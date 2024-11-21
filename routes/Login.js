// routes/authRoutes.js
const express = require("express");
const { login, logout, getAllLogs } = require("../controllers/Login.js"); // Use the refactored auth controller
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../middlewares/Auth.js");

// Routes for login and logout
router.post("/login", login);
router.post("/logout", verifyToken, logout);
router.post("/all-logs", verifyToken, verifyAdmin, getAllLogs);

module.exports = router;
