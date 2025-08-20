"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
const dropDatabase = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        // Drop the entire database
        await mongoose_1.default.connection.db?.dropDatabase();
        console.log('Database dropped successfully');
        await mongoose_1.default.connection.close();
        console.log('Connection closed');
        process.exit(0);
    }
    catch (error) {
        console.error('Error dropping database:', error);
        process.exit(1);
    }
};
dropDatabase();
//# sourceMappingURL=dropDatabase.js.map