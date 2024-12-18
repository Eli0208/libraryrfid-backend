const express = require("express");
const {
  registerStudent,
  handleRfidScan,
  getAllTimeInRecords,
  getAllStudents,
  deleteStudent,
  editStudent,
} = require("../controllers/Student.js");
const { verifyToken, verifyAdmin } = require("../middlewares/Auth.js"); // Middleware to protect routes
const router = express.Router();

// Route to register a new student
router.post("/register", verifyToken, registerStudent);
router.post("/rfid", handleRfidScan);
router.get("/records/all-time-in", verifyToken, getAllTimeInRecords);
router.get("/records/allstudents", verifyToken, verifyAdmin, getAllStudents);
router.delete("/:studentId", verifyToken, verifyAdmin, deleteStudent);
router.put("/:studentId", verifyToken, verifyAdmin, editStudent);

module.exports = router;
