export interface EmotionData {
  timestamp: number;
  happy: number;
  sad: number;
  angry: number;
  surprised: number;
  neutral: number;
}

export interface EmotionSession {
  id: string;
  date: Date;
  duration: number;
  emotions: { timestamp: number; [key: string]: number }[];
  averages: {
    happy: number;
    sad: number;
    angry: number;
    surprised: number;
    neutral: number;
  };
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  remainingSessions: number;
  isPremium: boolean;
  sessions: EmotionSession[];
}

export interface EmotionAverages {
  happy: number;
  sad: number;
  angry: number;
  surprised: number;
  neutral: number;
}

export interface EmotionInsight {
  id: string;
  type: 'improvement' | 'warning' | 'suggestion';
  message: string;
  emotion: keyof EmotionAverages;
  createdAt: Date;
}

export interface EmotionDetectorProps {
  onEmotionDetected: (emotions: EmotionData) => void;
  onSessionComplete: (session: EmotionSession) => void;
  isRecording: boolean;
}

export interface PricingTier {
  id: string;
  name: string;
  price: number;
  sessions: number;
  features: string[];
}

import { NotificationStatus, NotificationType } from './api';

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  notification_type: NotificationType;
  status: NotificationStatus;
  is_read: boolean;
  sent_at: Date;
}

export interface NotificationCreate {
  user_id: number;
  title: string;
  message: string;
  notification_type: NotificationType;
  status: NotificationStatus;
}

export interface NotificationForAll {
  title: string;
  message: string;
  notification_type: NotificationType;
  status: NotificationStatus;
}