const mongoose = require('mongoose');

const onboardingSchema = new mongoose.Schema({
  personal: {
    fullName: String,
    email: String,
    phone: String,
    dob: Date,
    gender: String,
  },
  address: {
    currentAddress: String,
    permanentAddress: String,
    pincode: String,
    area: String,
    city: String,
    state: String,
  },
  family: {
    father: Object,
    mother: Object,
    spouse: Object,
    maritalStatus: String,
    emergencyContact: Object,
  },
  job: {
    department: String,
    designation: String,
    joiningDate: Date,
    managerName: String,
  },
  education: {
    tenth: Object,
    twelfth: Object,
    graduation: Object,
    experiences: [Object],
  },
  documents: {
    aadhaar: String,
    pan: String,
    passport: String,
    tenthMarksheet: String,
    twelfthMarksheet: String,
    graduationMarksheet: String,
    resume: String,
    offerLetter: String,
  },
  bank: {
    ifsc: String,
    bankName: String,
    branch: String,
    accountNumber: String,
    upi: String,
  },
  declaration: {
    signature: String,
    drawnSignature: String,
    acceptedPolicies: Boolean,
  },
}, { timestamps: true });

module.exports = mongoose.model('Onboarding', onboardingSchema);
