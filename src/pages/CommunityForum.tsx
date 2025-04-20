import { useState, useEffect } from 'react';
import { 
  FaSearch, FaUser, FaHeart, FaReply, FaChevronDown, FaChevronUp, 
  FaRegBell, FaRegBookmark, FaExternalLinkAlt, FaRegClock 
} from 'react-icons/fa';
import { FiMenu, FiX } from 'react-icons/fi';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { BsPinAngle, BsStar } from 'react-icons/bs';

type User = {
  id: string;
  name: string;
  avatar: string;
  role: string;
  joinDate: string;
  postCount: number;
};

type ForumCategory = {
  id: string;
  name: string;
  description: string;
  threads: number;
  posts: number;
  icon: JSX.Element;
};

type ForumThread = {
  id: string;
  title: string;
  author: User;
  content: string;
  replies: number;
  views: number;
  lastActivity: string;
  tags: string[];
  isSticky?: boolean;
  isFeatured?: boolean;
  isLocked?: boolean;
  createdAt: string;
};

const EmotionAIForum = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('getting-started');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'categories' | 'recent' | 'popular'>('categories');
  const [newThread, setNewThread] = useState({
    title: '',
    content: '',
    category: 'getting-started'
  });

  // Mock user login
  useEffect(() => {
    // Simulate user fetch/authentication
    setTimeout(() => {
      setIsLoggedIn(true);
      setUser({
        id: 'user-123',
        name: 'AI_Enthusiast',
        avatar: 'AE',
        role: 'Premium Member',
        joinDate: '2023-01-15',
        postCount: 42
      });
    }, 1000);
  }, []);

  const categories: ForumCategory[] = [
    {
      id: 'getting-started',
      name: 'Getting Started',
      description: 'New to Emotion.AI? Start here',
      threads: 42,
      posts: 156,
      icon: <BsStar className="text-yellow-400" />
    },
    {
      id: 'technical',
      name: 'Technical Discussions',
      description: 'API, integrations and technical questions',
      threads: 128,
      posts: 543,
      icon: <FaReply className="text-blue-400" />
    },
    {
      id: 'use-cases',
      name: 'Use Cases',
      description: 'How Emotion.AI is being used in different industries',
      threads: 76,
      posts: 289,
      icon: <FaExternalLinkAlt className="text-green-400" />
    },
    {
      id: 'development',
      name: 'Development',
      description: 'Feature requests and beta testing',
      threads: 91,
      posts: 312,
      icon: <FaSearch className="text-purple-400" />
    },
    {
      id: 'community',
      name: 'Community',
      description: 'Events, meetups and success stories',
      threads: 65,
      posts: 198,
      icon: <FaUser className="text-pink-400" />
    },
  ];

  const featuredThreads: ForumThread[] = [
    {
      id: '1',
      title: 'Understanding Emotional Recognition Technology',
      author: {
        id: 'user-456',
        name: 'Alex_J',
        avatar: 'AJ',
        role: 'Moderator',
        joinDate: '2022-05-10',
        postCount: 127
      },
      content: 'A comprehensive guide to understanding how Emotion.AI processes and interprets emotional signals from various inputs...',
      replies: 24,
      views: 156,
      lastActivity: '2 hours ago',
      tags: ['guide', 'technology', 'beginners'],
      isFeatured: true,
      createdAt: '2023-06-15'
    },
    {
      id: '2',
      title: 'Case Study: Emotion.AI in Healthcare',
      author: {
        id: 'user-789',
        name: 'Dr_Smith',
        avatar: 'DS',
        role: 'Verified Professional',
        joinDate: '2023-02-20',
        postCount: 38
      },
      content: 'Detailed analysis of how our hospital system implemented Emotion.AI to improve patient care and mental health monitoring...',
      replies: 18,
      views: 203,
      lastActivity: '1 day ago',
      tags: ['healthcare', 'case-study', 'implementation'],
      isFeatured: true,
      createdAt: '2023-07-02'
    },
    {
      id: '3',
      title: 'Upcoming Features Preview',
      author: {
        id: 'user-001',
        name: 'EmotionAI_Team',
        avatar: 'ET',
        role: 'Admin',
        joinDate: '2021-11-01',
        postCount: 256
      },
      content: 'Sneak peek at the features we\'re developing for Q4 2023 including multi-modal emotion detection and real-time analytics...',
      replies: 32,
      views: 421,
      lastActivity: '3 hours ago',
      tags: ['announcement', 'roadmap', 'features'],
      isSticky: true,
      createdAt: '2023-08-10'
    },
  ];

  const recentThreads: ForumThread[] = [
    {
      id: '4',
      title: 'API Rate Limiting Best Practices',
      author: {
        id: 'user-234',
        name: 'Dev_Chris',
        avatar: 'DC',
        role: 'Senior Member',
        joinDate: '2022-09-14',
        postCount: 89
      },
      content: 'I\'ve been working with the Emotion.AI API and wanted to share some best practices for handling rate limits effectively...',
      replies: 7,
      views: 45,
      lastActivity: '30 minutes ago',
      tags: ['api', 'development', 'best-practices'],
      createdAt: '2023-08-25'
    },
    {
      id: '5',
      title: 'Custom Model Training Guide',
      author: {
        id: 'user-123',
        name: 'AI_Enthusiast',
        avatar: 'AE',
        role: 'Premium Member',
        joinDate: '2023-01-15',
        postCount: 42
      },
      content: 'Step-by-step tutorial on how to train custom emotion recognition models using your own dataset with Emotion.AI...',
      replies: 12,
      views: 87,
      lastActivity: '2 hours ago',
      tags: ['tutorial', 'machine-learning', 'custom-models'],
      createdAt: '2023-08-24'
    },
    {
      id: '6',
      title: 'Mental Health App Integration',
      author: {
        id: 'user-567',
        name: 'HealthTech_Guru',
        avatar: 'HG',
        role: 'Verified Professional',
        joinDate: '2023-03-05',
        postCount: 31
      },
      content: 'Sharing my experience integrating Emotion.AI into a mental health tracking app - challenges and solutions...',
      replies: 5,
      views: 32,
      lastActivity: '4 hours ago',
      tags: ['healthtech', 'integration', 'mental-health'],
      createdAt: '2023-08-23'
    },
    {
      id: '7',
      title: 'Troubleshooting: Video Analysis Errors',
      author: {
        id: 'user-890',
        name: 'VideoDev_Pro',
        avatar: 'VP',
        role: 'Member',
        joinDate: '2023-05-18',
        postCount: 15
      },
      content: 'Getting consistent errors when processing video files through the API. Here are the details of my setup and the errors...',
      replies: 3,
      views: 28,
      lastActivity: '5 hours ago',
      tags: ['troubleshooting', 'video', 'api'],
      createdAt: '2023-08-22'
    },
    {
      id: '8',
      title: 'Feature Request: Real-time Dashboard',
      author: {
        id: 'user-345',
        name: 'DataViz_Expert',
        avatar: 'DE',
        role: 'Premium Member',
        joinDate: '2022-12-01',
        postCount: 67
      },
      content: 'Would love to see a real-time dashboard feature that shows emotion detection results visually as they come in...',
      replies: 9,
      views: 54,
      lastActivity: '6 hours ago',
      tags: ['feature-request', 'dashboard', 'ui'],
      createdAt: '2023-08-21'
    },
  ];

  const popularThreads = [...recentThreads].sort((a, b) => b.views - a.views).slice(0, 5);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  const handleNewThreadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement thread creation
    console.log('Creating new thread:', newThread);
    // Reset form
    setNewThread({
      title: '',
      content: '',
      category: 'getting-started'
    });
  };

  const renderThreadList = (threads: ForumThread[]) => {
    return (
      <div className="space-y-2">
        {threads.map((thread) => (
          <div 
            key={thread.id} 
            className={`p-4 rounded-lg transition-colors ${thread.isSticky ? 'bg-gray-750 border-l-4 border-yellow-400' : 'hover:bg-gray-750'}`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className={`rounded-full w-10 h-10 flex items-center justify-center text-sm font-medium 
                  ${thread.author.role.includes('Admin') ? 'bg-purple-900' : 
                    thread.author.role.includes('Moderator') ? 'bg-blue-900' : 
                    thread.author.role.includes('Verified') ? 'bg-green-900' : 'bg-gray-700'}`}
                >
                  {thread.author.avatar}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium truncate hover:text-purple-400 cursor-pointer">
                    {thread.title}
                  </h4>
                  {thread.isSticky && <BsPinAngle className="text-yellow-400" />}
                  {thread.isFeatured && <BsStar className="text-purple-400" />}
                  {thread.isLocked && <span className="text-xs bg-red-900 text-red-200 px-2 py-1 rounded">Closed</span>}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
                  <span className="text-gray-400">by {thread.author.name}</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-400">{new Date(thread.createdAt).toLocaleDateString()}</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-400">{thread.views} views</span>
                  {thread.tags.map(tag => (
                    <span key={tag} className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
                <p className="text-sm text-gray-400 line-clamp-2 mb-3">{thread.content}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1 hover:text-purple-400 cursor-pointer">
                      <FaHeart /> {thread.replies} replies
                    </span>
                    <span className="flex items-center gap-1">
                      <FaRegClock /> Last activity {thread.lastActivity}
                    </span>
                  </div>
                  <button className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
                    <FaReply /> Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button 
                className="md:hidden text-gray-300 hover:text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                Emotion.AI
              </h1>
              <nav className="hidden md:flex space-x-6">
                <a href="#" className="hover:text-purple-400">Home</a>
                <a href="#" className="text-purple-400 font-medium">Forum</a>
                <a href="#" className="hover:text-purple-400">Resources</a>
                <a href="#" className="hover:text-purple-400">About</a>
                <a href="#" className="hover:text-purple-400">Contact</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <form onSubmit={handleSearch}>
                  <input
                    type="text"
                    placeholder="Search forum topics..."
                    className="bg-gray-700 rounded-full py-1 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="absolute left-3 top-2 text-gray-400">
                    <FaSearch />
                  </button>
                </form>
              </div>
              {isLoggedIn && user ? (
                <div className="flex items-center space-x-3">
                  <button className="text-gray-400 hover:text-purple-400 relative">
                    <IoMdNotificationsOutline size={20} />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
                  </button>
                  <div className="flex items-center space-x-2">
                    <div className="rounded-full bg-purple-700 w-8 h-8 flex items-center justify-center text-sm font-medium">
                      {user.avatar}
                    </div>
                    <span className="hidden md:inline text-sm">{user.name}</span>
                  </div>
                </div>
              ) : (
                <button className="bg-purple-600 hover:bg-purple-700 px-4 py-1 rounded-full text-sm font-medium flex items-center">
                  <FaUser className="mr-2" /> Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-800 border-b border-gray-700">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
            <a href="#" className="hover:text-purple-400">Home</a>
            <a href="#" className="text-purple-400 font-medium">Forum</a>
            <a href="#" className="hover:text-purple-400">Resources</a>
            <a href="#" className="hover:text-purple-400">About</a>
            <a href="#" className="hover:text-purple-400">Contact</a>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search forum topics..."
                className="bg-gray-700 rounded-full py-1 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute left-3 top-2 text-gray-400">
                <FaSearch />
              </button>
            </form>
            {isLoggedIn && user && (
              <div className="pt-2 border-t border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="rounded-full bg-purple-700 w-8 h-8 flex items-center justify-center text-sm font-medium">
                    {user.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.role}</p>
                  </div>
                </div>
                <div className="flex justify-between mt-3 text-sm">
                  <a href="#" className="hover:text-purple-400">Profile</a>
                  <a href="#" className="hover:text-purple-400">Notifications</a>
                  <a href="#" className="hover:text-purple-400">Settings</a>
                  <a href="#" className="hover:text-purple-400">Logout</a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg p-6 mb-8 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Welcome to the Emotion.AI Community Forum</h2>
            <p className="text-purple-200 mb-4">Share, Learn, and Grow Together</p>
            {isLoggedIn ? (
              <button className="bg-white text-purple-800 hover:bg-gray-100 px-4 py-2 rounded-full text-sm font-medium">
                Create New Thread
              </button>
            ) : (
              <div className="flex gap-3">
                <button className="bg-white text-purple-800 hover:bg-gray-100 px-4 py-2 rounded-full text-sm font-medium">
                  Register Now
                </button>
                <button className="bg-transparent border border-white text-white hover:bg-white hover:text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
                  Learn More
                </button>
              </div>
            )}
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-20">
            <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 200C155.228 200 200 155.228 200 100C200 44.7715 155.228 0 100 0C44.7715 0 0 44.7715 0 100C0 155.228 44.7715 200 100 200Z" fill="white"/>
              <path d="M100 160C133.137 160 160 133.137 160 100C160 66.8629 133.137 40 100 40C66.8629 40 40 66.8629 40 100C40 133.137 66.8629 160 100 160Z" fill="#6E48AA"/>
              <path d="M100 120C110.493 120 120 110.493 120 100C120 89.5066 110.493 80 100 80C89.5066 80 80 89.5066 80 100C80 110.493 89.5066 120 100 120Z" fill="white"/>
            </svg>
          </div>
        </div>

        {/* Featured Threads */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2 flex items-center gap-2">
            <BsStar className="text-yellow-400" /> Featured Topics
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {featuredThreads.map((thread) => (
              <div 
                key={thread.id} 
                className={`bg-gray-800 rounded-lg p-4 border-l-4 ${thread.isSticky ? 'border-yellow-400' : 'border-purple-500'} hover:bg-gray-750 transition-colors flex flex-col h-full`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium line-clamp-2">{thread.title}</h4>
                  {thread.isFeatured && (
                    <span className="bg-purple-600 text-xs px-2 py-1 rounded-full whitespace-nowrap">Featured</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`rounded-full w-6 h-6 flex items-center justify-center text-xs 
                    ${thread.author.role.includes('Admin') ? 'bg-purple-900' : 
                      thread.author.role.includes('Moderator') ? 'bg-blue-900' : 'bg-gray-700'}`}
                  >
                    {thread.author.avatar}
                  </div>
                  <p className="text-sm text-gray-400">by {thread.author.name}</p>
                </div>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2 flex-grow">{thread.content}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {thread.tags.map(tag => (
                    <span key={tag} className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-auto">
                  <span>{thread.replies} replies</span>
                  <span>{thread.views} views</span>
                  <span>{thread.lastActivity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Forum Navigation Tabs */}
        <div className="mb-6 border-b border-gray-700">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('categories')}
              className={`py-3 px-1 font-medium text-sm border-b-2 ${activeTab === 'categories' ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-400 hover:text-gray-300'}`}
            >
              Categories
            </button>
            <button
              onClick={() => setActiveTab('recent')}
              className={`py-3 px-1 font-medium text-sm border-b-2 ${activeTab === 'recent' ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-400 hover:text-gray-300'}`}
            >
              Recent Discussions
            </button>
            <button
              onClick={() => setActiveTab('popular')}
              className={`py-3 px-1 font-medium text-sm border-b-2 ${activeTab === 'popular' ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-400 hover:text-gray-300'}`}
            >
              Popular Topics
            </button>
          </nav>
        </div>

        {/* Forum Content */}
        {activeTab === 'categories' && (
          <div className="mb-8">
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="bg-gray-800 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex justify-between items-center p-4 hover:bg-gray-750 transition-colors"
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div className="bg-gray-700 p-3 rounded-lg">
                        {category.icon}
                      </div>
                      <div>
                        <h4 className="font-medium">{category.name}</h4>
                        <p className="text-sm text-gray-400">{category.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs bg-gray-700 rounded-full px-3 py-1 mr-4">
                        {category.threads} Threads • {category.posts} Posts
                      </span>
                      {expandedCategory === category.id ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                  </button>
                  {expandedCategory === category.id && (
                    <div className="p-4 bg-gray-750 border-t border-gray-700">
                      <div className="flex justify-between items-center mb-4">
                        <h5 className="font-medium">Recent Threads</h5>
                        {isLoggedIn && (
                          <button 
                            className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded-full text-sm font-medium"
                            onClick={() => {
                              setNewThread(prev => ({...prev, category: category.id}));
                              document.getElementById('new-thread-modal')?.classList.remove('hidden');
                            }}
                          >
                            New Thread
                          </button>
                        )}
                      </div>
                      {renderThreadList(recentThreads.filter(t => t.tags.includes(category.id.split('-')[0])))}
                      <button className="mt-3 text-sm text-purple-400 hover:text-purple-300">
                        View all threads in {category.name} →
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'recent' && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Recent Discussions</h3>
              {isLoggedIn && (
                <button 
                  className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded-full text-sm font-medium"
                  onClick={() => document.getElementById('new-thread-modal')?.classList.remove('hidden')}
                >
                  New Thread
                </button>
              )}
            </div>
            {renderThreadList(recentThreads)}
            <button className="w-full mt-4 bg-gray-800 hover:bg-gray-750 text-gray-400 py-2 rounded-lg text-sm font-medium">
              Load More Discussions
            </button>
          </div>
        )}

        {activeTab === 'popular' && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Popular Topics</h3>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Sorted by:</span>
                <select className="bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-sm">
                  <option>Most Views</option>
                  <option>Most Replies</option>
                  <option>Recent Activity</option>
                </select>
              </div>
            </div>
            {renderThreadList(popularThreads)}
          </div>
        )}

        {/* Stats */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-6 border-b border-gray-700 pb-2">Community Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-purple-400">5,287</p>
              <p className="text-gray-400">Members</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-400">1,203</p>
              <p className="text-gray-400">Topics</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-400">3,456</p>
              <p className="text-gray-400">Replies</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-400">42</p>
              <p className="text-gray-400">Online</p>
            </div>
          </div>
        </div>

        {/* New Thread Modal */}
        <div id="new-thread-modal" className="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Create New Thread</h3>
                <button 
                  onClick={() => document.getElementById('new-thread-modal')?.classList.add('hidden')}
                  className="text-gray-400 hover:text-white"
                >
                  <FiX size={24} />
                </button>
              </div>
              <form onSubmit={handleNewThreadSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select 
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm"
                    value={newThread.category}
                    onChange={(e) => setNewThread({...newThread, category: e.target.value})}
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Thread Title</label>
                  <input
                    type="text"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm"
                    placeholder="Enter a descriptive title for your thread"
                    value={newThread.title}
                    onChange={(e) => setNewThread({...newThread, title: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Content</label>
                  <textarea
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm min-h-[200px]"
                    placeholder="Write your post content here..."
                    value={newThread.content}
                    onChange={(e) => setNewThread({...newThread, content: e.target.value})}
                    required
                  ></textarea>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => document.getElementById('new-thread-modal')?.classList.add('hidden')}
                    className="px-4 py-2 rounded-md text-sm font-medium border border-gray-600 hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Post Thread
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Emotion.AI</h4>
              <p className="text-gray-400 text-sm mb-4">
                The premier community for emotional recognition technology enthusiasts and developers.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-purple-400">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-400">
                  <i className="fab fa-github"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-400">
                  <i className="fab fa-discord"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-400">
                  <i className="fab fa-linkedin"></i>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-purple-400">Home</a></li>
                <li><a href="#" className="hover:text-purple-400">Documentation</a></li>
                <li><a href="#" className="hover:text-purple-400">API Reference</a></li>
                <li><a href="#" className="hover:text-purple-400">Pricing</a></li>
                <li><a href="#" className="hover:text-purple-400">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-purple-400">Getting Started Guide</a></li>
                <li><a href="#" className="hover:text-purple-400">Tutorial Videos</a></li>
                <li><a href="#" className="hover:text-purple-400">Case Studies</a></li>
                <li><a href="#" className="hover:text-purple-400">Developer Tools</a></li>
                <li><a href="#" className="hover:text-purple-400">Community Projects</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-purple-400">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-purple-400">Terms of Service</a></li>
                <li><a href="#" className="hover:text-purple-400">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-purple-400">Data Processing Agreement</a></li>
                <li><a href="#" className="hover:text-purple-400">Contact Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} Emotion.AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EmotionAIForum;