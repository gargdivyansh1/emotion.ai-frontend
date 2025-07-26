import { useState, useEffect } from 'react';

export const useNotifications = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const offset = (pagination.page - 1) * pagination.limit;
      const data = await getNotifications(offset, pagination.limit);
      setNotifications(data);
      // If your backend returns total count (recommended)
      // setPagination(prev => ({...prev, total: data.total}));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchNotifications();
  }, [userId, pagination.page, pagination.limit]);

  return {
    notifications,
    pagination,
    loading,
    setPage: (page) => setPagination(prev => ({...prev, page})),
    refetch: fetchNotifications
  };
};