import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card } from '../common/Card';

export const CommitBarChart = ({ data = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <Card className="h-80 flex flex-col justify-between p-6 animate-pulse">
        <div className="h-5 bg-slate-800 rounded w-1/3" />
        <div className="h-48 bg-slate-800/40 rounded-xl w-full" />
      </Card>
    );
  }

  // Pre-process data: ensure it has at least some fallback display if empty
  const chartData = data.length > 0 ? data : [
    { name: 'Mon', count: 0 },
    { name: 'Tue', count: 0 },
    { name: 'Wed', count: 0 },
    { name: 'Thu', count: 0 },
    { name: 'Fri', count: 0 },
    { name: 'Sat', count: 0 },
    { name: 'Sun', count: 0 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950/95 border border-slate-850 p-3 rounded-xl shadow-2xl backdrop-blur-md">
          <p className="text-xs font-bold text-slate-400 mb-1">{label}</p>
          <p className="text-sm font-semibold text-indigo-400">
            Commits: <span className="font-mono font-bold text-slate-100">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-sm font-bold text-slate-350 uppercase tracking-wider">Commit Velocity</h3>
        <p className="text-xs text-slate-500">Total commit count trends grouped chronologically</p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="commitGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.85} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.25} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
            <XAxis 
              dataKey="_id" 
              stroke="#64748b" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              dy={10}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              dx={-5}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#334155', opacity: 0.15 }} />
            <Bar 
              dataKey="count" 
              fill="url(#commitGrad)" 
              radius={[6, 6, 0, 0]} 
              maxBarSize={40}
              animationDuration={800}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
export default CommitBarChart;
