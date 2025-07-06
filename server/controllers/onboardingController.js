const Onboarding = require("../models/Onboarding.js");

exports.saveOnboardingData = async (req, res) => {
  try {
    const {
      personal,
      address,
      family,
      job,
      education,
      documents,
      bank,
      declaration
    } = req.body;

    // Optional: Validate required sections
    if (!personal || !address || !family || !job || !education || !declaration) {
      return res.status(400).json({ message: "Missing required onboarding sections" });
    }

    const newRecord = new Onboarding({
      personal,
      address,
      family,
      job,
      education,
      documents,
      bank,
      declaration
    });

    const savedRecord = await newRecord.save();
    res.status(201).json({
      message: "✅ Onboarding data saved successfully",
      data: savedRecord
    });
  } catch (error) {
    console.error("❌ Error saving onboarding data:", error);
    res.status(500).json({ message: "Server error" });
  }
};
