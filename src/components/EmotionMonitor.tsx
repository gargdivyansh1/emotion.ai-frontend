import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  ThemeProvider,
  createTheme,
  CssBaseline,
  useMediaQuery,
  Grid,
  Tooltip,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { Pause, PlayArrow, Stop, Info } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const WEBSOCKET_URL = import.meta.env.VITE_API_WS_URL;

const blackTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1e88e5',
    },
    secondary: {
      main: '#7c4dff',
    },
    background: {
      default: '#050505',
      paper: '#0a0a0a',
    },
    text: {
      primary: '#f5f5f5',
      secondary: '#b0b0b0',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#0a0a0a',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.7)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 20px',
          letterSpacing: '0.5px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 10,
          borderRadius: 5,
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
        },
        bar: {
          borderRadius: 5,
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.5px',
    },
    h6: {
      fontWeight: 600,
    },
    body1: {
      fontWeight: 400,
    },
  },
});

type EmotionData = {
  emotion: string;
  confidence: number;
  timestamp: string;
  [key: string]: any;
};

const VideoStreamer = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [emotionData, setEmotionData] = useState<EmotionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fps, setFps] = useState(0);
  const [frameCount, setFrameCount] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [emotionHistory, setEmotionHistory] = useState<EmotionData[]>([]);
  const animationRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef(0);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [sessionLimitReached, setSessionLimitReached] = useState(false);


  const navigate = useNavigate();

  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:900px)');

  useEffect(() => {
    const initVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: isMobile ? 320 : isTablet ? 480 : 640 },
            height: { ideal: isMobile ? 240 : isTablet ? 360 : 480 },
            facingMode: 'user'
          },
          audio: false
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        return () => {
          if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
          }
        };
      } catch (err) {
        setError(`Could not access camera: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };

    initVideo();
  }, [isMobile, isTablet]);

  useEffect(() => {
    if (!isStreaming) return;

    const connectWebSocket = () => {

      const token = localStorage.getItem('token');

      const ws = new WebSocket(`${WEBSOCKET_URL}/ws/video/?token=${token}`);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setError(null);
        startFrameProcessing();
        startSessionTimer();
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.status === 'connected') {
            setSessionId(data.session_id);
          } else if (data.emotion) {
            const newEmotionData = {
              ...data,
              timestamp: new Date(data.timestamp).getTime()
            };
            setEmotionData(newEmotionData);
            setEmotionHistory(prev => [...prev.slice(-29), newEmotionData]);
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      ws.onerror = () => {
        setError('WebSocket error occurred');
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
      };

      return () => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      };
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
      }
    };
  }, [isStreaming]);

  const startSessionTimer = () => {
    setSessionTime(0);
    if (sessionTimerRef.current) {
      clearInterval(sessionTimerRef.current);
    }

    sessionTimerRef.current = setInterval(() => {
      setSessionTime(prev => {
        if (prev >= 120) {
          endSession();
          return 120;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const startFrameProcessing = () => {
    lastFrameTimeRef.current = performance.now();
    processFrame();
  };

  const processFrame = () => {
    if (isPaused) {
      animationRef.current = requestAnimationFrame(processFrame);
      return;
    }

    const now = performance.now();
    const elapsed = now - lastFrameTimeRef.current;

    if (elapsed >= 100) {
      captureAndSendFrame();
      lastFrameTimeRef.current = now;

      setFrameCount(prev => {
        const newCount = prev + 1;
        setFps(Math.round((newCount / (now - startTimeRef.current)) * 1000));
        return newCount;
      });
    }

    animationRef.current = requestAnimationFrame(processFrame);
  };

  const startTimeRef = useRef(0);

  const captureAndSendFrame = () => {
    if (!videoRef.current || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const reader = new FileReader();
        reader.onload = () => {
          const arrayBuffer = reader.result;
          if (wsRef.current?.readyState === WebSocket.OPEN && arrayBuffer instanceof ArrayBuffer) {
            wsRef.current.send(arrayBuffer);
          }
        };
        reader.readAsArrayBuffer(blob);
      },
      'image/jpeg',
      0.7
    );
  };

  const startSession = async () => {
    console.log('Button Clicked');

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        API_BASE_URL + "/users/increment-session",
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message === "Session limit reached") {
        setSessionLimitReached(true);
        setTimeout(() => {
          navigate("/pricing");
        }, 2000);
        return;
      }

      setIsStreaming(true);
      setIsPaused(false);
      setEmotionHistory([]);
      startTimeRef.current = performance.now();

      console.log("Session started successfully");
    } catch (error) {
      console.error("Error starting session:", error);
    }
  };

  const pauseSession = () => {
    setIsPaused(!isPaused);
  };

  const endSession = () => {
    setIsStreaming(false);
    setIsPaused(false);
    setFrameCount(0);
    setFps(0);

    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }

    if (sessionTimerRef.current) {
      clearInterval(sessionTimerRef.current);
    }
  };

  const chartData = emotionHistory.map((data, index) => ({
    time: index,
    emotion: data.emotion,
    confidence: data.confidence * 100,
    ...Object.fromEntries(
      Object.entries(data.emotion || {}).map(([key, value]) =>
        [key, typeof value === 'number' ? value * 100 : value]
      )
    )
  }));

  const emotionColors: Record<string, string> = {
    happy: '#4caf50',
    sad: '#2196f3',
    angry: '#f44336',
    surprise: '#ff9800',
    fear: '#9c27b0',
    disgust: '#795548',
    neutral: '#607d8b'
  };

  return (
    <div className='p-4 md:p-6 md:ml-64 min-h-screen bg-black text-white space-y-6 md:space-y-8'>
      <ThemeProvider theme={blackTheme}>
        <CssBaseline />
        <Box sx={{
          p: isMobile ? 2 : 3,
          width: '100%',
          minHeight: '100vh',
          backgroundColor: '#050505',
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(30,30,30,0.2) 0%, rgba(5,5,5,1) 100%)',
        }}>
          <Box sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            mb: 3,
            gap: 2
          }}>
            <Typography variant={isMobile ? "h5" : "h4"} sx={{
              fontWeight: 700,
              color: 'white',
              textShadow: '0 2px 10px rgba(30, 136, 229, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              Emotion Detection Dashboard
              <Tooltip title="Real-time emotion analysis using facial recognition">
                <Info color="primary" fontSize="small" />
              </Tooltip>
            </Typography>
            <h2>After completing the session do refresh from the Insights section for immediately switch off the camera..</h2>

          </Box>

          {sessionLimitReached && (
            <div className="fixed top-5 right-5 bg-red-600 text-white px-6 py-4 rounded-lg shadow-md z-50">
              <strong>Session limit reached!</strong> Upgrade to a new plan to continue.
            </div>
          )}

          {error && (
            <Card sx={{
              mb: 3,
              backgroundColor: 'rgba(244, 67, 54, 0.1)',
              border: '1px solid rgba(244, 67, 54, 0.3)',
              p: 2
            }}>
              <CardContent>
                <Typography color="error" variant="body1">
                  Error: {error}
                </Typography>
              </CardContent>
            </Card>
          )}

          <Grid container spacing={isMobile ? 2 : 4}>
            <Grid item xs={12} md={6}>
              <Card sx={{
                height: '100%',
                background: 'linear-gradient(145deg, #141414ff, #000000ff)'
              }}>
                <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                  }}>
                    <Typography variant="h6" sx={{
                      color: '#f5f5f5',
                      fontWeight: 600,
                      letterSpacing: '0.3px'
                    }}>
                      Video Stream
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                        {isMobile ? `${fps} FPS` : `Frame Rate: ${fps} FPS`}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{
                    position: 'relative',
                    mb: 3,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.5)',
                    aspectRatio: '16/9'
                  }}>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'block',
                        backgroundColor: '#000',
                        objectFit: 'cover'
                      }}
                    />
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                  </Box>

                  <Box sx={{
                    display: 'flex',
                    gap: 2,
                    mb: 2,
                    flexDirection: isMobile ? 'column' : 'row'
                  }}>
                    {!isStreaming ? (
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<PlayArrow />}
                        onClick={startSession}
                        fullWidth={isMobile}
                        sx={{
                          background: 'linear-gradient(45deg, #1e88e5, #1976d2)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #1976d2, #1565c0)'
                          }
                        }}
                      >
                        Start Session
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="contained"
                          color={isPaused ? "success" : "secondary"}
                          startIcon={isPaused ? <PlayArrow /> : <Pause />}
                          onClick={pauseSession}
                          sx={{
                            flex: 1,
                            background: isPaused
                              ? 'linear-gradient(45deg, #388e3c, #2e7d32)'
                              : 'linear-gradient(45deg, #7c4dff, #651fff)',
                            '&:hover': {
                              background: isPaused
                                ? 'linear-gradient(45deg, #2e7d32, #1b5e20)'
                                : 'linear-gradient(45deg, #651fff, #6200ea)'
                            }
                          }}
                        >
                          {isPaused ? 'Resume' : 'Pause'}
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<Stop />}
                          onClick={endSession}
                          sx={{
                            flex: 1,
                            background: 'linear-gradient(45deg, #f44336, #e53935)',
                            '&:hover': {
                              background: 'linear-gradient(45deg, #e53935, #d32f2f)'
                            }
                          }}
                        >
                          End Session
                        </Button>
                      </>
                    )}
                  </Box>

                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                    color: '#b0b0b0'
                  }}>
                    <Typography variant="body2">
                      Session Time: {Math.floor(sessionTime / 60)}:{String(sessionTime % 60).padStart(2, '0')} / 2:00
                    </Typography>
                    <Typography variant="body2">
                      Frames Processed: {frameCount}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(sessionTime / 120) * 100}
                    sx={{
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(90deg, #1e88e5, #64b5f6)'
                      }
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{
                height: '100%',
                background: 'linear-gradient(145deg, #0f0e0eff, #010101)'
              }}>
                <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                  <Typography variant="h6" sx={{
                    color: '#f5f5f5',
                    fontWeight: 600,
                    letterSpacing: '0.3px',
                    mb: 2
                  }}>
                    Emotion Analysis
                  </Typography>

                  {emotionData ? (
                    <>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 3,
                        p: 2,
                        background: '#111111',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                        flexDirection: isMobile ? 'column' : 'row',
                        textAlign: isMobile ? 'center' : 'left',
                        gap: 2
                      }}>
                        <Box sx={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          backgroundColor: emotionColors[emotionData.emotion] || '#607d8b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '1.2rem',
                          boxShadow: `0 0 20px ${emotionColors[emotionData.emotion] || '#607d8b'}`,
                          flexShrink: 0
                        }}>
                          {emotionData.emotion.charAt(0).toUpperCase()}
                        </Box>
                        <Box>
                          <Typography variant="h5" sx={{
                            fontWeight: 700,
                            color: emotionColors[emotionData.emotion] || '#f5f5f5',
                            lineHeight: 1.2
                          }}>
                            {emotionData.emotion.charAt(0).toUpperCase() + emotionData.emotion.slice(1)}
                          </Typography>
                          <Typography variant="body1" sx={{
                            color: '#b0b0b0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mt: 0.5
                          }}>
                            Confidence:
                            <Box component="span" sx={{
                              color: '#ffffff',
                              fontWeight: 500,
                              display: 'inline-flex',
                              alignItems: 'center'
                            }}>
                              {(emotionData.confidence * 100).toFixed(1)}%
                              <Box sx={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: emotionColors[emotionData.emotion] || '#607d8b',
                                ml: 1
                              }} />
                            </Box>
                          </Typography>
                          <Typography variant="caption" sx={{
                            color: '#757575',
                            display: 'block',
                            mt: 0.5
                          }}>
                            Detected at: {new Date(emotionData.timestamp).toLocaleTimeString()}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{
                        height: isMobile ? 250 : 300,
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        backgroundColor: '#0a0a0a',
                        mt: 2
                      }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
                            <XAxis
                              dataKey="time"
                              stroke="#b0b0b0"
                              tick={{ fill: '#b0b0b0', fontSize: isMobile ? 10 : 12 }}
                            />
                            <YAxis
                              stroke="#b0b0b0"
                              tick={{ fill: '#b0b0b0', fontSize: isMobile ? 10 : 12 }}
                              label={!isMobile ? {
                                value: 'Confidence %',
                                angle: -90,
                                position: 'insideLeft',
                                fill: '#b0b0b0',
                                fontSize: 12
                              } : undefined}
                            />
                            <RechartsTooltip
                              contentStyle={{
                                backgroundColor: '#0a0a0a',
                                border: '1px solid rgba(255, 255, 255, 0.12)',
                                borderRadius: '8px',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
                              }}
                              itemStyle={{
                                color: '#f5f5f5'
                              }}
                              labelStyle={{
                                color: '#b0b0b0',
                                fontWeight: 500
                              }}
                            />
                            {!isMobile && (
                              <Legend
                                wrapperStyle={{
                                  paddingTop: '10px',
                                  color: '#f5f5f5'
                                }}
                              />
                            )}
                            <Line
                              type="monotone"
                              dataKey="confidence"
                              stroke={emotionColors[emotionData.emotion] || '#607d8b'}
                              strokeWidth={2}
                              dot={false}
                              activeDot={{
                                r: 6,
                                stroke: '#ffffff',
                                strokeWidth: 2,
                                fill: emotionColors[emotionData.emotion] || '#607d8b'
                              }}
                              name="Confidence Level"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </Box>
                    </>
                  ) : (
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: isMobile ? 200 : 300,
                      color: '#757575',
                      border: '1px dashed rgba(255, 255, 255, 0.12)',
                      borderRadius: '12px',
                      backgroundColor: '#111111',
                      p: 3,
                      textAlign: 'center',
                      gap: 1
                    }}>
                      <Typography variant="h6" sx={{ color: '#b0b0b0', fontWeight: 500 }}>
                        No Emotion Data Available
                      </Typography>
                      <Typography variant="body2">
                        Start the session to begin real-time emotion analysis
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </ThemeProvider>
    </div>
  );
};

export default VideoStreamer;