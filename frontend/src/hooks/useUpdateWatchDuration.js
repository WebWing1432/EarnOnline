import { useState } from 'react';
import axiosClient from '../api/axios';

export const useUpdateWatchDuration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateWatch = async (data) => {
    setLoading(true);
    try {
      const response = await axiosClient.post('/updateWatchDuration', data);
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update watch');
      setLoading(false);
    }
  };

  return { updateWatch, loading, error };
};