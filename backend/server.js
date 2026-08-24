// server.js — Main Express server entry point
// Start with: node server.js  OR  npm start

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // load .env variables

// Import custom middleware
const requestLogger = require("./middleware/requestLogger");
const errorHandler = require("./middleware/errorHandler");

// Import routes
const authRoutes = require("./routes/auth");
const trainerRoutes = require("./routes/trainers");
const bookingRoutes = require("./routes/bookings");

const app = express();

// ── Global Middleware ──────────────────────────────────────────
app.use(cors()); // allow React frontend to call this API
app.use(express.json()); // parse JSON request bodies
app.use(requestLogger); // log every request (applied globally)

// ── Routes ────────────────────────────────────────────────────
// auth/login is public — no authGuard here
app.use("/api/v1/auth", authRoutes);

// trainers is public — anyone can see the list
app.use("/api/v1/trainers", trainerRoutes);

// bookings are protected — authGuard is applied inside bookings.js
app.use("/api/v1/bookings", bookingRoutes);

// Health check route — useful for testing
app.get("/", (req, res) => {
  res.json({ message: "FitZone API is running 🏋️" });
});

// ── Global Error Handler ───────────────────────────────────────
// Must be LAST — Express identifies it by the 4 parameters (err, req, res, next)
app.use(errorHandler);

// ── Connect to MongoDB, then start server ─────────────────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
