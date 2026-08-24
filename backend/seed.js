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

  // Generate 10 trainers for each specialization
  const specializations = ["Yoga", "Zumba", "CrossFit", "Pilates", "Weightlifting", "Boxing"];
  const firstNames = ["Aarav", "Priya", "Arjun", "Neha", "Vikram", "Sara", "Kabir", "Simran", "Rahul", "Anjali", "Rohan", "Kriti", "Amit", "Pooja", "Vishal", "Sneha", "Raj", "Kavya", "Siddharth", "Tara"];
  const lastNames = ["Sharma", "Patel", "Singh", "Desai", "Mehta", "Shah", "Kumar", "Verma", "Reddy", "Gupta", "Chauhan", "Joshi"];
  
  const generatedTrainers = [];
  
  for (const spec of specializations) {
    for (let i = 0; i < 10; i++) {
      const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
      
      const isAvailable = Math.random() > 0.3; // 70% available
      const randomBusyDays = isAvailable ? 0 : Math.floor(Math.random() * 6) + 1; // 1 to 6 days

      generatedTrainers.push({
        name: `${fName} ${lName}`,
        specialization: spec,
        available: isAvailable,
        busyDays: randomBusyDays
      });
    }
  }

  const trainers = await Trainer.insertMany(generatedTrainers);

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

  console.log(`✅ Seeded ${trainers.length} trainers across ${specializations.length} specializations`);
  console.log(`✅ Seeded members: ${members.map((m) => m.email).join(", ")}`);
  console.log("\nTest Login Credentials (for all users):");
  console.log("  Password: password123");
  console.log("  Users: test@fitzone.com | alice@fitzone.com | admin@fitzone.com");

  mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  mongoose.disconnect();
});
