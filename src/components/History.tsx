import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import axios from "axios";

const moodColors: Record<string, string> = {
  happy: "bg-green-500",
  sad: "bg-blue-500",
  fear: "bg-purple-500",
  angry: "bg-red-500",
  disgust: "bg-yellow-700",
  neutral: "bg-gray-500",
  surprised: "bg-orange-500",
};

const pieColors = {
  happy: "#22c55e",
  sad: "#3b82f6",
  fear: "#a855f7",
  angry: "#ef4444",
  disgust: "#a16207",
  neutral: "#6b7280",
  surprised: "#f97316",
};

const ITEMS_PER_PAGE = 10;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const History: React.FC = () => {
  const [trends, setTrends] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTrend, setSelectedTrend] = useState<any | null>(null);
  const [dayColors, setDayColors] = useState<{ [day: number]: string }>({});

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/emotion/user/emotions-trends`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = res.data;
        setTrends(data);

        const emotionTotals: Record<string, number> = {};
        const dayDominantEmotion: { [day: number]: { emotion: string; timestamp: string } } = {};

        data.forEach((trend: any) => {
          const day = new Date(trend.period_start).getDate();
          const summary = trend.emotion_summary || {};

          let dominant = { emotion: "neutral", count: 0 };
          for (const [emotion, detail]: any of Object.entries(summary)) {
            const count = typeof detail === "number" ? detail : detail?.count || 0;
            if (count > dominant.count) dominant = { emotion, count };
          }
          if (
            !dayDominantEmotion[day] ||
            new Date(trend.period_start) > new Date(dayDominantEmotion[day].timestamp)
          ) {
            dayDominantEmotion[day] = {
              emotion: dominant.emotion,
              timestamp: trend.period_start,
            };
          }

          Object.entries(summary).forEach(([emotion, detail]: any) => {
            emotionTotals[emotion] = (emotionTotals[emotion] || 0) + detail.count;
          });
        });

        const updatedColors: { [day: number]: string } = {};
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();

        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
          const mood = dayDominantEmotion[day]?.emotion || "neutral";
          updatedColors[day] = moodColors[mood] || "bg-yellow-500";
        }
        setDayColors(updatedColors);

        const formattedChart = Object.entries(emotionTotals).map(([emotion, count]) => ({
          name: emotion,
          value: count,
        }));
        setChartData(formattedChart);
      } catch (err) {
        console.error("Failed to fetch emotion trends:", err);
      }
    };

    fetchTrends();
  }, []);

  const fetchTrendDetail = async (id: number) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/emotion/user/emotion-trend/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSelectedTrend(res.data);
    } catch (err) {
      console.error("Failed to fetch trend details", err);
    }
  };

  const totalPages = Math.ceil(trends.length / ITEMS_PER_PAGE);
  const paginatedSessions = trends.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-4 md:p-6 md:ml-64 bg-black min-h-screen text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6 md:space-y-8"
      >
        <div className="flex flex-col sm:flex-row border border-gray-800 items-center justify-between bg-[#0a0a0a] p-4 md:p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-0">Emotion History</h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 bg-[#0a0a0a] p-3 md:p-4 rounded-lg shadow-md border border-gray-800"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between mb-3">
              <h2 className="text-base md:text-lg font-semibold text-white mb-2 sm:mb-0">Mood Calendar</h2>
              <div className="flex items-center space-x-1 text-gray-400 text-xs">
                <CalendarIcon className="w-3 h-3 md:w-4 md:h-4" />
                <span>{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-3 md:mb-4">
              {Array.from({
                length: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
              }, (_, i) => {
                const day = i + 1;
                const colorClass = dayColors[day] || 'bg-yellow-500';
                console.log(dayColors)
                return (
                  <div
                    key={day}
                    className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded flex items-center justify-center font-semibold text-white text-xs md:text-sm ${colorClass}`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs md:text-sm text-gray-300">
              {Object.entries(moodColors).map(([mood, colorClass]) => (
                <div key={mood} className="flex items-center space-x-1 md:space-x-2">
                  <div className={`w-3 h-3 md:w-4 md:h-4 rounded ${colorClass}`} />
                  <span className="capitalize">{mood}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 bg-[#0a0a0a] p-3 md:p-4 rounded-lg shadow-md border border-gray-800 flex flex-col items-center justify-center"
          >
            <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-white">Emotion Distribution</h2>
            <div className="w-full h-[200px] md:h-[250px] lg:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    paddingAngle={3}
                    label={({ name, percent }) =>
                      `${percent > 0.05 ? name.charAt(0).toUpperCase() + name.slice(1) + ': ' + Math.round(percent * 100) + '%' : ''}`
                    }
                    labelLine={false}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={pieColors[entry.name as keyof typeof pieColors]}
                        stroke="#111827"
                        strokeWidth={1.5}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f0f0f",
                      border: "1px solid #333",
                      borderRadius: "6px",
                      color: "#fff",
                    }}
                    itemStyle={{ color: "#fff" }}
                    formatter={(value: number, name: string) => [`${value} times`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {selectedTrend && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-2 md:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gradient-to-b from-[#111] to-[#1a1a1a] p-4 md:p-6 rounded-xl border border-gray-800 shadow-2xl w-full max-w-md md:max-w-2xl lg:max-w-3xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedTrend(null)}
                className="absolute top-2 right-2 md:top-4 md:right-4 text-gray-400 hover:text-white text-xl"
              >
                &times;
              </button>

              <h3 className="text-xl md:text-2xl font-semibold text-white mb-1 flex items-center gap-2">
                📊 Emotion Trend Detail
              </h3>
              <p className="text-xs md:text-sm text-gray-400 mb-3 md:mb-4">
                Detailed summary of your monitored emotional state.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6 text-xs md:text-sm text-gray-300">
                <div>
                  <span className="font-medium text-white">Session ID:</span> {selectedTrend.session_id}
                </div>
                <div>
                  <span className="font-medium text-white">Avg. Intensity:</span>{" "}
                  {selectedTrend.average_intensity.toFixed(2)}%
                </div>
                <div>
                  <span className="font-medium text-white">Start:</span>{" "}
                  {new Date(selectedTrend.period_start).toLocaleString()}
                </div>
                <div>
                  <span className="font-medium text-white">End:</span>{" "}
                  {new Date(selectedTrend.period_end).toLocaleString()}
                </div>
              </div>

              <div>
                <h4 className="text-base md:text-lg font-semibold text-white mb-2 md:mb-3">Emotion Summary</h4>

                {(() => {
                  const entries = Object.entries(selectedTrend.emotion_summary);
                  const dominantEmotion = entries.reduce((max, current) =>
                    current[1].count > max[1].count ? current : max
                  );

                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 text-xs md:text-sm">
                      {entries.map(([emotion, data]: any) => {
                        const isDominant = emotion === dominantEmotion[0];

                        return (
                          <div
                            key={emotion}
                            className={`rounded-lg px-3 py-2 md:px-4 md:py-3 flex flex-col border ${isDominant
                              ? "bg-yellow-500/10 border-yellow-600 shadow-md"
                              : "bg-[#222] border-gray-700"
                              }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-white font-semibold capitalize">{emotion}</span>
                              {isDominant && (
                                <span className="text-[10px] md:text-xs bg-yellow-600 text-black px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide">
                                  Dominant
                                </span>
                              )}
                            </div>
                            <span className="text-gray-300">{data.count} times</span>
                            <span className="text-gray-400">
                              {data.average_confidence.toFixed(2)}% confidence
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0a0a0a] p-3 md:p-4 rounded-lg shadow-md border border-gray-800"
        >
          <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-white">Your Emotion Trends</h2>

          <div className="space-y-2">
            {paginatedSessions.map((session: any) => {
              const summary = session.emotion_summary || {};
              const dominantEmotion = Object.entries(summary).reduce(
                (max, [emotion, data]: any) => {
                  const count = typeof data === "number" ? data : data?.count || 0;
                  return count > max.count ? { emotion, count } : max;
                },
                { emotion: "neutral", count: 0 }
              );

              return (
                <div
                  key={session.id}
                  className="bg-[#1a1a1a] p-3 md:p-4 rounded-lg hover:bg-[#2a2a2a] cursor-pointer transition-all"
                  onClick={() => fetchTrendDetail(session.id)}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-white">Trend ID: {session.id}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(session.period_start).toLocaleDateString()} –{" "}
                        {new Date(session.period_end).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-white text-sm md:text-base">Dominant Emotion: </span>
                      <span
                        className={`capitalize px-2 py-1 md:px-2.5 md:py-2 rounded-lg font-medium text-xs md:text-sm ${moodColors[dominantEmotion.emotion as keyof typeof moodColors] || "bg-gray-600"
                          }`}
                      >
                        {dominantEmotion.emotion}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-xs md:text-sm border border-gray-600 rounded disabled:opacity-30 w-full sm:w-auto"
            >
              Previous
            </button>
            <span className="text-xs md:text-sm text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-xs md:text-sm border border-gray-600 rounded disabled:opacity-30 w-full sm:w-auto"
            >
              Next
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default History;