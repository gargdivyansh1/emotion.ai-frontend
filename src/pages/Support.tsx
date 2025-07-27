import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { LifeBuoy, Mail, MessageSquare, FileText, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Support: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const loadTawkTo = () => {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://embed.tawk.to/6885dcbb8bbc5d1928eb4a77/1j15ecg35';
      script.charset = 'UTF-8';
      script.setAttribute('crossorigin', '*');
      document.body.appendChild(script);
      
      return script;
    };

    const script = loadTawkTo();

    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const startChat = () => {
    if (window.Tawk_API) {
      window.Tawk_API.toggle();
    } else {
      alert('Chat is loading, please try again in a moment');
    }
  };

  const supportOptions = [
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      available: 'Available now',
      action: 'Start Chat',
      onClick: startChat
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us an email and we\'ll respond within 24 hours',
      available: 'Typically responds in 4 hours',
      action: 'Contact Us',
      onClick: () => window.location.href = 'mailto:divyanshgarg515@gmail.com?subject=EmotionAI Support Request'
    },
    {
      icon: FileText,
      title: 'Help Center',
      description: 'Browse our documentation and FAQs',
      available: 'Always available',
      action: 'View Docs',
      onClick: () => navigate('/docs')
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Call us for immediate assistance',
      available: 'Mon-Fri, 9AM-5PM',
      action: 'Call Now',
      onClick: () => window.location.href = 'tel:+917617449174'
    }
  ];

  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "You can reset your password from the login page by clicking 'Forgot Password'."
    },
    {
      question: "Is my session data private?",
      answer: "Yes, we encrypt all data and never share it without your consent."
    },
    {
      question: "What devices are supported?",
      answer: "EmotionAI works on any device with a modern browser and camera."
    },
    {
      question: "How accurate is the emotion detection?",
      answer: "Our technology has a 94% accuracy rate in controlled conditions."
    },
    {
      question: "Can I export my data?",
      answer: "Yes, you can export all your data from your account settings."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
      <header className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <span className="text-xl font-bold">← Back to Home</span>
        </button>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="bg-indigo-900/30 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
            <LifeBuoy className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">How Can We Help?</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Get support for your EmotionAI experience
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {supportOptions.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-colors"
            >
              <div className="bg-indigo-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <option.icon className="w-6 h-6 text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">{option.title}</h2>
              <p className="text-gray-400 mb-4">{option.description}</p>
              <p className="text-sm text-gray-500 mb-4">{option.available}</p>
              <button 
                className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center transition-colors"
                onClick={option.onClick}
              >
                {option.action} →
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-gray-800 rounded-xl p-8 border border-gray-700"
        >
          <h2 className="text-2xl font-bold text-white mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-700 pb-6 last:border-0">
                <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
                <p className="text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-xl p-8 border border-indigo-500/30"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-white mb-2">Still Need Help?</h3>
              <p className="text-indigo-200">Contact us directly through these channels</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={startChat}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium text-center transition-colors"
              >
                Live Chat Now
              </button>
              <a 
                href="mailto:divyanshgarg515@gmail.com?subject=EmotionAI Support Request" 
                className="px-6 py-3 border border-indigo-400 hover:bg-indigo-900/30 rounded-lg font-medium text-center transition-colors"
              >
                Email Support
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={startChat}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg transition-colors"
          aria-label="Open chat"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default Support;