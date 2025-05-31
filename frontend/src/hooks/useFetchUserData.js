// src/hooks/useFetchUserData.js
import { useState, useEffect } from 'react';
import { account, databases } from '../appwrite/config'; // adjust path if needed

const DATABASE_ID = 'your_database_id';
const USERS_COLLECTION_ID = 'users';

export const useFetchUserData = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await account.get();
        const userId = session.$id;

        const response = await databases.getDocument(
          DATABASE_ID,
          USERS_COLLECTION_ID,
          userId
        );
        setUserData(response);
      } catch (err) {
        setError(err.message || 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { userData, loading, error };
};
