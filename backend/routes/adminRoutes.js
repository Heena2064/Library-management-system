const express = require("express");
const router = express.Router();
const { getAllUsers, approveFees, getAdminStats } = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

router.get("/users", protect, adminOnly, getAllUsers); 
router.put("/approve-fees/:userId", protect, adminOnly, approveFees);
router.get("/stats", protect, adminOnly, getAdminStats);



module.exports = router;
