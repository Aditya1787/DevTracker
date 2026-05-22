import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { 
  TrendingUp, 
  GitBranch, 
  BrainCircuit, 
  Clock, 
  Zap, 
  ArrowRight,
  Shield,
  Activity,
  Layers,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/common/Button';

// Counter component for scrolling stats counter animation
const AnimatedCounter = ({ value, duration = 2, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;
    
    let start = 0;
    const end = parseInt(value, 10);
    if (start === end) return;

    let totalMiliseconds = duration * 1000;
    let incrementTime = Math.abs(Math.floor(totalMiliseconds / end));
    
    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="font-mono">
      {count}
      {suffix}
    </span>
  );
};

export const LandingPage = () => {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Decorative gradient meshes */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="absolute top-[30%] right-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none animate-pulse" style={{ animationDuration: '12s' }} />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />

      {/* 1. Header/Navigation */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-650 to-cyan-500 text-white shadow-lg shadow-indigo-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-indigo-200 via-indigo-50 to-cyan-150 bg-clip-text text-transparent tracking-tight">
            DevTrackr
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-semibold text-slate-400 hover:text-slate-200 transition-colors">
            Sign In
          </Link>
          <Link to="/signup">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-24 md:pt-20 md:pb-32 text-center flex flex-col items-center">
        {/* Banner Pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-indigo-400 mb-6 backdrop-blur-md shadow-lg"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Empowering Engineering Teams with Claude AI Insights</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] max-w-3xl mb-6"
        >
          Engineering Analytics Met{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-indigo-200 to-cyan-400 bg-clip-text text-transparent">
            AI Intelligence.
          </span>
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mb-10 leading-relaxed"
        >
          DevTrackr connects to your GitHub repositories to visualize commits, branch history, and pull requests, generating real-time productivity metrics and strategic developer feedback.
        </motion.p>

        {/* CTA triggers */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-20"
        >
          <Link to="/signup">
            <Button size="lg" className="w-full sm:w-auto font-bold px-8 shadow-indigo-500/20" icon={ArrowRight}>
              Start Tracking Free
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto font-semibold px-8">
              Explore Demo
            </Button>
          </Link>
        </motion.div>

        {/* Glassmorphism Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring', damping: 25 }}
          className="w-full max-w-5xl rounded-2xl bg-slate-900/60 border border-slate-800/80 p-3 shadow-2xl backdrop-blur-sm relative group"
        >
          <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl pointer-events-none rounded-2xl" />
          <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-850 shadow-inner flex flex-col aspect-[16/9]">
            {/* Mock Header */}
            <div className="h-10 bg-slate-900 border-b border-slate-850 flex items-center px-4 justify-between">
              <div className="flex gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[10px] text-slate-500 font-mono">devtrackr.io/dashboard</span>
              <div className="w-6" />
            </div>
            {/* Mock Dashboard body */}
            <div className="flex-1 flex p-4 gap-4 bg-slate-950/90 text-left select-none">
              {/* Sidebar skeleton */}
              <div className="w-1/5 flex flex-col gap-2.5 border-r border-slate-850 pr-4">
                <div className="h-6 bg-slate-900 rounded-lg w-3/4" />
                <div className="h-14 bg-slate-900 rounded-lg mt-2" />
                <div className="space-y-2 mt-4">
                  <div className="h-4 bg-indigo-500/10 border-l-2 border-indigo-500 rounded w-full" />
                  <div className="h-4 bg-slate-900 rounded w-5/6" />
                  <div className="h-4 bg-slate-900 rounded w-11/12" />
                </div>
              </div>
              {/* Analytics skeleton */}
              <div className="flex-1 flex flex-col gap-4">
                <div className="grid grid-cols-4 gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-16 bg-slate-900 border border-slate-850/60 rounded-xl p-2.5 flex flex-col justify-between">
                      <div className="h-3 bg-slate-800 rounded w-1/2" />
                      <div className="h-5 bg-slate-850 rounded w-3/4 mt-1" />
                    </div>
                  ))}
                </div>
                <div className="flex-grow grid grid-cols-3 gap-3">
                  <div className="col-span-2 bg-slate-900 border border-slate-850/60 rounded-xl p-3 flex flex-col justify-between">
                    <div className="h-4 bg-slate-800 rounded w-1/4" />
                    <div className="flex items-end gap-2.5 h-32 pt-4">
                      <div className="bg-indigo-500/20 h-10 w-full rounded-t" />
                      <div className="bg-indigo-500/40 h-20 w-full rounded-t" />
                      <div className="bg-indigo-500/60 h-28 w-full rounded-t" />
                      <div className="bg-cyan-500 h-16 w-full rounded-t" />
                      <div className="bg-indigo-500 h-24 w-full rounded-t" />
                    </div>
                  </div>
                  <div className="bg-slate-900 border border-slate-850/60 rounded-xl p-3 flex flex-col justify-between">
                    <div className="h-4 bg-slate-800 rounded w-1/3" />
                    <div className="flex-1 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full border-8 border-slate-850 border-t-indigo-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. Stats Section */}
      <section className="relative z-10 border-y border-slate-900 bg-slate-950/40 py-16 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-1">
            <p className="text-4xl md:text-5xl font-black text-indigo-400 tracking-tight">
              <AnimatedCounter value="12" suffix="M+" />
            </p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Commits Tracked</p>
          </div>
          <div className="space-y-1 border-y border-slate-900 md:border-y-0 md:border-x md:border-slate-900 py-6 md:py-0">
            <p className="text-4xl md:text-5xl font-black text-cyan-400 tracking-tight">
              <AnimatedCounter value="450" suffix="K+" />
            </p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reports Generated</p>
          </div>
          <div className="space-y-1">
            <p className="text-4xl md:text-5xl font-black text-emerald-400 tracking-tight">
              <AnimatedCounter value="99" suffix="%" />
            </p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Satisfied Developers</p>
          </div>
        </div>
      </section>

      {/* 4. Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="text-center space-y-3 mb-16 md:mb-24">
          <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">Everything You Need To Optimize Workflows</h2>
          <p className="text-sm text-slate-450 max-w-xl mx-auto leading-relaxed">
            Connect your repositories in seconds and discover actionable metrics, performance analysis, and detailed contributor tracking.
          </p>
        </div>

        {/* 6-Card Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Automated Syncing',
              desc: 'Seamlessly indexes repository commits, branches, issues, and PR histories in MongoDB on a recurring 6h cron schedule.',
              icon: GitBranch,
              color: 'text-indigo-400'
            },
            {
              title: 'Claude AI Insights',
              desc: 'Harnesses Anthropic models to inspect performance statistics and deliver detailed summaries on bottlenecks.',
              icon: BrainCircuit,
              color: 'text-cyan-400'
            },
            {
              title: 'Productivity Normalizer',
              desc: 'Features a proprietary algorithm compiling commit volumes, PR velocities, and issue response times.',
              icon: Activity,
              color: 'text-emerald-400'
            },
            {
              title: 'High-Fidelity PDF Export',
              desc: 'Export high-resolution PDF documents featuring dual styled headers, charts metadata tables, and action items.',
              icon: FileText,
              color: 'text-amber-400'
            },
            {
              title: 'Glassmorphism Charts',
              desc: 'Visualizes contributor speeds and issue resolutions using beautiful Recharts bar, line, radar, and donut grids.',
              icon: Layers,
              color: 'text-rose-400'
            },
            {
              title: 'Secure Access & JWT',
              desc: 'Protects user sessions using cryptographically signed JSON Web Tokens and robust HTTP security headers.',
              icon: Shield,
              color: 'text-sky-400'
            }
          ].map((feat, index) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/60 hover:-translate-y-1.5 transition-all duration-300 backdrop-blur-md relative"
              >
                <div className="absolute inset-0 bg-indigo-500/[0.01] rounded-2xl group-hover:bg-indigo-500/[0.03] transition-colors" />
                <div className={`p-3 rounded-xl bg-slate-950 border border-slate-850 w-fit mb-5 group-hover:scale-110 transition-transform ${feat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-200 mb-2.5">{feat.title}</h3>
                <p className="text-xs text-slate-450 leading-relaxed">{feat.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 5. How It Works Section */}
      <section className="relative z-10 border-t border-slate-900 bg-slate-950/20 py-24 md:py-32 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-3 mb-20">
            <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">Four Simple Steps to Onboarding</h2>
            <p className="text-sm text-slate-450 max-w-xl mx-auto leading-relaxed">
              We designed the tracking pipeline to require minimal developer effort. Follow these simple steps.
            </p>
          </div>

          {/* 4-Step horizontal flow chart */}
          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 lg:gap-8">
            {/* Horizontal connecting line on desktop */}
            <div className="hidden md:block absolute top-7 left-1/8 right-1/8 h-0.5 bg-gradient-to-r from-indigo-500/10 via-cyan-500/30 to-emerald-500/10 pointer-events-none z-0" />

            {[
              {
                step: '01',
                title: 'Create Account',
                desc: 'Sign up for a DevTrackr workspace in seconds using your name and email address.',
                color: 'border-indigo-500/30 text-indigo-400 bg-indigo-950/10'
              },
              {
                step: '02',
                title: 'Connect GitHub',
                desc: 'Authenticate through GitHub OAuth to securely delegate repository scan tokens.',
                color: 'border-cyan-500/30 text-cyan-400 bg-cyan-950/10'
              },
              {
                step: '03',
                title: 'Link Repository',
                desc: 'Select which active or private repo you want DevTrackr to track and analyze.',
                color: 'border-emerald-500/30 text-emerald-400 bg-emerald-950/10'
              },
              {
                step: '04',
                title: 'Run AI Report',
                desc: 'Trigger the Claude engine to extract developer performance, scoreboards, and PDF files.',
                color: 'border-amber-500/30 text-amber-400 bg-amber-950/10'
              }
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-slate-900/40 border border-slate-850/60 backdrop-blur-md z-10"
              >
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-mono font-bold text-sm mb-5 shadow-lg ${item.color}`}>
                  {item.step}
                </div>
                <h3 className="text-sm font-bold text-slate-200 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-450 leading-relaxed max-w-[200px]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Call to Action Banner */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-900/60 via-slate-900/80 to-cyan-900/40 border border-slate-800/80 p-10 md:p-14 shadow-2xl backdrop-blur-md relative overflow-hidden flex flex-col items-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_60%_at_50%_50%,#312e81/15,transparent_100%)] pointer-events-none" />
          
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mb-4 max-w-lg tracking-tight leading-snug">
            Ready to Unlock High-Fidelity Engineering Metrics?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-8 leading-relaxed">
            Link your first GitHub repository now and trigger detailed AI audits. Free onboarding and setup.
          </p>
          <Link to="/signup">
            <Button size="lg" className="px-8 font-bold" icon={ArrowRight}>
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="relative z-10 border-t border-slate-900 py-12 text-slate-500 text-xs mt-12 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-650 to-cyan-500 text-white shadow-lg shadow-indigo-500/20 flex-shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-400 tracking-tight">DevTrackr</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} DevTrackr. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-350 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-350 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-350 transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default LandingPage;
