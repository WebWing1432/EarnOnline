import React from 'react';
import { useFetchUserData } from '../hooks/useFetchUserData';

const Dashboard = () => {
  const { userData, loading, error } = useFetchUserData();

  if (loading) return <div>Loading user data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Welcome {userData.username}</h2>
      <p>Total Watch Time: {userData.totalWatchTime} minutes</p>
    </div>
  );
};

export default Dashboard