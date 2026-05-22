import React, { useContext, useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Sidebar } from '../components/layout/Sidebar';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Spinner } from '../components/common/Spinner';

export const DashboardLayout = () => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar_collapsed');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('sidebar_collapsed', isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  // Auth Loading gate
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-400 gap-4">
        <Spinner size="lg" />
        <p className="text-sm font-semibold tracking-wide animate-pulse">Initializing DevTrackr Workspace...</p>
      </div>
    );
  }

  // Auth Protection redirect
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Dynamic Grid Background Overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#0f172a_1.2px,transparent_1.2px),linear-gradient(to_bottom,#0f172a_1.2px,transparent_1.2px)] bg-[size:5rem_5rem] opacity-35 pointer-events-none z-0" />
      
      {/* Sidebar Navigation */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen z-10 transition-all duration-350 pl-0 pb-16 md:pb-0 ${
          isSidebarCollapsed ? 'md:pl-20' : 'md:pl-20 lg:pl-64'
        }`}
      >
        {/* Top Navbar */}
        <Navbar
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
        />

        {/* Content Panel */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-24 pb-8 max-w-7xl w-full mx-auto flex flex-col">
          <div className="flex-1 flex flex-col">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};
export default DashboardLayout;
