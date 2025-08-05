import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Activity, BarChart2, User, Smile, Frown, Meh, Clock, Award, ChevronRight, Twitter, Facebook, Linkedin, Instagram } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import screenshot from '@/utils/images/ss.png';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Our advanced neural networks analyze micro-expressions with 95% accuracy using computer vision technology.',
    },
    {
      icon: Activity,
      title: 'Real-Time Tracking',
      description: 'Get instant feedback on your emotional state with our low-latency processing engine.',
    },
    {
      icon: BarChart2,
      title: 'Detailed Analytics',
      description: 'Weekly and monthly reports showing your emotional patterns and improvement areas.',
    },
  ];

  const stats = [
    { value: '100+', label: 'Active Users' },
    { value: '94%', label: 'Accuracy Rate' },
    { value: '180+', label: 'Sessions Analyzed' },
    { value: '4.2/5', label: 'User Rating' },
  ];

  const testimonials = [
    {
      name: 'Meenu Patel',
      role: 'Therapist',
      content: 'This tool has revolutionized how I track my clients emotional progress between sessions. The insights are incredibly accurate.',
      rating: 5,
    },
    {
      name: 'Pooja Agrawal',
      role: 'UX Designer',
      content: 'As someone who struggles with emotional awareness, this has helped me understand my reactions better than years of journaling.',
      rating: 5,
    },
    {
      name: 'Shivam Garg',
      role: 'SDE 2',
      content: 'We use this with our team for emotional intelligence training. The data visualization makes emotions understandable.',
      rating: 4,
    },
  ];

  const emotions = [
    { icon: Smile, name: 'Happiness', color: 'text-yellow-400' },
    { icon: Frown, name: 'Sadness', color: 'text-blue-400' },
    { icon: Meh, name: 'Neutral', color: 'text-gray-400' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">

      <nav className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center border-b border-gray-900">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => handleNavigation('/')}
        >
          <Activity className="w-8 h-8 text-indigo-500" />
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-blue-500 bg-clip-text text-transparent">
            EmotionAI
          </span>
        </motion.div>
        <div className="hidden md:flex space-x-8">
          <button
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-gray-400 hover:text-white transition"
          >
            Features
          </button>
          <button
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-gray-400 hover:text-white transition"
          >
            How It Works
          </button>
          <button
            onClick={() => document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-gray-400 hover:text-white transition"
          >
            Testimonials
          </button>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-4 py-12 md:py-24">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              Understand Your <span className="bg-gradient-to-r from-indigo-400 to-blue-500 bg-clip-text text-transparent">Emotions</span> Like Never Before
            </h1>
            <p className="text-gray-400 mb-8">
              EmotionAI uses cutting-edge facial recognition technology to give you real-time insights into your emotional state.
              Perfect for personal growth, therapy, and professional development.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={async () => {
                  const token = localStorage.getItem("token");
                  if (token) {
                    try {
                      await axios.post(
                        `${import.meta.env.VITE_API_BASE_URL}/logs/log-activity`,
                        {},
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      );
                    } catch (error) {
                      console.error("Failed to log user redirect activity");
                    }
                    navigate("/dashboard");
                  } else {
                    navigate("/register");
                  }
                }}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-lg text-base font-medium shadow-lg hover:from-indigo-700 hover:to-blue-700 transition-all"
              >
                Get Started - It's Free
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-black border border-gray-800 text-white px-6 py-3 rounded-lg text-base font-medium shadow-lg hover:bg-gray-900 transition-all"

              >
                See How It Works
              </motion.button>
            </div>
            <div className="mt-8 flex items-center space-x-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="w-10 h-10 rounded-full bg-gray-900 border-2 border-black"></div>
                ))}
              </div>
              <div className="text-gray-400 text-sm">
                <span className="text-white font-medium">100+</span> happy users
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:w-1/2 relative"
          >
            <div className="bg-black rounded-2xl p-2 shadow-2xl border border-gray-900">
              <div className="bg-gray-900 rounded-xl h-64 md:h-80 w-full flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="w-24 h-24 rounded-full bg-black mx-auto mb-4 flex items-center justify-center border border-indigo-500">
                    <User className="w-12 h-12 text-indigo-400" />
                  </div>
                  <p className="text-gray-400">Real-time emotion analysis</p>
                </div>
              </div>
            </div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute -bottom-6 -left-6 bg-black p-4 rounded-xl shadow-lg border border-indigo-700"
            >
              <div className="flex items-center">
                <Smile className="w-6 h-6 text-yellow-400 mr-2" />
                <div>
                  <p className="text-xs text-gray-400">Current mood</p>
                  <p className="font-medium text-white">Happy</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 4, delay: 0.5 }}
              className="absolute -top-6 -right-6 bg-black p-4 rounded-xl shadow-lg border border-gray-800"
            >
              <div className="flex items-center">
                <Clock className="w-6 h-6 text-indigo-400 mr-2" />
                <div>
                  <p className="text-xs text-gray-400">Session time</p>
                  <p className="font-medium text-white">1:45 / 2:00</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="bg-black py-12 border-t border-b border-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {stats.map((stat, index) => (
              <div key={index} className="p-4">
                <p className="text-3xl md:text-4xl font-bold text-indigo-400 mb-2">{stat.value}</p>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Powerful Features</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            EmotionAI provides everything you need to understand and improve your emotional well-being.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-black p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-900 hover:border-indigo-500"
            >
              <div className="bg-black w-14 h-14 rounded-lg flex items-center justify-center mb-6 mx-auto border border-indigo-500/30">
                <feature.icon className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-400 text-center">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mt-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="bg-black rounded-2xl p-2 shadow-xl border border-gray-900">
              <div className="bg-gray-900 rounded-xl h-64 w-full overflow-hidden">
                <img
                  src={screenshot}
                  alt="Screenshot"
                  className="w-full h-full "
                />
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 bg-black p-4 rounded-xl shadow-lg border border-indigo-700 w-2/3">
              <div className="flex items-center">
                <BarChart2 className="w-6 h-6 text-indigo-300 mr-2" />
                <div>
                  <p className="text-sm font-medium text-white">Weekly Emotional Trend</p>
                  <p className="text-xs text-gray-400">Positive mood increased by 12%</p>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Detailed Emotional Breakdown</h3>
            <p className="text-gray-400 mb-6">
              Our platform provides comprehensive analysis of your emotional patterns over time, helping you identify triggers and improvement areas.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-black p-1 rounded-full mr-4 mt-1 border border-indigo-500/30">
                  <ChevronRight className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Micro-expression detection</h4>
                  <p className="text-gray-400 text-sm">Captures subtle facial movements you might not notice</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-black p-1 rounded-full mr-4 mt-1 border border-indigo-500/30">
                  <ChevronRight className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Contextual analysis</h4>
                  <p className="text-gray-400 text-sm">Understands how emotions transition during your session</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-black p-1 rounded-full mr-4 mt-1 border border-indigo-500/30">
                  <ChevronRight className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Personalized recommendations</h4>
                  <p className="text-gray-400 text-sm">Actionable insights tailored to your emotional patterns</p>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      <section id="how-it-works" className="bg-black py-16 md:py-24 border-t border-b border-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How EmotionAI Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Three simple steps to emotional awareness
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-black p-8 rounded-xl border border-gray-900"
            >
              <div className="bg-black w-12 h-12 rounded-full flex items-center justify-center mb-6 text-indigo-400 font-bold text-xl border border-indigo-500/30">1</div>
              <h3 className="text-xl font-semibold text-white mb-3">Start a Session</h3>
              <p className="text-gray-400">Begin a 2-minute analysis session using your device's camera.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-black p-8 rounded-xl border border-gray-900"
            >
              <div className="bg-black w-12 h-12 rounded-full flex items-center justify-center mb-6 text-indigo-400 font-bold text-xl border border-indigo-500/30">2</div>
              <h3 className="text-xl font-semibold text-white mb-3">Real-Time Analysis</h3>
              <p className="text-gray-400">Our AI processes your facial expressions as you react to prompts.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-black p-8 rounded-xl border border-gray-900"
            >
              <div className="bg-black w-12 h-12 rounded-full flex items-center justify-center mb-6 text-indigo-400 font-bold text-xl border border-indigo-500/30">3</div>
              <h3 className="text-xl font-semibold text-white mb-3">Get Insights</h3>
              <p className="text-gray-400">Receive detailed reports and improvement suggestions.</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-black rounded-2xl p-8 shadow-xl border border-gray-900"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold text-white mb-4">Emotions We Detect</h3>
                <p className="text-gray-400 mb-6">
                  Our advanced models can identify a wide range of emotional states with high accuracy.
                </p>
                <div className="space-y-4">
                  {emotions.map((emotion, index) => (
                    <div key={index} className="flex items-center bg-black p-4 rounded-lg border border-gray-900">
                      <div className={`bg-black p-3 rounded-full mr-4 border ${emotion.color.includes('yellow') ? 'border-yellow-500/30' : emotion.color.includes('blue') ? 'border-blue-500/30' : 'border-gray-700'} ${emotion.color}`}>
                        <emotion.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{emotion.name}</h4>
                        <p className="text-gray-400 text-sm">Micro-expressions, intensity levels</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="bg-black rounded-xl p-4 h-64 md:h-80 flex items-center justify-center border border-gray-900">
                  <div className="text-center">
                    <div className="w-32 h-32 rounded-full bg-gray-900 mx-auto mb-6 flex items-center justify-center border border-gray-800">
                      <User className="w-16 h-16 text-gray-700" />
                    </div>
                    <p className="text-gray-500">Live emotion detection visualization</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="testimonials" className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Our Users Say</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Trusted by individuals and professionals worldwide
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-black p-8 rounded-xl shadow-lg border border-gray-900"
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-700'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-300 mb-6">"{testimonial.content}"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-900 mr-4 flex items-center justify-center border border-gray-800">
                  <User className="w-6 h-6 text-gray-500" />
                </div>
                <div>
                  <h4 className="font-medium text-white">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-black py-16 md:py-24 border-t border-b border-indigo-900/50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Award className="w-12 h-12 text-indigo-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Understand Your Emotions?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join hundreads of users who have improved their emotional awareness with EmotionAI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={async () => {
                  const token = localStorage.getItem("token");
                  if (token) {
                    try {
                      await axios.post(
                        `${import.meta.env.VITE_API_BASE_URL}/logs/log-activity`,
                        {},
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      );
                    } catch (error) {
                      console.error("Failed to log user redirect activity");
                    }
                    navigate("/dashboard");
                  } else {
                    navigate("/register");
                  }
                }}
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg hover:bg-indigo-700 transition-all"
              >
                Start Your Free Trial
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-black border border-indigo-500 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg hover:bg-gray-900 transition-all"
              >
                See How It Works
              </motion.button>
            </div>
            <p className="text-gray-500 text-sm mt-4">No credit card required. Cancel anytime.</p>
          </motion.div>
        </div>
      </section>

      <footer className="bg-black py-12 border-t border-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div
                className="flex items-center space-x-2 mb-4 cursor-pointer"
                onClick={() => handleNavigation('/')}
              >
                <Activity className="w-8 h-8 text-indigo-500" />
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-blue-500 bg-clip-text text-transparent">
                  EmotionAI
                </span>
              </div>
              <p className="text-gray-500 mb-4">
                Empowering emotional intelligence through AI technology.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleExternalLink('https://twitter.com')}
                  className="text-gray-500 hover:text-white transition"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleExternalLink('https://facebook.com')}
                  className="text-gray-500 hover:text-white transition"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleExternalLink('https://linkedin.com')}
                  className="text-gray-500 hover:text-white transition"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleExternalLink('https://instagram.com')}
                  className="text-gray-500 hover:text-white transition"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-gray-500 hover:text-white transition"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation('/pricing')}
                    className="text-gray-500 hover:text-white transition"
                  >
                    Pricing
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation('/support')}
                    className="text-gray-500 hover:text-white transition"
                  >
                    Support
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleNavigation('/docs')}
                    className="text-gray-500 hover:text-white transition"
                  >
                    Documentation
                  </button>
                </li>
                <li>
                  <button
                  onClick={() => handleNavigation('/')}
                    className="text-gray-500 hover:text-white transition"
                  >
                    Careers (soon)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation('/')}
                    className="text-gray-500 hover:text-white transition"
                  >
                    Blog
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleNavigation('/about')}
                    className="text-gray-500 hover:text-white transition"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation('/docs')}
                    className="text-gray-500 hover:text-white transition"
                  >
                    Guides
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation('/privacy')}
                    className="text-gray-500 hover:text-white transition"
                  >
                    Privacy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation('/terms')}
                    className="text-gray-500 hover:text-white transition"
                  >
                    Terms
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-900 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} EmotionAI. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <button
                onClick={() => handleNavigation('/privacy')}
                className="text-gray-500 hover:text-white text-sm"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => handleNavigation('/terms')}
                className="text-gray-500 hover:text-white text-sm"
              >
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;