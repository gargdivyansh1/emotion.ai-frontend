import { useState } from 'react';
import { Helmet } from 'react-helmet';

const EmotionAIDocumentation = () => {
    const [activeTab, setActiveTab] = useState<'faq' | 'api' | 'guides'>('faq');
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        gettingStarted: true,
        apiBasics: false,
        advanced: false
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Helmet>
                <title>Emotion.AI Documentation | API Reference & Guides</title>
                <meta name="description" content="Comprehensive documentation for Emotion.AI including API reference, implementation guides, and frequently asked questions" />
            </Helmet>

            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Emotion.AI Documentation</h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Resources to help you integrate emotion detection into your applications
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <nav className="space-y-1">
                        <button
                            onClick={() => setActiveTab('faq')}
                            className={`w-full text-left px-4 py-3 rounded-lg ${activeTab === 'faq' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                            <div className="flex items-center">
                                <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                FAQ
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('api')}
                            className={`w-full text-left px-4 py-3 rounded-lg ${activeTab === 'api' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                            <div className="flex items-center">
                                <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                                API Reference
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('guides')}
                            className={`w-full text-left px-4 py-3 rounded-lg ${activeTab === 'guides' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                            <div className="flex items-center">
                                <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Guides
                            </div>
                        </button>
                    </nav>

                    <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                        <h3 className="font-medium text-gray-900 mb-3">Need Help?</h3>
                        <p className="text-sm text-gray-600 mb-4">Our team is here to assist with integration</p>
                        <a
                            href="mailto:support@emotion.ai"
                            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                            Contact Support
                            <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    {activeTab === 'faq' && (
                        <div className="bg-white shadow overflow-hidden rounded-lg">
                            <div className="px-6 py-5 border-b border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {faqs.map((faq, index) => (
                                    <div key={index} className="p-6">
                                        <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                                        <div className="mt-2 text-gray-600">
                                            <p>{faq.answer}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'api' && (
                        <div className="space-y-6">
                            <div className="bg-white shadow overflow-hidden rounded-lg">
                                <div className="px-6 py-5 border-b border-gray-200">
                                    <h2 className="text-2xl font-bold text-gray-900">API Reference</h2>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-600 mb-6">
                                        Emotion.AI provides RESTful API endpoints for emotion detection across multiple modalities.
                                        All API requests require authentication via your API key.
                                    </p>

                                    <div className="space-y-8">
                                        {apiEndpoints.map((endpoint, index) => (
                                            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                                                <div className={`px-4 py-3 ${endpoint.method === 'POST' ? 'bg-blue-50' : 'bg-green-50'} flex items-center`}>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                                        {endpoint.method}
                                                    </span>
                                                    <span className="ml-2 font-mono text-sm text-gray-800">{endpoint.path}</span>
                                                </div>
                                                <div className="p-4">
                                                    <p className="text-gray-700 mb-4">{endpoint.description}</p>

                                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Parameters</h4>
                                                    <div className="overflow-x-auto">
                                                        <table className="min-w-full divide-y divide-gray-200">
                                                            <thead className="bg-gray-50">
                                                                <tr>
                                                                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                                                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                                                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required</th>
                                                                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="bg-white divide-y divide-gray-200">
                                                                {endpoint.parameters.map((param, paramIndex) => (
                                                                    <tr key={paramIndex}>
                                                                        <td className="px-3 py-2 whitespace-nowrap text-sm font-mono text-gray-900">{param.name}</td>
                                                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{param.type}</td>
                                                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{param.required ? 'Yes' : 'No'}</td>
                                                                        <td className="px-3 py-2 text-sm text-gray-500">{param.description}</td>
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
                            </div>              <div className="bg-white shadow overflow-hidden rounded-lg">
                                <div className="px-6 py-5 border-b border-gray-200">
                                    <h2 className="text-2xl font-bold text-gray-900">Authentication</h2>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-600 mb-4">
                                        All API requests must include your API key in the Authorization header:
                                    </p>
                                    <div className="bg-gray-800 rounded-md p-4 mb-6">
                                        <pre className="text-gray-100 overflow-x-auto">
                                            <code>
                                                {`Authorization: Bearer YOUR_API_KEY`}
                                            </code>
                                        </pre>
                                    </div>
                                    <p className="text-gray-600 mb-4">
                                        You can find your API key in the <a href="#" className="text-blue-600 hover:underline">Developer Dashboard</a>.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white shadow overflow-hidden rounded-lg">
                                <div className="px-6 py-5 border-b border-gray-200">
                                    <h2 className="text-2xl font-bold text-gray-900">Response Format</h2>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-600 mb-4">
                                        All successful API responses return JSON data with the following structure:
                                    </p>
                                    <div className="bg-gray-800 rounded-md p-4 mb-6">
                                        <pre className="text-gray-100 overflow-x-auto">
                                            <code>
                                                {`{
  "success": true,
  "data": {
    // Endpoint-specific data
  },
  "meta": {
    "request_id": "req_123456",
    "timestamp": "2023-06-15T12:34:56Z"
  }
}`}
                                            </code>
                                        </pre>
                                    </div>
                                    <p className="text-gray-600 mb-4">
                                        Error responses follow a similar format:
                                    </p>
                                    <div className="bg-gray-800 rounded-md p-4">
                                        <pre className="text-gray-100 overflow-x-auto">
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
                            <div className="bg-white shadow overflow-hidden rounded-lg">
                                <div className="px-6 py-5 border-b border-gray-200">
                                    <h2 className="text-2xl font-bold text-gray-900">Getting Started</h2>
                                </div>
                                <div className="p-6">
                                    <div className="prose max-w-none">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">1. Obtain your API Key</h3>
                                        <p className="text-gray-600 mb-6">
                                            Before you can make requests to the Emotion.AI API, you'll need to obtain an API key from the Developer Dashboard.
                                        </p>

                                        <h3 className="text-lg font-medium text-gray-900 mb-4">2. Install the SDK (optional)</h3>
                                        <p className="text-gray-600 mb-4">
                                            We provide official SDKs for several programming languages to simplify integration:
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            <div className="border border-gray-200 rounded-lg p-4">
                                                <h4 className="font-mono font-medium mb-2">JavaScript/Node.js</h4>
                                                <div className="bg-gray-800 rounded-md p-3">
                                                    <pre className="text-gray-100 text-sm">
                                                        <code>npm install emotion-ai-sdk</code>
                                                    </pre>
                                                </div>
                                            </div>
                                            <div className="border border-gray-200 rounded-lg p-4">
                                                <h4 className="font-mono font-medium mb-2">Python</h4>
                                                <div className="bg-gray-800 rounded-md p-3">
                                                    <pre className="text-gray-100 text-sm">
                                                        <code>pip install emotion-ai</code>
                                                    </pre>
                                                </div>
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-medium text-gray-900 mb-4">3. Make your first API call</h3>
                                        <p className="text-gray-600 mb-4">
                                            Here's a simple example using JavaScript to analyze text:
                                        </p>
                                        <div className="bg-gray-800 rounded-md p-4 mb-6">
                                            <pre className="text-gray-100 overflow-x-auto">
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

                                        <h3 className="text-lg font-medium text-gray-900 mb-4">4. Handle the response</h3>
                                        <p className="text-gray-600">
                                            The API will return a detailed analysis of detected emotions with confidence scores. Refer to the API reference for complete response documentation.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white shadow overflow-hidden rounded-lg">
                                <div className="px-6 py-5 border-b border-gray-200">
                                    <h2 className="text-2xl font-bold text-gray-900">Advanced Guides</h2>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-6">
                                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                                            <button
                                                onClick={() => toggleSection('realTime')}
                                                className="w-full flex justify-between items-center p-4 text-left bg-gray-50 hover:bg-gray-100"
                                            >
                                                <h3 className="font-medium text-gray-900">Real-time Video Analysis</h3>
                                                <svg
                                                    className={`h-5 w-5 text-gray-500 transform ${openSections.realTime ? 'rotate-180' : ''}`}
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                            {openSections.realTime && (
                                                <div className="p-4 border-t border-gray-200">
                                                    <p className="text-gray-600 mb-4">
                                                        To implement real-time video emotion analysis, you'll need to capture video frames and send them to our API at regular intervals.
                                                    </p>
                                                    <div className="bg-gray-800 rounded-md p-4 mb-4">
                                                        <pre className="text-gray-100 overflow-x-auto">
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
                                                    <p className="text-gray-600">
                                                        For best results, maintain a consistent frame rate and consider using web workers to offload processing.
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                                            <button
                                                onClick={() => toggleSection('webhook')}
                                                className="w-full flex justify-between items-center p-4 text-left bg-gray-50 hover:bg-gray-100"
                                            >
                                                <h3 className="font-medium text-gray-900">Webhook Integration</h3>
                                                <svg
                                                    className={`h-5 w-5 text-gray-500 transform ${openSections.webhook ? 'rotate-180' : ''}`}
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                            {openSections.webhook && (
                                                <div className="p-4 border-t border-gray-200">
                                                    <p className="text-gray-600 mb-4">
                                                        Configure webhooks to receive real-time notifications when analysis is complete for asynchronous processing.
                                                    </p>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="text-sm font-medium text-gray-900 mb-2">1. Set up your endpoint</h4>
                                                            <div className="bg-gray-800 rounded-md p-3">
                                                                <pre className="text-gray-100 text-sm">
                                                                    <code>{`POST /webhook/emotion-results
Content-Type: application/json
X-Signature: sha256=...</code>`}
                                                                    </code>
                                                                </pre>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-medium text-gray-900 mb-2">2. Verify the signature</h4>
                                                            <div className="bg-gray-800 rounded-md p-3">
                                                                <pre className="text-gray-100 text-sm">
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
    );
};

export default EmotionAIDocumentation;