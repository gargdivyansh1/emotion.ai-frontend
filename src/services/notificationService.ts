import api from '../api';
import { 
  Notification, 
  NotificationCreate, 
  NotificationForAll } from '../types'

export const getNotifications = async (limit = 10) => {
  const response = await api.get<Notification[]>('/notifications', {
    params: {limit}
  });
  console.log(response.data)
  return response.data;
};

export const getNotification = async (id: number) => {
  const response = await api.get<Notification>(`/notifications${id}`);
  return response.data;
};

export const markAsRead = async (id: number) => {
  const response = await api.put<Notification>(`/notifications/${id}/read`);
  return response.data;
};

export const deleteNotification = async (id: number) => {
  await api.delete(`/notifications/${id}/delete`);
};

export const clearAllNotifications = async (
  isAdmin: boolean,
  userId: Number
) => {
  await api.delete('/notifications/clear-all-notifications-user');
};

// Admin endpoints
export const getAdminNotifications = async (skip = 0, limit = 20) => {
  const response = await api.get<Notification[]>('/notifications/admin/get-all', {
    params: { skip, limit }
  });
  return response.data;
};

export const sendToUser = async (data: NotificationCreate) => {
  const response = await api.post<Notification>('/notifications/send-notification-to-user', data);
  return response.data;
};

export const sendToAll = async (data: NotificationForAll) => {
  const response = await api.post('/notifications/send-notification-to-all-users', data);
  return response.data;
};

export const deleteAdminNotification = async (id: number) => {
  await api.delete(`/notifications/admin/${id}`);
};