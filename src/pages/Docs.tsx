import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, Code, Database, Cpu, Terminal, GitBranch, 
  Zap, Shield, Lock, Download, Upload, Settings,
  BarChart2, Layers, Users, FileText, Globe, Smartphone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Docs: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeSDK, setActiveSDK] = useState<string>('REST API');

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
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
              <p>EmotionAI is a cutting-edge platform that analyzes human emotions through multiple input modalities including text, voice, and facial expressions.</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FileText className="w-4 h-4 mr-2 text-indigo-400" />
                    <span className="font-medium">Text Analysis</span>
                  </div>
                  <p className="text-sm text-gray-400">Analyze sentiment and emotional tone in written content</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Globe className="w-4 h-4 mr-2 text-indigo-400" />
                    <span className="font-medium">Voice Analysis - coming soon</span>
                  </div>
                  <p className="text-sm text-gray-400">Detect emotional patterns in speech and vocal characteristics</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Smartphone className="w-4 h-4 mr-2 text-indigo-400" />
                    <span className="font-medium">Facial Recognition</span>
                  </div>
                  <p className="text-sm text-gray-400">Identify emotions through facial expressions and micro-expressions</p>
                </div>
              </div>
            </div>
          )
        },
        {
          title: 'Creating Your First Session',
          content: (
            <div className="space-y-4">
              <p>Follow these steps to create your first analysis session:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Register for an API key in the developer portal</li>
                <li>Choose your analysis modality (text, audio, or video)</li>
                <li>Format your input data according to our specifications</li>
                <li>Submit your request to our API endpoint</li>
                <li>Receive and interpret your results</li>
              </ol>
              <div className="bg-gray-800 p-4 rounded-lg">
                <pre className="text-sm text-gray-300">
{`// Sample API Request
POST /v1/sessions
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "type": "text",
  "content": "I'm feeling excited about this new project!",
  "language": "en"
}`}
                </pre>
              </div>
            </div>
          )
        },
        {
          title: 'Understanding Your Dashboard',
          content: (
            <div className="space-y-4">
              <p>The EmotionAI dashboard provides comprehensive insights into your emotional analysis results:</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <BarChart2 className="w-4 h-4 mr-2" />
                    Emotion Distribution
                  </h4>
                  <p className="text-sm text-gray-400">Visual breakdown of detected emotions and their intensity</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Layers className="w-4 h-4 mr-2" />
                    Timeline Analysis
                  </h4>
                  <p className="text-sm text-gray-400">Track emotional changes over time in longer content</p>
                </div>
              </div>
            </div>
          )
        },
        {
          title: 'Troubleshooting Guide',
          content: (
            <div className="space-y-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2 text-red-400">Common Issues</h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="block w-2 h-2 rounded-full bg-red-400 mt-2 mr-2"></span>
                    <span>Authentication errors - Verify your API key</span>
                  </li>
                  <li className="flex items-start">
                    <span className="block w-2 h-2 rounded-full bg-red-400 mt-2 mr-2"></span>
                    <span>Input format issues - Check our data requirements</span>
                  </li>
                  <li className="flex items-start">
                    <span className="block w-2 h-2 rounded-full bg-red-400 mt-2 mr-2"></span>
                    <span>Rate limit exceeded - Upgrade your plan or optimize requests</span>
                  </li>
                </ul>
              </div>
            </div>
          )
        }
      ]
    },
    {
      icon: Code,
      title: 'API Reference',
      description: 'Technical documentation for developers',
      color: 'text-blue-400',
      items: [
        {
          title: 'Authentication',
          content: (
            <div className="space-y-4">
              <p>All API requests require authentication via API keys:</p>
              <div className="bg-gray-800 p-4 rounded-lg">
                <pre className="text-sm text-gray-300">
{`// Header format
Authorization: Bearer YOUR_API_KEY

// Obtain your API key from:
// https://developer.emotion.ai/dashboard/credentials`}
                </pre>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Security
                  </h4>
                  <p className="text-sm text-gray-400">Always keep your API keys secret. Rotate them regularly.</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Lock className="w-4 h-4 mr-2" />
                    Permissions
                  </h4>
                  <p className="text-sm text-gray-400">Different keys can have different permission levels.</p>
                </div>
              </div>
            </div>
          )
        },
        {
          title: 'Session Endpoints',
          content: (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left">Endpoint</th>
                      <th className="px-4 py-3 text-left">Method</th>
                      <th className="px-4 py-3 text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    <tr>
                      <td className="px-4 py-3 font-mono text-sm">emotion/emotion-trend</td>
                      <td className="px-4 py-3">POST</td>
                      <td className="px-4 py-3">Create new analysis session</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-sm">/emotion/emotion-trend/:id</td>
                      <td className="px-4 py-3">GET</td>
                      <td className="px-4 py-3">Retrieve session results</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-sm">/emotion-data</td>
                      <td className="px-4 py-3">POST</td>
                      <td className="px-4 py-3">Batch analysis</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )
        },
        {
          title: 'Webhook Integration',
          content: (
            <div className="space-y-4">
              <p>Configure webhooks to receive real-time notifications when analysis completes:</p>
              <div className="bg-gray-800 p-4 rounded-lg">
                <pre className="text-sm text-gray-300">
{`// Sample webhook payload
{
  "event": "analysis.completed",
  "data": {
    "session_id": "ses_123456789",
    "status": "completed",
    "timestamp": "2023-06-15T12:34:56Z",
    "results": {
      "dominant_emotion": "joy",
      "emotion_scores": {
        "joy": 0.87,
        "anger": 0.02,
        "sadness": 0.03,
        "surprise": 0.08
      }
    }
  }
}`}
                </pre>
              </div>
            </div>
          )
        },
        {
          title: 'Rate Limits',
          content: (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left">Plan</th>
                      <th className="px-4 py-3 text-left">Requests/Min</th>
                      <th className="px-4 py-3 text-left">Requests/Day</th>
                      <th className="px-4 py-3 text-left">Burst Limit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    <tr>
                      <td className="px-4 py-3">Free</td>
                      <td className="px-4 py-3">5</td>
                      <td className="px-4 py-3">1,000</td>
                      <td className="px-4 py-3">10</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Pro</td>
                      <td className="px-4 py-3">30</td>
                      <td className="px-4 py-3">50,000</td>
                      <td className="px-4 py-3">100</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Enterprise</td>
                      <td className="px-4 py-3">Custom</td>
                      <td className="px-4 py-3">Custom</td>
                      <td className="px-4 py-3">Custom</td>
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
          title: 'Emotion Data Schema',
          content: (
            <div className="space-y-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <pre className="text-sm text-gray-300">
{`// Emotion analysis response
{
  "id": "emo_123456789",
  "session_id": "ses_123456789",
  "analysis_type": "text",
  "timestamp": "2023-06-15T12:34:56Z",
  "results": {
    "dominant_emotion": "joy",
    "confidence": 0.92,
    "emotion_scores": {
      "joy": 0.92,
      "anger": 0.02,
      "sadness": 0.01,
      "surprise": 0.03,
      "fear": 0.01,
      "disgust": 0.01
    },
    "metadata": {
      "language": "en",
      "content_length": 28,
      "processing_time": 0.42
    }
  }
}`}
                </pre>
              </div>
            </div>
          )
        },
        {
          title: 'Session Objects',
          content: (
            <div className="space-y-4">
              <p>A session represents a single analysis request and its results:</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Input Properties</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="block w-2 h-2 rounded-full bg-green-400 mt-2 mr-2"></span>
                      <span>type (text/audio/video)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="block w-2 h-2 rounded-full bg-green-400 mt-2 mr-2"></span>
                      <span>content (raw or reference)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="block w-2 h-2 rounded-full bg-green-400 mt-2 mr-2"></span>
                      <span>language</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Output Properties</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="block w-2 h-2 rounded-full bg-green-400 mt-2 mr-2"></span>
                      <span>status (queued/processing/completed)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="block w-2 h-2 rounded-full bg-green-400 mt-2 mr-2"></span>
                      <span>results (analysis data)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="block w-2 h-2 rounded-full bg-green-400 mt-2 mr-2"></span>
                      <span>created_at/updated_at</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )
        },
        {
          title: 'User Profiles',
          content: (
            <div className="space-y-4">
              <p>User profiles track emotional patterns over time:</p>
              <div className="bg-gray-800 p-4 rounded-lg">
                <pre className="text-sm text-gray-300">
{`// User profile example
{
  "user_id": "usr_123456789",
  "emotional_baseline": {
    "joy": 0.65,
    "anger": 0.12,
    "sadness": 0.18,
    "surprise": 0.05
  },
  "trends": {
    "weekly_variation": 0.23,
    "dominant_emotion_changes": [
      {
        "from": "neutral",
        "to": "joy",
        "frequency": 0.45
      }
    ]
  },
  "sessions_count": 42,
  "first_session": "2023-01-15",
  "last_session": "2023-06-14"
}`}
                </pre>
              </div>
            </div>
          )
        },
        {
          title: 'Export Formats',
          content: (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Download className="w-4 h-4 mr-2 text-green-400" />
                    <span className="font-medium">JSON</span>
                  </div>
                  <p className="text-sm text-gray-400">Structured data for applications</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Upload className="w-4 h-4 mr-2 text-green-400" />
                    <span className="font-medium">CSV</span>
                  </div>
                  <p className="text-sm text-gray-400">Spreadsheet-friendly format - coming soon</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Settings className="w-4 h-4 mr-2 text-green-400" />
                    <span className="font-medium">PDF Report</span>
                  </div>
                  <p className="text-sm text-gray-400">Printable analysis summaries</p>
                </div>
              </div>
            </div>
          )
        }
      ]
    }
  ];

  const sdks = [
    {
      name: 'REST API',
      icon: Terminal,
      color: 'text-blue-400',
      description: 'Direct HTTP API integration',
      features: [
        'Standard RESTful endpoints',
        'JSON request/response format',
        'Works with any programming language',
        'OAuth 2.0 authentication'
      ],
      codeExample: `curl -X POST https://api.emotion.ai/v1/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"text": "Your content here"}'`
    },
    {
      name: 'Python SDK',
      icon: Cpu,
      color: 'text-green-400',
      description: 'Official Python client library',
      features: [
        'Python 3.7+ compatible',
        'Async/await support',
        'Type annotations',
        'Pandas integration'
      ],
      codeExample: `from emotionai import EmotionAI

client = EmotionAI(api_key="YOUR_API_KEY")
response = client.analyze.text("Your content here")
print(response.dominant_emotion)`
    },
    {
      name: 'JavaScript SDK',
      icon: GitBranch,
      color: 'text-yellow-400',
      description: 'Browser and Node.js client',
      features: [
        'ES modules and CommonJS',
        'React hooks included',
        'WebSocket support',
        'TypeScript definitions'
      ],
      codeExample: `import { EmotionAI } from 'emotionai-js';

const client = new EmotionAI('YOUR_API_KEY');
client.analyze.text('Your content here')
  .then(response => console.log(response));`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
      {/* Header */}
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

      {/* Main Content */}
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

        {/* Documentation Sections */}
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

        {/* Expanded Section Content */}
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

        {/* SDKs Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 mb-8"
        >
          <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-8">SDKs & Libraries</h2>
            
            {/* SDK Selector */}
            <div className="flex border-b border-gray-700 mb-8">
              {sdks.map((sdk) => (
                <button
                  key={sdk.name}
                  onClick={() => setActiveSDK(sdk.name)}
                  className={`px-6 py-3 font-medium border-b-2 ${activeSDK === sdk.name ? `border-${sdk.color.split('-')[1]} text-white` : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                  {sdk.name}
                </button>
              ))}
            </div>
            
            {/* Active SDK Content */}
            {sdks.map((sdk) => (
              <div 
                key={sdk.name}
                className={`${activeSDK === sdk.name ? 'block' : 'hidden'}`}
              >
                <div className="flex items-start mb-8">
                  <div className={`bg-gray-700/50 p-3 rounded-lg mr-4 ${sdk.color}`}>
                    <sdk.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{sdk.name}</h3>
                    <p className="text-gray-400">{sdk.description}</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Features</h4>
                    <ul className="space-y-3">
                      {sdk.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <span className={`block w-2 h-2 rounded-full mt-2 mr-3 ${sdk.color}`}></span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Example</h4>
                    <div className="bg-gray-900 rounded-lg p-4">
                      <pre className={`font-mono text-sm ${sdk.color}`}>
                        {sdk.codeExample}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Additional Resources */}
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
              <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors">
                Contact Support
              </button>
              <button className="px-6 py-3 bg-transparent border border-indigo-400 hover:bg-indigo-900/30 rounded-lg font-medium transition-colors">
                Join Community
              </button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Docs;