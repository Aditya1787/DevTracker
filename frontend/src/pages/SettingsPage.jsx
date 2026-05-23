import React, { useContext, useState } from 'react';
import { User, Shield, Sliders, Moon, Sun, Key, Save, AlertCircle, RefreshCw } from 'lucide-react';
import { GithubIcon } from '../components/common/GithubIcon';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { GitHubContext } from '../contexts/GitHubContext';
import { useToast } from '../hooks/useToast';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';

const SettingsPage = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { disconnectGitHub, isLoading: isGitHubDisconnecting } = useContext(GitHubContext);
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'github' | 'security' | 'preferences'

  // Forms states
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleProfileSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast('Profile configuration updated successfully!', 'success');
    }, 1000);
  };

  const handleSecuritySave = (e) => {
    e.preventDefault();
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      showToast('Passwords do not match!', 'error');
      return;
    }
    if (securityForm.newPassword.length < 6) {
      showToast('New password must be at least 6 characters!', 'warning');
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast('Account passwords updated successfully!', 'success');
      setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }, 1200);
  };

  const handleDisconnectGitHub = async () => {
    showToast('Disconnecting GitHub credentials from database...', 'info');
    const res = await disconnectGitHub();
    if (res.success) {
      showToast('GitHub account disconnected successfully!', 'success');
    } else {
      showToast(res.message || 'Failed to disconnect GitHub', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          Console Settings
        </h1>
        <p className="text-xs text-textMuted mt-1">
          Customize workspace configurations, profile configurations, and secure auth scopes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start text-left">
        {/* Navigation Sidebar Cards */}
        <div className="lg:col-span-1 space-y-2 bg-slate-950/40 p-2.5 rounded-2xl border border-slate-850">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 text-xs font-bold py-2.5 px-4 rounded-xl transition-all ${
              activeTab === 'profile'
                ? 'bg-indigo-650 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Specs</span>
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`w-full flex items-center gap-3 text-xs font-bold py-2.5 px-4 rounded-xl transition-all ${
              activeTab === 'github'
                ? 'bg-indigo-650 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <GithubIcon className="w-4 h-4" />
            <span>GitHub Auth Scope</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 text-xs font-bold py-2.5 px-4 rounded-xl transition-all ${
              activeTab === 'security'
                ? 'bg-indigo-650 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Security & keys</span>
          </button>

          <button
            onClick={() => setActiveTab('preferences')}
            className={`w-full flex items-center gap-3 text-xs font-bold py-2.5 px-4 rounded-xl transition-all ${
              activeTab === 'preferences'
                ? 'bg-indigo-650 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Preferences</span>
          </button>
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <Card title="Profile Specifications" icon={User}>
              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">
                      Developer Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-slate-200 font-medium transitionOutline outline-none focus:ring-1 focus:ring-indigo-500/20"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-slate-200 font-medium transitionOutline outline-none focus:ring-1 focus:ring-indigo-500/20"
                      required
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" disabled={isSaving} icon={Save} size="sm">
                    {isSaving ? 'Saving Configurations...' : 'Save Settings'}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {activeTab === 'github' && (
            <Card title="GitHub Integrations" icon={GithubIcon}>
              <div className="space-y-6">
                {user?.githubToken ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-850 rounded-xl">
                      <div className="flex items-center gap-3">
                        {user.githubAvatar ? (
                          <img
                            src={user.githubAvatar}
                            alt={user.githubUsername}
                            className="w-10 h-10 rounded-full border border-slate-800 shadow"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold">
                            {user.githubUsername?.charAt(0).toUpperCase() || 'GH'}
                          </div>
                        )}
                        <div>
                          <h4 className="text-xs font-bold text-slate-200">
                            {user.githubUsername || 'Linked Member'}
                          </h4>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                            Status: Telemetry Sync Ingest Active
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                        Linked
                      </span>
                    </div>

                    <div className="p-4 rounded-xl border border-rose-500/15 bg-rose-500/5 space-y-3">
                      <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4" />
                        <span>Disconnect Integrations</span>
                      </h4>
                      <p className="text-xs text-rose-350/80 leading-relaxed">
                        Disconnecting credentials will immediately halt developer telemetry indexes and lock your dashboards.
                      </p>
                       <Button
                        variant="gradient"
                        size="xs"
                        onClick={handleDisconnectGitHub}
                        disabled={isGitHubDisconnecting}
                        className="bg-gradient-to-r from-rose-600 to-red-600 text-white font-bold"
                      >
                        {isGitHubDisconnecting ? 'Disconnecting...' : 'Disconnect GitHub Scope'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center space-y-4 flex flex-col items-center">
                    <GithubIcon className="w-12 h-12 text-slate-500 animate-pulse" />
                    <h4 className="text-sm font-bold text-slate-200">No Credentials Linked</h4>
                    <p className="text-xs text-textMuted max-w-sm leading-relaxed">
                      Link your GitHub credentials to extract stats, stars, merges, contributor profiles, and sprint pipelines.
                    </p>
                    <a href="/repositories">
                      <Button size="sm">Connect Credentials</Button>
                    </a>
                  </div>
                )}
              </div>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card title="Security Credentials" icon={Shield}>
              <form onSubmit={handleSecuritySave} className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={securityForm.currentPassword}
                      onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-slate-200 font-medium transitionOutline outline-none focus:ring-1 focus:ring-indigo-500/20"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={securityForm.newPassword}
                        onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-slate-200 font-medium transitionOutline outline-none focus:ring-1 focus:ring-indigo-500/20"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={securityForm.confirmPassword}
                        onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-slate-200 font-medium transitionOutline outline-none focus:ring-1 focus:ring-indigo-500/20"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" disabled={isSaving} icon={Key} size="sm">
                    {isSaving ? 'Updating Password Credentials...' : 'Save Password'}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {activeTab === 'preferences' && (
            <Card title="Preferences Dashboard" icon={Sliders}>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-850 rounded-xl">
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Theme Configurations</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Toggle active layouts between dark and light themes.
                    </p>
                  </div>

                  <button
                    onClick={toggleTheme}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-850 text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
                  </button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
