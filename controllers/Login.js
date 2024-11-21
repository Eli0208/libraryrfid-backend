// services/AuthService.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const LoginLog = require("../models/Login");

// Login user and generate token
exports.login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user._id, role: user.role, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "9h" }
  );

  // Log the login action
  await LoginLog.create({
    userId: user._id,
    name: user.name,
    action: "login",
  });

  return { token, user };
};

// Logout user (simply log the action)
exports.logout = async (user) => {
  console.log(user);
  // Log the logout action
  await LoginLog.create({
    userId: user.userId,
    name: user.name,
    action: "logout",
  });
};

exports.getAllLogs = async (req, res) => {
  try {
    // Fetch all logs from the database, sorted by creation date (newest first)
    const logs = await LoginLog.find().sort({ createdAt: -1 });

    if (!logs || logs.length === 0) {
      return res.status(404).json({ message: "No logs found" });
    }

    // Return all logs
    res.status(200).json({ logs });
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ message: "Server error" });
  }
};
