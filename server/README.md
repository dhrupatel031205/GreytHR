# GreytHR Backend Server

A comprehensive HR management system backend built with Node.js, Express, TypeScript, and MongoDB.

## Features

- **Authentication & Authorization** - JWT-based auth with role-based access control
- **Employee Management** - Complete CRUD operations for employee records
- **Attendance Tracking** - Punch in/out system with location tracking
- **Leave Management** - Leave application, approval workflow, and balance tracking
- **Payroll System** - Salary calculations, payslip generation, and bulk processing
- **Task Management** - Task assignment, tracking, and collaboration
- **Announcements** - Company-wide or targeted announcements
- **Real-time Chat** - Socket.io powered messaging system
- **Notifications** - Real-time notifications for various events
- **Reports & Analytics** - Comprehensive reporting and dashboard

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.io
- **Security**: Helmet, CORS, Rate limiting
- **Validation**: Built-in Mongoose validation
- **File Handling**: Multer (ready for file uploads)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Copy the `.env` file and update with your MongoDB connection string:
   ```bash
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   NODE_ENV=development
   ```

4. **Seed the database** (Optional - creates demo users)
   ```bash
   npm run seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## Demo Credentials

After running the seed script, you can use these credentials:

- **Admin**: admin@greyhr.com / password
- **HR**: hr@greyhr.com / password  
- **Employee**: employee@greyhr.com / password

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Employee Management
- `GET /api/employee` - Get all employees (with filtering)
- `GET /api/employee/:id` - Get employee by ID
- `GET /api/employee/user/:userId` - Get employee by user ID
- `POST /api/employee` - Create new employee (HR/Admin)
- `PUT /api/employee/:id` - Update employee
- `DELETE /api/employee/:id` - Delete employee (HR/Admin)

### Attendance
- `POST /api/attendance/punch-in` - Punch in
- `POST /api/attendance/punch-out` - Punch out
- `GET /api/attendance/today` - Get today's attendance
- `GET /api/attendance/history` - Get attendance history
- `GET /api/attendance/report` - Get attendance report (HR/Admin)

### Leave Management
- `POST /api/leave/apply` - Apply for leave
- `GET /api/leave/my-leaves` - Get my leave applications
- `GET /api/leave/balance` - Get leave balance
- `GET /api/leave/all` - Get all leaves (HR/Admin)
- `PUT /api/leave/:id/approve` - Approve/reject leave (HR/Admin)

### Payroll
- `POST /api/payroll/generate` - Generate payroll (HR/Admin)
- `GET /api/payroll/my-payroll` - Get my payroll records
- `GET /api/payroll/all` - Get all payroll records (HR/Admin)
- `PUT /api/payroll/:id/process` - Process payroll (HR/Admin)

### Task Management
- `POST /api/task` - Create new task
- `GET /api/task/my-tasks` - Get my assigned tasks
- `GET /api/task/assigned-tasks` - Get tasks I assigned
- `PUT /api/task/:id` - Update task
- `POST /api/task/:id/comments` - Add comment to task

### Announcements
- `POST /api/announcement` - Create announcement (HR/Admin)
- `GET /api/announcement/my-announcements` - Get relevant announcements
- `GET /api/announcement` - Get all announcements (HR/Admin)

### Notifications
- `GET /api/notification` - Get notifications
- `PUT /api/notification/:id/read` - Mark as read
- `PUT /api/notification/mark-all-read` - Mark all as read

### Chat
- `GET /api/chat` - Get chat list
- `POST /api/chat` - Create new chat
- `GET /api/chat/:chatId/messages` - Get messages
- `POST /api/chat/:chatId/messages` - Send message

### Dashboard & Reports
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/reports/attendance` - Attendance report (HR/Admin)
- `GET /api/dashboard/reports/leave` - Leave report (HR/Admin)
- `GET /api/dashboard/reports/payroll` - Payroll report (HR/Admin)

## Socket.io Events

### Client to Server
- `join_chat` - Join a chat room
- `leave_chat` - Leave a chat room
- `send_message` - Send a message
- `typing_start` - Start typing indicator
- `typing_stop` - Stop typing indicator
- `mark_messages_read` - Mark messages as read

### Server to Client
- `new_message` - New message received
- `user_typing` - User is typing
- `user_stop_typing` - User stopped typing
- `new_notification` - New notification
- `new_announcement` - New announcement

## Database Models

- **User** - Authentication and basic user info
- **Employee** - Detailed employee information
- **Attendance** - Daily attendance records
- **Leave** - Leave applications and approvals
- **Payroll** - Salary and payroll information
- **Task** - Task assignments and tracking
- **Announcement** - Company announcements
- **Notification** - User notifications
- **Chat** - Chat conversations
- **Message** - Individual chat messages

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation and sanitization
- Role-based access control

## Development

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Seed demo data
npm run seed
```

## Production Deployment

1. Set `NODE_ENV=production` in environment variables
2. Update CORS origins for your frontend domain
3. Use a process manager like PM2
4. Set up proper MongoDB connection with authentication
5. Use HTTPS in production
6. Set up proper logging and monitoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.