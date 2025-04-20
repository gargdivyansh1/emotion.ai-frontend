import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { FiChevronDown, FiMail, FiCode, FiHelpCircle, FiTerminal, FiCpu, FiLink } from 'react-icons/fi';

const EmotionAIDocumentation = () => {
    const [activeTab, setActiveTab] = useState<'faq' | 'api' | 'guides'>('faq');
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        realTime: false,
        webhook: false,
        optimization: false
    });

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const faqs = [
        {
            question: "What is Emotion.AI?",
            answer: "Emotion.AI is an artificial intelligence platform that analyzes human emotions through various input methods including text, voice, and facial recognition. Our technology helps developers integrate emotion detection into their applications."
        },
        {
            question: "How accurate is the emotion detection?",
            answer: "Our current models achieve 89.7% accuracy for text analysis, 92.3% for voice tone analysis, and 95.1% for facial expression recognition in controlled environments. Accuracy may vary based on input quality."
        },
        {
            question: "What input types does Emotion.AI support?",
            answer: "We support three primary input modalities: 1) Text analysis for written content, 2) Voice analysis for speech patterns and tone, and 3) Visual facial expression analysis through image/video processing."
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

    const apiEndpoints = [
        {
            method: 'POST',
            path: '/v1/analyze/text',
            description: 'Analyze emotion from text content',
            parameters: [
                { name: 'text', type: 'string', required: true, description: 'Content to analyze' },
                { name: 'language', type: 'string', required: false, description: 'Language code (default: en)' }
            ]
        },
        {
            method: 'POST',
            path: '/v1/analyze/audio',
            description: 'Analyze emotion from audio file',
            parameters: [
                { name: 'file', type: 'binary', required: true, description: 'Audio file (MP3, WAV)' },
                { name: 'sample_rate', type: 'integer', required: false, description: 'Sample rate in Hz' }
            ]
        },
        {
            method: 'POST',
            path: '/v1/analyze/image',
            description: 'Analyze facial emotions from image',
            parameters: [
                { name: 'image', type: 'binary', required: true, description: 'Image file (JPG, PNG)' },
                { name: 'detect_faces', type: 'boolean', required: false, description: 'Auto-detect multiple faces' }
            ]
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
                    {/* Sidebar Navigation */}
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
                            <button
                                onClick={() => setActiveTab('guides')}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center ${activeTab === 'guides' ? 'bg-gray-800 text-blue-400 font-medium shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                            >
                                <FiTerminal className="mr-3 h-5 w-5" />
                                Guides
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

                    {/* Main Content */}
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
                                        <h2 className="text-2xl font-bold text-white">API Reference</h2>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-gray-400 mb-6">
                                            Emotion.AI provides RESTful API endpoints for emotion detection across multiple modalities.
                                            All API requests require authentication via your API key.
                                        </p>

                                        <div className="space-y-6">
                                            {apiEndpoints.map((endpoint, index) => (
                                                <div key={index} className="border border-gray-700 rounded-lg overflow-hidden hover:border-blue-500 transition-colors duration-200">
                                                    <div className={`px-4 py-3 ${endpoint.method === 'POST' ? 'bg-blue-900/30 border-b border-blue-900/50' : 'bg-purple-900/30 border-b border-purple-900/50'} flex items-center`}>
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${endpoint.method === 'POST' ? 'bg-blue-400/10 text-blue-400' : 'bg-purple-400/10 text-purple-400'}`}>
                                                            {endpoint.method}
                                                        </span>
                                                        <span className="ml-3 font-mono text-sm text-gray-200">{endpoint.path}</span>
                                                    </div>
                                                    <div className="p-4 bg-gray-900/20">
                                                        <p className="text-gray-300 mb-4">{endpoint.description}</p>

                                                        <h4 className="text-sm font-medium text-gray-400 mb-3">Parameters</h4>
                                                        <div className="overflow-x-auto">
                                                            <table className="min-w-full divide-y divide-gray-700">
                                                                <thead className="bg-gray-800">
                                                                    <tr>
                                                                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                                                                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                                                                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Required</th>
                                                                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="bg-gray-900/50 divide-y divide-gray-800">
                                                                    {endpoint.parameters.map((param, paramIndex) => (
                                                                        <tr key={paramIndex} className="hover:bg-gray-800/50">
                                                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-blue-400">{param.name}</td>
                                                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{param.type}</td>
                                                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{param.required ? 'Yes' : 'No'}</td>
                                                                            <td className="px-4 py-3 text-sm text-gray-400">{param.description}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg overflow-hidden">
                                    <div className="px-6 py-5 border-b border-gray-700 bg-gray-900/50">
                                        <h2 className="text-2xl font-bold text-white">Authentication</h2>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-gray-400 mb-4">
                                            All API requests must include your API key in the Authorization header:
                                        </p>
                                        <div className="bg-gray-900 rounded-lg p-4 mb-6 border border-gray-700">
                                            <pre className="text-blue-400 overflow-x-auto font-mono text-sm">
                                                <code>
                                                    {`Authorization: Bearer YOUR_API_KEY`}
                                                </code>
                                            </pre>
                                        </div>
                                        <p className="text-gray-400">
                                            You can find your API key in the <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Developer Dashboard</a>.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg overflow-hidden">
                                    <div className="px-6 py-5 border-b border-gray-700 bg-gray-900/50">
                                        <h2 className="text-2xl font-bold text-white">Response Format</h2>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-gray-400 mb-4">
                                            All successful API responses return JSON data with the following structure:
                                        </p>
                                        <div className="bg-gray-900 rounded-lg p-4 mb-6 border border-gray-700">
                                            <pre className="text-green-400 overflow-x-auto font-mono text-sm">
                                                <code>
                                                    {`{
  "success": true,
  "data": {
    "emotions": [
      {
        "type": "happiness",
        "score": 0.92,
        "confidence": 0.96
      }
    ]
  },
  "meta": {
    "request_id": "req_123456",
    "timestamp": "2023-06-15T12:34:56Z"
  }
}`}
                                                </code>
                                            </pre>
                                        </div>
                                        <p className="text-gray-400 mb-4">
                                            Error responses follow a similar format:
                                        </p>
                                        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                                            <pre className="text-red-400 overflow-x-auto font-mono text-sm">
                                                <code>
                                                    {`{
  "success": false,
  "error": {
    "code": "invalid_api_key",
    "message": "The provided API key is invalid",
    "details": null
  },
  "meta": {
    "request_id": "req_123456",
    "timestamp": "2023-06-15T12:34:56Z"
  }
}`}
                                                </code>
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'guides' && (
                            <div className="space-y-6">
                                <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg overflow-hidden">
                                    <div className="px-6 py-5 border-b border-gray-700 bg-gray-900/50">
                                        <h2 className="text-2xl font-bold text-white">Getting Started</h2>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-8">
                                            <div>
                                                <h3 className="text-lg font-medium text-blue-400 mb-4 flex items-center">
                                                    <FiCpu className="mr-2" />
                                                    1. Obtain your API Key
                                                </h3>
                                                <p className="text-gray-400 mb-6 pl-8">
                                                    Before you can make requests to the Emotion.AI API, you'll need to obtain an API key from the Developer Dashboard.
                                                </p>
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-medium text-blue-400 mb-4 flex items-center">
                                                    <FiTerminal className="mr-2" />
                                                    2. Install the SDK (optional)
                                                </h3>
                                                <p className="text-gray-400 mb-4 pl-8">
                                                    We provide official SDKs for several programming languages to simplify integration:
                                                </p>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pl-8">
                                                    <div className="border border-gray-700 rounded-lg p-4 hover:border-blue-500 transition-colors">
                                                        <h4 className="font-mono font-medium text-gray-300 mb-2">JavaScript/Node.js</h4>
                                                        <div className="bg-gray-900 rounded-md p-3 border border-gray-700">
                                                            <pre className="text-green-400 text-sm font-mono">
                                                                <code>npm install emotion-ai-sdk</code>
                                                            </pre>
                                                        </div>
                                                    </div>
                                                    <div className="border border-gray-700 rounded-lg p-4 hover:border-blue-500 transition-colors">
                                                        <h4 className="font-mono font-medium text-gray-300 mb-2">Python</h4>
                                                        <div className="bg-gray-900 rounded-md p-3 border border-gray-700">
                                                            <pre className="text-green-400 text-sm font-mono">
                                                                <code>pip install emotion-ai</code>
                                                            </pre>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-medium text-blue-400 mb-4 flex items-center">
                                                    <FiCode className="mr-2" />
                                                    3. Make your first API call
                                                </h3>
                                                <p className="text-gray-400 mb-4 pl-8">
                                                    Here's a simple example using JavaScript to analyze text:
                                                </p>
                                                <div className="bg-gray-900 rounded-lg p-4 mb-6 border border-gray-700 pl-8">
                                                    <pre className="text-green-400 overflow-x-auto font-mono text-sm">
                                                        <code>
                                                            {`const EmotionAI = require('emotion-ai-sdk');
const client = new EmotionAI('YOUR_API_KEY');

client.analyze.text({
  text: 'I am feeling really happy today!',
  language: 'en'
})
.then(response => {
  console.log('Detected emotions:', response.data.emotions);
})
.catch(error => {
  console.error('Error:', error.message);
});`}
                                                        </code>
                                                    </pre>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg overflow-hidden">
                                    <div className="px-6 py-5 border-b border-gray-700 bg-gray-900/50">
                                        <h2 className="text-2xl font-bold text-white">Advanced Guides</h2>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-4">
                                            <div className="border border-gray-700 rounded-lg overflow-hidden hover:border-blue-500 transition-colors">
                                                <button
                                                    onClick={() => toggleSection('realTime')}
                                                    className="w-full flex justify-between items-center p-4 text-left bg-gray-900/50 hover:bg-gray-800/50"
                                                >
                                                    <div className="flex items-center">
                                                        <FiCpu className="mr-3 text-blue-400" />
                                                        <h3 className="font-medium text-white">Real-time Video Analysis</h3>
                                                    </div>
                                                    <FiChevronDown className={`h-5 w-5 text-gray-400 transform transition-transform ${openSections.realTime ? 'rotate-180' : ''}`} />
                                                </button>
                                                {openSections.realTime && (
                                                    <div className="p-6 border-t border-gray-700 bg-gray-900/20">
                                                        <p className="text-gray-400 mb-4">
                                                            To implement real-time video emotion analysis, you'll need to capture video frames and send them to our API at regular intervals.
                                                        </p>
                                                        <div className="bg-gray-900 rounded-lg p-4 mb-4 border border-gray-700">
                                                            <pre className="text-green-400 overflow-x-auto font-mono text-sm">
                                                                <code>
                                                                    {`// Example using browser MediaDevices API
async function startVideoAnalysis() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  const video = document.createElement('video');
  video.srcObject = stream;
  video.play();
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  setInterval(async () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    
    const imageData = canvas.toDataURL('image/jpeg');
    const response = await client.analyze.image({ image: imageData });
    // Process emotions...
  }, 300); // Analyze every 300ms
}`}
                                                                </code>
                                                            </pre>
                                                        </div>
                                                        <p className="text-gray-400">
                                                            For best results, maintain a consistent frame rate and consider using web workers to offload processing.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="border border-gray-700 rounded-lg overflow-hidden hover:border-blue-500 transition-colors">
                                                <button
                                                    onClick={() => toggleSection('webhook')}
                                                    className="w-full flex justify-between items-center p-4 text-left bg-gray-900/50 hover:bg-gray-800/50"
                                                >
                                                    <div className="flex items-center">
                                                        <FiLink className="mr-3 text-purple-400" />
                                                        <h3 className="font-medium text-white">Webhook Integration</h3>
                                                    </div>
                                                    <FiChevronDown className={`h-5 w-5 text-gray-400 transform transition-transform ${openSections.webhook ? 'rotate-180' : ''}`} />
                                                </button>
                                                {openSections.webhook && (
                                                    <div className="p-6 border-t border-gray-700 bg-gray-900/20">
                                                        <p className="text-gray-400 mb-4">
                                                            Configure webhooks to receive real-time notifications when analysis is complete for asynchronous processing.
                                                        </p>
                                                        <div className="space-y-6">
                                                            <div>
                                                                <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                                                                    <FiCode className="mr-2" />
                                                                    1. Set up your endpoint
                                                                </h4>
                                                                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                                                                    <pre className="text-green-400 font-mono text-sm">
                                                                        <code>{`POST /webhook/emotion-results
Content-Type: application/json
X-Signature: sha256=...`}</code>
                                                                    </pre>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                                                                    <FiTerminal className="mr-2" />
                                                                    2. Verify the signature
                                                                </h4>
                                                                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                                                                    <pre className="text-green-400 font-mono text-sm">
                                                                        <code>{`// Node.js example
const crypto = require('crypto');

function verifyWebhook(req) {
  const signature = req.headers['x-signature'];
  const hmac = crypto.createHmac('sha256', process.env.WEBHOOK_SECRET);
  const digest = hmac.update(JSON.stringify(req.body)).digest('hex');
  return signature === \`sha256=\${digest}\`;
}`}</code>
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
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmotionAIDocumentation;