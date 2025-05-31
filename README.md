# YW-App – YouTube Watch & Earn

A full-stack platform where users can watch YouTube videos or subscribe to channels to earn small rewards. Built using React, MUI, and Appwrite for modern, scalable deployments.

## 🚀 Features
- User Authentication via Appwrite
- Watch Time Tracker
- Channel Subscription Proof
- Daily Earnings Tracker
- Withdrawal System
- Admin Reward Management

## 📦 Tech Stack
- Frontend: React (Vite), MUI
- Backend: Appwrite Functions (Node.js)
- Database: Appwrite Databases
- Authentication: Appwrite Auth (Email/OTP)

## 📁 Project Structure
- `/frontend`: React frontend
- `/backend`: Appwrite cloud functions
- `/docs`: Project documentation

## 🛠️ Local Setup
```bash
npm install -g appwrite-cli
appwrite init project
appwrite deploy function --all
cd frontend && npm install && npm run dev
