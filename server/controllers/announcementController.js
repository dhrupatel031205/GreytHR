const Announcement = require('../models/Announcement');

exports.createAnnouncement = async (req, res) => {
  try {
    const ann = await Announcement.create(req.body);
    res.status(201).json(ann);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.getAnnouncements = async (req, res) => {
  try {
    const items = await Announcement.find().sort({ pinned: -1, createdAt: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateAnnouncement = async (req, res) => {
  try {
    const updated = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Announcement not found' });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    const deleted = await Announcement.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Announcement not found' });
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

