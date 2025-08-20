import React from 'react';
import { Info, Users, Zap } from 'lucide-react';

const DemoBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 animate-pulse" />
              <span className="font-bold text-lg">DEMO MODE</span>
            </div>
            <div className="hidden md:flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>Switch between user roles to explore different features</span>
              </div>
              <div className="flex items-center space-x-1">
                <Info className="h-4 w-4" />
                <span>All data is pre-seeded for demonstration purposes</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <div className="hidden sm:flex items-center space-x-1">
              <span>👑 Admin</span>
              <span>•</span>
              <span>👥 HR</span>
              <span>•</span>
              <span>👤 Employee</span>
            </div>
            <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-xs font-medium">
              Live Demo
            </div>
          </div>
        </div>
        
        {/* Mobile view */}
        <div className="md:hidden mt-2 text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>Switch user roles to explore features</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoBanner;