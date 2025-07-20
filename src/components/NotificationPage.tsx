import React from 'react';
import { useAuth } from '../context/AuthContext';
import { NotificationList } from './NotificationList';
import { AdminPanel } from './AdminPanel';

const NotificationPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  console.log(isAdmin)

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      
      {/* Admin-specific content */}
      {isAdmin && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Admin Panel</h2>
          <AdminPanel />
        </div>
      )}
      
      {/* Notifications for all users */}
      <h2 className="text-xl font-semibold mb-4">
        {isAdmin ? 'System Notifications' : 'Your Notifications'}
      </h2>
      <NotificationList isAdmin={isAdmin} />
    </div>
  );
};

export default NotificationPage;