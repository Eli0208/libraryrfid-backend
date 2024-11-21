const mongoose = require("mongoose");

const userLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true }, // Include name directly in the log
  action: { type: String, enum: ["login", "logout"], required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("userLog", userLogSchema);
