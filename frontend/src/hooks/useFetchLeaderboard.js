// src/hooks/useFetchLeaderboard.js
import { useState, useEffect } from 'react';
import { databases, query } from '../appwrite/config'; // adjust path

const DATABASE_ID = 'your_database_id';
const EARNINGS_COLLECTION_ID = 'earnings';

export const useFetchLeaderboard = (limit = 10) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          EARNINGS_COLLECTION_ID,
          [
            query.orderDesc('totalEarnings'),
            query.limit(limit)
          ]
        );
        setLeaderboard(response.documents);
      } catch (err) {
        setError(err.message || 'Failed to fetch leaderboard');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [limit]);

  return { leaderboard, loading, error };
};
