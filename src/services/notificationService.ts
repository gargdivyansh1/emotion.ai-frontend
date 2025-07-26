import api from '../api';
import { 
  Notification, 
  NotificationCreate, 
  NotificationForAll } from '../types'

// correct --
export const getNotifications = async (limit = 10) => {
  const token = localStorage.getItem('token'); 

  const response = await api.get<Notification[]>('/notifications/', {
    params: { limit },
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

// correct 
export const getNotification = async (id: number) => {
  const token = localStorage.getItem('token');

  const response = await api.get<Notification>(`/notifications/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

// correct
export const markAsRead = async (id: number): Promise<Notification> => {
  const token = localStorage.getItem('token');
  
  const response = await api.put<Notification>(
    `/notifications/${id}/read`, 
    {}, 
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  return response.data;
};

// correct 
export const deleteNotification = async (id: number): Promise<void> => {
  const token = localStorage.getItem('token');
  
  await api.delete(`/notifications/${id}/delete`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });
};

// correct --
export const clearAllNotifications = async () => {
  const token = localStorage.getItem('token');
  
  const response = await api.delete('/notifications/clear', {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });
  
  return response.data;
};

// Admin endpoints
export const getAdminNotifications = async (skip = 0, limit = 20) => {
  const token = localStorage.getItem('token');

  const response = await api.get<Notification[]>('/notifications/admin/get-all', {
    params: { skip, limit },
    headers: {
      Authorization: `Bearer ${token}` 
    }
  });

  return response.data;
};

// correct --
export const sendToAll = async (data: NotificationForAll): Promise<{ message: string }> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await api.post<{ message: string }>(
      '/notifications/admin/broadcast',
      {
        title: data.title,
        message: data.message,
        notification_type: data.notification_type,
        status: data.status 
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error sending notification to all users:', error);
    throw error;
  }
};

export const sendToUser = async (data: NotificationCreate) => {
  const response = await api.post<Notification>('/notifications/send-notification-to-user', data);
  return response.data;
};

export const deleteAdminNotification = async (id: number) => {
  await api.delete(`/notifications/admin/${id}`);
};