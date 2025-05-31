import { useState } from 'react';
import axiosClient from '../api/axios';

export const useCreditReward = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const credit = async (rewardData) => {
    setLoading(true);
    try {
      const response = await axiosClient.post('/creditReward', rewardData);
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to credit reward');
      setLoading(false);
    }
  };

  return { credit, loading, error };
};