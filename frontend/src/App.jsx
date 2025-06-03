import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import LeaderBoard from './pages/Leaderboard';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        
        <Route path="/leaderboard" element={
          <ProtectedRoute><LeaderBoard /></ProtectedRoute>
        } />
        
        <Route path="/admin" element={
          <ProtectedRoute><AdminPanel /></ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

export default App;
