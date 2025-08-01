import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Layout,
  Activity,
  User,
  History,
  Brain,
  BarChart2,
  CreditCard,
  Box,
  Menu,
  X,
  Bell,
  BellDot,
  Airplay,
  Home,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getNotifications } from '../services/notificationService';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, [unreadCount, setUnreadCount]);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      const unread = data.filter((n) => !n.is_read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error('Notification fetch error:', err);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsOpen(!mobile);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { icon: Home, label: 'Home', path: '/', description: 'The Landing Page' },
    { icon: Activity, label: 'Monitor', path: '/monitor', description: 'Real-time emotion tracking' },
    { icon: History, label: 'History', path: '/history', description: 'Past sessions and trends' },
    { icon: Brain, label: 'Insights', path: '/insights', description: 'AI-powered emotional analysis' },
    { icon: Layout, label: 'Dashboard', path: '/dashboard', description: 'Overview of your analytics' },
    { icon: User, label: 'Profile', path: '/profile', description: 'Manage your account' },
    { icon: BarChart2, label: 'Reports', path: '/reports', description: 'Detailed emotional reports' },
    { icon: Box, label: 'Feedbacks', path: '/feedback-dashboard', description: 'Let us know what you feel' },
    {
      icon: unreadCount > 0 ? BellDot : Bell,
      label: 'Notifications',
      path: '/notifications',
      description: 'You got something !!',
    },
    { icon: Airplay, label: 'AI Assistant', path: '/assistant', description: 'Let the AI resolve your doubts' },
    { icon: CreditCard, label: 'Pricing', path: '/#', description: 'Upgrade your plan' },
  ];

  return (
    <>
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
            className={`h-screen w-64 bg-black border-r border-gray-800 fixed left-0 top-0 shadow-xl overflow-y-auto z-40 ${isMobile ? 'md:hidden' : ''
              }`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style>{`::-webkit-scrollbar { display: none; }`}</style>

            <div className="p-6">
              <motion.div className="flex items-center space-x-2 mb-8" whileHover={{ scale: 1.05 }}>
                <Link
                  to="/"
                  className="flex items-center space-x-3 hover:scale-105 transition-transform duration-200"
                >
                  <Activity className="w-9 h-9 text-white" />
                  <span className="text-xl font-bold bg-gradient-to-r from-white to-indigo-500 text-transparent bg-clip-text">
                    EmotionAI
                  </span>
                </Link>
              </motion.div>

              <nav className="space-y-2">
                {menuItems.map((item, index) => {
                  const isNotification = item.label === 'Notifications';
                  const isBellDot = item.icon === BellDot;

                  const iconColor = isNotification
                    ? isBellDot
                      ? 'text-red-500'
                      : 'text-green-500'
                    : '';

                  const textColor = isNotification
                    ? isBellDot
                      ? 'text-red-500'
                      : 'text-green-500'
                    : '';

                  return (
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
                            className={`overflow-hidden rounded-lg transition-all duration-300 p-3 ${isActive
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                              }`}
                          >
                            <div className="flex items-center space-x-3">
                              <item.icon className={`w-5 h-5 ${iconColor}`} />
                              <span className={`font-medium ${textColor}`}>{item.label}</span>
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
                  );
                })}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
