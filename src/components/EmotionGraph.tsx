import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { EmotionData } from '../types';

interface EmotionGraphProps {
  data: EmotionData[];
}

const EmotionGraph: React.FC<EmotionGraphProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
        />
        <YAxis />
        <Tooltip
          labelFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
        />
        <Legend />
        <Line type="monotone" dataKey="happy" stroke="#4CAF50" name="Happy" />
        <Line type="monotone" dataKey="sad" stroke="#2196F3" name="Sad" />
        <Line type="monotone" dataKey="angry" stroke="#F44336" name="Angry" />
        <Line type="monotone" dataKey="surprised" stroke="#FF9800" name="Surprised" />
        <Line type="monotone" dataKey="neutral" stroke="#9E9E9E" name="Neutral" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default EmotionGraph;