// models/Employee.js
const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  fullName: String,
  email: String,
  phone: String,
  dob: Date,
  gender: String,
  address: String,
  department: String,
  designation: String,
  doj: Date,
  role: {
    type: String,
    enum: ["admin", "hr", "employee"]
  },
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    bankName: String
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },
  avatar: String,
  documents: {
    idProof: String,
    resume: String
  }
});

module.exports = mongoose.model("Employee", employeeSchema);
