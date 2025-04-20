import React from 'react';
import { motion } from 'framer-motion';
import { LifeBuoy, Mail, MessageSquare, FileText, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Support: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const supportOptions = [
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      available: 'Will available in some time',
      action: 'Start Chat'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us an email and we\'ll respond within 24 hours',
      available: 'Typically responds in 4 hours',
      action: 'Contact Us'
    },
    {
      icon: FileText,
      title: 'Help Center',
      description: 'Browse our documentation and FAQs',
      available: 'Always available',
      action: 'View Docs'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Call us for immediate assistance',
      available: 'Will available in some time',
      action: 'Call Now'
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
          className="flex items-center space-x-2 text-indigo-400"
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
              <button className="text-indigo-400 font-medium flex items-center" onClick={() => handleNavigation("/documentation")}>
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
      </section>
    </div>
  );
};

export default Support;