import React, { createContext, useContext, useEffect, useState } from 'react';
import { Account } from 'appwrite';
import client from '../appwrite/config';

const account = new Account(client);

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUser = async () => {
    try {
      const data = await account.get();
      setUser(data);
    } catch (err) {
      console.error("Failed to fetch user", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const login = async (email, password) => {
    await account.createEmailSession(email, password);
    await getUser();
  };

  const logout = async () => {
    await account.deleteSessions();
    setUser(null);
  };

  const register = async (email, password, name) => {
    await account.create('unique()', email, password, name);
    await account.createEmailSession(email, password);
    await getUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
