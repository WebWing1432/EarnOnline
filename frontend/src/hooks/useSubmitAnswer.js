import { useState } from 'react';
import axiosClient from '../api/axios';

export const useSubmitAnswer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (answerData) => {
    setLoading(true);
    try {
      const response = await axiosClient.post('/submitAnswer', answerData);
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit answer');
      setLoading(false);
    }
  };

  return { submit, loading, error };
};