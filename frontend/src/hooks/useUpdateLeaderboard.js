import { useState } from 'react';
import axiosClient from '../api/axios';

export const useUpdateLeaderboard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.post('/updateLeaderboard');
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Leaderboard update failed');
      setLoading(false);
    }
  };

  return { updateLeaderboard, loading, error };
};