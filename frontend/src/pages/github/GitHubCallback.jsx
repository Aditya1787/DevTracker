import React, { useEffect, useContext, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { connectGitHub } from '../../api/github.api';
import { AuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import { Spinner } from '../../components/common/Spinner';
import { AlertTriangle } from 'lucide-react';
import { GithubIcon } from '../../components/common/GithubIcon';

export const GitHubCallback = () => {
  const [searchParams] = useSearchParams();
  const { setUser } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    const code = searchParams.get('code');
    if (hasTriggeredRef.current) return;
    
    if (!code) {
      showToast('No authorization code found in URL', 'error');
      navigate('/dashboard');
      return;
    }

    const exchangeCode = async () => {
      hasTriggeredRef.current = true;
      try {
        const res = await connectGitHub(code);
        if (res.success && res.data) {
          // Update authenticated user credentials
          setUser(prev => ({
            ...prev,
            githubUsername: res.data.githubUsername,
            githubAvatar: res.data.githubAvatar
          }));
          showToast('Successfully connected GitHub account!', 'success');
        } else {
          showToast(res.message || 'Failed to connect GitHub account', 'error');
        }
      } catch (err) {
        console.error('OAuth connection error:', err);
        showToast(err.response?.data?.message || 'Error authenticating with GitHub', 'error');
      } finally {
        navigate('/repositories');
      }
    };

    exchangeCode();
  }, [searchParams, setUser, showToast, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-450 gap-5">
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-xl animate-pulse" />
        <div className="relative p-5 bg-slate-900 border border-slate-800 rounded-3xl text-indigo-400">
          <GithubIcon className="w-12 h-12" />
        </div>
      </div>
      <div className="text-center space-y-2 max-w-sm">
        <h2 className="text-lg font-bold text-slate-200">Completing GitHub Handshake</h2>
        <p className="text-xs text-slate-500 leading-relaxed animate-pulse">
          Exchanging authorization codes for credentials. Please do not close or reload this tab.
        </p>
      </div>
      <Spinner size="md" className="mt-2" />
    </div>
  );
};
export default GitHubCallback;
