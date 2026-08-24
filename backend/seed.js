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

  // Create sample trainers
  const trainers = await Trainer.insertMany([
    { name: "Raj Mehta", specialization: "Yoga & Meditation", available: true },
    { name: "Priya Shah", specialization: "Zumba & Dance", available: true },
    { name: "Arjun Patel", specialization: "CrossFit & Strength", available: false },
    { name: "Neha Desai", specialization: "Pilates & Flexibility", available: true },
  ]);

  // Create a test member with hashed password
  const hashedPassword = await bcrypt.hash("password123", 10);
  const member = await Member.create({
    name: "Jaymin Test",
    email: "test@fitzone.com",
    phone: "9876543210",
    membershipType: "premium",
    password: hashedPassword,
    role: "member",
  });

  console.log("✅ Seeded trainers:", trainers.map(t => t.name));
  console.log("✅ Seeded member:", member.email);
  console.log("\nTest Login Credentials:");
  console.log("  Email:    test@fitzone.com");
  console.log("  Password: password123");

  mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  mongoose.disconnect();
});
