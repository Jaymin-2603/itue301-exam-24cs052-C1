// routes/trainers.js
// GET /api/v1/trainers — public route, returns all trainers

const express = require("express");
const router = express.Router();
const Trainer = require("../models/Trainer");

// GET /api/v1/trainers — public (no auth required)
router.get("/", async (req, res, next) => {
  try {
    const trainers = await Trainer.find(); // get all trainers from MongoDB
    res.status(200).json(trainers);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
