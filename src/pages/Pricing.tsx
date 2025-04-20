import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PricingHome: React.FC = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      description: 'Perfect for individuals getting started with emotional awareness',
      features: [
        '5 sessions per month',
        'Basic emotion tracking',
        'Weekly summary',
        'Email support'
      ],
      cta: 'Get Started'
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: '/month',
      description: 'For those serious about emotional growth',
      features: [
        'Unlimited sessions',
        'Advanced analytics',
        'Real-time tracking',
        'Priority support',
        'Monthly reports'
      ],
      popular: true,
      cta: 'Start Free Trial'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For organizations and healthcare providers',
      features: [
        'Everything in Pro',
        'Team management',
        'API access',
        'Dedicated account manager',
        'Custom integrations'
      ],
      cta: 'Contact Sales'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
      {/* Header */}
      <header className="max-w-6xl mx-auto px-4 py-8">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-indigo-400"
        >
          <span className="text-xl font-bold">← Back to Home</span>
        </button>
      </header>

      {/* Pricing Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Choose the plan that fits your emotional growth journey
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gray-800 rounded-xl p-8 relative ${plan.popular ? 'border-2 border-indigo-500' : 'border border-gray-700'}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-semibold flex items-center">
                  <Star className="w-3 h-3 mr-1" /> MOST POPULAR
                </div>
              )}
              <h2 className="text-2xl font-bold text-white mb-2">{plan.name}</h2>
              <div className="flex items-end mb-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-gray-400 ml-1">{plan.period}</span>}
              </div>
              <p className="text-gray-400 mb-6">{plan.description}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="w-5 h-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => plan.name === 'Enterprise' ? navigate('/contact') : navigate('/register')}
                className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white' 
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                {plan.cta}
                {plan.popular && <Zap className="w-4 h-4 ml-2" />}
              </motion.button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 rounded-xl p-8 mt-16 border border-gray-700"
        >
          <h2 className="text-2xl font-bold text-white mb-4 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                question: "Can I change plans later?",
                answer: "Yes, you can upgrade or downgrade at any time."
              },
              {
                question: "Do you offer discounts for students?",
                answer: "We offer 50% off for students with valid ID."
              },
              {
                question: "Is there a free trial?",
                answer: "The Pro plan comes with a 14-day free trial."
              },
              {
                question: "How do I cancel?",
                answer: "You can cancel anytime from your account settings."
              }
            ].map((faq, i) => (
              <div key={i}>
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

export default PricingHome;