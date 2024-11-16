const express = require("express");
const {
  registerStudent,
  handleRfidScan,
  getAllTimeInRecords,
} = require("../controllers/Student.js");
const verifyToken = require("../middlewares/Auth.js"); // Middleware to protect routes
const router = express.Router();

// Route to register a new student
router.post("/register", verifyToken, registerStudent);
router.post("/rfid", handleRfidScan);
router.get("/records/all-time-in", verifyToken, getAllTimeInRecords);

module.exports = router;
