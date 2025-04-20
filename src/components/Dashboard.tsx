import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Brain, TrendingUp, History as HistoryIcon, AlertCircle } from 'lucide-react';
import { EmotionData, EmotionInsight } from '../types';

const Dashboard: React.FC = () => {
  const realtimeData: EmotionData[] = Array.from({ length: 20 }, (_, i) => ({
    timestamp: Date.now() - (19 - i) * 1000,
    happy: Math.random() * 0.8 + 0.2,
    sad: Math.random() * 0.4,
    angry: Math.random() * 0.3,
    surprised: Math.random() * 0.5,
    neutral: Math.random() * 0.6
  }));

  const insights: EmotionInsight[] = [
    {
      id: '1',
      type: 'improvement',
      message: 'Your happiness levels have increased by 15% this week',
      emotion: 'happy',
      createdAt: new Date()
    },
    {
      id: '2',
      type: 'warning',
      message: 'Higher stress levels detected during morning sessions',
      emotion: 'angry',
      createdAt: new Date()
    },
    {
      id: '3',
      type: 'suggestion',
      message: 'Try deep breathing exercises to reduce anxiety',
      emotion: 'neutral',
      createdAt: new Date()
    }
  ];

  return (
    <div className="p-6 ml-64 bg-black min-h-screen text-gray-100">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Emotion Dashboard</h1>
          <button className="bg-[#0a0a0a] text-gray-200 px-4 py-2 rounded-lg border border-[#1a1a1a] hover:bg-[#1a1a1a] transition-colors">
            Start New Session
          </button>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {[
            { icon: Brain, label: 'Dominant Emotion', value: 'Happy', color: 'text-green-400' },
            { icon: TrendingUp, label: 'Improvement', value: '+15%', color: 'text-blue-400' },
            { icon: HistoryIcon, label: 'Sessions Today', value: '3', color: 'text-purple-400' },
            { icon: AlertCircle, label: 'Stress Level', value: 'Low', color: 'text-yellow-400' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#0a0a0a] p-6 rounded-xl shadow-lg border border-[#1a1a1a]"
            >
              <div className="flex items-center space-x-4">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#0a0a0a] p-6 rounded-xl shadow-lg border border-[#1a1a1a]"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-200">Live Emotion Feed</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={realtimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis
                  dataKey="timestamp"
                  tick={{ fill: '#ccc' }}
                  tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
                />
                <YAxis tick={{ fill: '#ccc' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                  labelFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
                />
                <Legend wrapperStyle={{ color: '#ccc' }} />
                <Line type="monotone" dataKey="happy" stroke="#4CAF50" />
                <Line type="monotone" dataKey="sad" stroke="#2196F3" />
                <Line type="monotone" dataKey="angry" stroke="#F44336" />
                <Line type="monotone" dataKey="surprised" stroke="#FF9800" />
                <Line type="monotone" dataKey="neutral" stroke="#9E9E9E" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#0a0a0a] p-6 rounded-xl shadow-lg border border-[#1a1a1a]"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-200">Emotion Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={realtimeData}>
                <defs>
                  {[
                    { key: 'happy', color: '#4CAF50' },
                    { key: 'sad', color: '#2196F3' },
                    { key: 'angry', color: '#F44336' },
                    { key: 'surprised', color: '#FF9800' },
                    { key: 'neutral', color: '#9E9E9E' }
                  ].map(({ key, color }) => (
                    <linearGradient id={`${key}Gradient`} x1="0" y1="0" x2="0" y2="1" key={key}>
                      <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
                  stroke="#9CA3AF"
                />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "#f9fafb" }}
                  labelFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
                />
                <Legend />
                <Area type="monotone" dataKey="happy" stackId="1" stroke="#4CAF50" fill="url(#happyGradient)" />
                <Area type="monotone" dataKey="sad" stackId="1" stroke="#2196F3" fill="url(#sadGradient)" />
                <Area type="monotone" dataKey="angry" stackId="1" stroke="#F44336" fill="url(#angryGradient)" />
                <Area type="monotone" dataKey="surprised" stackId="1" stroke="#FF9800" fill="url(#surprisedGradient)" />
                <Area type="monotone" dataKey="neutral" stackId="1" stroke="#9E9E9E" fill="url(#neutralGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0a0a0a] p-6 rounded-xl shadow-lg border border-[#1a1a1a]"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-200">AI Insights</h2>
          <div className="grid grid-cols-3 gap-6">
            {insights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-l-4 ${insight.type === 'improvement'
                  ? 'border-green-400 bg-green-900/30'
                  : insight.type === 'warning'
                    ? 'border-yellow-400 bg-yellow-900/30'
                    : 'border-blue-400 bg-blue-900/30'
                  }`}
              >
                <p className="text-sm font-medium mb-2 capitalize text-gray-200">
                  {insight.type}
                </p>
                <p className="text-gray-300">{insight.message}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {insight.createdAt.toLocaleTimeString()}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
