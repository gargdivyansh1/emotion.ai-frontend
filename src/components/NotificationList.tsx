import { useState, useEffect } from 'react';
import { Notification } from '../types';
import { 
  clearAllNotifications, 
  getNotifications,
  markAsRead,
  deleteNotification
} from '../services/notificationService';
import { useAuth } from '../context/AuthContext';
import { NotificationStatus, NotificationType } from '../api';

interface NotificationListProps {
  isAdmin: boolean;
}

const Button = ({ 
  variant = 'default', 
  size = 'md', 
  onClick, 
  className = '', 
  children,
  disabled = false
}: {
  variant?: 'default' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}) => {
  const baseStyles = 'rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variantStyles = {
    default: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 focus:ring-blue-500 shadow-sm',
    ghost: 'bg-transparent text-gray-300 hover:bg-gray-800 focus:ring-gray-500 border border-gray-600',
    danger: 'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700 focus:ring-red-500 shadow-sm',
    success: 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 focus:ring-green-500 shadow-sm',
  };
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-2.5 text-base',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  );
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-8">
    <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-700 border-t-blue-600"></div>
  </div>
);

const NotificationItem = ({
  notification,
  onMarkAsRead,
  onDelete,
  isAdmin
}: {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
  isAdmin: boolean;
}) => {
  const isRead = notification.is_read === true;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`p-5 transition-colors ${isRead ? 'bg-gray-800' : 'bg-gray-700 hover:bg-gray-600'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={`font-medium ${isRead ? 'text-gray-400' : 'text-white'}`}>
              {notification.title}
            </h3>
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              notification.notification_type === NotificationType.INFORMATIVE
                ? 'bg-red-100 text-red-900'
                : 'bg-blue-900 text-blue-300'
            }`}>
              {notification.notification_type}
            </span>
            {!isRead && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-800 text-blue-200">
                New
              </span>
            )}
          </div>
          <p className={`mt-1 text-sm ${isRead ? 'text-gray-500' : 'text-gray-300'}`}>
            {notification.message}
          </p>
          <div className="mt-2 flex items-center text-xs text-gray-500">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            {new Date(notification.sent_at).toLocaleString()}
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-2">
          {(!isRead || isHovered) && (
            <Button
              variant={isRead ? 'ghost' : 'success'}
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead(notification.id);
              }}
              className="min-w-[100px]"
            >
              {isRead ? 'Read ✓' : 'Mark as Read'}
            </Button>
          )}
          
          {(isAdmin || isHovered) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(notification.id);
              }}
              className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-900/50 transition-colors"
              aria-label="Delete notification"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const NotificationList = ({ isAdmin }: NotificationListProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchNotifications();
  }, [markAsRead, deleteNotification, NotificationItem]);
  
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError('');
      if (!user) return;

      const data = await getNotifications();
      const sorted = data.sort((a, b) => {
        if (a.status !== b.status) {
          return a.status === NotificationStatus.READ ? 1 : -1;
        }
        return new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime();
      });
      setNotifications(sorted);
    } catch (err) {
      setError('Failed to fetch notifications');
      console.error('Notification fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead(id);
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, status: NotificationStatus.READ } : n
      ));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNotification(id);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (err) {
      console.error('Failed to delete notification:', err);
      setError('Failed to delete notification');
    }
  };

  const handleClearAll = async () => {
    if (!user) return;
    if (window.confirm('Clear all notifications? This cannot be undone.')) {
      try {
        await clearAllNotifications();
        setNotifications([]);
      } catch (err) {
        setError('Failed to clear notifications');
        console.error('Clear notifications error:', err);
      }
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [isAdmin, user]);

  if (loading) return <LoadingSpinner />;

  if (error) return (
    <div className="bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="flex items-start gap-3 text-red-400">
        <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        <div>
          <h3 className="font-medium">Error loading notifications</h3>
          <p className="text-sm text-red-300 mt-1">{error}</p>
          <Button variant="default" size="sm" onClick={fetchNotifications} className="mt-3">
            Retry
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-900 text-white rounded-xl shadow-sm border border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-700 bg-gray-800">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">
              {isAdmin ? 'System Notifications' : 'Your Notifications'}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {notifications.length} {notifications.length === 1 ? 'notification' : 'notifications'}
              {notifications.some(n => n.status !== NotificationStatus.READ) && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-300">
                  {notifications.filter(n => n.status !== NotificationStatus.READ).length} new
                </span>
              )}
            </p>
          </div>
          {notifications.length > 0 && (
            <Button variant="danger" size="sm" onClick={handleClearAll}>
              Clear All
            </Button>
          )}
        </div>
      </div>

      <div className="divide-y divide-gray-800">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-200">No notifications</h3>
            <p className="mt-1 text-sm text-gray-500">
              {isAdmin ? 'No system notifications have been sent yet.' : 'You have no notifications at this time.'}
            </p>
          </div>
        ) : (
          notifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
              isAdmin={isAdmin}
            />
          ))
        )}
      </div>
    </div>
  );
};