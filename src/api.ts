import axios from "axios";

export enum NotificationStatus {
    SENT = "sent",
    PENDING = "pending",
    FAILED = "failed",
    READ = 'read',
    URGENT = 'urgent'
  }
  
  export enum NotificationType {
    EMOTION_REPORT = "Emotion Report",
    INFORMATIVE = "Informative",
    URGENT = "urgent"
  }
  
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
    withCredentials: true,
  });
  
  // Add request interceptor for auth token
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  
  export default api;
  