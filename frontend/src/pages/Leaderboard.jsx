import React from 'react';
import { useFetchLeaderboard } from '../hooks/useFetchLeaderboard';

const LeaderBoard = () => {
  const { leaderboard, loading, error } = useFetchLeaderboard();

  if (loading) return <div>Loading leaderboard...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🏆 Leaderboard</h2>
      <ol>
        {leaderboard.map((user, index) => (
          <li key={user.$id}>
            #{index + 1} - {user.username}: ₹{user.totalEarnings}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default LeaderBoard;
