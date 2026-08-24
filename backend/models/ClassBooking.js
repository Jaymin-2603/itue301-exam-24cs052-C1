// ClassBooking.js — Mongoose schema for class bookings
// References Member and Trainer using ObjectId refs

const mongoose = require("mongoose");

const classBookingSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member", // reference to Member collection
      required: [true, "Member ID is required"],
    },
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer", // reference to Trainer collection
      required: [true, "Trainer ID is required"],
    },
    className: {
      type: String,
      required: [true, "Class name is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    timeSlot: {
      type: String,
      required: [true, "Time slot is required"],
    },
    status: {
      type: String,
      enum: {
        values: ["booked", "attended", "cancelled"],
        message: "Status must be booked, attended, or cancelled",
      },
      default: "booked",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ClassBooking", classBookingSchema);
