import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});

const FeedbackDashboard = () => {
    const [tab, setTab] = useState("submit");
    const [feedbackType, setFeedbackType] = useState("bug");
    const [message, setMessage] = useState("");
    const [rating, setRating] = useState<number | null>(null);
    const [success, setSuccess] = useState("");

    const [userFeedback, setUserFeedback] = useState([]);
    const [allFeedback, setAllFeedback] = useState([]);
    const [adminTypeFilter, setAdminTypeFilter] = useState("");
    const [adminSort, setAdminSort] = useState("date");

    useEffect(() => {
        if (tab === "my") {
            axiosInstance.get("/feedback/my-feedback")
                .then((res) => setUserFeedback(res.data))
                .catch((err) => console.error("My feedback error:", err.response?.data || err.message));
        }
        if (tab === "admin") {
            fetchAdminFeedback();
        }
    }, [tab, adminTypeFilter, adminSort]);

    const fetchAdminFeedback = () => {
        axiosInstance
            .get("/feedback", {
                params: {
                    feedback_type: adminTypeFilter || undefined,
                    sort_by: adminSort,
                    limit: 50,
                },
            })
            .then((res) => setAllFeedback(res.data))
            .catch((err) => console.error("Admin feedback fetch error:", err.response?.data || err.message));
    };

    const submitFeedback = async () => {
        try {
            await axiosInstance.post("/feedback", {
                feedback_type: feedbackType,
                message,
                rating,
            });
            setSuccess("Feedback submitted successfully!");
            setMessage("");
            setRating(null);
            setTimeout(() => setSuccess(""), 3000);
        } catch (err: any) {
            console.error("Submit feedback error:", err.response?.data || err.message);
        }
    };

    const deleteUserFeedback = async (id: number) => {
        try {
            await axiosInstance.delete(`/feedback/delete-feedback-user/${id}`);
            setUserFeedback(userFeedback.filter((f: any) => f.id !== id));
        } catch (err: any) {
            console.error("Delete user feedback error:", err.response?.data || err.message);
        }
    };

    const deleteAdminFeedback = async (id: number) => {
        try {
            await axiosInstance.delete(`/feedback/delete-feedback-admin/${id}`);
            fetchAdminFeedback();
        } catch (err: any) {
            console.error("Delete admin feedback error:", err.response?.data || err.message);
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
        <div className="text-gray-200 p-4 md:p-6 max-w-4xl mx-auto bg-[#090909] min-h-screen">
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 md:space-x-4 mb-6">
                <button
                    onClick={() => setTab("submit")}
                    className={`px-4 py-2 rounded-lg transition-all ${tab === "submit" ? "bg-indigo-900/80 border border-indigo-700 text-indigo-200" : "bg-[#111111] hover:bg-[#1a1a1a] border border-[#222222] text-gray-300"}`}
                >
                    Submit
                </button>
                <button
                    onClick={() => setTab("my")}
                    className={`px-4 py-2 rounded-lg transition-all ${tab === "my" ? "bg-indigo-900/80 border border-indigo-700 text-indigo-200" : "bg-[#111111] hover:bg-[#1a1a1a] border border-[#222222] text-gray-300"}`}
                >
                    My Feedback
                </button>
                <button
                    onClick={() => setTab("admin")}
                    className={`px-4 py-2 rounded-lg transition-all ${tab === "admin" ? "bg-indigo-900/80 border border-indigo-700 text-indigo-200" : "bg-[#111111] hover:bg-[#1a1a1a] border border-[#222222] text-gray-300"}`}
                >
                    Admin View
                </button>
            </div>

            {/* Submit Feedback Tab */}
            {tab === "submit" && (
                <div className="bg-[#0e0e0e] p-4 md:p-6 rounded-xl shadow-lg border border-[#222222]">
                    <h2 className="text-xl md:text-2xl font-bold mb-4 text-indigo-300">Submit Feedback</h2>
                    <select
                        value={feedbackType}
                        onChange={(e) => setFeedbackType(e.target.value)}
                        className="mb-3 w-full p-3 bg-[#111111] rounded-lg border border-[#252525] focus:border-indigo-600 focus:ring-1 focus:ring-indigo-900 outline-none text-gray-300"
                    >
                        <option value="bug">Bug Report</option>
                        <option value="feature_request">Feature Request</option>
                        <option value="suggestion">Suggestion</option>
                    </select>
                    <textarea
                        className="w-full p-3 bg-[#111111] rounded-lg border border-[#252525] focus:border-indigo-600 focus:ring-1 focus:ring-indigo-900 outline-none mb-3 text-gray-300 placeholder-gray-500"
                        rows={8}
                        placeholder="Describe your feedback in detail..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <div className="flex items-center mb-4">
                        <label className="mr-3 text-gray-400">Rating:</label>
                        <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(rating === star ? null : star)}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${rating && rating >= star ? "bg-yellow-600/80 text-black" : "bg-[#111111] text-gray-500 border border-[#252525] hover:border-yellow-600"}`}
                                >
                                    {star}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={submitFeedback}
                        className="w-full bg-indigo-900/80 hover:bg-indigo-800/80 py-3 rounded-lg border border-indigo-800 transition-all font-medium text-lg flex items-center justify-center gap-2 text-indigo-200"
                    >
                        Submit Feedback
                    </button>
                    {success && (
                        <div className="mt-3 p-3 bg-green-900/30 border border-green-800/50 rounded-lg text-green-300">
                            {success}
                        </div>
                    )}
                </div>
            )}

            {/* My Feedback Tab */}
            {tab === "my" && (
                <div className="space-y-6">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-indigo-300">My Feedback</h2>

                    {userFeedback.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-600 text-lg mb-4">You haven't submitted any feedback yet</div>
                            <button
                                onClick={() => setTab("submit")}
                                className="px-6 py-2 bg-indigo-900/80 hover:bg-indigo-800/80 rounded-lg border border-indigo-800 transition-all text-indigo-200"
                            >
                                Submit Your First Feedback
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {userFeedback.map((item: any) => (
                                <div
                                    key={item.id}
                                    className="bg-[#0e0e0e] p-5 rounded-xl shadow-lg border border-[#222222] hover:border-indigo-700/30 transition-all group"
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
                                                <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-gray-300 whitespace-pre-wrap break-words mb-5 px-1">
                                        {item.message}
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => deleteUserFeedback(item.id)}
                                            className="px-4 py-2 bg-red-900/50 hover:bg-red-900/60 text-red-300 rounded-lg border border-red-800 transition-all flex items-center gap-2 group-hover:border-red-500"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Admin View Tab */}
            {tab === "admin" && (
                <div className="space-y-6">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-indigo-300">All Feedback</h2>

                    <div className="flex flex-col sm:flex-row gap-3 mb-6">
                        <select
                            value={adminTypeFilter}
                            onChange={(e) => setAdminTypeFilter(e.target.value)}
                            className="flex-1 bg-[#111111] text-gray-300 p-2 rounded-lg border border-[#252525] focus:border-indigo-600 focus:ring-1 focus:ring-indigo-900 outline-none"
                        >
                            <option value="">All Types</option>
                            <option value="bug">Bug Reports</option>
                            <option value="feature_request">Feature Requests</option>
                            <option value="suggestion">Suggestions</option>
                        </select>

                        <select
                            value={adminSort}
                            onChange={(e) => setAdminSort(e.target.value)}
                            className="flex-1 bg-[#111111] text-gray-300 p-2 rounded-lg border border-[#252525] focus:border-indigo-600 focus:ring-1 focus:ring-indigo-900 outline-none"
                        >
                            <option value="date">Sort by Date</option>
                            <option value="rating">Sort by Rating</option>
                        </select>
                    </div>

                    {allFeedback.length === 0 ? (
                        <div className="text-center py-12 text-gray-600 text-lg">
                            No feedback matches your filters
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {allFeedback.map((fb: any) => (
                                <div
                                    key={fb.id}
                                    className="bg-[#0e0e0e] p-5 rounded-xl shadow-lg border border-[#222222] hover:border-indigo-700/30 transition-all"
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
                                                <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-gray-300 whitespace-pre-wrap break-words mb-5 px-1">
                                        {fb.message}
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500">Submitted by: {fb.user_id}</span>
                                        <button
                                            onClick={() => deleteAdminFeedback(fb.id)}
                                            className="px-4 py-2 bg-red-900/50 hover:bg-red-900/60 text-red-300 rounded-lg border border-red-800 transition-all flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FeedbackDashboard;