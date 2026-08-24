// Member.js — Mongoose schema for gym members
// Fields: name, email, phone, membershipType

const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Member name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
    },
    membershipType: {
      type: String,
      enum: {
        values: ["basic", "premium", "platinum"],
        message: "membershipType must be basic, premium, or platinum",
      },
      default: "basic",
    },
    // Store a hashed password for login (simple for exam purposes)
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["member", "trainer", "admin"],
      default: "member",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Member", memberSchema);
