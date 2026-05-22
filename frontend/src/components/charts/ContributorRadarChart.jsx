import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '../common/Card';

export const ContributorRadarChart = ({ contributor, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card className="h-80 flex flex-col justify-between p-6 animate-pulse">
        <div className="h-5 bg-slate-800 rounded w-1/3" />
        <div className="h-48 bg-slate-800/40 rounded-full w-full" />
      </Card>
    );
  }

  // Define metric fields and map them to clean percentages or scores
  const data = contributor ? [
    { subject: 'Commits', A: Math.min((contributor.commitCount || 0) * 10, 100), fullMark: 100 },
    { subject: 'Additions', A: Math.min((contributor.additions || 0) / 100, 100), fullMark: 100 },
    { subject: 'Deletions', A: Math.min((contributor.deletions || 0) / 50, 100), fullMark: 100 },
    { subject: 'Productivity', A: contributor.productivityScore || 0, fullMark: 100 },
    { subject: 'Active Days', A: Math.min((contributor.commitDates?.length || 1) * 20, 100), fullMark: 100 }
  ] : [
    { subject: 'Commits', A: 0, fullMark: 100 },
    { subject: 'Additions', A: 0, fullMark: 100 },
    { subject: 'Deletions', A: 0, fullMark: 100 },
    { subject: 'Productivity', A: 0, fullMark: 100 },
    { subject: 'Active Days', A: 0, fullMark: 100 }
  ];

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-350 uppercase tracking-wider">Engineering Footprint</h3>
        <p className="text-xs text-slate-500">
          {contributor ? `Multi-dimensional index for ${contributor.name}` : 'Relative profile metrics comparison'}
        </p>
      </div>

      <div className="h-64 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#334155" opacity={0.3} />
            <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={9} fontWeight={600} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={8} opacity={0.5} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#020617',
                borderColor: '#1e293b',
                borderRadius: '12px',
                color: '#f8fafc',
                fontSize: '11px'
              }}
            />
            <Radar
              name="Strength Index"
              dataKey="A"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.25}
              animationDuration={800}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
export default ContributorRadarChart;
