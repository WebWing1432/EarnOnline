// src/appwrite/config.js

import { Client, Account, Databases, Functions, Avatars, Query } from 'appwrite';

const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

// Export all required Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const functions = new Functions(client);
export const avatars = new Avatars(client);
export const query = new Query(client);

export default client;
