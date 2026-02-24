const Seat = require("../models/Seat");
const User = require('../models/User');

// =======================
// CREATE SEATS (Admin)
// =======================
const createSeats = async (req, res) => {
  try {
    const { totalSeats } = req.body;

    const seats = [];

    for (let i = 1; i <= totalSeats; i++) {
      seats.push({ seatNumber: i });
    }

    await Seat.insertMany(seats);

    res.status(201).json({ message: `${totalSeats} seats created successfully` });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// GET ALL SEATS
// =======================
const getAllSeats = async (req, res) => {
  try {
    const seats = await Seat.find().populate("occupiedBy", "name email");

    res.status(200).json(seats);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





// =======================
// BOOK A SEAT
// =======================
const bookSeat = async (req, res) => {
  try {
    const { seatNumber } = req.body;

    const seat = await Seat.findOne({ seatNumber });

    if (!seat) {
      return res.status(404).json({ message: "Seat not found" });
    }

    if (seat.isOccupied) {
      return res.status(400).json({ message: "Seat already occupied" });
    }

    // Check if user already has a seat
    const user = await User.findById(req.user._id);
    if (!user.feesPaid) {
  return res.status(403).json({ message: "Please pay fees before booking a seat" });
}


    if (user.seatNumber) {
      return res.status(400).json({ message: "You already have a seat" });
    }

    // Assign seat
    seat.isOccupied = true;
    seat.occupiedBy = user._id;
    await seat.save();

    user.seatNumber = seatNumber;
    await user.save();

    res.status(200).json({ message: `Seat ${seatNumber} booked successfully` });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSeats,
  getAllSeats,
  bookSeat,
};



