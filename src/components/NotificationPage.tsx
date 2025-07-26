import React from 'react';
import { useAuth } from '../context/AuthContext';
import { NotificationList } from './NotificationList';
import { AdminPanel } from './AdminPanel';

const NotificationPage: React.FC = () => {
  const {isAdmin } = useAuth();
  console.log(isAdmin)

  return (
    <div className="p-4 md:p-6 md:ml-64 min-h-screen bg-black text-white space-y-6 md:space-y-8">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      
      {isAdmin && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Admin Panel</h2>
          <AdminPanel />
        </div>
      )}
      
      <h2 className="text-xl font-semibold mb-4">
        {isAdmin ? 'System Notifications' : 'Your Notifications'}
      </h2>
      <NotificationList isAdmin={isAdmin} />
    </div>
  );
};

export default NotificationPage;