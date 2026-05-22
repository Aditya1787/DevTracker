import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const LoginPage = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      showToast('Please fill in all fields', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(formData);
      if (res.success) {
        showToast('Welcome back to DevTrackr!', 'success');
        navigate('/dashboard');
      } else {
        showToast(res.message || 'Invalid email or password', 'error');
      }
    } catch (err) {
      showToast('An unexpected error occurred during login', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1.5">
        <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">Sign In</h2>
        <p className="text-xs text-slate-450">
          Enter your developer credentials to view your analytics dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email field */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="developer@company.com"
              className="block w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/50 border border-slate-800 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/70 focus:ring-1 focus:ring-indigo-500/30 transition-all font-medium"
              required
            />
          </div>
        </div>

        {/* Password field */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center px-1">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="block w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/50 border border-slate-800 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/70 focus:ring-1 focus:ring-indigo-500/30 transition-all font-medium"
              required
            />
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full py-3 mt-2 rounded-xl text-sm"
          icon={LogIn}
        >
          Sign In
        </Button>
      </form>

      <div className="text-center pt-2">
        <p className="text-xs text-slate-500">
          Don't have a DevTrackr account?{' '}
          <Link
            to="/signup"
            className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-0.5"
          >
            <span>Create one</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </p>
      </div>
    </div>
  );
};
export default LoginPage;
