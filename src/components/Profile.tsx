import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from "recharts";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  FiLogOut, FiSettings, FiUser, FiActivity, FiBarChart2, 
  FiHelpCircle, FiCalendar, FiClock, FiAward, FiTrendingUp,
  FiEdit, FiLock, FiMail, FiBell, FiCreditCard, FiShield
} from "react-icons/fi";
import { useMediaQuery } from "react-responsive";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Navigate, useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Types for better type safety
type User = {
  id: string; 
  username: string;
  email: string;
  created_at: string;
  last_login: string;
  number_of_session_taken: number;
  number_of_alloted_sessions: number;
  subscription_plan?: string;
  subscription_end?: string;
  profile_picture?: string;
};

type EmotionData = {
  emotion: string;
  value: number;
  color?: string;
};

type SessionTrend = {
  session: string;
  happiness: number;
  sadness: number;
  anxiety: number;
  excitement: number;
};

type StatCard = {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Profile: React.FC = () => {

  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const [user, setUser] = useState<User | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    notifications: true,
    darkMode: true
  });

  const isMobile = useMediaQuery({ maxWidth: 768 });

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      //console.log(token)
      const res = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      //console.log(res)
      setUser(res.data);
      setFormData({
        username: res.data.username,
        email: res.data.email,
        notifications: true,
        darkMode: true
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
      toast.error("Failed to load profile data");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const getInitials = (name: string) => {
    if (!name) return "";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase();
  };

  const handleLogoutClick = () => setShowLogoutModal(true);

  const confirmLogout = async () => {
    try {
      setLoggingOut(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("No token found.");
        return;
      }

      await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Logout successful! Redirecting...", {
        position: "top-center",
      });

      setTimeout(() => {
        localStorage.removeItem("token");
        window.location.href = "/";
      }, 1500);
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
      setLoggingOut(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${API_BASE_URL}/users/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      fetchProfile(); // Refresh user data
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update profile");
    }
  };

  // Emotion data with colors
  const emotionData: EmotionData[] = [
    { emotion: "Happiness", value: 70, color: COLORS[0] },
    { emotion: "Sadness", value: 15, color: COLORS[1] },
    { emotion: "Anger", value: 5, color: COLORS[2] },
    { emotion: "Surprise", value: 10, color: COLORS[3] },
    { emotion: "Neutral", value: 20, color: COLORS[4] },
  ];

  // Session trends data
  const sessionTrends: SessionTrend[] = [
    { session: "Week 1", happiness: 60, sadness: 20, anxiety: 15, excitement: 5 },
    { session: "Week 2", happiness: 65, sadness: 18, anxiety: 12, excitement: 8 },
    { session: "Week 3", happiness: 70, sadness: 15, anxiety: 10, excitement: 12 },
    { session: "Week 4", happiness: 75, sadness: 12, anxiety: 8, excitement: 15 },
    { session: "Week 5", happiness: 80, sadness: 10, anxiety: 5, excitement: 20 },
  ];

  // Weekly activity data
  const weeklyActivity = [
    { day: "Mon", sessions: 2 },
    { day: "Tue", sessions: 3 },
    { day: "Wed", sessions: 1 },
    { day: "Thu", sessions: 4 },
    { day: "Fri", sessions: 2 },
    { day: "Sat", sessions: 1 },
    { day: "Sun", sessions: 0 },
  ];

  // Stats cards data
  const stats: StatCard[] = [
    {
      title: "Sessions Attended",
      value: user?.number_of_session_taken ?? 0,
      description: "Number of sessions you actively joined",
      icon: <FiActivity className="text-blue-400" size={24} />,
      trend: 'up',
      trendValue: '+12% from last month'
    },
    {
      title: "Sessions Remaining",
      value: user ? user.number_of_alloted_sessions - user.number_of_session_taken : 0,
      description: "Sessions left in your current plan",
      icon: <FiClock className="text-purple-400" size={24} />,
      trend: 'down',
      trendValue: '-5% from last month'
    },
    {
      title: "Total Sessions",
      value: user?.number_of_alloted_sessions ?? 0,
      description: "All sessions allocated to you",
      icon: <FiCalendar className="text-green-400" size={24} />,
      trend: 'up',
      trendValue: '+20% from last month'
    },
    {
      title: "Achievements",
      value: 5,
      description: "Badges and milestones earned",
      icon: <FiAward className="text-yellow-400" size={24} />,
      trend: 'neutral'
    }
  ];

  // Recent activity data
  const recentActivity = [
    { id: 1, type: "Session", description: "Completed mindfulness session", time: "2 hours ago" },
    { id: 2, type: "Goal", description: "Reached weekly goal", time: "1 day ago" },
    { id: 3, type: "Achievement", description: "Earned 'Consistent' badge", time: "3 days ago" },
    { id: 4, type: "Session", description: "Started new program", time: "1 week ago" },
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center space-y-6"
        >
          <div className="w-16 h-16 border-4 border-white/10 border-t-white rounded-full animate-spin"></div>
          <p className="text-lg text-slate-400">Loading your profile...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 min-h-screen bg-black text-white md:ml-64 space-y-6 relative">
      {/* Mobile Header */}
      {isMobile && (
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Profile</h1>
          <button 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobile && showMobileMenu && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute z-10 top-16 right-0 w-full bg-[#0a0a0a] border border-slate-800 rounded-lg shadow-lg p-4"
        >
          <div className="flex flex-col space-y-2">
            <button 
              onClick={() => { setActiveTab("overview"); setShowMobileMenu(false); }}
              className={`flex items-center space-x-2 p-2 rounded-lg ${activeTab === "overview" ? "bg-slate-800" : "hover:bg-slate-800"}`}
            >
              <FiUser />
              <span>Overview</span>
            </button>
            <button 
              onClick={() => { setActiveTab("stats"); setShowMobileMenu(false); }}
              className={`flex items-center space-x-2 p-2 rounded-lg ${activeTab === "stats" ? "bg-slate-800" : "hover:bg-slate-800"}`}
            >
              <FiTrendingUp />
              <span>Statistics</span>
            </button>
            <button 
              onClick={() => { setActiveTab("settings"); setShowMobileMenu(false); }}
              className={`flex items-center space-x-2 p-2 rounded-lg ${activeTab === "settings" ? "bg-slate-800" : "hover:bg-slate-800"}`}
            >
              <FiSettings />
              <span>Settings</span>
            </button>
            <button 
              onClick={() => { setActiveTab("help"); setShowMobileMenu(false); }}
              className={`flex items-center space-x-2 p-2 rounded-lg ${activeTab === "help" ? "bg-slate-800" : "hover:bg-slate-800"}`}
            >
              <FiHelpCircle />
              <span>Help</span>
            </button>
            <button 
              onClick={handleLogoutClick}
              className="flex items-center space-x-2 p-2 rounded-lg text-red-400 hover:bg-slate-800"
            >
              <FiLogOut />
              <span>Logout</span>
            </button>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center justify-between p-4 md:p-6 rounded-2xl bg-[#0a0a0a] border border-slate-800">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            {user.profile_picture ? (
              <img 
                src={user.profile_picture} 
                alt="Profile" 
                className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-slate-700"
              />
            ) : (
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center text-xl md:text-2xl font-bold">
                {getInitials(user.username)}
              </div>
            )}
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold">{user.username}</h2>
              <p className="text-sm text-slate-400">{user.email}</p>
              <div className="flex items-center mt-1 space-x-2">
                <span className="text-xs px-2 py-1 bg-slate-800 rounded-full text-slate-300">
                  Member since {new Date(user.created_at).toLocaleDateString()}
                </span>
                <span className="text-xs px-2 py-1 bg-slate-800 rounded-full text-slate-300">
                  {user.role.toUpperCase()}
                </span>
                {user.subscription_plan && (
                  <span className="text-xs px-2 py-1 bg-blue-900/30 rounded-full text-blue-400">
                    {user.subscription_plan}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            {!isMobile && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab("stats")}
                  className={`px-3 py-2 text-sm md:px-4 md:py-2 ${activeTab === "stats" ? "bg-blue-600" : "bg-slate-800"} text-white rounded-xl flex items-center`}
                >
                  <FiTrendingUp className="inline mr-2" />
                  Stats
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab("settings")}
                  className={`px-3 py-2 text-sm md:px-4 md:py-2 ${activeTab === "settings" ? "bg-blue-600" : "bg-slate-800"} text-white rounded-xl flex items-center`}
                >
                  <FiSettings className="inline mr-2" />
                  Settings
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogoutClick}
                  className="px-3 py-2 text-sm md:px-4 md:py-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl flex items-center"
                >
                  <FiLogOut className="inline mr-2" />
                  Logout
                </motion.button>
              </>
            )}
          </div>
        </div>

        {/* Main Content with Tabs */}
        <Tabs selectedIndex={['overview', 'stats', 'settings', 'help'].indexOf(activeTab)} 
              onSelect={(index) => setActiveTab(['overview', 'stats', 'settings', 'help'][index])}
              className="border border-slate-800 rounded-2xl overflow-hidden">
          <TabList className="flex bg-[#0a0a0a] border-b border-slate-800">
            <Tab className="px-4 py-3 cursor-pointer focus:outline-none" selectedClassName="text-blue-400 border-b-2 border-blue-400">
              <div className="flex items-center space-x-2">
                <FiUser />
                <span>Overview</span>
              </div>
            </Tab>
            <Tab className="px-4 py-3 cursor-pointer focus:outline-none" selectedClassName="text-blue-400 border-b-2 border-blue-400">
              <div className="flex items-center space-x-2">
                <FiTrendingUp />
                <span>Statistics</span>
              </div>
            </Tab>
            <Tab className="px-4 py-3 cursor-pointer focus:outline-none" selectedClassName="text-blue-400 border-b-2 border-blue-400">
              <div className="flex items-center space-x-2">
                <FiSettings />
                <span>Settings</span>
              </div>
            </Tab>
            <Tab className="px-4 py-3 cursor-pointer focus:outline-none" selectedClassName="text-blue-400 border-b-2 border-blue-400">
              <div className="flex items-center space-x-2">
                <FiHelpCircle />
                <span>Help</span>
              </div>
            </Tab>
          </TabList>

          <div className="bg-[#0a0a0a] p-4 md:p-6">
            <TabPanel>
              {/* Overview Tab Content */}
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map((item, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 rounded-2xl bg-[#111111] border border-slate-800"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs md:text-sm text-slate-400 uppercase font-medium">{item.title}</h3>
                        <div className="text-xl">
                          {item.icon}
                        </div>
                      </div>
                      <p className="text-2xl md:text-3xl font-bold mt-2">{item.value}</p>
                      <p className="text-xs md:text-sm text-slate-500 mt-1">{item.description}</p>
                      {item.trend && (
                        <div className={`flex items-center mt-2 text-xs ${item.trend === 'up' ? 'text-green-400' : item.trend === 'down' ? 'text-red-400' : 'text-slate-400'}`}>
                          {item.trend === 'up' ? (
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          ) : item.trend === 'down' ? (
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                            </svg>
                          )}
                          {item.trendValue}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <motion.div 
                    whileHover={{ scale: 1.01 }} 
                    className="p-4 md:p-6 bg-[#111111] rounded-2xl border border-slate-800"
                  >
                    <h3 className="text-lg text-white font-semibold mb-4">Emotion Distribution</h3>
                    <div className="h-64 md:h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={emotionData}>
                          <PolarGrid stroke="#334155" />
                          <PolarAngleAxis dataKey="emotion" stroke="#cbd5e1" fontSize={12} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={{ fill: "#cbd5e1", fontSize: 10 }} />
                          <Radar 
                            name="Emotion Level" 
                            dataKey="value" 
                            stroke="#ffffff" 
                            fill="#ffffff" 
                            fillOpacity={0.15} 
                            animationDuration={1500}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: "#0f172a", 
                              borderColor: "#1e293b",
                              borderRadius: "0.5rem",
                              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                            }}
                            labelStyle={{ color: "#f1f5f9", fontWeight: 600 }} 
                            itemStyle={{ color: "#e2e8f0" }} 
                            formatter={(value) => [`${value}%`, 'Intensity']}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.01 }} 
                    className="p-4 md:p-6 bg-[#111111] rounded-2xl border border-slate-800"
                  >
                    <h3 className="text-lg text-white font-semibold mb-4">Weekly Activity</h3>
                    <div className="h-64 md:h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weeklyActivity}>
                          <XAxis dataKey="day" stroke="#cbd5e1" />
                          <YAxis stroke="#cbd5e1" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: "#0f172a", 
                              borderColor: "#1e293b",
                              borderRadius: "0.5rem"
                            }}
                            labelStyle={{ color: "#f1f5f9" }} 
                            itemStyle={{ color: "#e2e8f0" }} 
                            formatter={(value) => [`${value} sessions`, 'Count']}
                          />
                          <Bar 
                            dataKey="sessions" 
                            fill="#8884d8" 
                            radius={[4, 4, 0, 0]}
                            animationDuration={1500}
                          >
                            {weeklyActivity.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                </div>

                {/* Recent Activity */}
                <div className="p-4 md:p-6 bg-[#111111] rounded-2xl border border-slate-800">
                  <h3 className="text-lg text-white font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <motion.div 
                        key={activity.id}
                        whileHover={{ x: 5 }}
                        className="flex items-start p-3 rounded-lg bg-slate-900/50 hover:bg-slate-900 transition-colors"
                      >
                        <div className="flex-shrink-0 mt-1">
                          {activity.type === "Session" && <FiActivity className="text-blue-400" />}
                          {activity.type === "Goal" && <FiAward className="text-green-400" />}
                          {activity.type === "Achievement" && <FiAward className="text-yellow-400" />}
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-white">{activity.description}</p>
                          <p className="text-xs text-slate-400">{activity.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </TabPanel>

            <TabPanel>
              {/* Statistics Tab Content */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <motion.div 
                    whileHover={{ scale: 1.01 }} 
                    className="p-4 md:p-6 bg-[#111111] rounded-2xl border border-slate-800"
                  >
                    <h3 className="text-lg text-white font-semibold mb-4">Emotion Trends Over Time</h3>
                    <div className="h-64 md:h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sessionTrends}>
                          <XAxis dataKey="session" stroke="#cbd5e1" />
                          <YAxis stroke="#cbd5e1" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: "#0f172a", 
                              borderColor: "#1e293b",
                              borderRadius: "0.5rem"
                            }}
                            labelStyle={{ color: "#f1f5f9" }} 
                            itemStyle={{ color: "#e2e8f0" }} 
                            formatter={(value, name) => [`${value}%`, name]}
                          />
                          <Legend 
                            wrapperStyle={{ 
                              color: "#cbd5e1",
                              paddingTop: '10px'
                            }} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="happiness" 
                            stroke="#e5e7eb" 
                            strokeWidth={2} 
                            dot={{ r: 4 }} 
                            name="Happiness" 
                            animationDuration={1500}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="sadness" 
                            stroke="#64748b" 
                            strokeWidth={2} 
                            dot={{ r: 4 }} 
                            name="Sadness" 
                            animationDuration={1500}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="anxiety" 
                            stroke="#f43f5e" 
                            strokeWidth={2} 
                            dot={{ r: 4 }} 
                            name="Anxiety" 
                            animationDuration={1500}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="excitement" 
                            stroke="#10b981" 
                            strokeWidth={2} 
                            dot={{ r: 4 }} 
                            name="Excitement" 
                            animationDuration={1500}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.01 }} 
                    className="p-4 md:p-6 bg-[#111111] rounded-2xl border border-slate-800"
                  >
                    <h3 className="text-lg text-white font-semibold mb-4">Emotion Breakdown</h3>
                    <div className="h-64 md:h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={emotionData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            animationDuration={1500}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {emotionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: "#0f172a", 
                              borderColor: "#1e293b",
                              borderRadius: "0.5rem"
                            }}
                            formatter={(value) => [`${value}%`, 'Intensity']}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                </div>

                {/* Session History */}
                <div className="p-4 md:p-6 bg-[#111111] rounded-2xl border border-slate-800">
                  <h3 className="text-lg text-white font-semibold mb-4">Session History</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-800">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Duration</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Type</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Mood Before</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Mood After</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {[1, 2, 3, 4, 5].map((item) => (
                          <tr key={item} className="hover:bg-slate-900/50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300">2023-06-{10 + item}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300">{15 + item} mins</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300">Mindfulness</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <span className="px-2 py-1 text-xs rounded-full bg-blue-900/30 text-blue-400">Calm</span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <span className="px-2 py-1 text-xs rounded-full bg-green-900/30 text-green-400">Relaxed</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </TabPanel>

            <TabPanel>
              {/* Settings Tab Content */}
              <div className="space-y-6">
                <div className="p-4 md:p-6 bg-[#111111] rounded-2xl border border-slate-800">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">Account Settings</h3>
                    {isEditing ? (
                      <div className="space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl"
                        >
                          Cancel
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleSaveProfile}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl"
                        >
                          Save Changes
                        </motion.button>
                      </div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl flex items-center"
                      >
                        <FiEdit className="mr-2" />
                        Edit Profile
                      </motion.button>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Username</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                            {user.username}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                        {isEditing ? (
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                            {user.email}
                          </div>
                        )}
                      </div>
                    </div>

                    {isEditing && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-slate-400 mb-1">New Password</label>
                          <div className="relative">
                            <input
                              type="password"
                              name="password"
                              placeholder="••••••••"
                              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                            />
                            <FiLock className="absolute right-3 top-3.5 text-slate-500" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-400 mb-1">Confirm Password</label>
                          <div className="relative">
                            <input
                              type="password"
                              name="confirmPassword"
                              placeholder="••••••••"
                              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                            />
                            <FiLock className="absolute right-3 top-3.5 text-slate-500" />
                          </div>
                        </div>
                      </>
                    )}

                    <div className="pt-4 border-t border-slate-800">
                      <h4 className="text-lg font-medium mb-4 flex items-center">
                        <FiBell className="mr-2" />
                        Notification Settings
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Email Notifications</label>
                            <p className="text-xs text-slate-500">Receive email notifications about your account</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              name="notifications"
                              checked={formData.notifications}
                              onChange={handleInputChange}
                              className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Dark Mode</label>
                            <p className="text-xs text-slate-500">Toggle between light and dark theme</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              name="darkMode"
                              checked={formData.darkMode}
                              onChange={handleInputChange}
                              className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                      <h4 className="text-lg font-medium mb-4 flex items-center">
                        <FiShield className="mr-2" />
                        Security
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Two-Factor Authentication</label>
                            <p className="text-xs text-slate-500">Add an extra layer of security to your account</p>
                          </div>
                          <button className="px-3 py-1 text-sm bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700">
                            Enable
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Active Sessions</label>
                            <p className="text-xs text-slate-500">View and manage your active login sessions</p>
                          </div>
                          <button className="px-3 py-1 text-sm bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700">
                            Manage
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                      <h4 className="text-lg font-medium mb-4 flex items-center">
                        <FiCreditCard className="mr-2" />
                        Subscription
                      </h4>
                      {user.subscription_plan ? (
                        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{user.subscription_plan} Plan</span>
                            <span className="text-sm bg-blue-900/30 text-blue-400 px-2 py-1 rounded-full">
                              Active
                            </span>
                          </div>
                          <p className="text-sm text-slate-400 mb-3">
                            Renews on {user.subscription_end ? new Date(user.subscription_end).toLocaleDateString() : 'N/A'}
                          </p>
                          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm">
                            Manage Subscription
                          </button>
                        </div>
                      ) : (
                        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                          <p className="text-sm text-slate-400 mb-3">You don't have an active subscription</p>
                          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm">
                            Upgrade Plan
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 md:p-6 bg-[#111111] rounded-2xl border border-slate-800">
                  <h3 className="text-xl font-semibold mb-6">Danger Zone</h3>
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-red-900/20 rounded-lg border border-red-900/50">
                      <div className="mb-2 md:mb-0">
                        <h4 className="font-medium text-red-400">Delete Account</h4>
                        <p className="text-sm text-red-400/70">
                          Permanently delete your account and all associated data
                        </p>
                      </div>
                      <button className="px-4 py-2 bg-red-900/50 hover:bg-red-900 text-red-400 rounded-lg text-sm border border-red-900">
                        Delete Account
                      </button>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-amber-900/20 rounded-lg border border-amber-900/50">
                      <div className="mb-2 md:mb-0">
                        <h4 className="font-medium text-amber-400">Export Data</h4>
                        <p className="text-sm text-amber-400/70">
                          Download all your data in a portable format
                        </p>
                      </div>
                      <button className="px-4 py-2 bg-amber-900/50 hover:bg-amber-900 text-amber-400 rounded-lg text-sm border border-amber-900">
                        Export Data
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>

            <TabPanel>
              {/* Help Tab Content */}
              <div className="space-y-6">
                <div className="p-4 md:p-6 bg-[#111111] rounded-2xl border border-slate-800">
                  <h3 className="text-xl font-semibold mb-6">Help & Support</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors" onClick={() => handleNavigation("/second-docs")}>
                      <div className="flex items-center mb-3">
                        <div className="p-2 bg-blue-900/30 rounded-lg mr-3">
                          <FiHelpCircle className="text-blue-400" size={20} />
                        </div>
                        <h4 className="font-medium">FAQs</h4>
                      </div>
                      <p className="text-sm text-slate-400">
                        Find answers to common questions about using our platform and services.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors" onClick={() => handleNavigation("/support")}>
                      <div className="flex items-center mb-3">
                        <div className="p-2 bg-purple-900/30 rounded-lg mr-3">
                          <FiMail className="text-purple-400" size={20} />
                        </div>
                        <h4 className="font-medium">Contact Support</h4>
                      </div>
                      <p className="text-sm text-slate-400">
                        Reach out to our support team for personalized assistance with any issues.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors" onClick={() => handleNavigation("/forum")}>
                      <div className="flex items-center mb-3">
                        <div className="p-2 bg-yellow-900/30 rounded-lg mr-3">
                          <FiUser className="text-yellow-400" size={20} />
                        </div>
                        <h4 className="font-medium">Community Forum</h4>
                      </div>
                      <p className="text-sm text-slate-400">
                        Connect with other users to share experiences and get advice.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors" onClick={() => handleNavigation("/second-docs")}>
                      <div className="flex items-center mb-3">
                        <div className="p-2 bg-green-900/30 rounded-lg mr-3">
                          <FiBarChart2 className="text-green-400" size={20} />
                        </div>
                        <h4 className="font-medium">Guides & Tutorials</h4>
                      </div>
                      <p className="text-sm text-slate-400">
                        Learn how to make the most of our platform with step-by-step guides.
                      </p>
                    </div>

                  </div>
                </div>

                <div className="p-4 md:p-6 bg-[#111111] rounded-2xl border border-slate-800">
                  <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
                  <div className="space-y-4">
                    {[
                      {
                        question: "How do I reset my password?",
                        answer: "You can reset your password by clicking on 'Forgot Password' on the login page. You'll receive an email with instructions to create a new password."
                      },
                      {
                        question: "Can I change my subscription plan?",
                        answer: "Yes, you can upgrade or downgrade your subscription at any time from the 'Subscription' section in your account settings."
                      },
                      {
                        question: "How do I interpret my emotion statistics?",
                        answer: "The emotion statistics show trends in your emotional state over time. Higher values indicate stronger presence of that emotion during your sessions."
                      },
                      {
                        question: "Is my data secure and private?",
                        answer: "Absolutely. We use industry-standard encryption and follow strict privacy policies to protect your data. You can read more in our Privacy Policy."
                      }
                    ].map((faq, index) => (
                      <div key={index} className="p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                        <h4 className="font-medium text-slate-200 mb-2">{faq.question}</h4>
                        <p className="text-sm text-slate-400">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabPanel>
          </div>
        </Tabs>
      </motion.div>

      {/* Logout Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setShowLogoutModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0a0a0a] border border-slate-800 rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <FiLogOut className="mx-auto text-red-400" size={48} />
                <h3 className="text-xl font-semibold mt-4">Confirm Logout</h3>
                <p className="text-slate-400 mt-2">
                  Are you sure you want to log out? You'll need to sign in again to access your account.
                </p>
                <div className="flex justify-center space-x-4 mt-6">
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
                    disabled={loggingOut}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmLogout}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg flex items-center"
                    disabled={loggingOut}
                  >
                    {loggingOut ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Logging Out...
                      </>
                    ) : (
                      "Logout"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default Profile;