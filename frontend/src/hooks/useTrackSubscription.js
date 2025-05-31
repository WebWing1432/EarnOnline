import { useState } from 'react';
import axiosClient from '../api/axios';

export const useTrackSubscription = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const track = async (subscriptionData) => {
    setLoading(true);
    try {
      const response = await axiosClient.post('/trackSubscription', subscriptionData);
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to track subscription');
      setLoading(false);
    }
  };

  return { track, loading, error };
};