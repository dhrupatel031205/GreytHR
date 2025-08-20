"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Import database connection
const database_1 = __importDefault(require("./config/database"));
// Import middleware
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
// Import routes
const auth_1 = __importDefault(require("./routes/auth"));
const employee_1 = __importDefault(require("./routes/employee"));
const attendance_1 = __importDefault(require("./routes/attendance"));
const leave_1 = __importDefault(require("./routes/leave"));
const payroll_1 = __importDefault(require("./routes/payroll"));
const task_1 = __importDefault(require("./routes/task"));
const announcement_1 = __importDefault(require("./routes/announcement"));
const notification_1 = __importDefault(require("./routes/notification"));
const chat_1 = __importDefault(require("./routes/chat"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
// Import socket handlers
const socketHandlers_1 = require("./socket/socketHandlers");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.NODE_ENV === 'production'
            ? ['https://your-frontend-domain.com']
            : ['http://localhost:5173', 'http://localhost:3000'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }
});
// Connect to MongoDB
(0, database_1.default)();
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
// Middleware
app.use((0, helmet_1.default)()); // Security headers
app.use((0, compression_1.default)()); // Compress responses
app.use((0, morgan_1.default)('combined')); // Logging
app.use(limiter); // Rate limiting
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://your-frontend-domain.com']
        : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});
// API Routes
app.use('/api/auth', auth_1.default);
app.use('/api/employee', employee_1.default);
app.use('/api/attendance', attendance_1.default);
app.use('/api/leave', leave_1.default);
app.use('/api/payroll', payroll_1.default);
app.use('/api/task', task_1.default);
app.use('/api/announcement', announcement_1.default);
app.use('/api/notification', notification_1.default);
app.use('/api/chat', chat_1.default);
app.use('/api/dashboard', dashboard_1.default);
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    });
});
// Error handling middleware (should be last)
app.use(errorHandler_1.default);
// Setup Socket.IO
(0, socketHandlers_1.setupSocketIO)(io);
// Make io available globally for other modules
app.set('io', io);
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/health`);
    console.log(`🔌 Socket.IO server is ready`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Process terminated');
    });
});
process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    server.close(() => {
        console.log('Process terminated');
    });
});
exports.default = app;
//# sourceMappingURL=index.js.map