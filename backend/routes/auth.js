// routes/auth.js
// POST /api/v1/auth/login — authenticate a member and return a JWT token

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Member = require("../models/Member");

// POST /api/v1/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Find member by email
    const member = await Member.findOne({ email });
    if (!member) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, member.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Create JWT token — valid for 7 days
    const token = jwt.sign(
      { id: member._id, email: member.email, role: member.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return token and member info (don't send password)
    res.status(200).json({
      token,
      role: member.role,
      member: {
        id: member._id,
        name: member.name,
        email: member.email,
        membershipType: member.membershipType,
      },
    });
  } catch (err) {
    next(err); // pass to global error handler
  }
});

module.exports = router;
