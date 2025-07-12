import React from 'react';
import { Users, Clock, Calendar, DollarSign, TrendingUp, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useEmployee } from '../../contexts/EmployeeContext';
import StatsCard from './StatsCard';
import RecentActivity from './RecentActivity';
import QuickActions from './QuickActions';
import AttendanceChart from './AttendanceChart';

const Dashboard: React.FC = () => {
  const { state: authState } = useAuth();
  const { state: employeeState } = useEmployee();

  const statsData = [
    {
      title: 'Total Employees',
      value: employeeState.employees.length.toString(),
      icon: Users,
      color: 'blue',
      change: '+5%',
      changeType: 'increase' as const,
    },
    {
      title: 'Present Today',
      value: '85',
      icon: Clock,
      color: 'green',
      change: '+2%',
      changeType: 'increase' as const,
    },
    {
      title: 'Pending Leaves',
      value: '12',
      icon: Calendar,
      color: 'yellow',
      change: '-8%',
      changeType: 'decrease' as const,
    },
    {
      title: 'Monthly Payroll',
      value: '$45,320',
      icon: DollarSign,
      color: 'purple',
      change: '+12%',
      changeType: 'increase' as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Good morning, {authState.user?.name}! 👋
        </h1>
        <p className="text-blue-100">
          Here's what's happening with your team today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Section */}
        <div className="lg:col-span-2">
          <AttendanceChart />
        </div>

        {/* Quick Actions */}
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
};

export default Dashboard;