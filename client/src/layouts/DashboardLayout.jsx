import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="h-screen flex bg-slate-50 dark:bg-dark-950 transition-colors duration-300 overflow-hidden relative">
      {/* Dynamic Background Blur Blobs */}
      <div className="gradient-blob w-[400px] h-[400px] bg-brand-500 top-[-100px] left-[-100px]" />
      <div className="gradient-blob w-[500px] h-[500px] bg-indigo-500 bottom-[-200px] right-[-200px]" />

      {/* Mobile Backdrop overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-dark-950/40 backdrop-blur-sm z-20 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Nav */}
      <Sidebar isOpen={sidebarOpen} onLinkClick={closeSidebar} />

      {/* Right Column: Navbar + Scrollable Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* App Header */}
        <Navbar onMenuToggle={toggleSidebar} />

        {/* Scrollable Dashboard Content */}
        <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto overflow-x-hidden z-10 max-w-[1400px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
