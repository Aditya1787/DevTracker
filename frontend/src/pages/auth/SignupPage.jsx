import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { User, Mail, Lock, UserPlus, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const SignupPage = () => {
  const { signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreeTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: 'Very Weak', color: 'bg-rose-500' });

  // Calculate password strength procedurally
  useEffect(() => {
    const pw = formData.password;
    if (!pw) {
      setPasswordStrength({ score: 0, text: 'None', color: 'bg-slate-800' });
      return;
    }

    let score = 0;
    if (pw.length >= 6) score += 1;
    if (pw.length >= 10) score += 1;
    if (/[A-Z]/.test(pw)) score += 1;
    if (/[0-9]/.test(pw)) score += 1;
    if (/[^A-Za-z0-9]/.test(pw)) score += 1;

    let text = 'Very Weak';
    let color = 'bg-rose-500';

    if (score === 2) {
      text = 'Weak';
      color = 'bg-orange-500';
    } else if (score === 3) {
      text = 'Medium';
      color = 'bg-amber-500';
    } else if (score === 4) {
      text = 'Strong';
      color = 'bg-emerald-500';
    } else if (score === 5) {
      text = 'Exceptional';
      color = 'bg-indigo-500 shadow-md shadow-indigo-500/30';
    }

    setPasswordStrength({ score, text, color });
  }, [formData.password]);

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [e.target.name]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      showToast('You must agree to the Terms and Conditions', 'warning');
      return;
    }

    if (formData.password.length < 6) {
      showToast('Password must be at least 6 characters', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const res = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (res.success) {
        showToast('Account created successfully! Welcome to DevTrackr.', 'success');
        navigate('/dashboard');
      } else {
        showToast(res.message || 'Registration failed', 'error');
      }
    } catch (err) {
      showToast('An unexpected error occurred during signup', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1.5">
        <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">Create Account</h2>
        <p className="text-xs text-slate-450">
          Register now to unlock high-fidelity insights on your GitHub workflows
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
            Your Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Alex Mercer"
              className="block w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/50 border border-slate-800 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/70 focus:ring-1 focus:ring-indigo-500/30 transition-all font-medium"
              required
            />
          </div>
        </div>

        {/* Email */}
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
              placeholder="alex@company.com"
              className="block w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/50 border border-slate-800 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/70 focus:ring-1 focus:ring-indigo-500/30 transition-all font-medium"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
            Password
          </label>
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
          
          {/* Password strength bar */}
          {formData.password && (
            <div className="space-y-1 px-1 pt-1.5">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-500 font-semibold uppercase tracking-wider">Strength</span>
                <span className="font-bold text-slate-350">{passwordStrength.text}</span>
              </div>
              <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full ${passwordStrength.color} transition-all duration-350`}
                  style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Agree terms */}
        <div className="flex items-start gap-2.5 px-1 py-1.5 select-none">
          <input
            type="checkbox"
            name="agreeTerms"
            id="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleChange}
            className="w-4 h-4 rounded border-slate-800 bg-slate-950/50 text-indigo-650 focus:ring-indigo-500/30 focus:ring-offset-slate-900 mt-0.5 cursor-pointer accent-indigo-600"
          />
          <label htmlFor="agreeTerms" className="text-xs text-slate-450 leading-snug cursor-pointer">
            I agree to the{' '}
            <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              Privacy Policy
            </a>
          </label>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full py-3 mt-2 rounded-xl text-sm"
          icon={UserPlus}
        >
          Sign Up
        </Button>
      </form>

      <div className="text-center pt-2">
        <p className="text-xs text-slate-500">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-0.5"
          >
            <span>Sign in instead</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </p>
      </div>
    </div>
  );
};
export default SignupPage;
