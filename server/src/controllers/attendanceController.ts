import { Request, Response } from 'express';
import Attendance from '../models/Attendance';
import Employee from '../models/Employee';
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';

interface AuthRequest extends Request {
  user?: any;
}

export const punchIn = async (req: AuthRequest, res: Response) => {
  try {
    const { location, notes } = req.body;
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);

    // Get employee record
    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee) {
      return res.status(404).json({ message: 'Employee record not found' });
    }

    // Check if already punched in today
    const existingAttendance = await Attendance.findOne({
      employeeId: employee._id,
      date: { $gte: startOfToday, $lte: endOfToday }
    });

    if (existingAttendance && existingAttendance.punchIn) {
      return res.status(400).json({ message: 'Already punched in today' });
    }

    // Create or update attendance record
    const attendanceData = {
      employeeId: employee._id,
      date: startOfToday,
      punchIn: today,
      status: 'present',
      location,
      notes
    };

    const attendance = existingAttendance 
      ? await Attendance.findByIdAndUpdate(existingAttendance._id, attendanceData, { new: true })
      : await Attendance.create(attendanceData);

    res.json({
      success: true,
      message: 'Punched in successfully',
      data: attendance
    });
  } catch (error: any) {
    console.error('Punch in error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const punchOut = async (req: AuthRequest, res: Response) => {
  try {
    const { location, notes } = req.body;
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);

    // Get employee record
    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee) {
      return res.status(404).json({ message: 'Employee record not found' });
    }

    // Find today's attendance record
    const attendance = await Attendance.findOne({
      employeeId: employee._id,
      date: { $gte: startOfToday, $lte: endOfToday }
    });

    if (!attendance || !attendance.punchIn) {
      return res.status(400).json({ message: 'Please punch in first' });
    }

    if (attendance.punchOut) {
      return res.status(400).json({ message: 'Already punched out today' });
    }

    // Update attendance with punch out
    attendance.punchOut = today;
    if (location) attendance.location = location;
    if (notes) attendance.notes = notes;

    await attendance.save();

    res.json({
      success: true,
      message: 'Punched out successfully',
      data: attendance
    });
  } catch (error: any) {
    console.error('Punch out error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getTodayAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);

    // Get employee record
    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee) {
      return res.status(404).json({ message: 'Employee record not found' });
    }

    const attendance = await Attendance.findOne({
      employeeId: employee._id,
      date: { $gte: startOfToday, $lte: endOfToday }
    });

    res.json({
      success: true,
      data: attendance
    });
  } catch (error: any) {
    console.error('Get today attendance error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getAttendanceHistory = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, month, year, employeeId } = req.query;
    
    // Get employee record
    let targetEmployeeId = employeeId as string;
    if (!targetEmployeeId) {
      const employee = await Employee.findOne({ userId: req.user._id });
      if (!employee) {
        return res.status(404).json({ message: 'Employee record not found' });
      }
      targetEmployeeId = employee._id;
    }

    const query: any = { employeeId: targetEmployeeId };

    // Filter by month/year if provided
    if (month && year) {
      const startDate = startOfMonth(new Date(Number(year), Number(month) - 1));
      const endDate = endOfMonth(new Date(Number(year), Number(month) - 1));
      query.date = { $gte: startDate, $lte: endDate };
    }

    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit))
      .populate('employeeId', 'fullName email department');

    const total = await Attendance.countDocuments(query);

    res.json({
      success: true,
      data: attendance,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('Get attendance history error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getAttendanceReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, department } = req.query;
    
    const query: any = {};
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    let attendanceData = await Attendance.find(query)
      .populate('employeeId', 'fullName email department designation')
      .sort({ date: -1 });

    // Filter by department if specified
    if (department) {
      attendanceData = attendanceData.filter((record: any) => 
        record.employeeId.department === department
      );
    }

    // Calculate statistics
    const totalRecords = attendanceData.length;
    const presentCount = attendanceData.filter(record => record.status === 'present').length;
    const absentCount = attendanceData.filter(record => record.status === 'absent').length;
    const lateCount = attendanceData.filter(record => record.status === 'late').length;

    const stats = {
      total: totalRecords,
      present: presentCount,
      absent: absentCount,
      late: lateCount,
      presentPercentage: totalRecords > 0 ? ((presentCount / totalRecords) * 100).toFixed(2) : 0
    };

    res.json({
      success: true,
      data: attendanceData,
      stats
    });
  } catch (error: any) {
    console.error('Get attendance report error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const updateAttendance = async (req: Request, res: Response) => {
  try {
    const { status, punchIn, punchOut, breakTime, notes } = req.body;
    
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      { status, punchIn, punchOut, breakTime, notes },
      { new: true, runValidators: true }
    );

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.json({
      success: true,
      message: 'Attendance updated successfully',
      data: attendance
    });
  } catch (error: any) {
    console.error('Update attendance error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);

    // Today's attendance stats
    const todayStats = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: startOfToday, $lte: endOfToday }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Monthly attendance stats
    const startOfThisMonth = startOfMonth(today);
    const endOfThisMonth = endOfMonth(today);

    const monthlyStats = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: startOfThisMonth, $lte: endOfThisMonth }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Format stats
    const formatStats = (stats: any[]) => {
      const result = { present: 0, absent: 0, late: 0, 'half-day': 0 };
      stats.forEach(stat => {
        result[stat._id as keyof typeof result] = stat.count;
      });
      return result;
    };

    res.json({
      success: true,
      data: {
        today: formatStats(todayStats),
        thisMonth: formatStats(monthlyStats)
      }
    });
  } catch (error: any) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};