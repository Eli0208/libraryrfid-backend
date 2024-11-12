const express = require("express");
const {
  registerStudent,
  handleRfidScan,
} = require("../controllers/Student.js");
const verifyToken = require("../middlewares/Auth.js"); // Middleware to protect routes
const router = express.Router();

// Route to register a new student
router.post("/register", verifyToken, registerStudent);
router.post("/rfid", handleRfidScan);

module.exports = router;
