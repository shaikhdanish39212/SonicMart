import React from 'react';
import Sidebar from '../../components/admin/Sidebar';
import { PermissionsProvider } from '../../context/PermissionsContext';

const AdminLayout = ({ children }) => {
  return (
    <PermissionsProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-grow md:ml-64">
          <header className="bg-white shadow-sm border-b border-gray-200 px-2 sm:px-4 md:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Admin Panel</h1>
                <p className="mt-1 text-xs sm:text-sm text-gray-600">Manage your store efficiently</p>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="flex items-center space-x-2 bg-gray-100 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs sm:text-sm text-gray-700 font-medium">System Online</span>
                </div>
              </div>
            </div>
          </header>
          <div className="p-2 sm:p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </PermissionsProvider>
  );
};

export default AdminLayout;