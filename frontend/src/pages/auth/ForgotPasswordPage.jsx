import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword, resetPassword } from '../../api/auth.api';
import { useToast } from '../../hooks/useToast';
import { Mail, Lock, Key, ArrowLeft, Send, CheckCircle2, RefreshCw } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const ForgotPasswordPage = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1 = Request token, 2 = Reset password

  const handleRequestToken = async (e) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter your email address', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const res = await forgotPassword(email);
      if (res.success && res.data?.resetToken) {
        setResetToken(res.data.resetToken);
        showToast('Password reset token generated!', 'success');
        setStep(2); // Advance to password reset form
      } else {
        showToast(res.message || 'Email not found', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to request password reset', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetToken || !newPassword) {
      showToast('Please fill in all fields', 'warning');
      return;
    }

    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters', 'warning');
      return;
    }

    setIsResetLoading(true);
    try {
      const res = await resetPassword(resetToken, newPassword);
      if (res.success) {
        showToast('Password reset successful! You can now log in.', 'success');
        setStep(3); // Success step
      } else {
        showToast(res.message || 'Failed to reset password', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to reset password. Token might be invalid or expired.', 'error');
    } finally {
      setIsResetLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {step === 1 && (
        <>
          <div className="text-center space-y-1.5">
            <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">Forgot Password?</h2>
            <p className="text-xs text-slate-450 text-center leading-relaxed">
              No problem! Enter your email address below, and we will generate a secure reset token directly on this screen.
            </p>
          </div>

          <form onSubmit={handleRequestToken} className="space-y-4">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="developer@company.com"
                  className="block w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/50 border border-slate-800 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/70 focus:ring-1 focus:ring-indigo-500/30 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full py-3 mt-2 rounded-xl text-sm"
              icon={Send}
            >
              Request Token
            </Button>
          </form>
        </>
      )}

      {step === 2 && (
        <>
          <div className="text-center space-y-1.5">
            <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">Reset Password</h2>
            <p className="text-xs text-slate-450 text-center leading-relaxed">
              We generated a secure simulated reset token. Fill in the fields below to complete your password update.
            </p>
          </div>

          {/* Secure token display area */}
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 text-left space-y-2 select-text">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Key className="w-3.5 h-3.5 animate-pulse" />
              <span>Simulated Reset Token</span>
            </div>
            <p className="font-mono text-xs text-indigo-300 break-all bg-slate-950/80 p-2.5 rounded-xl select-all border border-slate-850">
              {resetToken}
            </p>
            <p className="text-[10px] text-slate-500 leading-snug">
              This token has been copied to your clipboard or you can double click to copy. In production, this token would be emailed.
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-4">
            {/* Display Readonly token input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
                Verification Token
              </label>
              <input
                type="text"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                className="block w-full px-4 py-3 rounded-xl bg-slate-950/30 border border-slate-800 text-sm text-slate-400 focus:outline-none focus:border-indigo-500/70 focus:ring-1 focus:ring-indigo-500/30 transition-all font-medium font-mono"
                required
              />
            </div>

            {/* Password input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/50 border border-slate-800 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/70 focus:ring-1 focus:ring-indigo-500/30 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isResetLoading}
              className="w-full py-3 mt-2 rounded-xl text-sm"
              icon={RefreshCw}
            >
              Update Password
            </Button>
          </form>
        </>
      )}

      {step === 3 && (
        <div className="text-center space-y-6 py-4">
          <div className="flex justify-center text-emerald-400 animate-bounce">
            <CheckCircle2 className="w-16 h-16" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">All Set!</h2>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              Your password has been successfully updated. You can now use your new password to sign in to DevTrackr.
            </p>
          </div>
          <Link to="/login" className="block">
            <Button className="w-full py-3 rounded-xl text-sm">
              Back to Sign In
            </Button>
          </Link>
        </div>
      )}

      {step < 3 && (
        <div className="text-center pt-2">
          <Link
            to="/login"
            className="text-xs font-semibold text-slate-500 hover:text-slate-350 transition-colors inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>
      )}
    </div>
  );
};
export default ForgotPasswordPage;
