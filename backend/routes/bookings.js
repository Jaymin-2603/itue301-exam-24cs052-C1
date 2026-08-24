// routes/bookings.js
// All booking routes — all protected by authGuard

const express = require("express");
const router = express.Router();
const ClassBooking = require("../models/ClassBooking");
const Trainer = require("../models/Trainer");
const authGuard = require("../middleware/authGuard");

// Apply authGuard to ALL routes in this file
router.use(authGuard);

// ─────────────────────────────────────────────────────────────────
// POST /api/v1/bookings — Create a new booking
// ─────────────────────────────────────────────────────────────────
router.post("/", async (req, res, next) => {
  try {
    const { trainerId, className, date, timeSlot } = req.body;

    // Ensure the trainer exists and is available
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found." });
    }
    if (!trainer.available) {
      const days = trainer.busyDays || 3;
      return res.status(400).json({ message: `Trainer is busy for the next ${days} days. You may book after that.` });
    }

    // memberId comes from the JWT token (set by authGuard as req.member.id)
    const booking = new ClassBooking({
      memberId: req.member.id,
      trainerId,
      className,
      date,
      timeSlot,
    });

    // Mongoose will throw ValidationError if required fields are missing
    const saved = await booking.save();

    // Change trainer status to false (fully booked) so they can't be double booked
    trainer.available = false;
    await trainer.save();

    res.status(201).json(saved); // 201 Created
  } catch (err) {
    // Handle Mongoose ValidationError — return clean messages
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: "Validation failed", errors: messages });
    }
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────────
// GET /api/v1/bookings/my — Get logged-in member's bookings
// Uses .populate() to get trainer and member details
// ─────────────────────────────────────────────────────────────────
router.get("/my", async (req, res, next) => {
  try {
    const bookings = await ClassBooking.find({ memberId: req.member.id })
      .populate("memberId", "name email")        // fetch name & email from Member
      .populate("trainerId", "name specialization"); // fetch from Trainer

    res.status(200).json(bookings);
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────────
// PATCH /api/v1/bookings/:id/status — Update booking status
// ─────────────────────────────────────────────────────────────────
router.patch("/:id/status", async (req, res, next) => {
  try {
    const { status } = req.body;

    // Validate the incoming status value
    const allowedStatuses = ["booked", "attended", "cancelled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${allowedStatuses.join(", ")}`,
      });
    }

    const booking = await ClassBooking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true } // return the updated document
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    res.status(200).json(booking);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
