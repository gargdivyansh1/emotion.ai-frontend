import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AuthPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [allowMonitoring, setAllowMonitoring] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        setError("");
    }, [isLogin]);

    useEffect(() => {
        if (!password) {
            setPasswordStrength(0);
            return;
        }

        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;

        setPasswordStrength(strength);
    }, [password]);

    const toggleMode = () => {
        setUsername("");
        setEmail("");
        setPassword("");
        setShowPassword(false);
        setAllowMonitoring(false);
        setIsLogin(!isLogin);
    };

    const goBack = () => {
        navigate("/");
    };

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!isLogin && !allowMonitoring) {
            setError("You must give access to real-time monitoring to proceed.");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (!isLogin && passwordStrength < 3) {
            setError("Password is too weak. Please use a stronger password.");
            return;
        }

        setIsLoading(true);

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

                toast.success("Login successful!");
                navigate("/dashboard");
            } else {
                await axios.post(`${API_BASE_URL}/auth/register`, {
                    username,
                    email,
                    password,
                    real_time_monitoring_access: allowMonitoring,
                });

                toast.success("Registration successful! Please login.");
                toggleMode();
            }
        } catch (err: any) {
            console.error("Auth error:", err);
            const errorMessage = err.response?.data?.detail ||
                err.response?.data?.message ||
                "Authentication failed. Please check your info.";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength === 0) return "bg-gray-700";
        if (passwordStrength <= 2) return "bg-red-600";
        if (passwordStrength === 3) return "bg-yellow-500";
        return "bg-green-500";
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4">
            <div className="absolute inset-0 z-0">
                <img 
                    src="src\utils\images\brain-2062057_1920.jpg" 
                    alt="Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/95"></div> 
            </div>
            <button
                    onClick={goBack}
                    className="absolute top-10 left-10 z-30 flex items-center gap-1 text-white hover:text-white"
                    aria-label="Go back to home"
                >
                    <ArrowLeft size={18} />
                    <span className="text-xl hidden sm:inline">Back</span>
                </button>
            <div className="relative w-full max-w-4xl bg-black border border-gray-800">
                <div className="flex flex-col md:flex-row">
                    <div className={`w-full md:w-1/2 bg-gray-900 p-6 sm:p-8`}>
                        <div className="w-full max-w-sm mx-auto">
                            <h2 className="text-2xl font-semibold text-white mb-6">
                                {isLogin ? "Sign In" : "Create Account"}
                            </h2>

                            {error && (
                                <div className="mb-4 p-3 bg-red-900/30 border-l-4 border-red-600">
                                    <p className="text-red-400 text-sm">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {!isLogin && (
                                    <div>
                                        <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                                            Username
                                        </label>
                                        <input
                                            id="username"
                                            type="text"
                                            placeholder="Your name"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-indigo-500 pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {!isLogin && password && (
                                        <div className="mt-2">
                                            <div className="w-full bg-gray-700 h-1">
                                                <div
                                                    className={`h-1 ${getPasswordStrengthColor()}`}
                                                    style={{ width: `${(passwordStrength / 4) * 100}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {passwordStrength === 0 ? "Weak" :
                                                    passwordStrength <= 2 ? "Fair" :
                                                        passwordStrength === 3 ? "Good" : "Strong"}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {!isLogin && (
                                    <div className="flex items-start gap-2">
                                        <input
                                            type="checkbox"
                                            id="monitoring"
                                            checked={allowMonitoring}
                                            onChange={() => setAllowMonitoring(!allowMonitoring)}
                                            className="mt-1 accent-indigo-500"
                                        />
                                        <label htmlFor="monitoring" className="text-xs sm:text-sm text-gray-400">
                                            Allow real-time emotion monitoring
                                        </label>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {isLoading && <Loader2 size={18} className="animate-spin" />}
                                    {isLogin ? "Sign In" : "Create Account"}
                                </button>
                            </form>

                            <div className="mt-4 text-sm text-gray-400 text-center">
                                {isLogin ? (
                                    <>
                                        Don't have an account?{" "}
                                        <button
                                            onClick={toggleMode}
                                            className="text-indigo-400 hover:underline font-medium"
                                            disabled={isLoading}
                                        >
                                            Sign up
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        Already have an account?{" "}
                                        <button
                                            onClick={toggleMode}
                                            className="text-indigo-400 hover:underline font-medium"
                                            disabled={isLoading}
                                        >
                                            Sign in
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:flex w-1/2 bg-gray-800 items-center justify-center p-8">
                        <div className="max-w-xs">
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                {isLogin ? "Welcome Back" : "Get Started"}
                            </h2>
                            <p className="text-gray-400 mb-6">
                                {isLogin
                                    ? "Sign in to access your personalized dashboard."
                                    : "Create an account to unlock all features."}
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 flex items-center justify-center text-indigo-500">
                                        <span>•</span>
                                    </div>
                                    <p className="text-gray-300">Real-time analytics</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 flex items-center justify-center text-indigo-500">
                                        <span>•</span>
                                    </div>
                                    <p className="text-gray-300">Secure and private</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 flex items-center justify-center text-indigo-500">
                                        <span>•</span>
                                    </div>
                                    <p className="text-gray-300">Personalized insights</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;