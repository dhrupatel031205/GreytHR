const Payroll = require('../models/Payroll');

exports.getPayrollForUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const items = await Payroll.find({ userId }).sort({ period: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.generatePayroll = async (req, res) => {
  try {
    const { userId, period, baseSalary, allowances = 0, deductions = 0 } = req.body;
    const netPay = baseSalary + allowances - deductions;
    const payroll = await Payroll.create({ userId, period, baseSalary, allowances, deductions, netPay, status: 'processed' });
    res.status(201).json(payroll);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

