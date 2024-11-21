const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AuthService = require("../controllers/Login");

// Register a new user
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if all fields are provided
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide both email and password" });
  }

  try {
    // Use AuthService to handle login logic
    const { token, user } = await AuthService.login(email, password);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(400).json({ message: error.message });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    const { userId, name } = req.body; // Expect both userId and name in the request body

    if (!userId || !name) {
      return res
        .status(400)
        .json({ message: "User ID and name are required for logout" });
    }

    // Call AuthService's logout function with user details
    await AuthService.logout({ userId, name });

    res.status(200).json({ message: `Logout successful for ${name}` });
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find();

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Return the list of users
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Edit a user
exports.editUser = async (req, res) => {
  const { userId } = req.params; // Get the user ID from route parameters
  const { name, email, password, role } = req.body; // Include 'role' in the request body

  // Check if at least one field is provided for update
  if (!name && !email && !password && !role) {
    return res
      .status(400)
      .json({ message: "Please provide at least one field to update" });
  }

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role; // Update the role field
    if (password) {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  const { userId } = req.params; // Get the user ID from route parameters

  try {
    // Find the user by ID and delete
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
};
