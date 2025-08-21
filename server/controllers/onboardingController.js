const Onboarding = require('../models/Onboarding');

exports.getOnboarding = async (req, res) => {
  try {
    const { userId } = req.params;
    const item = await Onboarding.findOne({ userId });
    res.json(item || { userId, steps: [], status: 'in-progress' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateOnboarding = async (req, res) => {
  try {
    const { userId } = req.params;
    const updated = await Onboarding.findOneAndUpdate({ userId }, req.body, { new: true, upsert: true });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

