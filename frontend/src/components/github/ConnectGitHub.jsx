import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Info, ShieldCheck, Zap } from 'lucide-react';
import { GithubIcon } from '../common/GithubIcon';
import { GITHUB_OAUTH_URL } from '../../utils/constants';

export const ConnectGitHub = () => {
  return (
    <div className="flex-1 flex items-center justify-center p-6 select-none">
      <Card className="max-w-xl w-full p-8 md:p-10 text-center relative overflow-hidden flex flex-col items-center">
        {/* Glow backdrop */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
        
        {/* Github Logo Badge */}
        <div className="p-4 rounded-3xl bg-slate-950 border border-slate-850 w-fit mb-6 text-indigo-400 shadow-lg shadow-indigo-500/5">
          <GithubIcon className="w-10 h-10" />
        </div>

        <h2 className="text-xl md:text-2xl font-extrabold text-slate-100 mb-3 tracking-tight">
          Link Your GitHub Account
        </h2>
        <p className="text-xs md:text-sm text-slate-450 leading-relaxed max-w-sm mb-8">
          To begin tracking metrics, link your GitHub profile. DevTrackr will compile data from repositories.
        </p>

        <a href={GITHUB_OAUTH_URL} className="w-full sm:w-auto">
          <Button size="lg" className="w-full sm:w-auto font-bold px-8" icon={GithubIcon}>
            Connect GitHub
          </Button>
        </a>

        {/* Benefits Info Checklist */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-850 pt-8 w-full text-left">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300 font-bold text-xs">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Real-time sync</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-snug">Track commits, PRs, and issues directly.</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300 font-bold text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Secure Scopes</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-snug">Read-only metadata indexing, no code storage.</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300 font-bold text-xs">
              <Info className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI Diagnostics</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-snug">Unlock bottlenecks and recommendations.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
export default ConnectGitHub;
