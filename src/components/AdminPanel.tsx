import { useState} from 'react';
import { sendToAll} from '../services/notificationService';
import { NotificationType, NotificationStatus } from '../api';

export const AdminPanel = () => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    notification_type: NotificationType.INFORMATIVE,
    status: NotificationStatus.PENDING
  });

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
    } catch (err) {
      alert('Failed to send notification');
    }
  };

  return (
    <div className="space-y-6 bg-black p-6 text-white">
      <div className="bg-gray-900 rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Send Notification to All Users</h2>
        </div>
        <form onSubmit={handleSendToAll} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 text-white shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 text-white shadow-sm p-2"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Type</label>
              <select
                value={formData.notification_type}
                onChange={(e) => setFormData({ ...formData, notification_type: e.target.value as NotificationType })}
                className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 text-white shadow-sm p-2"
              >
                {Object.values(NotificationType).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as NotificationStatus })}
                className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 text-white shadow-sm p-2"
              >
                {Object.values(NotificationStatus).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Send to All Users
          </button>
        </form>
      </div>
    </div>
  );
};
