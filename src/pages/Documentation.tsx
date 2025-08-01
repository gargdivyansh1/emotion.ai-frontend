import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { FiMail, FiCode, FiHelpCircle } from 'react-icons/fi';

const EmotionAIDocumentation = () => {
    const [activeTab, setActiveTab] = useState<'faq' | 'api' | 'guides'>('faq');

    const faqs = [
        {
            question: "What is Emotion.AI?",
            answer: "Emotion.AI is an artificial intelligence platform that analyzes human emotions through various input methods including text, voice, and facial recognition. Our technology helps developers integrate emotion detection into their applications."
        },
        {
            question: "How accurate is the emotion detection?",
            answer: "Our current models achieve 89.7% accuracy for text analysis and 95.1% for facial expression recognition in controlled environments. Accuracy may vary based on input quality."
        },
        {
            question: "What input types does Emotion.AI support?",
            answer: "We support three primary input modalities: 1) Text analysis for written content (will provide service soon - on testing mode) 2) Visual facial expression analysis through image/video processing."
        },
        {
            question: "Is real-time analysis supported?",
            answer: "Yes, our API supports real-time streaming analysis for both audio and video inputs with latency under 300ms for most use cases. Text analysis is near instantaneous with median response times of 120ms."
        },
        {
            question: "How do I handle user privacy concerns?",
            answer: "We recommend: 1) Always obtaining explicit consent, 2) Anonymizing data where possible, 3) Providing clear opt-out options, and 4) Reviewing our Data Processing Agreement for compliance requirements."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <Helmet>
                <title>Emotion.AI Documentation | API Reference & Guides</title>
                <meta name="description" content="Comprehensive documentation for Emotion.AI including API reference, implementation guides, and frequently asked questions" />
            </Helmet>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-100 to-blue-300 mb-4">
                        Emotion.AI Documentation
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Resources to help you integrate emotion detection into your applications
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-64 flex-shrink-0">
                        <nav className="space-y-2">
                            <button
                                onClick={() => setActiveTab('faq')}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center ${activeTab === 'faq' ? 'bg-gray-800 text-blue-400 font-medium shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                            >
                                <FiHelpCircle className="mr-3 h-5 w-5" />
                                FAQ
                            </button>
                            <button
                                onClick={() => setActiveTab('api')}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center ${activeTab === 'api' ? 'bg-gray-800 text-blue-400 font-medium shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                            >
                                <FiCode className="mr-3 h-5 w-5" />
                                API Reference
                            </button>
                        </nav>

                        <div className="mt-8 p-6 bg-gray-800 rounded-xl border border-gray-700 shadow-lg">
                            <h3 className="font-medium text-white mb-3">Need Help?</h3>
                            <p className="text-sm text-gray-400 mb-4">Our team is here to assist with integration</p>
                            <a
                                href="mailto:support@emotion.ai"
                                className="inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                Contact Support
                                <FiMail className="ml-2 h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    <div className="flex-1">
                        {activeTab === 'faq' && (
                            <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-700 bg-gray-900/50">
                                    <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
                                </div>
                                <div className="divide-y divide-gray-700">
                                    {faqs.map((faq, index) => (
                                        <div key={index} className="p-6 hover:bg-gray-800/50 transition-colors duration-150">
                                            <h3 className="text-lg font-medium text-blue-400">{faq.question}</h3>
                                            <div className="mt-3 text-gray-300">
                                                <p>{faq.answer}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'api' && (
                            <div className="space-y-6">
                                <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg overflow-hidden">
                                    <div className="px-6 py-5 border-b border-gray-700 bg-gray-900/50">
                                        <h2 className="text-2xl font-bold text-white">WebSocket API Reference</h2>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-gray-400 mb-6">
                                            Emotion.AI provides real-time emotion detection through WebSocket connections for video stream processing.
                                            The API uses OpenCV for face detection and DeepFace for emotion analysis.
                                        </p>

                                        <div className="space-y-6">
                                            <div className="border border-gray-700 rounded-lg overflow-hidden hover:border-blue-500 transition-colors duration-200">
                                                <div className="px-4 py-3 bg-blue-900/30 border-b border-blue-900/50 flex items-center">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-400/10 text-blue-400">
                                                        WEBSOCKET
                                                    </span>
                                                    <span className="ml-3 font-mono text-sm text-gray-200">ws://your-api-url/ws/video/</span>
                                                </div>
                                                <div className="p-4 bg-gray-900/20">
                                                    <p className="text-gray-300 mb-4">Real-time video stream processing for emotion detection</p>

                                                    <h4 className="text-sm font-medium text-gray-400 mb-3">Connection Flow</h4>
                                                    <div className="bg-gray-900 rounded-lg p-4 mb-6 border border-gray-700">
                                                        <pre className="text-blue-400 overflow-x-auto font-mono text-sm">
                                                            <code>
                                                                {`1. Client establishes WebSocket connection
2. Server responds with connection confirmation:
   {
     "status": "connected",
     "session_id": "unique-session-id",
     "message": "Ready to receive frames"
   }
3. Client sends video frames as binary data
4. Server processes each frame and returns emotion analysis
5. Connection closes when client disconnects`}
                                                            </code>
                                                        </pre>
                                                    </div>

                                                    <h4 className="text-sm font-medium text-gray-400 mb-3">Frame Requirements</h4>
                                                    <div className="overflow-x-auto">
                                                        <table className="min-w-full divide-y divide-gray-700">
                                                            <thead className="bg-gray-800">
                                                                <tr>
                                                                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Parameter</th>
                                                                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Value</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="bg-gray-900/50 divide-y divide-gray-800">
                                                                <tr className="hover:bg-gray-800/50">
                                                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-blue-400">Format</td>
                                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">JPEG or PNG encoded binary</td>
                                                                </tr>
                                                                <tr className="hover:bg-gray-800/50">
                                                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-blue-400">Max Size</td>
                                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">5MB per frame</td>
                                                                </tr>
                                                                <tr className="hover:bg-gray-800/50">
                                                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-blue-400">Processing Rate</td>
                                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">~10 FPS (100ms interval)</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="border border-gray-700 rounded-lg overflow-hidden hover:border-green-500 transition-colors duration-200">
                                                <div className="px-4 py-3 bg-green-900/30 border-b border-green-900/50">
                                                    <h3 className="text-lg font-medium text-white">Analysis Response</h3>
                                                </div>
                                                <div className="p-4 bg-gray-900/20">
                                                    <div className="bg-gray-900 rounded-lg p-4 mb-4 border border-gray-700">
                                                        <pre className="text-green-400 overflow-x-auto font-mono text-sm">
                                                            <code>
                                                                {`{
  "emotion": "happiness",
  "confidence": 0.92,
  "timestamp": "2023-06-15T12:34:56.789Z"
}`}
                                                            </code>
                                                        </pre>
                                                    </div>
                                                    <div className="overflow-x-auto">
                                                        <table className="min-w-full divide-y divide-gray-700">
                                                            <thead className="bg-gray-800">
                                                                <tr>
                                                                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Field</th>
                                                                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="bg-gray-900/50 divide-y divide-gray-800">
                                                                <tr className="hover:bg-gray-800/50">
                                                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-green-400">emotion</td>
                                                                    <td className="px-4 py-3 text-sm text-gray-400">Detected emotion (happiness, sadness, anger, fear, surprise, disgust, neutral)</td>
                                                                </tr>
                                                                <tr className="hover:bg-gray-800/50">
                                                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-green-400">confidence</td>
                                                                    <td className="px-4 py-3 text-sm text-gray-400">Confidence score (0-1) of the detection</td>
                                                                </tr>
                                                                <tr className="hover:bg-gray-800/50">
                                                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-green-400">timestamp</td>
                                                                    <td className="px-4 py-3 text-sm text-gray-400">ISO 8601 timestamp of analysis</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="border border-gray-700 rounded-lg overflow-hidden hover:border-purple-500 transition-colors duration-200">
                                                <div className="px-4 py-3 bg-purple-900/30 border-b border-purple-900/50">
                                                    <h3 className="text-lg font-medium text-white">OpenCV Face Detection</h3>
                                                </div>
                                                <div className="p-4 bg-gray-900/20">
                                                    <p className="text-gray-300 mb-4">
                                                        The system uses OpenCV's Haar Cascade classifier for initial face detection before emotion analysis.
                                                    </p>

                                                    <h4 className="text-sm font-medium text-gray-400 mb-3">Configuration</h4>
                                                    <div className="bg-gray-900 rounded-lg p-4 mb-6 border border-gray-700">
                                                        <pre className="text-purple-400 overflow-x-auto font-mono text-sm">
                                                            <code>
                                                                {`# Haar Cascade Parameters
scale_factor = 1.05  # How much the image size is reduced at each scale
min_neighbors = 5    # How many neighbors each candidate rectangle should have
min_size = (30, 30)  # Minimum possible object size`}
                                                            </code>
                                                        </pre>
                                                    </div>

                                                    <h4 className="text-sm font-medium text-gray-400 mb-3">Detection Process</h4>
                                                    <div className="space-y-4">
                                                        <div className="flex items-start">
                                                            <div className="flex-shrink-0 bg-purple-500/10 text-purple-400 rounded-full p-1 mt-1">
                                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </div>
                                                            <div className="ml-3">
                                                                <p className="text-sm text-gray-300">Convert frame to grayscale for processing</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start">
                                                            <div className="flex-shrink-0 bg-purple-500/10 text-purple-400 rounded-full p-1 mt-1">
                                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </div>
                                                            <div className="ml-3">
                                                                <p className="text-sm text-gray-300">Apply Haar Cascade classifier to detect faces</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start">
                                                            <div className="flex-shrink-0 bg-purple-500/10 text-purple-400 rounded-full p-1 mt-1">
                                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </div>
                                                            <div className="ml-3">
                                                                <p className="text-sm text-gray-300">Pass detected face regions to DeepFace for emotion analysis</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="border border-gray-700 rounded-lg overflow-hidden hover:border-red-500 transition-colors duration-200">
                                                <div className="px-4 py-3 bg-red-900/30 border-b border-red-900/50">
                                                    <h3 className="text-lg font-medium text-white">Error Responses</h3>
                                                </div>
                                                <div className="p-4 bg-gray-900/20">
                                                    <div className="bg-gray-900 rounded-lg p-4 mb-4 border border-gray-700">
                                                        <pre className="text-red-400 overflow-x-auto font-mono text-sm">
                                                            <code>
                                                                {`{
  "error": "no_face_detected",
  "message": "No faces found in the frame",
  "timestamp": "2023-06-15T12:34:56.789Z"
}`}
                                                            </code>
                                                        </pre>
                                                    </div>
                                                    <div className="overflow-x-auto">
                                                        <table className="min-w-full divide-y divide-gray-700">
                                                            <thead className="bg-gray-800">
                                                                <tr>
                                                                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Error Code</th>
                                                                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="bg-gray-900/50 divide-y divide-gray-800">
                                                                <tr className="hover:bg-gray-800/50">
                                                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-red-400">no_face_detected</td>
                                                                    <td className="px-4 py-3 text-sm text-gray-400">No faces were detected in the frame</td>
                                                                </tr>
                                                                <tr className="hover:bg-gray-800/50">
                                                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-red-400">invalid_frame</td>
                                                                    <td className="px-4 py-3 text-sm text-gray-400">Frame data is corrupted or invalid</td>
                                                                </tr>
                                                                <tr className="hover:bg-gray-800/50">
                                                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-red-400">frame_too_large</td>
                                                                    <td className="px-4 py-3 text-sm text-gray-400">Frame exceeds maximum allowed size (5MB)</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg overflow-hidden">
                                    <div className="px-6 py-5 border-b border-gray-700 bg-gray-900/50">
                                        <h2 className="text-2xl font-bold text-white">Python Client Example</h2>
                                    </div>
                                    <div className="p-6">
                                        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                                            <pre className="text-yellow-400 overflow-x-auto font-mono text-sm">
                                                <code>
                                                    {`import asyncio
import websockets
import cv2
import numpy as np

async def send_video_stream():
    async with websockets.connect('ws://your-api-url/ws/video/') as websocket:
        # Receive connection confirmation
        response = await websocket.recv()
        print("Server response:", response)

        # Open camera
        cap = cv2.VideoCapture(0)
        
        try:
            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break

                # Encode frame as JPEG
                _, buffer = cv2.imencode('.jpg', frame)
                frame_bytes = buffer.tobytes()

                # Send frame to server
                await websocket.send(frame_bytes)

                # Get analysis result
                try:
                    result = await asyncio.wait_for(websocket.recv(), timeout=1.0)
                    print("Emotion analysis:", result)
                except asyncio.TimeoutError:
                    continue

        finally:
            cap.release()

asyncio.get_event_loop().run_until_complete(send_video_stream())`}
                                                </code>
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmotionAIDocumentation;