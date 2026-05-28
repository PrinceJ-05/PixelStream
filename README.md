# PrimeVault

PrimeVault is a cinematic MERN stack web application simulating an Amazon Prime Video Subscription & Watchlist Management System.

## Features
- **Cinematic Dark Theme**: Premium aesthetic using Deep Navy, Electric Blue, and Gold highlights with glassmorphism UI elements.
- **Subscription Management**: Choose from Mini, Family, and Ultra plans. Expired subscriptions glow red and prompt for renewal.
- **Watchlist Tracking**: Add your favorite movies. Each plan enforces a strict limit on the number of movies you can keep in your watchlist.
- **Responsive Layout**: Works beautifully across all screen sizes.

## Tech Stack
- **Frontend**: React (Vite)
- **Backend**: Node.js, Express
- **Database**: MongoDB (Mongoose)

## Setup Instructions

1. **Prerequisites**: Ensure you have Node.js and MongoDB installed on your system.
2. **Environment Variables**: Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/primevault
   ```
3. **Backend Setup**:
   ```bash
   cd server
   npm install
   npm run start
   ```
4. **Frontend Setup**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

## API Endpoints
- `GET /api/state` - Fetch current user subscription and watchlist state.
- `POST /api/subscribe` - Subscribe to a new plan.
- `POST /api/watchlist/add` - Add a movie (enforces plan limit).
- `PUT /api/subscription/renew` - Renew an expired subscription.
