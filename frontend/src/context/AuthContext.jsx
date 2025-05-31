import React, { createContext, useContext, useEffect, useState } from 'react';
import { Client, Account } from 'appwrite';
import client from '../appwrite/config';

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const project = import.meta.env.VITE_APPWRITE_PROJECT_ID;

if (!endpoint || !project) {
  throw new Error("Appwrite environment variables are missing");
}

// const client = new Client().setEndpoint(endpoint).setProject(project);
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
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);