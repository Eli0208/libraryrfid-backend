const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
  editUser,
  deleteUser,
} = require("../controllers/Auth.js");
const { verifyToken, verifyAdmin } = require("../middlewares/Auth.js");
const router = express.Router();

// Route for registering a new user
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/users", verifyToken, verifyAdmin, getAllUsers);
router.put("/users/:userId", verifyToken, verifyAdmin, editUser);
router.delete("/users/:userId", verifyToken, verifyAdmin, deleteUser);

module.exports = router;
