import React from 'react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Brain, TrendingUp, History as HistoryIcon, AlertCircle } from 'lucide-react';
import { EmotionInsight } from '../types';
import { FiActivity, FiAward } from 'react-icons/fi';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const recentActivity = [
  { id: 1, type: "Session", description: "Completed mindfulness session", time: "2 hours ago" },
  { id: 2, type: "Goal", description: "Reached weekly goal", time: "1 day ago" },
  { id: 3, type: "Achievement", description: "Earned 'Consistent' badge", time: "3 days ago" },
  { id: 4, type: "Session", description: "Started new program", time: "1 week ago" },
];

const Dashboard: React.FC = () => {

  const [stats, setStats] = useState([
    { icon: Brain, label: 'Dominant Emotion', value: 'Loading...', color: 'text-green-400' },
    { icon: TrendingUp, label: 'Improvement', value: 'Loading...', color: 'text-blue-400' },
    { icon: HistoryIcon, label: 'Sessions Today', value: '0', color: 'text-purple-400' },
    { icon: AlertCircle, label: 'Stress Level', value: 'Loading...', color: 'text-yellow-400' }
  ]);

  const insights: EmotionInsight[] = [
    {
      id: '1',
      type: 'improvement',
      message: `Your ${stats[1].label.toLowerCase()} shows positive trends - ${stats[1].value} increase in emotional balance this week`,
      emotion: 'happy',
      createdAt: new Date(),
      details: `Breakdown of improvements:
    - Morning positivity: +22% 
    - Stress resilience: +15%
    - Social engagement: +18%
    
    Key contributors:
    1. Consistent sleep schedule (7h 42m avg)
    2. Daily mindfulness practice (12min/day)
    3. Increased physical activity (+3,200 steps/day)`,
      recommendation: 'Maintain current routines and consider adding evening gratitude journaling'
    },
    {
      id: '2',
      type: 'warning',
      message: `${stats[3].label}: ${stats[3].value} detected during ${stats[0].value.toLowerCase()} periods`,
      emotion: 'angry',
      createdAt: new Date(),
      details: `Stress pattern analysis:
    - Peak stress time: 10:15 AM (meeting hours)
    - Physiological signs:
      • Heart rate +14 bpm above baseline
      • Shallow breathing detected
      • Increased fidgeting
    
    Top stress triggers:
    1. Back-to-back meetings (73% correlation)
    2. Email overload (67% correlation)
    3. Task switching (58% correlation)`,
      recommendation: 'Schedule 5-minute breathing breaks between meetings and try the Pomodoro technique'
    },
    {
      id: '3',
      type: 'suggestion',
      message: `Based on ${stats[2].value} sessions today, consider adjusting your activity balance`,
      emotion: 'neutral',
      createdAt: new Date(),
      details: `Session effectiveness analysis:
    - Focus sessions: ${Math.floor(Math.random() * 5)} completed
    - Energy levels: ${['stable', 'fluctuating', 'declining'][Math.floor(Math.random() * 3)]}
    - Optimal work/break ratio: 52 minutes / 17 minutes
    
    Current patterns:
    • Deep work: 38% of sessions
    • Collaborative: 29% of sessions
    • Administrative: 33% of sessions`,
      recommendation: 'Try the 52/17 work rhythm and schedule creative work during your energy peaks'
    },
    {
      id: '4',
      type: 'analysis',
      message: `Your dominant emotion (${stats[0].value}) shows interesting patterns this week`,
      emotion: stats[0].value.toLowerCase() as EmotionType,
      createdAt: new Date(),
      details: `Emotional landscape:
    - Primary: ${stats[0].value} (42% of samples)
    - Secondary: ${['Content', 'Focused', 'Curious'][Math.floor(Math.random() * 3)]} (28%)
    - Tertiary: ${['Calm', 'Energetic', 'Contemplative'][Math.floor(Math.random() * 3)]} (18%)
    
    Temporal patterns:
    • Morning: ${['Hopeful', 'Energetic', 'Focused'][Math.floor(Math.random() * 3)]}
    • Afternoon: ${['Determined', 'Stressed', 'Social'][Math.floor(Math.random() * 3)]}
    • Evening: ${['Relaxed', 'Reflective', 'Tired'][Math.floor(Math.random() * 3)]}`,
      recommendation: 'Align challenging tasks with your peak emotional states for better results'
    }
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`
        };

        const [emotionRes, countRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/emotion/getting_seven_days_emotions_count`, { headers }),
          axios.get(`${API_BASE_URL}/emotion/getting_seven_days_count`, { headers })
        ]);

        const emotionData = emotionRes.data;
        const counts = countRes.data;

        const dominant = Object.entries(emotionData).reduce((a, b) => (b[1] > a[1] ? b : a), ["none", 0])[0];

        const todaySessions = counts[counts.length - 1];

        const stressSum = (emotionData.sad || 0) + (emotionData.angry || 0) + (emotionData.fear || 0);
        let stressLevel = "Low";
        if (stressSum >= 30) stressLevel = "High";
        else if (stressSum >= 10) stressLevel = "Moderate";

        const positiveSum = (emotionData.happy || 0) + (emotionData.neutral || 0) + (emotionData.surprised || 0);
        const improvement = `${Math.min(100, ((positiveSum / 500) * 100).toFixed(1))}%`;

        setStats([
          { icon: Brain, label: 'Dominant Emotion', value: dominant, color: 'text-green-400' },
          { icon: TrendingUp, label: 'Improvement', value: `+${improvement}`, color: 'text-blue-400' },
          { icon: HistoryIcon, label: 'Sessions Today', value: todaySessions.toString(), color: 'text-purple-400' },
          { icon: AlertCircle, label: 'Stress Level', value: stressLevel, color: 'text-yellow-400' }
        ]);
      } catch (error) {
        console.error("Error fetching stats", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-4 md:p-6 md:ml-64 min-h-screen bg-black text-white space-y-6 md:space-y-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Emotion Dashboard</h1>
          <Link to="/monitor" className="w-full md:w-auto">
            <button className="bg-[#0a0a0a] text-gray-200 px-4 py-2 rounded-lg border border-[#1a1a1a] hover:bg-[#1a1a1a] transition-colors w-full md:w-auto">
              Start New Session
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#0a0a0a] p-4 md:p-6 rounded-xl shadow-lg border border-[#1a1a1a]"
            >
              <div className="flex items-center space-x-3 md:space-x-4">
                <stat.icon className={`w-6 h-6 md:w-8 md:h-8 ${stat.color}`} />
                <div>
                  <p className="text-xs md:text-sm text-gray-500">{stat.label}</p>
                  <p className={`text-lg md:text-xl font-bold ${stat.color}`}>{stat.value.toUpperCase()}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0a0a0a] p-4 md:p-6 rounded-xl shadow-lg border border-[#1a1a1a]"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-200">AI Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {insights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 md:p-4 rounded-lg border-l-4 ${insight.type === 'improvement'
                  ? 'border-green-400 bg-green-900/30'
                  : insight.type === 'warning'
                    ? 'border-yellow-400 bg-yellow-900/30'
                    : 'border-blue-400 bg-blue-900/30'
                  }`}
              >
                <p className="text-xs md:text-sm font-medium mb-2 capitalize text-gray-200">
                  {insight.type}
                </p>
                <p className="text-xs md:text-sm text-gray-300">{insight.message}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {insight.createdAt.toLocaleTimeString()}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="bg-[#1f1f1f] text-gray-200 rounded-2xl shadow-xl p-4 md:p-8 border border-gray-700 max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-5">Understanding & Using Emotion.AI Effectively</h2>

          <p className="text-sm md:text-base text-gray-400 mb-3 md:mb-4">
            Emotion.AI is a powerful tool that helps you monitor and understand your emotional patterns in real time using facial expression recognition. Designed to assist both individuals and mental health professionals, it transforms emotional data into meaningful insights.
          </p>

          <p className="text-sm md:text-base text-gray-400 mb-3 md:mb-4">
            The system is best utilized when you're engaged in your daily routine—whether you're working, studying, interacting socially, or performing tasks that reflect your natural behavior. Avoid using it while sitting idle or remaining expressionless, as this may produce limited or misleading emotion data.
          </p>

          <p className="text-sm md:text-base text-gray-400 mb-3 md:mb-4">
            When integrated with a therapist or psychologist's workflow, Emotion.AI serves as a valuable supplement, providing analytical feedback on emotional trends across sessions. It allows professionals to make informed decisions based on actual, real-time emotional responses rather than subjective reports alone.
          </p>

          <div className="mt-4 md:mt-6 mb-3 md:mb-4">
            <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Core Features</h3>
            <ul className="list-disc list-inside text-sm md:text-base text-gray-400 space-y-1 md:space-y-2">
              <li>Real-time detection of emotions through webcam-based analysis</li>
              <li>Session-wise emotion breakdown with time-based visualization</li>
              <li>Weekly and monthly emotion trend reports to track progress</li>
              <li>Comprehensive emotion summaries for each session</li>
              <li>Historical comparison to monitor improvements or patterns over time</li>
              <li>Insight categories like Sleep, Work, Nutrition, Social activity, and more</li>
            </ul>
          </div>

          <p className="text-sm md:text-base text-gray-400">
            By continuously using Emotion.AI during your natural activities, you can gain deeper awareness of your emotional habits and improve your mental well-being with structured, data-driven feedback.
          </p>
        </div>

        <div className="p-3 md:p-6 bg-[#111111] rounded-2xl border border-slate-800">
          <h3 className="text-base md:text-lg text-white font-semibold mb-3 md:mb-4">Recent Activity</h3>
          <div className="space-y-2 md:space-y-3">
            {recentActivity.map((activity) => (
              <motion.div
                key={activity.id}
                whileHover={{ x: 5 }}
                className="flex items-start p-2 md:p-3 rounded-lg bg-slate-900/50 hover:bg-slate-900 transition-colors"
              >
                <div className="flex-shrink-0 mt-1">
                  {activity.type === "Session" && <FiActivity className="text-blue-400 w-4 h-4 md:w-5 md:h-5" />}
                  {activity.type === "Goal" && <FiAward className="text-green-400 w-4 h-4 md:w-5 md:h-5" />}
                  {activity.type === "Achievement" && <FiAward className="text-yellow-400 w-4 h-4 md:w-5 md:h-5" />}
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-xs md:text-sm font-medium text-white">{activity.description}</p>
                  <p className="text-xs text-slate-400">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;