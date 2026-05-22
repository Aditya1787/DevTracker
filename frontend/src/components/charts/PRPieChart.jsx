import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '../common/Card';

export const PRPieChart = ({ open = 0, closed = 0, merged = 0, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card className="h-80 flex flex-col justify-between p-6 animate-pulse">
        <div className="h-5 bg-slate-800 rounded w-1/3" />
        <div className="h-48 bg-slate-800/40 rounded-full w-full" />
      </Card>
    );
  }

  const data = [
    { name: 'Merged', value: merged, color: '#10b981' }, // Emerald
    { name: 'Open', value: open, color: '#3b82f6' },   // Blue
    { name: 'Closed', value: closed, color: '#f43f5e' }  // Rose
  ].filter(item => item.value > 0); // Hide zero segments

  // Fallback if no PRs are available
  const displayData = data.length > 0 ? data : [
    { name: 'No PRs Found', value: 1, color: '#475569' }
  ];

  const renderCustomLegend = (props) => {
    const { payload } = props;
    return (
      <ul className="flex flex-wrap justify-center gap-4 mt-4 text-xs font-semibold">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center gap-1.5 text-slate-300">
            <span 
              className="w-2.5 h-2.5 rounded-full inline-block" 
              style={{ backgroundColor: entry.color }} 
            />
            <span>{entry.value}</span>
            <span className="text-slate-550 font-normal">
              ({entry.payload.value})
            </span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-sm font-bold text-slate-350 uppercase tracking-wider">PR Distribution</h3>
        <p className="text-xs text-slate-500">Pull request breakdown of current tracked workspace</p>
      </div>

      <div className="h-64 w-full flex flex-col justify-between">
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={displayData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                animationDuration={600}
              >
                {displayData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#020617',
                  borderColor: '#1e293b',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '12px'
                }}
              />
              <Legend content={renderCustomLegend} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};
export default PRPieChart;
