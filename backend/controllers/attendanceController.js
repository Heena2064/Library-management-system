const User = require("../models/User");
const Seat = require('../models/Seat');

// =======================
// CHECK-IN
// =======================
const checkIn = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.seatNumber) {
      return res.status(400).json({ message: "You must book a seat first" });
    }

    if (user.isPresent) {
      return res.status(400).json({ message: "You are already checked in" });
    }

    user.isPresent = true;
    await user.save();

    res.status(200).json({ message: "Checked in successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// CHECK-OUT
// =======================
const checkOut = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.isPresent) {
      return res.status(400).json({ message: "You are not checked in" });
    }

    // Find user's seat
    const seat = await Seat.findOne({ seatNumber: user.seatNumber });

    if (seat) {
      seat.isOccupied = false;
      seat.occupiedBy = null;
      await seat.save();
    }

    user.isPresent = false;
    user.seatNumber = null;
    await user.save();

    res.status(200).json({ message: "Checked out and seat released successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  checkIn,
  checkOut,
};
