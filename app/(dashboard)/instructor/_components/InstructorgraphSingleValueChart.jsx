'use client';

import React from 'react';
import {
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts';

const data = [
  
  { value: 32 },
  { value: 100 },
  { value: 35 },
  { value: 50 },
  { value: 40 },
  { value: 55 },
  { value: 20 },
  { value: 100 },
  { value: 18 },
  { value: 80 },
  { value: 22 },
  { value: 68 },
];

export default function CurvedWaveChart() {
  return (
    <div className="w-full max-w-md h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke="#66CB9F"
            strokeWidth={2.5}
            dot={false}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
