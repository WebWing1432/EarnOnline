import React from 'react';
import { useFetchLeaderboard } from '../hooks/useFetchLeaderboard';

const Leaderboard = () => {
  const { leaderboard, loading, error } = useFetchLeaderboard();

  if (loading) return <div>Loading leaderboard...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {leaderboard.map((user, index) => (
        <li key={user.$id}>
          #{index + 1} - {user.username}: ₹{user.totalEarnings}
        </li>
      ))}
    </ul>
  );
};

export default Leaderboard