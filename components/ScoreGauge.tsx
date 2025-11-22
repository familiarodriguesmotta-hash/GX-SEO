import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ScoreGaugeProps {
  score: number;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score }) => {
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];

  const getColor = (val: number) => {
    if (val >= 90) return '#1D9BF0'; // Blue
    if (val >= 70) return '#F59E0B'; // Yellow/Orange
    return '#FF4500'; // Red/Orange
  };

  return (
    <div className="relative h-64 w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={100}
            startAngle={180}
            endAngle={0}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell key="cell-0" fill={getColor(score)} />
            <Cell key="cell-1" fill="#2F3336" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <p className="text-5xl font-bold text-white">{score}</p>
        <p className="text-gxTextMuted text-sm uppercase tracking-widest mt-2">SEO Score</p>
      </div>
    </div>
  );
};