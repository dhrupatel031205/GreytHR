const mongoose = require('mongoose');

const onboardingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    steps: [
      {
        name: { type: String, required: true },
        completed: { type: Boolean, default: false },
        completedAt: { type: Date },
      },
    ],
    status: { type: String, enum: ['in-progress', 'completed'], default: 'in-progress' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Onboarding', onboardingSchema);

