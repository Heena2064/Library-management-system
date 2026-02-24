const User = require("../models/User");
const Seat = require("../models/Seat");

// GET ALL USERS
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// APPROVE FEES
const approveFees = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.feesPaid = true;
    await user.save();

    res.status(200).json({
      message: "Fees approved successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        feesPaid: user.feesPaid,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// ADMIN STATS
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalAdmins = await User.countDocuments({ role: "admin" });

    const totalSeats = await Seat.countDocuments();
    const occupiedSeats = await Seat.countDocuments({ isOccupied: true });
    const availableSeats = await Seat.countDocuments({ isOccupied: false });

    const studentsPresent = await User.countDocuments({ isPresent: true });

    res.status(200).json({
      totalUsers,
      totalStudents,
      totalAdmins,
      totalSeats,
      occupiedSeats,
      availableSeats,
      studentsPresent,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = { getAllUsers, approveFees, getAdminStats };