import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Layout,
  Activity,
  User,
  History,
  Settings,
  Brain,
  BarChart2,
  TrendingUp,
  CreditCard,
  Box,
  Menu,
  X,
  Lightbulb,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initialize the state

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { icon: Layout, label: 'Dashboard', path: '/dashboard', description: 'Overview of your analytics' },
    { icon: Activity, label: 'Monitor', path: '/monitor', description: 'Real-time emotion tracking' },
    { icon: History, label: 'History', path: '/history', description: 'Past sessions and trends' },
    { icon: Brain, label: 'Insights', path: '/insights', description: 'AI-powered emotional analysis' },
    { icon: BarChart2, label: 'Reports', path: '/reports', description: 'Detailed emotional reports' },
    { icon: User, label: 'Profile', path: '/profile', description: 'Manage your account' },
    { icon: Box, label: 'Feedbacks', path: '/feedback-dashboard', description: 'Let us know what you feel' },
    { icon: Bell, label: 'Notifications', path: '/notifications', description: 'You got something !!' },
    { icon: TrendingUp, label: 'Progress', path: '/progress', description: 'Track your emotional growth' },
    { icon: CreditCard, label: 'Pricing', path: '/pricing', description: 'Upgrade your plan' },
  ];

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed z-50 top-4 left-4 p-2 rounded-md bg-black text-white focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      <AnimatePresence>
        {(isOpen || !isMobile) && (
          <motion.div
            key="sidebar"
            initial={{ x: isMobile ? -280 : 0 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`h-screen w-64 bg-black border-r border-gray-800 fixed left-0 top-0 shadow-xl overflow-y-auto z-40 ${
              isMobile ? 'md:hidden' : ''
            }`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style>{`
              ::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            <div className="p-6">
              <motion.div
                className="flex items-center space-x-2 mb-8"
                whileHover={{ scale: 1.05 }}
              >
                <Link to="/" className="flex items-center space-x-3 hover:scale-105 transition-transform duration-200">
                  <Activity className="w-9 h-9 text-white" />
                  <span className="text-xl font-bold bg-gradient-to-r from-white to-indigo-500 text-transparent bg-clip-text">
                    EmotionAI
                  </span>
                </Link>
              </motion.div>

              <nav className="space-y-2">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <NavLink 
                      to={item.path} 
                      className="relative block"
                      onClick={() => isMobile && setIsOpen(false)}
                    >
                      {({ isActive }) => (
                        <div
                          className={`overflow-hidden rounded-lg transition-all duration-300 p-3 ${
                            isActive
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1 ml-8">{item.description}</p>
                          {isActive && (
                            <motion.div
                              layoutId="active-nav"
                              className="absolute inset-y-0 left-0 w-1 bg-white"
                              initial={false}
                            />
                          )}
                        </div>
                      )}
                    </NavLink>
                  </motion.div>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;