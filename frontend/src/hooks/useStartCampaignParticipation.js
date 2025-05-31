import { useState } from 'react';
import axiosClient from '../api/axios';

export const useStartCampaignParticipation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const startParticipation = async ({ userId, campaignId, videoId }) => {
    setLoading(true);
    try {
      const response = await axiosClient.post('/startCampaignParticipation', {
        userId,
        campaignId,
        videoId
      });
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to participate');
      setLoading(false);
    }
  };

  return { startParticipation, loading, error };
};