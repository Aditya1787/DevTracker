import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import { RepoSelector } from '../github/RepoSelector';
import { 
  LayoutDashboard, 
  GitFork, 
  BrainCircuit, 
  FileText, 
  Settings, 
  LogOut, 
  TrendingUp,
  Moon,
  Sun,
  Menu
} from 'lucide-react';
import { Avatar } from '../common/Avatar';

export const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { user, logout } = useContext(AuthContext);
  const { isDark, toggleTheme } = useContext(ThemeContext);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Repositories', path: '/repositories', icon: GitFork },
    { name: 'AI Insights', path: '/insights', icon: BrainCircuit },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900/90 backdrop-blur border-t border-slate-800 flex justify-around items-center z-30 px-2 py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium transition-all ${
                  isActive ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="truncate">{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      <aside
        className={`fixed top-0 bottom-0 left-0 z-30 flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-350 ${
          isCollapsed ? 'hidden md:flex w-20' : 'flex w-64'
        }`}
      >
        {/* Brand logo header */}
        <div className={`flex items-center h-16 border-b border-slate-800/80 transition-all ${
          isCollapsed ? 'px-4 justify-center' : 'px-4 justify-between lg:px-6'
        }`}>
          {isCollapsed ? (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors mx-auto"
              title="Expand sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
          ) : (
            <>
              <NavLink to="/dashboard" className="flex items-center gap-2.5 group flex-shrink-0">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-650 to-cyan-500 text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="font-bold text-lg bg-gradient-to-r from-indigo-200 via-indigo-50 to-cyan-150 bg-clip-text text-transparent tracking-tight">
                  DevTrackr
                </span>
              </NavLink>
              
              {/* Toggle Collapse button on desktop & Close button on mobile */}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                title="Collapse sidebar"
              >
                <Menu className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Repo Selector region */}
        <div className="p-4 border-b border-slate-850 bg-slate-950/20">
          <RepoSelector isCollapsed={isCollapsed} />
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-850 scrollbar-track-transparent">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-3 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                    isCollapsed ? 'justify-center pl-3' : 'justify-start pl-3.5'
                  } ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600/15 to-indigo-600/5 text-indigo-400 border-l-[3.5px] border-indigo-500'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border-l-[3.5px] border-transparent'
                  }`
                }
                title={isCollapsed ? item.name : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Area: User Profile, Theme toggle, Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/10 space-y-4">
          {/* Theme Toggle option */}
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/65 transition-colors text-xs font-semibold ${
              isCollapsed ? 'justify-center' : 'justify-between'
            }`}
          >
            <div className="flex items-center gap-3 pl-1">
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
              {!isCollapsed && <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
            </div>
          </button>

          {/* User Card */}
          {user && (
            <div className={`flex items-center gap-3 p-2 rounded-xl bg-slate-950/30 border border-slate-850 transition-all ${
              isCollapsed ? 'justify-center' : 'justify-between'
            }`}>
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar
                  src={user.githubAvatar}
                  name={user.name}
                  size="sm"
                  className="border border-slate-800"
                />
                {!isCollapsed && (
                  <div className="truncate text-left">
                    <p className="text-xs font-bold text-slate-200 truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">
                      {user.githubUsername ? `@${user.githubUsername}` : user.email}
                    </p>
                  </div>
                )}
              </div>
              {!isCollapsed && (
                <button
                  onClick={logout}
                  className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-lg transition-all"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
