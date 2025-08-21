const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['attendance', 'payroll', 'leave', 'custom'], default: 'custom' },
    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    parameters: { type: Object, default: {} },
    data: { type: Object, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);

