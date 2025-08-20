const Employee = require('../models/Employee');

// Get employee by userId
const getEmployeeByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const employee = await Employee.findOne({ userId });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    console.error('Error fetching employee by userId:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update employee by id
const updateEmployeeById = async (req, res) => {
  const { id } = req.params;

  try {
    const updated = await Employee.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(updated);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getEmployeeByUserId,
  updateEmployeeById,
};
