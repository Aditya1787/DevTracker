import React, { useContext } from 'react';
import { Navigate, Outlet, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export const AuthLayout = () => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  if (isAuthenticated && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-slate-950 overflow-hidden px-4 py-12 select-none">
      {/* Decorative gradient meshes */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />
      
      {/* Dynamic Grid Background Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Floating brand header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 z-10 flex flex-col items-center gap-3"
      >
        <Link to="/" className="flex items-center gap-3 bg-slate-900/80 px-4 py-2 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-md hover:border-slate-700/60 transition-colors">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-650 to-cyan-500 text-white shadow-lg shadow-indigo-500/20">
            <TrendingUp className="w-5 h-5 animate-pulse" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-indigo-200 via-indigo-50 to-cyan-150 bg-clip-text text-transparent tracking-tight">
            DevTrackr
          </span>
        </Link>
      </motion.div>

      {/* Card wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring', damping: 25 }}
        className="relative z-10 w-full max-w-md bg-slate-900/65 backdrop-blur-md border border-slate-800/80 rounded-3xl p-8 md:p-10 shadow-2xl"
      >
        <Outlet />
      </motion.div>

      {/* Footer copyright */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-xs text-slate-550 z-10 text-center font-medium"
      >
        &copy; {new Date().getFullYear()} DevTrackr. Secured using industry-standard JWT.
      </motion.div>
    </div>
  );
};
export default AuthLayout;
