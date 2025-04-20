// config/settings.js
const settings = {
  // API Configuration
  api: {
    baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
    wsBaseUrl: process.env.REACT_APP_WS_BASE_URL || 'ws://localhost:8000',
    endpoints: {
      auth: {
        login: '/auth/login',
        register: '/auth/register',
        refresh: '/auth/refresh',
        logout: '/auth/logout'
      },
      video: {
        analysis: '/video/ws/video',
        sessions: '/video/sessions',
        reports: '/video/reports'
      },
      user: {
        profile: '/user/profile',
        sessions: '/user/sessions'
      }
    },
    timeout: 30000, // 30 seconds
    retries: 3
  },

  // Video Analysis Configuration
  videoAnalysis: {
    frameRate: 5, // Frames per second to send to backend
    sessionDuration: 90, // Session duration in seconds (1.5 minutes)
    maxSessions: 5, // Maximum concurrent sessions per user
    videoConstraints: {
      width: 640,
      height: 480,
      facingMode: 'user' // Front camera
    },
    emotionThreshold: 0.7, // Minimum confidence threshold to display emotion
    sampleInterval: 200 // Milliseconds between frame samples
  },

  // Emotion Detection Settings
  emotions: {
    supportedEmotions: ['happy', 'sad', 'angry', 'surprise', 'fear', 'neutral'],
    emotionColors: {
      happy: '#4CAF50',
      sad: '#2196F3',
      angry: '#F44336',
      surprise: '#FFEB3B',
      fear: '#9C27B0',
      neutral: '#9E9E9E'
    },
    defaultEmotion: 'neutral'
  },

  // UI Settings
  ui: {
    theme: {
      primary: '#6366F1', // indigo-600
      secondary: '#818CF8', // indigo-400
      danger: '#EF4444', // red-500
      success: '#10B981', // emerald-500
      dark: '#1F2937', // gray-800
      darker: '#111827' // gray-900
    },
    animation: {
      duration: 300,
      easing: 'ease-in-out'
    },
    maxWidth: 'max-w-3xl'
  },

  // Analytics Configuration
  analytics: {
    enabled: process.env.NODE_ENV === 'production',
    trackingId: process.env.REACT_APP_GA_TRACKING_ID || null
  },

  // Feature Flags
  features: {
    realtimeAnalysis: true,
    sessionHistory: true,
    pdfReports: true,
    emotionTrends: true
  },

  // Local Storage Keys
  storageKeys: {
    authToken: 'emotio_ai_auth_token',
    userData: 'emotio_ai_user_data',
    sessionHistory: 'emotio_ai_session_history'
  },

  // Development Settings
  dev: {
    mockApi: process.env.REACT_APP_MOCK_API === 'true',
    debugWebSocket: true,
    logLevel: 'debug' // 'error', 'warn', 'info', 'debug'
  }
};

// Environment-based settings
const envSettings = {
  development: {
    api: {
      baseUrl: 'http://localhost:8000',
      wsBaseUrl: 'ws://localhost:8000'
    },
    dev: {
      mockApi: true,
      debugWebSocket: true
    }
  },
  production: {
    api: {
      baseUrl: 'https://api.emotio.ai',
      wsBaseUrl: 'wss://api.emotio.ai'
    },
    analytics: {
      enabled: true
    },
    dev: {
      mockApi: false,
      debugWebSocket: false
    }
  }
};

// Merge environment specific settings
const environment = process.env.NODE_ENV || 'development';
const finalConfig = {
  ...settings,
  ...envSettings[environment]
};

export default finalConfig;