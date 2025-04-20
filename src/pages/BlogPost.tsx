import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, MessageSquare, ArrowLeft, Share2, Bookmark, Heart } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const BlogPost: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // In a real app, you would fetch this data based on the ID
  const post = {
    id: 1,
    title: 'Understanding Micro-Expressions: The Science Behind EmotionAI',
    content: `
      <p>Micro-expressions are brief, involuntary facial expressions that reveal the true emotions of a person. 
      Lasting only 1/25 to 1/5 of a second, these fleeting expressions often occur when someone is trying to 
      conceal their feelings or when they experience an emotion too quickly to control their facial muscles.</p>
      
      <h2>The Science of Micro-Expressions</h2>
      <p>First discovered by psychologists Haggard and Isaacs in 1966, and later expanded upon by Dr. Paul Ekman, 
      micro-expressions have become a crucial area of study in psychology and affective computing. Our EmotionAI 
      technology builds upon decades of this research to provide accurate emotion detection.</p>
      
      <p>There are seven universal micro-expressions that correspond to basic emotions:</p>
      <ul>
        <li><strong>Happiness:</strong> Raised cheeks, crow's feet around eyes, teeth may be exposed</li>
        <li><strong>Sadness:</strong> Inner corners of eyebrows raised, corners of lips turned down</li>
        <li><strong>Surprise:</strong> Eyebrows raised, eyes wide open, jaw drops slightly</li>
        <li><strong>Fear:</strong> Eyebrows raised and drawn together, upper eyelids raised</li>
        <li><strong>Anger:</strong> Eyebrows lowered, lips pressed firmly together</li>
        <li><strong>Disgust:</strong> Upper lip raised, nose bridge wrinkled</li>
        <li><strong>Contempt:</strong> One side of the mouth raised</li>
      </ul>
      
      <h2>How EmotionAI Detects Micro-Expressions</h2>
      <p>Our advanced computer vision system uses a multi-step process:</p>
      <ol>
        <li><strong>Facial Landmark Detection:</strong> Identifies 68 key points on the face</li>
        <li><strong>Motion Analysis:</strong> Tracks subtle muscle movements between frames</li>
        <li><strong>Pattern Recognition:</strong> Matches observed movements to known micro-expression patterns</li>
        <li><strong>Contextual Analysis:</strong> Considers the sequence of expressions for more accurate reading</li>
      </ol>
      
      <p>With our proprietary deep learning algorithms, we achieve 98% accuracy in controlled environments, 
      far surpassing human ability to detect these fleeting expressions.</p>
      
      <h2>Applications in Daily Life</h2>
      <p>Understanding micro-expressions can help in:</p>
      <ul>
        <li>Improving emotional intelligence and communication skills</li>
        <li>Enhancing mental health assessments</li>
        <li>Developing better human-computer interfaces</li>
        <li>Training for professions requiring emotional awareness (therapists, negotiators, etc.)</li>
      </ul>
    `,
    category: 'Technology',
    date: 'May 15, 2023',
    readTime: '5 min read',
    author: {
      name: 'Dr. Sarah Chen',
      bio: 'PhD in Affective Computing with 10+ years in emotion recognition research',
      avatar: 'avatar-sarah.jpg'
    },
    comments: 12,
    likes: 45,
    image: 'tech-bg.jpg'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
      {/* Header */}
      <header className="max-w-6xl mx-auto px-4 py-8">
        <button 
          onClick={() => navigate('/blog')}
          className="flex items-center space-x-2 text-indigo-400"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-xl font-bold">Back to Blog</span>
        </button>
      </header>

      {/* Blog Post Content */}
      <article className="max-w-3xl mx-auto px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-6">
            <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold inline-block">
              {post.category}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{post.title}</h1>
          
          <div className="flex items-center text-gray-400 mb-8">
            <div className="flex items-center mr-6">
              <User className="w-5 h-5 mr-2" />
              <span>{post.author.name}</span>
            </div>
            <div className="flex items-center mr-6">
              <Calendar className="w-5 h-5 mr-2" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>{post.readTime}</span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-10 rounded-xl overflow-hidden bg-gray-700 h-64 flex items-center justify-center">
            {/* Placeholder for blog post image */}
            <span className="text-gray-500">{post.image.replace('.jpg', '')}</span>
          </div>

          {/* Post Content */}
          <div 
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>

          {/* Post Actions */}
          <div className="mt-12 pt-6 border-t border-gray-700 flex flex-wrap justify-between items-center">
            <div className="flex space-x-4 mb-4 sm:mb-0">
              <button className="flex items-center text-gray-400 hover:text-indigo-400 transition">
                <Heart className="w-5 h-5 mr-2" />
                <span>{post.likes} Likes</span>
              </button>
              <button className="flex items-center text-gray-400 hover:text-indigo-400 transition">
                <MessageSquare className="w-5 h-5 mr-2" />
                <span>{post.comments} Comments</span>
              </button>
            </div>
            <div className="flex space-x-3">
              <button className="p-2 rounded-full bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white transition">
                <Bookmark className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white transition">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Author Bio */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 bg-gray-800 rounded-xl p-8 border border-gray-700"
        >
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center mb-6 md:mb-0 md:mr-6">
              {/* Placeholder for author avatar */}
              <User className="w-10 h-10 text-gray-400" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-white mb-1">{post.author.name}</h3>
              <p className="text-gray-400 mb-4">{post.author.bio}</p>
              <button className="text-indigo-400 hover:text-indigo-300 transition">
                View all posts by {post.author.name.split(' ')[0]} →
              </button>
            </div>
          </div>
        </motion.div>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold text-white mb-8">Comments ({post.comments})</h2>
          
          {/* Comment Form */}
          <div className="mb-12 bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Leave a Comment</h3>
            <textarea 
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
              rows={4}
              placeholder="Share your thoughts..."
            ></textarea>
            <div className="flex justify-end">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition">
                Post Comment
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-8">
            {[1, 2, 3].map((comment) => (
              <div key={comment} className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-white">User {comment}</h4>
                      <span className="text-sm text-gray-500">2 days ago</span>
                    </div>
                    <p className="text-gray-300 mb-3">
                      This is a sample comment about how interesting this article was. 
                      I learned so much about micro-expressions!
                    </p>
                    <button className="text-sm text-gray-400 hover:text-indigo-400 transition">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </article>
    </div>
  );
};

export default BlogPost;