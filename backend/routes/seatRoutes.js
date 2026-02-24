const express = require("express");
const router = express.Router();
const { createSeats, getAllSeats, bookSeat } = require("../controllers/seatController");
const { protect } = require("../middleware/authMiddleware");
const {adminOnly} = require('../middleware/adminMiddleware');

router.post("/create",protect, adminOnly, createSeats);
router.get("/", protect, getAllSeats);
router.post("/book", protect, bookSeat);

module.exports = router;
