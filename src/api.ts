import axios from "axios";

export enum NotificationStatus {
  SENT = "sent",
  PENDING = "pending",
  FAILED = "failed",
  READ = "read",
  URGENT = "urgent"
}

export enum NotificationType {
  EMOTION_REPORT = "Emotion Report",
  INFORMATIVE = "Informative",
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export default api;
