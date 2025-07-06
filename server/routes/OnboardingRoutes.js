const express = require("express");
const router = express.Router();
const { saveOnboardingData } = require("../controllers/onboardingController.js");

router.post("/", saveOnboardingData);

module.exports = router;
