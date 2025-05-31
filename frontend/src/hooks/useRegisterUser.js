import { useState } from 'react';
import axiosClient from '../api/axios';

export const useRegisterUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const registerUser = async (userData) => {
    setLoading(true);
    try {
      const response = await axiosClient.post('/registerUser', userData);
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      setLoading(false);
    }
  };

  return { registerUser, loading, error };
};