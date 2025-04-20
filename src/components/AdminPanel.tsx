import { useState, useEffect } from 'react';
import { Notification } from '../types';
import { getAdminNotifications, sendToAll, deleteAdminNotification } from '../services/notificationService';
import { NotificationType, NotificationStatus } from '../api';

export const AdminPanel = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    notification_type: NotificationType.INFORMATIVE,
    status: NotificationStatus.PENDING
  });

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getAdminNotifications();
      setNotifications(data);
    } catch (err) {
      setError('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleSendToAll = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendToAll(formData);
      alert('Notification sent to all users');
      setFormData({
        title: '',
        message: '',
        notification_type: NotificationType.INFORMATIVE,
        status: NotificationStatus.PENDING
      });
      fetchNotifications();
    } catch (err) {
      alert('Failed to send notification');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      await deleteAdminNotification(id);
      fetchNotifications();
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Send Notification to All Users</h2>
        </div>
        <form onSubmit={handleSendToAll} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                value={formData.notification_type}
                onChange={(e) => setFormData({...formData, notification_type: e.target.value as NotificationType})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              >
                {Object.values(NotificationType).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as NotificationStatus})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              >
                {Object.values(NotificationStatus).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Send to All Users
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Recent Notifications</h2>
        </div>
        {loading ? (
          <div className="p-4">Loading...</div>
        ) : error ? (
          <div className="p-4 text-red-500">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-gray-500">No notifications found</div>
        ) : (
          <div className="divide-y">
            {notifications.map(notification => (
              <div key={notification.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{notification.title}</h3>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    <div className="mt-1 text-xs text-gray-400">
                      {new Date(notification.sent_at).toLocaleString()}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(notification.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};