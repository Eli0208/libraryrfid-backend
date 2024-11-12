const express = require("express");
const { registerUser, loginUser } = require("../controllers/Auth.js");
const router = express.Router();

// Route for registering a new user
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
