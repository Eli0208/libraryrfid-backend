const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    studentNumber: { type: String, required: true, unique: true }, // Student Number field
    institute: { type: String, required: true }, // Institute field
    rfidTag: { type: String, required: true, unique: true }, // RFID Tag field
    status: { type: String, default: "Active" }, // Status field (optional, can be "Active" or "Inactive")

    // Embed RFID scan events in an array
    rfidScans: [
      {
        timestamp: { type: Date, default: Date.now }, // Time of scan
        status: { type: String, default: "Scanned" }, // Status of scan, like "Scanned", "Checked In", etc.
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
