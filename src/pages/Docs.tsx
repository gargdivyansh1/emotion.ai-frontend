import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Code, Database, Activity, Image, Camera, Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Docs: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeSDK, setActiveSDK] = useState<string>('REST API');

  const LibraryItem = ({ name, version, description, color }) => (
    <li className="flex items-start">
      <div className={`flex-shrink-0 w-3 h-3 rounded-full mt-1.5 mr-3 bg-${color}`}></div>
      <div>
        <div className="flex items-baseline">
          <h4 className="text-lg font-semibold text-white">{name}</h4>
          <span className="ml-2 text-sm text-gray-400">v{version}</span>
        </div>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </li>
  );

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const documentationSections = [
    {
      icon: BookOpen,
      title: 'Getting Started',
      description: 'Begin your journey with EmotionAI',
      color: 'text-indigo-400',
      items: [
        {
          title: 'Introduction to EmotionAI',
          content: (
            <div className="space-y-4">
              <p>EmotionAI is a cutting-edge platform that analyzes human emotions through facial expressions and micro-expressions using computer vision.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Camera className="w-4 h-4 mr-2 text-indigo-400" />
                    <span className="font-medium">Real-time Analysis</span>
                  </div>
                  <p className="text-sm text-gray-400">Process video streams with low latency for immediate feedback</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Image className="w-4 h-4 mr-2 text-indigo-400" />
                    <span className="font-medium">Image Processing</span>
                  </div>
                  <p className="text-sm text-gray-400">Analyze static images for emotional content</p>
                </div>
              </div>
            </div>
          )
        },
        {
          title: 'Creating Your First Session',
          content: (
            <div className="space-y-4">
              <p>Follow these steps to create your first facial analysis session:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Register for an API key in the developer portal</li>
                <li>Configure your video input source (webcam, file, or stream)</li>
                <li>Initialize the facial recognition session</li>
                <li>Process frames and receive emotion data</li>
                <li>Analyze the results in your dashboard</li>
              </ol>
              <div className="bg-gray-800 p-4 rounded-lg">
                <pre className="text-sm text-gray-300">
                  {`// Sample WebSocket Initialization
const socket = new WebSocket('wss://api.emotion.ai/ws/video');

socket.onopen = () => {
  // Send configuration
  socket.send(JSON.stringify({
    api_key: 'YOUR_API_KEY',
    detect_microexpressions: true,
    resolution: '720p'
  }));
};`}
                </pre>
              </div>
            </div>
          )
        },
        {
          title: 'Understanding Your Dashboard',
          content: (
            <div className="space-y-4">
              <p>The EmotionAI dashboard provides comprehensive insights into your facial expression analysis results:</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Activity className="w-4 h-4 mr-2" />
                    Expression Timeline
                  </h4>
                  <p className="text-sm text-gray-400">Visual timeline of detected facial expressions</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Multi-face Detection
                  </h4>
                  <p className="text-sm text-gray-400">Track multiple faces in the same frame</p>
                </div>
              </div>
            </div>
          )
        }
      ]
    },
    {
      "icon": Code,
      "title": "API Reference",
      "description": "Technical documentation for developers",
      "color": "text-blue-400",
      "items": [
        {
          "title": "WebSocket API",
          "content": (
            <div className="space-y-4">
              <p>Real-time facial expression analysis through WebSocket connection:</p>
              <div className="bg-gray-800 p-4 rounded-lg">
                <pre className="text-sm text-gray-300">
                  {`// WebSocket Endpoint
wss://yourdomain.com/ws/video/

// Connection Requirements:
// - No authentication required (for demo)
// - Should send binary frame data (JPEG/PNG)

// Frame Specifications:
// - JPEG or PNG encoded
// - Minimum resolution: detectable face (300x300 recommended)
// - Maximum size: 5MB per frame
// - Optimal face size: 100-300 pixels between eyes
// - Color format: BGR (OpenCV standard)

// Response Format:
{
    "emotion": "dominant_emotion",
    "confidence": 0.0-1.0,
    "timestamp": "ISO8601"
}`}
                </pre>
              </div>
              <div className="mt-4 p-4 bg-yellow-900/20 rounded-lg">
                <h4 className="font-bold text-yellow-400">Important Notes</h4>
                <ul className="list-disc pl-5 mt-2 text-yellow-300 text-sm">
                  <li>Server processes frames at 10 FPS (0.1s interval)</li>
                  <li>Emotion data is saved every 2 seconds</li>
                  <li>Session ends automatically after timeout (5s)</li>
                  <li>Haar Cascade used for initial face detection</li>
                </ul>
              </div>
            </div>
          )
        },
        {
          "title": "Analysis Response",
          "content": (
            <div className="space-y-4">
              <p>Detailed facial analysis response structure:</p>
              <div className="bg-gray-800 p-4 rounded-lg">
                <pre className="text-sm text-gray-300">
                  {`// Emotion Analysis Response
{
    "emotion": "happy" | "sad" | "angry" | "surprised" 
               | "fear" | "disgust" | "neutral",
    "confidence": 0.89,  // 0-1 confidence score
    "timestamp": "2023-06-15T12:34:56Z"
}

// Supported Emotion Types:
[
    "NEUTRAL", "HAPPY", "SAD", 
    "ANGRY", "FEAR", "DISGUST",
    "SURPRISED"  // Note: 'SURPRISE' is converted
]`}
                </pre>
              </div>
            </div>
          )
        },
        {
          "title": "Session Lifecycle",
          "content": (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="bg-gray-800 p-3 rounded-lg">
                  <h4 className="font-bold">1. Initialization</h4>
                  <ul className="mt-2 space-y-1 text-gray-300">
                    <li>• UUID generated for session</li>
                    <li>• Frame processing begins</li>
                    <li>• First face detection</li>
                  </ul>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <h4 className="font-bold">2. Processing</h4>
                  <ul className="mt-2 space-y-1 text-gray-300">
                    <li>• 10 FPS analysis</li>
                    <li>• Batch saves every 2s</li>
                    <li>• Real-time feedback</li>
                  </ul>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <h4 className="font-bold">3. Termination</h4>
                  <ul className="mt-2 space-y-1 text-gray-300">
                    <li>• Trend analysis</li>
                    <li>• PDF report generation</li>
                    <li>• Database cleanup</li>
                  </ul>
                </div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <pre className="text-sm text-gray-300">
                  {`// Session End Metrics Example
{
    "status": "session_complete",
    "session_id": "uuid-string",
    "duration": 45.2,
    "frame_count": 452,
    "fps": 10.0,
    "report_generated": true
}`}
                </pre>
              </div>
            </div>
          )
        },
        {
          "title": "Error Handling",
          "content": (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left">Error</th>
                      <th className="px-4 py-3 text-left">Cause</th>
                      <th className="px-4 py-3 text-left">Solution</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    <tr>
                      <td className="px-4 py-3 font-mono text-sm">INVALID_IMAGE</td>
                      <td className="px-4 py-3">Corrupted frame data</td>
                      <td className="px-4 py-3">Verify frame encoding</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-sm">NO_FACE</td>
                      <td className="px-4 py-3">No detectable face</td>
                      <td className="px-4 py-3">Adjust camera/lighting</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-sm">FRAME_TIMEOUT</td>
                      <td className="px-4 py-3">5s without frames</td>
                      <td className="px-4 py-3">Maintain steady stream</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )
        }
      ]
    },
    {
      icon: Database,
      title: 'Data Models',
      description: 'Understand our data structures',
      color: 'text-green-400',
      items: [
        {
          title: 'Face Detection Model',
          content: (
            <div className="space-y-4">
              <p>Contains raw face detection data including positions and landmarks:</p>
              <div className="bg-gray-800 p-4 rounded-lg">
                <pre className="text-sm text-gray-300">
                  {`{
  "id": "face_123",
  "session_id": "ses_456",
  "image_id": "img_789",
  "bounding_box": [x, y, w, h],
  "landmarks": {
    "left_eye": [x,y], "right_eye": [x,y],
    "nose": [x,y], "mouth_left": [x,y],
    "mouth_right": [x,y], ...
  },
  "detection_confidence": 0.98,
  "timestamp": "2023-06-15T12:34:56Z"
}`}
                </pre>
              </div>
            </div>
          )
        },
        {
          title: 'Expression Analysis Model',
          content: (
            <div className="space-y-4">
              <p>Detailed emotional analysis for each detected face:</p>
              <div className="bg-gray-800 p-4 rounded-lg">
                <pre className="text-sm text-gray-300">
                  {`{
  "face_id": "face_123",
  "analysis_id": "ana_456",
  "emotion_scores": {
    "neutral": 0.76,
    "happy": 0.12,
    "sad": 0.04,
    "angry": 0.03,
    "surprise": 0.05
  },
  "dominant_emotion": "neutral",
  "dominant_score": 0.76,
  "microexpressions": [
    {
      "emotion": "surprise",
      "duration": 0.2,
      "intensity": 0.45,
      "timestamp": 12.345
    }
  ],
  "analysis_metadata": {
    "model_version": "2.1.0",
    "processing_time": 120
  }
}`}
                </pre>
              </div>
            </div>
          )
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
      <header className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span className="text-lg font-medium">Back to Home</span>
        </button>
      </header>

      <section className="max-w-7xl mx-auto px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">EmotionAI Documentation</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Comprehensive guides and references to integrate emotion analysis into your applications
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {documentationSections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-indigo-500 transition-colors"
            >
              <div className="p-8">
                <div className={`bg-gray-700/50 w-12 h-12 rounded-lg flex items-center justify-center mb-6`}>
                  <section.icon className={`w-6 h-6 ${section.color}`} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{section.title}</h2>
                <p className="text-gray-400 mb-6">{section.description}</p>
                <ul className="space-y-3">
                  {section.items.map((item, i) => (
                    <li key={i}>
                      <button
                        onClick={() => toggleSection(`${section.title}-${item.title}`)}
                        className="flex items-start w-full text-left group"
                      >
                        <span className={`block w-2 h-2 rounded-full mt-2 mr-3 ${section.color}`}></span>
                        <span className="group-hover:text-white transition-colors">{item.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {documentationSections.map((section) => (
          section.items.map((item) => {
            const sectionKey = `${section.title}-${item.title}`;
            return (
              <motion.div
                key={sectionKey}
                initial={{ opacity: 0, height: 0 }}
                animate={{
                  opacity: activeSection === sectionKey ? 1 : 0,
                  height: activeSection === sectionKey ? 'auto' : 0
                }}
                className="overflow-hidden mb-8 bg-gray-800 rounded-xl border border-gray-700"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                    <button
                      onClick={() => toggleSection(sectionKey)}
                      className="text-gray-400 hover:text-white"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="prose prose-invert max-w-none">
                    {item.content}
                  </div>
                </div>
              </motion.div>
            );
          })
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 mb-8"
        >
          <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-8">Core Libraries & Dependencies</h2>

            <div className="flex border-b border-gray-700 mb-8">
              <button
                onClick={() => setActiveSDK('backend')}
                className={`px-6 py-3 font-medium border-b-2 ${activeSDK === 'backend' ? 'border-blue-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
              >
                Backend
              </button>
              <button
                onClick={() => setActiveSDK('frontend')}
                className={`px-6 py-3 font-medium border-b-2 ${activeSDK === 'frontend' ? 'border-purple-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
              >
                Frontend
              </button>
              <button
                onClick={() => setActiveSDK('ai')}
                className={`px-6 py-3 font-medium border-b-2 ${activeSDK === 'ai' ? 'border-green-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
              >
                AI/ML
              </button>
            </div>

            {/* Backend Libraries */}
            <div className={`${activeSDK === 'backend' ? 'block' : 'hidden'}`}>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Core Backend</h3>
                  <ul className="space-y-4">
                    <LibraryItem
                      name="FastAPI"
                      version="0.115.12"
                      description="Modern, fast web framework for building APIs with Python"
                      color="blue-500"
                    />
                    <LibraryItem
                      name="SQLAlchemy"
                      version="2.0.40"
                      description="Python SQL toolkit and ORM for database interactions"
                      color="blue-500"
                    />
                    <LibraryItem
                      name="Uvicorn"
                      version="0.34.0"
                      description="Lightning-fast ASGI server implementation"
                      color="blue-500"
                    />
                    <LibraryItem
                      name="Pydantic"
                      version="2.11.1"
                      description="Data validation and settings management using Python type hints"
                      color="blue-500"
                    />
                  </ul>

                  <h3 className="text-xl font-bold text-white mt-8 mb-4">Authentication</h3>
                  <ul className="space-y-4">
                    <LibraryItem
                      name="python-jose"
                      version="3.4.0"
                      description="JWT implementation for Python"
                      color="blue-500"
                    />
                    <LibraryItem
                      name="bcrypt"
                      version="4.0.1"
                      description="Password hashing library"
                      color="blue-500"
                    />
                    <LibraryItem
                      name="passlib"
                      version="1.7.4"
                      description="Comprehensive password hashing framework"
                      color="blue-500"
                    />
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Utilities</h3>
                  <ul className="space-y-4">
                    <LibraryItem
                      name="aiohttp"
                      version="3.0.2"
                      description="Async HTTP client/server framework"
                      color="blue-500"
                    />
                    <LibraryItem
                      name="redis"
                      version="5.2.1"
                      description="Python Redis client"
                      color="blue-500"
                    />
                    <LibraryItem
                      name="APScheduler"
                      version="3.11.0"
                      description="Advanced Python Scheduler"
                      color="blue-500"
                    />
                    <LibraryItem
                      name="python-dotenv"
                      version="1.1.0"
                      description="Reads key-value pairs from .env file"
                      color="blue-500"
                    />
                  </ul>

                  <h3 className="text-xl font-bold text-white mt-8 mb-4">Data Processing</h3>
                  <ul className="space-y-4">
                    <LibraryItem
                      name="pandas"
                      version="2.2.3"
                      description="Powerful data analysis and manipulation library"
                      color="blue-500"
                    />
                    <LibraryItem
                      name="numpy"
                      version="1.26.4"
                      description="Fundamental package for scientific computing"
                      color="blue-500"
                    />
                    <LibraryItem
                      name="reportlab"
                      version="4.3.1"
                      description="PDF generation library"
                      color="blue-500"
                    />
                  </ul>
                </div>
              </div>
            </div>

            <div className={`${activeSDK === 'frontend' ? 'block' : 'hidden'}`}>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Core Framework</h3>
                  <ul className="space-y-4">
                    <LibraryItem
                      name="React"
                      version="18.3.1"
                      description="JavaScript library for building user interfaces"
                      color="purple-500"
                    />
                    <LibraryItem
                      name="TypeScript"
                      version="5.8.3"
                      description="Strongly typed programming language"
                      color="purple-500"
                    />
                    <LibraryItem
                      name="Vite"
                      version="5.4.2"
                      description="Next generation frontend tooling"
                      color="purple-500"
                    />
                    <LibraryItem
                      name="React Router"
                      version="6.22.3"
                      description="Declarative routing for React"
                      color="purple-500"
                    />
                  </ul>

                  <h3 className="text-xl font-bold text-white mt-8 mb-4">UI Components</h3>
                  <ul className="space-y-4">
                    <LibraryItem
                      name="Material-UI"
                      version="7.2.0"
                      description="React components for faster web development"
                      color="purple-500"
                    />
                    <LibraryItem
                      name="Radix UI"
                      version="1.1.8"
                      description="Unstyled, accessible UI components"
                      color="purple-500"
                    />
                    <LibraryItem
                      name="Framer Motion"
                      version="11.18.2"
                      description="Production-ready motion library for React"
                      color="purple-500"
                    />
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Data Visualization</h3>
                  <ul className="space-y-4">
                    <LibraryItem
                      name="Chart.js"
                      version="4.4.8"
                      description="Simple yet flexible JavaScript charting"
                      color="purple-500"
                    />
                    <LibraryItem
                      name="Recharts"
                      version="2.15.2"
                      description="Composable charting library built on React"
                      color="purple-500"
                    />
                    <LibraryItem
                      name="React Chartjs 2"
                      version="5.3.0"
                      description="React wrapper for Chart.js"
                      color="purple-500"
                    />
                  </ul>

                  <h3 className="text-xl font-bold text-white mt-8 mb-4">Utilities</h3>
                  <ul className="space-y-4">
                    <LibraryItem
                      name="Axios"
                      version="1.8.4"
                      description="Promise based HTTP client"
                      color="purple-500"
                    />
                    <LibraryItem
                      name="date-fns"
                      version="3.3.1"
                      description="Modern JavaScript date utility library"
                      color="purple-500"
                    />
                    <LibraryItem
                      name="React WebSocket"
                      version="4.13.0"
                      description="WebSocket implementation for React"
                      color="purple-500"
                    />
                  </ul>
                </div>
              </div>
            </div>

            <div className={`${activeSDK === 'ai' ? 'block' : 'hidden'}`}>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Core AI</h3>
                  <ul className="space-y-4">
                    <LibraryItem
                      name="TensorFlow"
                      version="2.19.0"
                      description="End-to-end open source machine learning platform"
                      color="green-500"
                    />
                    <LibraryItem
                      name="Keras"
                      version="3.9.1"
                      description="Deep learning API running on top of TensorFlow"
                      color="green-500"
                    />
                    <LibraryItem
                      name="OpenCV"
                      version="4.11.0.86"
                      description="Computer vision and image processing"
                      color="green-500"
                    />
                    <LibraryItem
                      name="DeepFace"
                      version="0.0.93"
                      description="Deep learning facial recognition and analysis"
                      color="green-500"
                    />
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Supporting Libraries</h3>
                  <ul className="space-y-4">
                    <LibraryItem
                      name="NumPy"
                      version="1.26.4"
                      description="Fundamental package for scientific computing"
                      color="green-500"
                    />
                    <LibraryItem
                      name="Pandas"
                      version="2.2.3"
                      description="Data analysis and manipulation"
                      color="green-500"
                    />
                    <LibraryItem
                      name="Matplotlib"
                      version="3.10.1"
                      description="Comprehensive visualization library"
                      color="green-500"
                    />
                    <LibraryItem
                      name="TensorFlow.js"
                      version="4.17.0"
                      description="Machine learning in JavaScript"
                      color="green-500"
                    />
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-xl p-8 border border-indigo-500/30"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-white mb-2">Need More Help?</h3>
              <p className="text-indigo-200">Our team is ready to assist with your integration</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => handleNavigation('/support')}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors">
                Contact Support
              </button>
              {/* <button 
              className="px-6 py-3 bg-transparent border border-indigo-400 hover:bg-indigo-900/30 rounded-lg font-medium transition-colors">
                Join Community
              </button> */}
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Docs;