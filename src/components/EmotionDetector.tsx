import React, { useRef, useState, useEffect, useCallback } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const EmotionDetector = () => {
  const [status, setStatus] = useState<"idle" | "monitoring" | "paused" | "stopped">("idle");
  const [emotion, setEmotion] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);

  // Fetch token from localStorage or API
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      // If you need to fetch a new token
      axios.get(`${API_BASE_URL}/auth/token`)
        .then(response => {
          const newToken = response.data.token;
          localStorage.setItem("token", newToken);
          setToken(newToken);
        })
        .catch(error => {
          console.error("Error fetching token:", error);
        });
    }
  }, []);

  // WebSocket connection
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    token ? `ws://localhost:8000/ws/video/` : null, // Note: No token in URL
    {
      shouldReconnect: () => true,
      reconnectAttempts: 10,
      reconnectInterval: 3000,
      queryParams: {
        token: token || ""
      },
      onOpen: () => console.log("WebSocket connection established"),
      onClose: () => console.log("WebSocket connection closed"),
      onError: (event) => console.error("WebSocket error:", event)
    }
  );

  // Handle incoming messages
  useEffect(() => {
    if (lastMessage !== null) {
      try {
        const data = JSON.parse(lastMessage.data);
        if (data.emotion && data.confidence) {
          setEmotion(data.emotion);
          setConfidence(data.confidence);
        } else if (data.error) {
          console.error("Server error:", data.error);
        }
      } catch (e) {
        console.error("Error parsing WebSocket message:", e);
      }
    }
  }, [lastMessage]);

  // Frame processing
  const processFrame = useCallback(() => {
    if (
      status !== "monitoring" ||
      readyState !== ReadyState.OPEN ||
      !videoRef.current ||
      !canvasRef.current
    ) {
      return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx || video.readyState !== HTMLMediaElement.HAVE_ENOUGH_DATA) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to JPEG and send
    canvas.toBlob((blob) => {
      if (blob) {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result && typeof reader.result === "string") {
            // Send as binary data (like the Python example)
            const base64Data = reader.result.split(",")[1];
            const binaryString = atob(base64Data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            sendMessage(bytes);
          }
        };
        reader.readAsDataURL(blob);
      }
    }, "image/jpeg", 0.8); // 80% quality

    animationRef.current = requestAnimationFrame(processFrame);
  }, [status, readyState, sendMessage]);

  // Manage frame processing
  useEffect(() => {
    if (status === "monitoring" && readyState === ReadyState.OPEN) {
      animationRef.current = requestAnimationFrame(processFrame);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [status, readyState, processFrame]);

  // Camera controls
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setStatus("monitoring");
      setEmotion(null);
      setConfidence(null);
    } catch (err) {
      console.error("Camera access denied:", err);
      alert("Camera access denied. Please allow camera permissions.");
    }
  };

  const pauseCamera = () => {
    streamRef.current?.getTracks().forEach(track => (track.enabled = false));
    setStatus("paused");
  };

  const resumeCamera = () => {
    streamRef.current?.getTracks().forEach(track => (track.enabled = true));
    setStatus("monitoring");
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setStatus("stopped");
    setEmotion(null);
    setConfidence(null);
  };

  const renderStatusText = () => {
    switch (status) {
      case "monitoring":
        return "Real-time emotion analysis active";
      case "paused":
        return "Session paused - ready to resume";
      case "stopped":
        return "Session ended - ready for new analysis";
      default:
        return "Start your emotion detection session";
    }
  };

  const renderControls = () => {
    switch (status) {
      case "idle":
        return <ActionButton onClick={startCamera} label="Start Session" icon="video" />;
      case "monitoring":
        return (
          <>
            <ActionButton onClick={pauseCamera} label="Pause" icon="pause" />
            <ActionButton onClick={stopCamera} label="End Session" icon="stop" />
          </>
        );
      case "paused":
        return (
          <>
            <ActionButton onClick={resumeCamera} label="Resume" icon="play" />
            <ActionButton onClick={stopCamera} label="End Session" icon="stop" />
          </>
        );
      case "stopped":
        return <ActionButton onClick={startCamera} label="Start New Session" icon="video" />;
      default:
        return null;
    }
  };

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Connected",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <div className="min-h-screen bg-black text-neutral-200 p-6 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-neutral-300 to-neutral-500">
            Emotion Vision
          </h1>
          <p className="text-neutral-400 max-w-lg mx-auto">{renderStatusText()}</p>
          <div className="flex justify-center items-center mt-2">
            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${readyState === ReadyState.OPEN ? "bg-green-500" : "bg-yellow-500"}`}></span>
            <span className="text-xs text-neutral-500">{connectionStatus} to analysis server</span>
          </div>
        </div>

        {/* Video Feed */}
        <div className="relative mb-8 rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 aspect-video">
          {status === "idle" && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-900 to-black text-center p-6">
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-dashed border-neutral-700 flex items-center justify-center">
                  <CameraIcon className="h-8 w-8 text-neutral-500" />
                </div>
                <p className="text-neutral-400 mb-4">Camera feed inactive</p>
              </div>
            </div>
          )}
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          <canvas ref={canvasRef} className="hidden" />

          {status === "monitoring" && (
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 px-3 py-1 rounded-full text-sm flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
              <span>Analyzing</span>
            </div>
          )}

          {emotion && (
            <div className="absolute top-4 right-4 bg-black bg-opacity-70 px-3 py-2 rounded-lg">
              <div className="text-sm font-medium">Emotion: <span className="capitalize">{emotion}</span></div>
              <div className="text-xs">Confidence: {(confidence! * 100).toFixed(1)}%</div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-3">{renderControls()}</div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-neutral-500">
          {status === "monitoring" && <p>Capturing and analyzing facial expressions in real-time</p>}
          {status === "paused" && <p>Analysis paused - video feed inactive</p>}
          {status === "stopped" && <p>Session completed - ready for new analysis</p>}
        </div>
      </div>
    </div>
  );
};

// Reusable button
const ActionButton = ({
  onClick,
  label,
  icon,
}: {
  onClick: () => void;
  label: string;
  icon: "video" | "pause" | "play" | "stop";
}) => {
  const icons = {
    video: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    ),
    pause: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
    play: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </>
    ),
    stop: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
      </>
    ),
  };

  return (
    <button
      onClick={onClick}
      className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg font-medium transition-all duration-200 border border-neutral-700 hover:border-neutral-600 flex items-center"
      title={label}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {icons[icon]}
      </svg>
      {label}
    </button>
  );
};

// Camera icon
const CameraIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

export default EmotionDetector;