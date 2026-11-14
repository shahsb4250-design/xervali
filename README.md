# XERVALI Store

A full‑stack luxury e‑commerce application built with **React (Vite, Tailwind CSS)** for the frontend and **Node.js/Express** for the backend.

## ✨ Features
- **Official Google OAuth 2.0**: Real cryptographic Google Identity Services sign-in with token verification via Google's OAuth2 endpoints & `google-auth-library`.
- **Role-Based Access Control**: Store owner admin privilege automatically assigned to `syedismail12570@gmail.com`.
- **Password Security**: Strong bcrypt salt-hashing with protection against rainbow table attacks.
- **Brute-Force Rate Limiting**: Anti brute-force protection with in-memory TTL cleanup preventing memory leaks.
- **Real-Time Admin Notifications**: WebSockets & polling for instant new-order alerts and status updates.
- **Production-Ready**: Configured for Vercel (frontend), Render/Railway (backend), and MongoDB Atlas.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
# In server directory
cd server
npm install

# In client directory
cd ../client
npm install
```

### 2. Configure Real Google Authentication (Optional for standard login, required for Google sign-in)
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Create an **OAuth 2.0 Client ID** with Application type **Web application**.
3. Under **Authorized JavaScript origins**, add:
   - `http://localhost:3000`
   - Your production URL (e.g. `https://your-domain.vercel.app`)
4. Copy your Client ID (format: `xxxx.apps.googleusercontent.com`).
5. Add it to your `.env` files:
   - `client/.env`: `VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com`
   - `server/.env`: `GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com`
*(Note: You can also paste your Google Client ID directly into the frontend config popup in the browser!)*

### 3. Run Locally
```bash
# Terminal 1 - Backend API
cd server
npm start    # Runs on http://localhost:5000

# Terminal 2 - Frontend Client
cd client
npm run dev  # Runs on http://localhost:3000
```

### 4. Admin Credentials
- **Admin Email**: `syedismail12570@gmail.com`
- **Admin Password**: `Knightrider1@`
- *(Or sign in with the real Google account matching `syedismail12570@gmail.com`)*

---

## 🌐 Deploying
- **Frontend**: Connect the `client/` folder to Vercel. Set `VITE_GOOGLE_CLIENT_ID`.
- **Backend**: Deploy `server/` to Render or Railway. Set `GOOGLE_CLIENT_ID` and `JWT_SECRET`.
- **Database**: Add MongoDB Atlas connection string when transitioning from local file db to cloud.

## 📄 License
MIT License
