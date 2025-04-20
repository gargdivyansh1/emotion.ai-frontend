import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const AuthPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [allowMonitoring, setAllowMonitoring] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const toggleMode = () => {
        setError("");
        setUsername("");
        setEmail("");
        setPassword("");
        setAllowMonitoring(false);
        setIsLogin(!isLogin);
    };

    const goBack = () => {
        navigate("/");
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isLogin && !allowMonitoring) {
            setError("You must give access to real-time monitoring to proceed.");
            return;
        }

        try {
            if (isLogin) {
                const formData = new URLSearchParams();
                formData.append("username", email);
                formData.append("password", password);

                const res = await axios.post(`${API_BASE_URL}/auth/login`, formData, {
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                });

                localStorage.setItem("token", res.data.access_token);
                localStorage.setItem("user_role", res.data.role);
                localStorage.setItem("user_id", res.data.user_id);
                localStorage.setItem("is_verified", res.data.is_verified);
                navigate("/dashboard");
            } else {
                await axios.post(`${API_BASE_URL}/auth/register`, {
                    username,
                    email,
                    password,
                    real_time_monitoring_access: allowMonitoring,
                });
                toggleMode();
            }
        } catch (err: any) {
            if (err.response?.data?.detail) {
                setError(err.response.data.detail);
            } else {
                setError("Authentication failed. Please check your info.");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black px-4">
            <div className="relative flex w-full max-w-5xl h-[600px] bg-gray-900 shadow-2xl rounded-2xl overflow-hidden">
                <button
                    onClick={goBack}
                    className="absolute top-4 left-4 z-30 flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span className="text-sm">Back to Home</span>
                </button>
                <motion.div
                    className="absolute top-0 h-full w-full md:w-1/2 bg-gray-900 text-white z-20 flex items-center justify-center px-6 md:px-14"
                    animate={{ x: isLogin ? "0%" : "100%" }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                    <div className="w-full max-w-md">
                        <h2 className="text-3xl font-bold text-indigo-400 mb-6">
                            {isLogin ? "Login to Your Account" : "Create an Account"}
                        </h2>
                        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                                    <input
                                        type="text"
                                        placeholder="Your name"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {!isLogin && (
                                <div className="flex items-center gap-2 mt-1">
                                    <input
                                        type="checkbox"
                                        id="monitoring"
                                        checked={allowMonitoring}
                                        onChange={() => setAllowMonitoring(!allowMonitoring)}
                                        className="accent-indigo-600 w-4 h-4"
                                    />
                                    <label htmlFor="monitoring" className="text-sm text-gray-300">
                                        Give access to real-time monitoring <span className="text-red-500">*</span>
                                    </label>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-indigo-600 hover:bg-indigo-700 transition duration-300 text-white font-semibold py-2 px-4 rounded-lg"
                            >
                                {isLogin ? "Login" : "Register"}
                            </button>
                        </form>

                        <p className="mt-6 text-sm text-gray-400 text-center">
                            {isLogin ? (
                                <>
                                    Don’t have an account?{" "}
                                    <button onClick={toggleMode} className="text-indigo-400 hover:underline font-medium">
                                        Register here
                                    </button>
                                </>
                            ) : (
                                <>
                                    Already have an account?{" "}
                                    <button onClick={toggleMode} className="text-indigo-400 hover:underline font-medium">
                                        Login here
                                    </button>
                                </>
                            )}
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    className="absolute top-0 h-full w-full md:w-1/2 bg-gradient-to-br from-indigo-800 to-indigo-900 text-white hidden md:flex items-center justify-center p-10 z-10"
                    animate={{ x: isLogin ? "100%" : "0%" }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-extrabold leading-tight">
                            {isLogin ? "Welcome Back!" : "Welcome to EmotionAI"}
                        </h2>
                        <p className="text-lg opacity-90">
                            {isLogin
                                ? "Log in to monitor and grow with EmotionAI insights."
                                : "Unlock your emotional intelligence with powerful AI analytics."}
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AuthPage;