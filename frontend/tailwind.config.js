/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0F172A', // slate-950
        surface: '#1E293B',    // slate-800
        border: '#334155',     // slate-700
        primary: '#6366F1',    // indigo-500
        secondary: '#8B5CF6',  // violet-500
        accent: '#06B6D4',     // cyan-500
        success: '#10B981',    // emerald-500
        warning: '#F59E0B',    // amber-500
        danger: '#EF4444',     // red-500
        textPrimary: '#F8FAFC', // slate-50
        textMuted: '#94A3B8',   // slate-400
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6366F1, #8B5CF6)',
        'gradient-accent': 'linear-gradient(135deg, #06B6D4, #6366F1)',
      }
    },
  },
  plugins: [],
}
