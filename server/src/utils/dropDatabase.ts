import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const dropDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');
    
    // Drop the entire database
    await mongoose.connection.db?.dropDatabase();
    console.log('Database dropped successfully');
    
    await mongoose.connection.close();
    console.log('Connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error dropping database:', error);
    process.exit(1);
  }
};

dropDatabase();