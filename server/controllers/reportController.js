const Report = require('../models/Report');

exports.createReport = async (req, res) => {
  try {
    const report = await Report.create(req.body);
    res.status(201).json(report);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.getReports = async (req, res) => {
  try {
    const items = await Report.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

