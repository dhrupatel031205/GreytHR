const User = require('../models/User');
const Employee = require('../models/Employee');

const seedDemoData = async () => {
  try {
    const usersToEnsure = [
      { name: 'Admin User', email: 'admin@greyhr.com', password: 'password', role: 'admin', department: 'Administration', avatar: '' },
      { name: 'HR User', email: 'hr@greyhr.com', password: 'password', role: 'hr', department: 'Human Resources', avatar: '' },
      { name: 'Employee User', email: 'employee@greyhr.com', password: 'password', role: 'employee', department: 'Engineering', avatar: '' },
    ];

    for (const userData of usersToEnsure) {
      let user = await User.findOne({ email: userData.email });
      if (!user) {
        user = await User.create(userData);
        console.log(`Created user: ${user.email}`);
      }

      const existingEmployee = await Employee.findOne({ userId: user._id });
      if (!existingEmployee) {
        const employeeData = {
          userId: user._id,
          fullName: user.name,
          email: user.email,
          phone: '0000000000',
          dob: new Date('1990-01-01'),
          gender: 'other',
          address: 'N/A',
          department: user.department,
          designation: user.role === 'employee' ? 'Software Engineer' : user.role === 'hr' ? 'HR Manager' : 'Administrator',
          doj: new Date('2020-01-01'),
          role: user.role,
          bankDetails: {
            accountNumber: '0000000000',
            ifscCode: 'IFSC0000',
            bankName: 'Demo Bank'
          },
          emergencyContact: {
            name: 'John Doe',
            relationship: 'Friend',
            phone: '0000000000'
          },
          status: 'active',
          avatar: '',
          documents: {}
        };
        await Employee.create(employeeData);
        console.log(`Created employee for user: ${user.email}`);
      }
    }
  } catch (error) {
    console.error('Seeding error:', error);
  }
};

module.exports = seedDemoData;

