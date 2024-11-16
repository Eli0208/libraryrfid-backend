// Import required modules
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const morgan = require("morgan");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

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
