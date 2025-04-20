import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Brush
} from 'recharts';
import { Brain, Lightbulb, TrendingUp, Sun, Moon } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface EmotionData {
  id: number;
  emotion: string;
  intensity: number;
  timestamp: string;
  session_id: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

interface EmotionTrend {
  id: number;
  period_end: string;
  average_intensity: number;
  created_at: string;
  user_id: number;
  session_id: string;
  period_start: string;
  emotion_summary: {
    [key: string]: {
      count: number;
      average_confidence: number;
    };
  };
  updated_at: string;
}

const COLORS = {
  happy: '#4CAF50',
  sad: '#2196F3',
  fear: '#9C27B0',
  angry: '#F44336',
  disgust: '#795548',
  neutral: '#9E9E9E',
  surprised: '#FF9800'
};

const allEmotions = Object.keys(COLORS);

const Insights: React.FC = () => {
  const navigate = useNavigate();
  const [emotionData, setEmotionData] = useState<any[]>([]);
  const [weeklyTrendsData, setWeeklyTrendsData] = useState<any[]>([]);
  const [processedData, setProcessedData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [weeklyLoading, setWeeklyLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<[number, number]>([0, 100]);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchEmotionData = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required. Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/emotion/latest/emotion-data/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          localStorage.removeItem('token');
          setError('Session expired. Please login again.');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        if (!res.data) {
          setError('No emotion data found for your account.');
          return;
        }

        const sortedData = res.data.sort((a: EmotionData, b: EmotionData) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        
        setEmotionData(sortedData);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            localStorage.removeItem('token');
            setError('Session expired. Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
          } else {
            setError(`Failed to fetch data: ${err.response?.data?.message || err.message}`);
          }
        } else {
          setError('An unexpected error occurred. Please try again later.');
          console.error('Error:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchWeeklyTrends = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return;
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/emotion/user/emotions-trends-seven`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          return;
        }

        if (res.data) {
          const processedTrends = res.data.map((trend: EmotionTrend) => {
            const date = new Date(trend.period_end);
            const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
            
            const happyCount = trend.emotion_summary.happy?.count || 0;
            const sadCount = trend.emotion_summary.sad?.count || 0;
            const fearCount = trend.emotion_summary.fear?.count || 0;
            const angryCount = trend.emotion_summary.angry?.count || 0;
            const neutralCount = trend.emotion_summary.neutral?.count || 0;

            return {
              day,
              happiness: happyCount,
              stress: sadCount + fearCount + angryCount,
              energy: happyCount + neutralCount,
              date: date.toLocaleDateString()
            };
          });

          setWeeklyTrendsData(processedTrends.reverse());
        }
      } catch (err) {
        console.error('Error fetching weekly trends:', err);
      } finally {
        setWeeklyLoading(false);
      }
    };

    fetchEmotionData();
    fetchWeeklyTrends();
  }, [navigate]);

  useEffect(() => {
    if (emotionData.length > 0) {
      const processed = emotionData.reduce((acc, current) => {
        const timestamp = new Date(current.timestamp).getTime();
        let existingEntry = acc.find((item: any) => item.timestamp === timestamp);
        
        if (!existingEntry) {
          existingEntry = { timestamp };
          allEmotions.forEach(emotion => {
            existingEntry[emotion] = 0;
          });
          acc.push(existingEntry);
        }
        
        existingEntry[current.emotion] = current.intensity;
        return acc;
      }, [] as any[]);

      setProcessedData(processed);
    }
  }, [emotionData]);

  const handleBrushChange = (e: any) => {
    if (e.startIndex !== undefined && e.endIndex !== undefined) {
      setTimeRange([e.startIndex, e.endIndex]);
    }
  };

  const displayedData = processedData.slice(timeRange[0], timeRange[1] + 1);

  const fallbackData = Array.from({ length: 10 }).map((_, i) => {
    const baseEntry = {
      timestamp: Date.now() - (10 - i) * 60000,
    };
    allEmotions.forEach(emotion => {
      baseEntry[emotion] = 0;
    });
    const randomEmotion = allEmotions[Math.floor(Math.random() * allEmotions.length)];
    baseEntry[randomEmotion] = Math.floor(Math.random() * 100);
    return baseEntry;
  });

  const weeklyTrends = weeklyTrendsData.length > 0 ? weeklyTrendsData : [
    { day: 'Mon', happiness: 0, stress: 0, energy: 0 },
    { day: 'Tue', happiness: 0, stress: 0, energy: 0 },
    { day: 'Wed', happiness: 0, stress: 0, energy: 0 },
    { day: 'Thu', happiness: 0, stress: 0, energy: 0 },
    { day: 'Fri', happiness: 0, stress: 0, energy: 0 },
    { day: 'Sat', happiness: 0, stress: 0, energy: 0 },
    { day: 'Sun', happiness: 0, stress: 0, energy: 0 }
  ];

  const emotionCorrelations = [
    { emotion: 'Happy', correlation: 0.8 },
    { emotion: 'Sad', correlation: -0.3 },
    { emotion: 'Fear', correlation: -0.4 },
    { emotion: 'Angry', correlation: -0.5 },
    { emotion: 'Neutral', correlation: 0.1 },
    { emotion: 'Surprised', correlation: 0.4 }
  ];

  const aiRecommendations = [
    {
      title: 'Morning Routine Optimization',
      description: 'Your happiness levels peak after morning exercise. Consider maintaining this routine.',
      impact: 'High',
      icon: Sun
    },
    {
      title: 'Stress Management',
      description: 'Higher stress detected during afternoon meetings. Try short meditation breaks.',
      impact: 'Medium',
      icon: Brain
    },
    {
      title: 'Evening Relaxation',
      description: 'Emotional balance improves with evening relaxation activities.',
      impact: 'High',
      icon: Moon
    }
  ];

  const keyFindings = [
    {
      title: 'Peak Performance',
      description: 'Your emotional balance is best during morning hours',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Stress Triggers',
      description: 'Meetings longer than 1 hour increase stress levels',
      icon: Brain,
      color: 'text-red-600'
    },
    {
      title: 'Improvement Areas',
      description: 'Evening relaxation could be enhanced with meditation',
      icon: Lightbulb,
      color: 'text-blue-600'
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="p-6 ml-64 dark:bg-black min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Insights</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Deep analysis of your emotional patterns</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {new Date().toLocaleString()}
            </span>
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => window.location.reload()}
            >
              Refresh Analysis
            </button>
            <button 
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100 px-4 py-3 rounded relative"
          >
            <span className="block sm:inline">{error}</span>
            {error.includes('login') && (
              <button
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
                onClick={() => navigate('/login')}
              >
                <svg className="fill-current h-6 w-6 text-red-500 dark:text-red-300" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <title>Close</title>
                  <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                </svg>
              </button>
            )}
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aiRecommendations.map((rec, index) => (
            <motion.div
              key={rec.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#0a0a0a] p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center space-x-3 mb-4">
                <rec.icon className="w-8 h-8 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{rec.title}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{rec.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Impact</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  rec.impact === 'High' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                  rec.impact === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                  'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
                }`}>{rec.impact}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-[#0a0a0a] p-6 rounded-xl shadow-lg border border-[#1a1a1a]"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-200">Emotion Distribution (Last Session)</h2>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">{error}</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart
                  data={processedData.length > 0 ? displayedData : fallbackData}
                  ref={chartRef}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    {Object.entries(COLORS).map(([key, color]) => (
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
                  <YAxis stroke="#9CA3AF" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "#f9fafb" }}
                    labelFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
                    formatter={(value: number, name: string) => [`${value.toFixed(2)}%`, name]}
                  />
                  <Legend />
                  {allEmotions.map((key) => (
                    <Area
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stackId="1"
                      stroke={COLORS[key as keyof typeof COLORS]}
                      fill={`url(#${key}Gradient)`}
                      connectNulls={true}
                      activeDot={{ r: 6 }}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>

              <div className="mt-4">
                <ResponsiveContainer width="100%" height={100}>
                  <AreaChart
                    data={processedData.length > 0 ? processedData : fallbackData}
                    syncId="emotionChart"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
                      stroke="#9CA3AF"
                    />
                    <YAxis stroke="#9CA3AF" domain={[0, 100]} hide />
                    <Brush
                      dataKey="timestamp"
                      height={30}
                      stroke="#8884d8"
                      travellerWidth={10}
                      onChange={handleBrushChange}
                      startIndex={timeRange[0]}
                      endIndex={timeRange[1]}
                    />
                    {allEmotions.map((key) => (
                      <Area
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stackId="1"
                        stroke={COLORS[key as keyof typeof COLORS]}
                        fill={`url(#${key}Gradient)`}
                        connectNulls={true}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0a0a0a] p-6 rounded-xl shadow-lg border dark:border-gray-700"
        >
          <h2 className="text-xl font-bold mb-4 text-gray-200">Last Seven Analysis</h2>
          {weeklyLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyTrends}>
                <defs>
                  <linearGradient id="happinessGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#2e7d32" stopOpacity={0.3} />
                  </linearGradient>
                  <linearGradient id="stressGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F44336" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#b71c1c" stopOpacity={0.3} />
                  </linearGradient>
                  <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2196F3" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#0d47a1" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "#f9fafb" }} />
                <Legend />
                <Bar dataKey="happiness" fill="url(#happinessGradient)" />
                <Bar dataKey="stress" fill="url(#stressGradient)" />
                <Bar dataKey="energy" fill="url(#energyGradient)" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0a0a0a] p-6 rounded-xl shadow-lg border dark:border-gray-700 w-full max-w-3xl"
          >
            <h2 className="text-xl pb-12 font-bold mb-4 text-white text-center">Emotion Correlations</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={emotionCorrelations}>
                <PolarGrid />
                <PolarAngleAxis dataKey="emotion" stroke="#8884d8" />
                <PolarRadiusAxis domain={[-1, 1]} stroke="#8884d8" />
                <Radar name="Correlation" dataKey="correlation" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0a0a0a] p-6 rounded-xl shadow-lg border dark:border-gray-700"
          >
            <h2 className="text-xl font-bold mb-4 text-white">Key Findings</h2>
            <div className="grid grid-cols-1 gap-4">
              {keyFindings.map((finding, index) => (
                <motion.div
                  key={finding.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <finding.icon className={`w-8 h-8 ${finding.color} mb-3`} />
                  <h3 className="font-semibold text-white mb-2">{finding.title}</h3>
                  <p className="text-gray-400 text-sm">{finding.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Insights;