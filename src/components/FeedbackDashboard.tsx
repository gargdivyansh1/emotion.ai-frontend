import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Trash2 } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const tabContentVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: 30, transition: { duration: 0.2 } },
};

const FeedbackDashboard = () => {
  const [role, setRole] = useState("USER");
  const [tab, setTab] = useState("submit");
  const [feedbackType, setFeedbackType] = useState("bug");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [success, setSuccess] = useState("");
  const [userFeedback, setUserFeedback] = useState([]);
  const [allFeedback, setAllFeedback] = useState([]);
  const [adminTypeFilter, setAdminTypeFilter] = useState("");
  const [adminSort, setAdminSort] = useState("date");

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRole(res.data.role);
    } catch (err) {
      console.error("Error fetching profile:", err);
      toast.error("Failed to load profile data");
    }
  };

  const fetchAdminFeedback = () => {
    axiosInstance
      .get("/feedback/", {
        params: {
          feedback_type: adminTypeFilter || undefined,
          sort_by: adminSort,
          limit: 50,
        },
      })
      .then((res) => setAllFeedback(res.data))
      .catch((err) => {
        console.error("Admin feedback fetch error:", err.response?.data || err.message);
        toast.error("Failed to load admin feedback");
      });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (tab === "my") {
      axiosInstance.get("/feedback/my-feedback")
        .then((res) => setUserFeedback(res.data))
        .catch((err) => {
          console.error("My feedback error:", err.response?.data || err.message);
          toast.error("Failed to load your feedback");
        });
    }
    if (tab === "admin") {
      fetchAdminFeedback();
    }
  }, [tab, adminTypeFilter, adminSort]);

  const submitFeedback = async () => {
    try {
      await axiosInstance.post("/feedback/", {
        feedback_type: feedbackType,
        message,
        rating,
      });
      setSuccess("Feedback submitted successfully!");
      setMessage("");
      setRating(null);
      setTimeout(() => setSuccess(""), 3000);
      toast.success("Feedback submitted successfully!");
    } catch (err: any) {
      console.error("Submit feedback error:", err.response?.data || err.message);
      toast.error("Failed to submit feedback");
    }
  };

  const deleteUserFeedback = async (id: number) => {
    try {
      await axiosInstance.delete(`/feedback/delete-feedback-user/${id}`);
      setUserFeedback(userFeedback.filter((f: any) => f.id !== id));
      toast.success("Feedback deleted successfully");
    } catch (err: any) {
      console.error("Delete user feedback error:", err.response?.data || err.message);
      toast.error("Failed to delete feedback");
    }
  };

  const deleteAdminFeedback = async (id: number) => {
    try {
      await axiosInstance.delete(`/feedback/delete-feedback-admin/${id}`);
      fetchAdminFeedback();
      toast.success("Feedback deleted successfully");
    } catch (err: any) {
      console.error("Delete admin feedback error:", err.response?.data || err.message);
      toast.error("Failed to delete feedback");
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "bug": return "bg-red-900/60 text-red-400 border-red-800";
      case "feature_request": return "bg-blue-900/60 text-blue-400 border-blue-800";
      case "suggestion": return "bg-purple-900/60 text-purple-400 border-purple-800";
      default: return "bg-gray-900/60 text-gray-400 border-gray-800";
    }
  };

  return (
    <div className="p-4 md:p-6 md:ml-64 min-h-screen bg-black text-white space-y-6 md:space-y-8">
      <motion.div 
        className="flex flex-wrap gap-2 md:space-x-4 mb-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.button
          onClick={() => setTab("submit")}
          className={`px-4 py-2 rounded-lg transition-all ${tab === "submit" ? "bg-indigo-900/80 border border-indigo-700 text-indigo-200" : "bg-[#111111] hover:bg-[#1a1a1a] border border-[#222222] text-gray-300"}`}
          variants={itemVariants}
        >
          Submit
        </motion.button>
        <motion.button
          onClick={() => setTab("my")}
          className={`px-4 py-2 rounded-lg transition-all ${tab === "my" ? "bg-indigo-900/80 border border-indigo-700 text-indigo-200" : "bg-[#111111] hover:bg-[#1a1a1a] border border-[#222222] text-gray-300"}`}
          variants={itemVariants}
        >
          My Feedback
        </motion.button>
        {role === 'admin' && (
          <motion.button
            onClick={() => setTab("admin")}
            className={`px-4 py-2 rounded-lg transition-all ${tab === "admin" ? "bg-indigo-900/80 border border-indigo-700 text-indigo-200" : "bg-[#111111] hover:bg-[#1a1a1a] border border-[#222222] text-gray-300"}`}
            variants={itemVariants}
          >
            Admin
          </motion.button>
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        {tab === "submit" && (
          <motion.div
            key="submit"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-[#0e0e0e] p-4 md:p-6 rounded-xl shadow-lg border border-[#222222]"
          >
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-indigo-300">Submit Feedback</h2>
            <motion.div variants={itemVariants}>
              <select
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value)}
                className="mb-3 w-full p-3 bg-[#111111] rounded-lg border border-[#252525] focus:border-indigo-600 focus:ring-1 focus:ring-indigo-900 outline-none text-gray-300"
              >
                <option value="bug">Bug Report</option>
                <option value="feature_request">Feature Request</option>
                <option value="suggestion">Suggestion</option>
              </select>
            </motion.div>
            <motion.div variants={itemVariants}>
              <textarea
                className="w-full p-3 bg-[#111111] rounded-lg border border-[#252525] focus:border-indigo-600 focus:ring-1 focus:ring-indigo-900 outline-none mb-3 text-gray-300 placeholder-gray-500"
                rows={8}
                placeholder="Describe your feedback in detail..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </motion.div>
            <motion.div variants={itemVariants} className="flex items-center mb-4">
              <label className="mr-3 text-gray-400">Rating:</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    onClick={() => setRating(rating === star ? null : star)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${rating && rating >= star ? "bg-yellow-600/80 text-black" : "bg-[#111111] text-gray-500 border border-[#252525] hover:border-yellow-600"}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {star}
                  </motion.button>
                ))}
              </div>
            </motion.div>
            <motion.button
              onClick={submitFeedback}
              className="w-full bg-indigo-900/80 hover:bg-indigo-800/80 py-3 rounded-lg border border-indigo-800 transition-all font-medium text-lg flex items-center justify-center gap-2 text-indigo-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              variants={itemVariants}
            >
              Submit Feedback
            </motion.button>
            {success && (
              <motion.div 
                className="mt-3 p-3 bg-green-900/30 border border-green-800/50 rounded-lg text-green-300"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {success}
              </motion.div>
            )}
          </motion.div>
        )}

        {tab === "my" && (
          <motion.div
            key="my"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-indigo-300">My Feedback</h2>

            {userFeedback.length === 0 ? (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-gray-600 text-lg mb-4">You haven't submitted any feedback yet</div>
                <motion.button
                  onClick={() => setTab("submit")}
                  className="px-6 py-2 bg-indigo-900/80 hover:bg-indigo-800/80 rounded-lg border border-indigo-800 transition-all text-indigo-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Submit Your First Feedback
                </motion.button>
              </motion.div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {userFeedback.map((item: any) => (
                  <motion.div
                    key={item.id}
                    className="bg-[#0e0e0e] p-5 rounded-xl shadow-lg border border-[#222222] hover:border-indigo-700/30 transition-all group"
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <span className={`${getTypeColor(item.feedback_type)} px-3 py-1 rounded-full text-sm font-medium border`}>
                          {item.feedback_type.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {item.rating !== null && (
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500 font-medium">{item.rating}</span>
                          <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                        </div>
                      )}
                    </div>

                    <div className="text-gray-300 whitespace-pre-wrap break-words mb-5 px-1">
                      {item.message}
                    </div>

                    <div className="flex justify-end">
                      <motion.button
                        onClick={() => deleteUserFeedback(item.id)}
                        className="px-4 py-2 bg-red-900/50 hover:bg-red-900/60 text-red-300 rounded-lg border border-red-800 transition-all flex items-center gap-2 group-hover:border-red-500"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}

        {tab === "admin" && (
          <motion.div
            key="admin"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-indigo-300">All Feedback</h2>

            <motion.div 
              className="flex flex-col sm:flex-row gap-3 mb-6"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants} className="flex-1">
                <select
                  value={adminTypeFilter}
                  onChange={(e) => setAdminTypeFilter(e.target.value)}
                  className="w-full bg-[#111111] text-gray-300 p-2 rounded-lg border border-[#252525] focus:border-indigo-600 focus:ring-1 focus:ring-indigo-900 outline-none"
                >
                  <option value="">All Types</option>
                  <option value="bug">Bug Reports</option>
                  <option value="feature_request">Feature Requests</option>
                  <option value="suggestion">Suggestions</option>
                </select>
              </motion.div>
              <motion.div variants={itemVariants} className="flex-1">
                <select
                  value={adminSort}
                  onChange={(e) => setAdminSort(e.target.value)}
                  className="w-full bg-[#111111] text-gray-300 p-2 rounded-lg border border-[#252525] focus:border-indigo-600 focus:ring-1 focus:ring-indigo-900 outline-none"
                >
                  <option value="date">Sort by Date</option>
                  <option value="rating">Sort by Rating</option>
                </select>
              </motion.div>
            </motion.div>

            {allFeedback.length === 0 ? (
              <motion.div 
                className="text-center py-12 text-gray-600 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                No feedback matches your filters
              </motion.div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {allFeedback.map((fb: any) => (
                  <motion.div
                    key={fb.id}
                    className="bg-[#0e0e0e] p-5 rounded-xl shadow-lg border border-[#222222] hover:border-indigo-700/30 transition-all"
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <span className={`${getTypeColor(fb.feedback_type)} px-3 py-1 rounded-full text-sm font-medium border`}>
                          {fb.feedback_type.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(fb.created_at).toLocaleString()}
                        </span>
                      </div>
                      {fb.rating !== null && (
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500 font-medium">{fb.rating}</span>
                          <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                        </div>
                      )}
                    </div>

                    <div className="text-gray-300 whitespace-pre-wrap break-words mb-5 px-1">
                      {fb.message}
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white">Submitted by: {fb.user_id}</span>
                      <motion.button
                        onClick={() => deleteAdminFeedback(fb.id)}
                        className="px-4 py-2 bg-red-900/50 hover:bg-red-900/60 text-red-300 rounded-lg border border-red-800 transition-all flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeedbackDashboard;