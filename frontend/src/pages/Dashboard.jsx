import React from 'react';
import { useFetchUserData } from '../hooks/useFetchUserData';

const Dashboard = () => {
  const { userData, loading, error } = useFetchUserData();

  if (loading) return <div>Loading user data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🎉 Welcome, {userData.username}</h2>
      <p>Total Watch Time: {userData.totalWatchTime} minutes</p>
      <p>Total Earnings: ₹{userData.totalEarnings}</p>
    </div>
  );
};

export default Dashboard;
