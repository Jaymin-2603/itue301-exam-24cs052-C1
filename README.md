# 🏋️ FitZone — Gym & Class Booking System

**ITUE301: Advanced Web Development Frameworks**
**SET B | CSPIT, CHARUSAT | AY 2026-27**

## Tech Stack
- **Frontend:** React (Vite) + React Router
- **Backend:** Express.js + Node.js
- **Database:** MongoDB + Mongoose

---

## Project Structure
```
FitZone/
├── frontend/     ← React Vite app
├── backend/      ← Express.js API
└── README.md
```

---

## ⚙️ Backend Setup

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Set up environment variables
```bash
# Copy the example file
cp .env.example .env

# Edit .env and fill in your values:
# MONGO_URI=your_mongodb_atlas_connection_string
# PORT=5000
# JWT_SECRET=any_random_long_string
```

### 3. Seed the database (run once)
```bash
node seed.js
```
This creates 4 sample trainers and 1 test member:
- **Email:** test@fitzone.com
- **Password:** password123

### 4. Start the server
```bash
node server.js
# OR
npm start
```
Server runs at: http://localhost:5000

---

## 🎨 Frontend Setup

### 1. Install dependencies
```bash
cd frontend
npm install
```

### 2. Start the dev server
```bash
npm run dev
```
App runs at: http://localhost:5173

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/v1/auth/login | ❌ | Login, get JWT token |
| GET | /api/v1/trainers | ❌ | Get all trainers |
| POST | /api/v1/bookings | ✅ | Create booking |
| GET | /api/v1/bookings/my | ✅ | My bookings (populated) |
| PATCH | /api/v1/bookings/:id/status | ✅ | Update booking status |

---

## 🧪 Test Login
```
Email:    test@fitzone.com
Password: password123
```

---

## ✅ Tasks Completed
- **Task 1:** React Component Architecture (LoginPage, ClassesPage, MyBookingsPage, TrainerCard)
- **Task 2:** Routing + AuthContext + ProtectedRoute + AdminPanel (lazy)
- **Task 3:** Express REST API + requestLogger + authGuard + errorHandler
- **Task 4:** API consumption with loading/error states + client-side search
- **Task 5:** MongoDB + Mongoose schemas with validation + populate
