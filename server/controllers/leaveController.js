const Leave = require('../models/Leave');

exports.requestLeave = async (req, res) => {
  try {
    const leave = await Leave.create(req.body);
    res.status(201).json(leave);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.getMyLeaves = async (req, res) => {
  const userId = req.params.userId;
  try {
    const items = await Leave.find({ userId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateLeaveStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await Leave.findByIdAndUpdate(id, { status: req.body.status, approvedBy: req.body.approvedBy }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Leave not found' });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

