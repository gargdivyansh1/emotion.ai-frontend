import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend);

type EmotionData = {
  emotion: string;
  confidence: number;
  timestamp: string;
};

type SessionStats = {
  [emotion: string]: number;
};

const EMOTION_COLORS: Record<string, string> = {
  happy: '#10b981',
  sad: '#3b82f6',
  angry: '#ef4444',
  surprise: '#f59e0b',
  fear: '#8b5cf6',
  disgust: '#10b981',
  neutral: '#6b7280',
  unknown: '#4b5563',
  no_face: '#374151',
};

export default function EmotionDetector() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emotionData, setEmotionData] = useState<EmotionData | null>(null);
  const [sessionStats, setSessionStats] = useState<SessionStats>({});
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize emotion stats
  const initStats = useCallback(() => {
    const initialStats: SessionStats = {};
    Object.keys(EMOTION_COLORS).forEach(emotion => {
      initialStats[emotion] = 0;
    });
    setSessionStats(initialStats);
  }, []);

  // Start session timer
  const startSessionTimer = useCallback(() => {
    setSessionDuration(0);
    sessionTimerRef.current = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);
  }, []);

  // Stop session timer
  const stopSessionTimer = useCallback(() => {
    if (sessionTimerRef.current) {
      clearInterval(sessionTimerRef.current);
      sessionTimerRef.current = null;
    }
  }, []);

  // Format session duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Save session data when session ends
  const saveSessionData = async () => {
    if (!sessionId || !user) return;

    try {
      await axios.post(
        '/sessions/save',
        {
          session_id: sessionId,
          duration: sessionDuration,
          emotions: sessionStats,
          user_id: user.id
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
    } catch (err) {
      console.error('Failed to save session data:', err);
    }
  };

  // Stop session and clean up resources
  const stopSession = useCallback(async () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (wsRef.current) {
      const validStates: Array<WebSocket['readyState']> = [WebSocket.OPEN, WebSocket.CONNECTING];
      if (validStates.includes(wsRef.current.readyState)) {
        wsRef.current.close();
      }
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    stopSessionTimer();
    await saveSessionData();

    setIsConnected(false);
    setIsLoading(false);
  }, [sessionDuration, sessionId, sessionStats, user, stopSessionTimer]);

  // Start emotion detection session
  const startSession = useCallback(async () => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    setError(null);
    initStats();

    try {
      // Get camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = resolve;
          }
        });
      }

      // Get token from auth context
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Connect to WebSocket
      const wsUrl = `ws://localhost:8000/video/ws?token=${token}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connection established');
        setIsConnected(true);
        setIsLoading(false);
        startSessionTimer();
        captureAndSendFrames();
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.status === 'connected') {
            setSessionId(data.session_id);
          } else if (data.emotion) {
            setEmotionData(data);
            updateStats(data.emotion);
          } else if (data.error) {
            setError(data.error);
            if (data.error.includes('authentication')) {
              logout();
              navigate('/login');
            }
          }
        } catch (err) {
          console.error('Error parsing message:', err);
        }
      };

      ws.onerror = () => {
        setError('Connection error. Please refresh and try again.');
        stopSession();
      };

      ws.onclose = () => {
        stopSession();
      };

    } catch (err) {
      console.error('Session error:', err);
      setError(err instanceof Error ? err.message : 'Failed to start session');
      await stopSession();
    }
  }, [isAuthenticated, user, navigate, initStats, startSessionTimer, stopSession, logout]);

  // Capture and send video frames
  const captureAndSendFrames = useCallback(() => {
    if (!isConnected || !videoRef.current || !canvasRef.current || !wsRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;

    // Set canvas dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw frame
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Send frame
    canvas.toBlob(
      (blob) => blob && wsRef.current?.readyState === WebSocket.OPEN && wsRef.current.send(blob),
      'image/jpeg',
      0.7
    );

    // Continue capturing
    animationRef.current = requestAnimationFrame(captureAndSendFrames);
  }, [isConnected]);

  // Update emotion statistics
  const updateStats = useCallback((emotion: string) => {
    setSessionStats(prev => ({
      ...prev,
      [emotion]: (prev[emotion] || 0) + 1
    }));
  }, []);

  // Generate data for doughnut chart
  const getChartData = useCallback(() => {
    const emotions = Object.keys(sessionStats)
      .filter(emotion => sessionStats[emotion] > 0)
      .sort((a, b) => sessionStats[b] - sessionStats[a]);

    return {
      labels: emotions,
      datasets: [{
        data: emotions.map(e => sessionStats[e]),
        backgroundColor: emotions.map(e => EMOTION_COLORS[e]),
        borderColor: '#1f2937',
        borderWidth: 1,
      }]
    };
  }, [sessionStats]);

  // Generate data for bar chart
  const getBarChartData = useCallback(() => {
    const emotions = Object.entries(sessionStats)
      .filter(([_, count]) => count > 0)
      .sort((a, b) => b[1] - a[1]);

    return {
      labels: emotions.map(([e]) => e.replace('_', ' ').toUpperCase()),
      datasets: [{
        label: 'Emotion Frequency',
        data: emotions.map(([_, count]) => count),
        backgroundColor: emotions.map(([e]) => EMOTION_COLORS[e]),
        borderColor: '#1f2937',
        borderWidth: 1,
      }]
    };
  }, [sessionStats]);

  // Get color for emotion display
  const getEmotionColor = useCallback((emotion: string) => {
    return EMOTION_COLORS[emotion.toLowerCase()] || '#6b7280';
  }, []);

  // Auto-start session when component mounts if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      startSession();
    }
    return () => {
      stopSession();
    };
  }, [isAuthenticated, startSession, stopSession]);

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">
            Real-time Emotion Detection
          </h1>
          {user && (
            <div className="flex items-center gap-2">
              <span className="text-sm md:text-base text-gray-400">
                Logged in as: {user.username}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Video Feed Section */}
          <div className="lg:col-span-2 space-y-3 md:space-y-4">
            <div className="relative bg-gray-800 rounded-lg md:rounded-xl overflow-hidden aspect-video border border-gray-700">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />

              {!isConnected && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800/90">
                  <div className="text-center p-4 md:p-6">
                    <h2 className="text-lg md:text-xl font-semibold mb-2">
                      {isAuthenticated ? 'Initializing...' : 'Authentication Required'}
                    </h2>
                    {!isAuthenticated && (
                      <>
                        <p className="text-gray-400 mb-4">
                          Please login to use emotion detection
                        </p>
                        <button
                          onClick={() => navigate('/login')}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
                        >
                          Go to Login
                        </button>
                      </>
                    )}
                    {isAuthenticated && isLoading && (
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {emotionData && isConnected && (
                <div
                  className="absolute bottom-3 left-3 md:bottom-4 md:left-4 px-3 py-1 md:px-4 md:py-2 rounded-md md:rounded-lg backdrop-blur-sm border"
                  style={{
                    backgroundColor: `${getEmotionColor(emotionData.emotion)}20`,
                    borderColor: getEmotionColor(emotionData.emotion)
                  }}
                >
                  <div className="flex items-center gap-1 md:gap-2">
                    <span className="text-sm md:text-lg font-semibold capitalize">
                      {emotionData.emotion.replace('_', ' ')}
                    </span>
                    <span className="text-xs md:text-sm opacity-80">
                      {Math.round(emotionData.confidence * 100)}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                {!isConnected && isAuthenticated && !isLoading && (
                  <button
                    onClick={startSession}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium"
                  >
                    Start Session
                  </button>
                )}

                {isConnected && (
                  <button
                    onClick={stopSession}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium"
                  >
                    Stop Session
                  </button>
                )}
              </div>

              {isConnected && (
                <div className="text-sm md:text-base">
                  <span className="text-gray-400">Duration:</span>{' '}
                  <span className="font-mono">{formatDuration(sessionDuration)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats Section */}
          <div className="space-y-4 md:space-y-6">
            <div className="bg-gray-800 rounded-lg md:rounded-xl p-4 md:p-6 border border-gray-700">
              <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
                Emotion Distribution
              </h2>
              <div className="h-48 md:h-64">
                <Doughnut
                  data={getChartData()}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                        labels: {
                          color: '#f3f4f6',
                          font: {
                            family: 'Inter',
                            size: window.innerWidth < 768 ? 10 : 12
                          }
                        }
                      },
                      tooltip: {
                        backgroundColor: '#111827',
                        titleColor: '#f3f4f6',
                        bodyColor: '#d1d5db',
                      }
                    },
                    cutout: '65%',
                  }}
                />
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg md:rounded-xl p-4 md:p-6 border border-gray-700">
              <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
                Emotion Frequency
              </h2>
              <div className="h-48 md:h-64">
                <Bar
                  data={getBarChartData()}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          color: '#9ca3af'
                        },
                        grid: {
                          color: '#374151'
                        }
                      },
                      x: {
                        ticks: {
                          color: '#9ca3af'
                        },
                        grid: {
                          display: false
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        display: false
                      }
                    }
                  }}
                />
              </div>
            </div>

            {sessionId && (
              <div className="bg-gray-800 rounded-lg md:rounded-xl p-4 border border-gray-700">
                <h2 className="text-lg font-semibold mb-2">Session Info</h2>
                <div className="text-sm space-y-2">
                  <div>
                    <p className="text-gray-400">Session ID:</p>
                    <p className="font-mono text-gray-300 text-xs truncate">{sessionId}</p>
                  </div>
                  {user && (
                    <div>
                      <p className="text-gray-400">User ID:</p>
                      <p className="font-mono text-gray-300">{user.id}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-red-300">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-1 text-xs text-red-400 hover:text-red-300"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  );
}