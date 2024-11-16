const Student = require("../models/Student");

// Register a new student
exports.registerStudent = async (req, res) => {
  const { name, studentNumber, institute, rfidTag, status } = req.body;

  // Validate input
  if (!name || !studentNumber || !institute || !rfidTag) {
    return res.status(400).json({
      message: "Please provide name, student number, institute, and RFID tag",
    });
  }

  try {
    // Check if the RFID tag already exists
    const existingStudent = await Student.findOne({ rfidTag });
    if (existingStudent) {
      return res
        .status(400)
        .json({ message: "RFID tag is already registered" });
    }

    // Check if the student number already exists
    const existingStudentNumber = await Student.findOne({ studentNumber });
    if (existingStudentNumber) {
      return res
        .status(400)
        .json({ message: "Student number is already registered" });
    }

    // Create a new student record
    const newStudent = new Student({
      name,
      studentNumber,
      institute,
      rfidTag,
      status: status || "Active", // default to "Active" if not provided
    });

    // Save to the database
    await newStudent.save();

    res.status(201).json({
      message: "Student registered successfully",
      student: newStudent,
    });
  } catch (error) {
    console.error("Error registering student:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.handleRfidScan = async (req, res) => {
  const { rfidTag } = req.body; // The RFID tag sent from the device

  // Validate the input
  if (!rfidTag) {
    return res.status(400).json({ message: "RFID tag is required" });
  }

  try {
    // Find the student by the RFID tag
    const student = await Student.findOne({ rfidTag });

    if (!student) {
      return res
        .status(404)
        .json({ message: "Student not found for this RFID tag" });
    }

    // Add the scan event to the student's rfidScans array
    student.rfidScans.push({
      timestamp: new Date(), // Store the current timestamp
      status: "Scanned", // Default status for now
    });

    // Save the updated student document
    await student.save();

    // Respond with success and the updated student data
    res.status(200).json({
      message: "RFID scan recorded successfully",
      student: student,
    });
  } catch (error) {
    console.error("Error handling RFID scan:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllTimeInRecords = async (req, res) => {
  try {
    // Fetch all students along with their RFID scan records
    const students = await Student.find(
      {},
      { name: 1, studentNumber: 1, rfidScans: 1, institute: 1 }
    );

    if (!students || students.length === 0) {
      return res.status(404).json({ message: "No records found" });
    }

    res.status(200).json({
      message: "RFID scan records retrieved successfully",
      records: students,
    });
  } catch (error) {
    console.error("Error retrieving RFID scan records:", error);
    res.status(500).json({ message: "Server error" });
  }
};
