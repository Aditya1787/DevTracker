import React from 'react';

export const Footer = () => {
  return (
    <footer className="py-6 border-t border-slate-800 bg-slate-950/20 text-slate-500 text-xs text-center backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          &copy; {new Date().getFullYear()} <span className="font-semibold text-slate-400">DevTrackr</span>. All rights reserved.
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-slate-300 transition-colors">GitHub Integration Docs</a>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
