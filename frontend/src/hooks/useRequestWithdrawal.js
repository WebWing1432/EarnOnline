import { useState } from 'react';
import axiosClient from '../api/axios';

export const useRequestWithdrawal = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async (withdrawalData) => {
    setLoading(true);
    try {
      const response = await axiosClient.post('/requestWithdrawal', withdrawalData);
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Withdrawal failed');
      setLoading(false);
    }
  };

  return { request, loading, error };
};