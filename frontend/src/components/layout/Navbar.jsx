import React, { useContext, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { GitHubContext } from '../../contexts/GitHubContext';
import { 
  Bell, 
  Search, 
  User as UserIcon, 
  Settings, 
  LogOut, 
  Menu,
  ChevronDown
} from 'lucide-react';
import { GithubIcon } from '../common/GithubIcon';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';

export const Navbar = ({ isSidebarCollapsed, setIsSidebarCollapsed }) => {
  const { user, logout } = useContext(AuthContext);
  const { selectedRepo } = useContext(GitHubContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Derive page title from active path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return 'Dashboard';
    if (path.startsWith('/repositories')) return 'Repositories';
    if (path.startsWith('/insights')) return 'AI Insights';
    if (path.startsWith('/reports')) return 'Reports';
    if (path.startsWith('/settings')) return 'Settings';
    return 'Analytics';
  };

  const getGithubAuthUrl = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID || 'Ov23ct4Fw8K4q8B0U2Gv'; // Fallback
    const redirectUri = encodeURIComponent('http://localhost:5000/api/github/callback');
    return `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo,user&redirect_uri=${redirectUri}`;
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-20 flex items-center justify-between h-16 px-6 bg-slate-900/60 backdrop-blur-md border-b border-slate-800 transition-all duration-350 md:pl-20 pl-6 lg:pl-64"
      style={{
        paddingLeft: typeof window !== 'undefined' && window.innerWidth >= 768 
          ? isSidebarCollapsed ? '5rem' : '16rem'
          : '1.5rem'
      }}
    >
      {/* Page Title & Mobile Sidebar trigger */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsSidebarCollapsed(prev => !prev)}
          className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-850"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span>{getPageTitle()}</span>
            {selectedRepo && (
              <span className="hidden sm:inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-750">
                {selectedRepo.repoName}
              </span>
            )}
          </h1>
        </div>
      </div>

      {/* Action buttons (Right-aligned) */}
      <div className="flex items-center gap-4">
        {/* Onboarding Connect GitHub banner */}
        {user && !user.githubUsername ? (
          <a
            href={getGithubAuthUrl()}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-650 to-cyan-500 hover:from-indigo-550 hover:to-cyan-400 text-white shadow-lg shadow-indigo-500/10 transition-all scale-100 active:scale-95 border border-indigo-500/20"
          >
            <GithubIcon className="w-4 h-4" />
            <span>Connect GitHub</span>
          </a>
        ) : null}

        {/* Search tool */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/40 border border-slate-850 text-slate-550 focus-within:border-slate-700/80 focus-within:text-slate-300 transition-colors w-64 max-w-xs shadow-inner">
          <Search className="w-4 h-4 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search commits or contributors..."
            className="bg-transparent border-none outline-none text-xs w-full text-slate-200 placeholder-slate-600"
          />
        </div>

        {/* Notifications (Bell button) */}
        <button className="relative p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors">
          <Bell className="w-4.5 h-4.5" />
          {user && !user.githubUsername && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-2 ring-slate-900 animate-pulse" />
          )}
        </button>

        {/* User Profile dropdown menu */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl hover:bg-slate-800/50 transition-colors text-left"
            >
              <Avatar
                src={user.githubAvatar}
                name={user.name}
                size="sm"
                className="border border-slate-800"
              />
              <ChevronDown className={`w-3.5 h-3.5 text-slate-450 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-48 z-20 rounded-xl bg-slate-900 border border-slate-850 shadow-2xl p-1.5 text-slate-350">
                  <div className="px-3 py-2 border-b border-slate-850 mb-1">
                    <p className="text-xs font-bold text-slate-200 truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                  </div>
                  
                  <Link
                    to="/settings"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs hover:bg-slate-800 hover:text-slate-200 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs hover:bg-rose-500/10 hover:text-rose-400 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
export default Navbar;
