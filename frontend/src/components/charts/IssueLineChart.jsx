import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Card } from '../common/Card';

export const IssueLineChart = ({ data = [], isLoading = false }) => {
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
    { name: 'W1', open: 0, closed: 0 },
    { name: 'W2', open: 0, closed: 0 },
    { name: 'W3', open: 0, closed: 0 },
    { name: 'W4', open: 0, closed: 0 }
  ];

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-sm font-bold text-slate-350 uppercase tracking-wider">Issue Resolutions</h3>
        <p className="text-xs text-slate-500">Timeline comparison of opened versus closed tickets</p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
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
            <Line 
              type="monotone" 
              dataKey="open" 
              stroke="#3b82f6" 
              strokeWidth={3} 
              dot={{ r: 4, strokeWidth: 0, fill: '#3b82f6' }}
              activeDot={{ r: 6 }} 
              name="Opened Issues"
              animationDuration={800}
            />
            <Line 
              type="monotone" 
              dataKey="closed" 
              stroke="#10b981" 
              strokeWidth={3} 
              dot={{ r: 4, strokeWidth: 0, fill: '#10b981' }}
              activeDot={{ r: 6 }} 
              name="Closed Issues"
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
export default IssueLineChart;
