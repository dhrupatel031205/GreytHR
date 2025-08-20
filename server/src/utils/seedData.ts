import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User';
import Employee from '../models/Employee';
import connectDB from '../config/database';

// Load environment variables
dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Employee.deleteMany({});

    console.log('Existing data cleared');

    // Create demo users
    const users = [
      {
        name: 'Admin User',
        email: 'admin@greyhr.com',
        password: 'password',
        role: 'admin',
        department: 'Administration'
      },
      {
        name: 'HR Manager',
        email: 'hr@greyhr.com',
        password: 'password',
        role: 'hr',
        department: 'Human Resources'
      },
      {
        name: 'John Employee',
        email: 'employee@greyhr.com',
        password: 'password',
        role: 'employee',
        department: 'Engineering'
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@greyhr.com',
        password: 'password',
        role: 'employee',
        department: 'Marketing'
      },
      {
        name: 'Mike Johnson',
        email: 'mike.johnson@greyhr.com',
        password: 'password',
        role: 'employee',
        department: 'Sales'
      }
    ];

    const createdUsers = [];
    
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
    }

    console.log('Users created successfully');

    // Create corresponding employee records
    const employees = [
      {
        userId: createdUsers[0]._id,
        fullName: 'Admin User',
        email: 'admin@greyhr.com',
        phone: '+1-234-567-8901',
        dob: new Date('1985-01-15'),
        gender: 'male',
        role: 'admin',
        address: '123 Admin Street, Admin City, AC 12345',
        department: 'Administration',
        designation: 'System Administrator',
        doj: new Date('2020-01-01'),
        bankDetails: {
          accountNumber: '1234567890',
          ifscCode: 'BANK0001234',
          bankName: 'Demo Bank'
        },
        emergencyContact: {
          name: 'Emergency Contact',
          relationship: 'Spouse',
          phone: '+1-234-567-8902'
        },
        status: 'active'
      },
      {
        userId: createdUsers[1]._id,
        fullName: 'HR Manager',
        email: 'hr@greyhr.com',
        phone: '+1-234-567-8903',
        dob: new Date('1988-03-20'),
        gender: 'female',
        role: 'hr',
        address: '456 HR Avenue, HR City, HC 12345',
        department: 'Human Resources',
        designation: 'HR Manager',
        doj: new Date('2021-02-15'),
        bankDetails: {
          accountNumber: '2345678901',
          ifscCode: 'BANK0001235',
          bankName: 'Demo Bank'
        },
        emergencyContact: {
          name: 'HR Emergency',
          relationship: 'Parent',
          phone: '+1-234-567-8904'
        },
        status: 'active'
      },
      {
        userId: createdUsers[2]._id,
        fullName: 'John Employee',
        email: 'employee@greyhr.com',
        phone: '+1-234-567-8905',
        dob: new Date('1990-06-10'),
        gender: 'male',
        role: 'employee',
        address: '789 Employee Lane, Emp City, EC 12345',
        department: 'Engineering',
        designation: 'Software Engineer',
        doj: new Date('2022-03-01'),
        bankDetails: {
          accountNumber: '3456789012',
          ifscCode: 'BANK0001236',
          bankName: 'Demo Bank'
        },
        emergencyContact: {
          name: 'John Emergency',
          relationship: 'Sibling',
          phone: '+1-234-567-8906'
        },
        status: 'active'
      },
      {
        userId: createdUsers[3]._id,
        fullName: 'Jane Smith',
        email: 'jane.smith@greyhr.com',
        phone: '+1-234-567-8907',
        dob: new Date('1987-09-25'),
        gender: 'female',
        role: 'employee',
        address: '321 Marketing Blvd, Marketing City, MC 12345',
        department: 'Marketing',
        designation: 'Marketing Specialist',
        doj: new Date('2021-08-15'),
        bankDetails: {
          accountNumber: '4567890123',
          ifscCode: 'BANK0001237',
          bankName: 'Demo Bank'
        },
        emergencyContact: {
          name: 'Jane Emergency',
          relationship: 'Parent',
          phone: '+1-234-567-8908'
        },
        status: 'active'
      },
      {
        userId: createdUsers[4]._id,
        fullName: 'Mike Johnson',
        email: 'mike.johnson@greyhr.com',
        phone: '+1-234-567-8909',
        dob: new Date('1992-12-05'),
        gender: 'male',
        role: 'employee',
        address: '654 Sales Street, Sales City, SC 12345',
        department: 'Sales',
        designation: 'Sales Representative',
        doj: new Date('2023-01-10'),
        bankDetails: {
          accountNumber: '5678901234',
          ifscCode: 'BANK0001238',
          bankName: 'Demo Bank'
        },
        emergencyContact: {
          name: 'Mike Emergency',
          relationship: 'Spouse',
          phone: '+1-234-567-8910'
        },
        status: 'active'
      }
    ];

    for (const employeeData of employees) {
      const employee = new Employee(employeeData);
      await employee.save();
    }

    console.log('Employee records created successfully');
    console.log('\n=== Demo Credentials ===');
    console.log('Admin: admin@greyhr.com / password');
    console.log('HR: hr@greyhr.com / password');
    console.log('Employee: employee@greyhr.com / password');
    console.log('========================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Run seed data if this file is executed directly
if (require.main === module) {
  seedData();
}

export default seedData;