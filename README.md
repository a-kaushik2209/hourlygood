# HourlyGood: Skill Sharing Platform

## Overview
HourlyGood is a peer-to-peer skill sharing platform that connects people who want to learn with those who can teach. Users can request lessons, browse available skills, and coordinate through real-time chat.

Key features:
- User authentication and profiles
- Skill marketplace for browsing available lessons
- Skill request system for requesting specific lessons
- Real-time chat with typing indicators and read receipts
- Time credit system for tracking lesson hours

## Tech Stack
- **Frontend**: React (create-react-app)
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Real-time Chat**: Socket.io with Express server
- **Styling**: CSS with inline styles

## How to Run

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### Installation

1. Install frontend dependencies:
```bash
npm install
```

2. Install server dependencies:
```bash
npm install -g firebase-tools
npm install express socket.io cors firebase-admin
```

3. Set up Firebase:
   - Create a Firebase project at https://console.firebase.google.com/
   - Enable Authentication, Firestore, and Storage
   - Add your Firebase config to `src/firebase.js`
   - Generate a service account key and save it as `serviceAccountKey.json` in the root directory

### Running the Application

#### Development Mode
Run both the React frontend and Socket.io server concurrently:
```bash
npm run dev
```

Or run them separately:
```bash
# Terminal 1 - React frontend
npm start

# Terminal 2 - Socket.io server
npm run server
```

#### Production Mode
1. Build the React app:
```bash
npm run build
```

2. Start the server which will serve the built React app:
```bash
npm run server
```

## Deployment
The application is ready for deployment to platforms like Netlify, Vercel, or Firebase Hosting. For the Socket.io server, you can deploy to services like Heroku, Railway, or DigitalOcean.

## Features
- **Authentication**: Sign up, login, and profile management
- **Skill Marketplace**: Browse and filter available skills
- **Skill Requests**: Request lessons for specific skills
- **Real-time Chat**: Communicate with tutors/students with typing indicators and read receipts
- **Time Credits**: Track and manage lesson hours
- **Responsive Design**: Works on desktop and mobile devices

## Future Enhancements
- Video calling integration
- Payment processing
- Rating and review system
- Advanced search and filtering
- Mobile app versions
