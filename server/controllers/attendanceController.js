const Attendance = require('../models/Attendance');

exports.getMyAttendance = async (req, res) => {
  const userId = req.params.userId;
  try {
    const items = await Attendance.find({ userId }).sort({ date: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.clockIn = async (req, res) => {
  const userId = req.params.userId;
  const date = new Date(new Date().toDateString());
  try {
    const item = await Attendance.findOneAndUpdate(
      { userId, date },
      { $setOnInsert: { userId, date }, $set: { clockIn: new Date(), status: 'present' } },
      { upsert: true, new: true }
    );
    res.json(item);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.clockOut = async (req, res) => {
  const userId = req.params.userId;
  const date = new Date(new Date().toDateString());
  try {
    const item = await Attendance.findOneAndUpdate(
      { userId, date },
      { $set: { clockOut: new Date() } },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'No attendance record for today' });
    res.json(item);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

