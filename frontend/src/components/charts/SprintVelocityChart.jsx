import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Card } from '../common/Card';

export const SprintVelocityChart = ({ data = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <Card className="h-80 flex flex-col justify-between p-6 animate-pulse">
        <div className="h-5 bg-slate-800 rounded w-1/3" />
        <div className="h-48 bg-slate-800/40 rounded-xl w-full" />
      </Card>
    );
  }

  // Pre-process data or supply a default if empty
  const chartData = data.length > 0 ? data : [
    { name: 'Sprint 1', commits: 0, issues: 0 },
    { name: 'Sprint 2', commits: 0, issues: 0 },
    { name: 'Sprint 3', commits: 0, issues: 0 },
    { name: 'Sprint 4', commits: 0, issues: 0 }
  ];

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-sm font-bold text-slate-350 uppercase tracking-wider">Sprint Velocity</h3>
        <p className="text-xs text-slate-500">Weekly engineering delivery metrics across code and tasks</p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
            <XAxis 
              dataKey="name" 
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
            <Tooltip
              contentStyle={{
                backgroundColor: '#020617',
                borderColor: '#1e293b',
                borderRadius: '12px',
                color: '#f8fafc',
                fontSize: '12px'
              }}
            />
            <Legend 
              verticalAlign="top" 
              height={36} 
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8' }}
            />
            <Bar 
              dataKey="commits" 
              fill="#6366f1" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={30}
              name="Commits Closed"
              animationDuration={800}
            />
            <Bar 
              dataKey="issues" 
              fill="#06b6d4" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={30}
              name="Tasks Resolved"
              animationDuration={800}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
export default SprintVelocityChart;
