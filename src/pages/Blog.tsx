import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, Clock, User, MessageSquare, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Blog: React.FC = () => {
  const navigate = useNavigate();

  // Sample blog posts data
  const blogPosts = [
    {
      id: 1,
      title: 'Understanding Micro-Expressions: The Science Behind EmotionAI',
      excerpt: 'Learn how our technology detects subtle facial movements that reveal true emotions.',
      category: 'Technology',
      date: 'May 15, 2023',
      readTime: '5 min read',
      author: 'Dr. Sarah Chen',
      comments: 12,
      image: 'tech-bg.jpg'
    },
    {
      id: 2,
      title: 'Improving Emotional Intelligence in the Workplace',
      excerpt: 'How EmotionAI is helping teams communicate better and reduce conflict.',
      category: 'Business',
      date: 'April 28, 2023',
      readTime: '4 min read',
      author: 'James Wilson',
      comments: 8,
      image: 'business-bg.jpg'
    },
    {
      id: 3,
      title: 'The Future of Mental Health: AI-Assisted Therapy',
      excerpt: 'Exploring how emotion recognition technology is transforming mental healthcare.',
      category: 'Health',
      date: 'April 10, 2023',
      readTime: '6 min read',
      author: 'Priya Patel',
      comments: 15,
      image: 'health-bg.jpg'
    },
    {
      id: 4,
      title: 'Building Emotional Awareness: A 30-Day Challenge',
      excerpt: 'Practical exercises using EmotionAI to become more emotionally intelligent.',
      category: 'Self-Improvement',
      date: 'March 22, 2023',
      readTime: '3 min read',
      author: 'Michael Johnson',
      comments: 5,
      image: 'self-improve-bg.jpg'
    },
    {
      id: 5,
      title: 'How We Achieved 98% Accuracy in Emotion Recognition',
      excerpt: 'A technical deep dive into our machine learning models and training data.',
      category: 'Technology',
      date: 'March 15, 2023',
      readTime: '8 min read',
      author: 'Dr. Sarah Chen',
      comments: 20,
      image: 'accuracy-bg.jpg'
    },
    {
      id: 6,
      title: 'Teaching Emotional Intelligence to Children with AI',
      excerpt: 'How parents and educators can use our technology to help kids understand emotions.',
      category: 'Education',
      date: 'February 28, 2023',
      readTime: '4 min read',
      author: 'Priya Patel',
      comments: 7,
      image: 'education-bg.jpg'
    }
  ];

  // Categories for filtering
  const categories = [
    'All',
    'Technology',
    'Business',
    'Health',
    'Self-Improvement',
    'Education'
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

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="bg-indigo-900/30 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">EmotionAI Blog</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Insights, research, and stories about emotional intelligence and AI technology
          </p>
        </motion.div>
      </section>

      {/* Category Filter */}
      <section className="max-w-6xl mx-auto px-4 mb-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3"
        >
          {categories.map((category, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                category === 'All'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>
      </section>

      {/* Blog Posts */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-indigo-500 border border-gray-700"
            >
              <div className="h-48 bg-gray-700 relative overflow-hidden">
                {/* Placeholder for blog post image */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  {post.image.replace('.jpg', '')}
                </div>
                <div className="absolute top-4 left-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {post.category}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-400 mb-4">
                  <div className="flex items-center mr-4">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-white mb-3 hover:text-indigo-400 transition cursor-pointer">
                  {post.title}
                </h2>
                <p className="text-gray-400 mb-5">{post.excerpt}</p>
                <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                      <User className="w-4 h-4 text-gray-400" />
                    </div>
                    <span className="text-sm text-gray-300">{post.author}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    <span>{post.comments} comments</span>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Newsletter Subscription */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-gray-800 rounded-xl p-8 mt-16 border border-gray-700"
        >
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-gray-400 mb-6">
              Subscribe to our newsletter to receive the latest articles and updates about EmotionAI
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Blog;