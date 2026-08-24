// seed.js — Run this ONCE to populate MongoDB with sample data
// Usage: node seed.js
// This creates 3 trainers and 1 test member for testing the API

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Member = require("./models/Member");
const Trainer = require("./models/Trainer");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB...");

  // Clear existing data
  await Member.deleteMany();
  await Trainer.deleteMany();

  // Create sample trainers with some overlapping specializations
  const trainers = await Trainer.insertMany([
    { name: "Raj Mehta", specialization: "Yoga", available: true },
    { name: "Karan Desai", specialization: "Yoga", available: true },
    { name: "Priya Shah", specialization: "Zumba", available: true },
    { name: "Simran Kaur", specialization: "Zumba", available: false },
    { name: "Arjun Patel", specialization: "CrossFit", available: false },
    { name: "Kabir Singh", specialization: "CrossFit", available: true },
    { name: "Neha Desai", specialization: "Pilates", available: true },
    { name: "Vikram Singh", specialization: "Weightlifting", available: true },
    { name: "David Lee", specialization: "Boxing", available: true },
  ]);

  // Create test members with hashed password
  const hashedPassword = await bcrypt.hash("password123", 10);
  const members = await Member.insertMany([
    {
      name: "Jaymin (Test User)",
      email: "test@fitzone.com",
      phone: "9876543210",
      membershipType: "premium",
      password: hashedPassword,
      role: "member",
    },
    {
      name: "Alice Johnson",
      email: "alice@fitzone.com",
      phone: "9876543211",
      membershipType: "basic",
      password: hashedPassword,
      role: "member",
    },
    {
      name: "Admin Superuser",
      email: "admin@fitzone.com",
      phone: "9876543212",
      membershipType: "platinum",
      password: hashedPassword,
      role: "admin",
    }
  ]);

  console.log("✅ Seeded trainers:", trainers.map(t => t.name).join(", "));
  console.log("✅ Seeded members:", members.map(m => m.email).join(", "));
  console.log("\nTest Login Credentials (for all users):");
  console.log("  Password: password123");
  console.log("  Users: test@fitzone.com | alice@fitzone.com | admin@fitzone.com");

  mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  mongoose.disconnect();
});
