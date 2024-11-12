// Import required modules
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware setup
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require("./routes/Auth.js");
const studentRoutes = require("./routes/Student.js");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);

// Base route for testing
app.get("/", (req, res) => {
  res.send("Library System API is running and connected to MongoDB");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
