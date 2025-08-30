import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ProgressCardProps {
  title: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  subtitle?: string;
  unit?: string;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  value,
  trend,
  subtitle,
  unit = '%'
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      default:
        return <Minus className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {getTrendIcon()}
      </div>
      <div className="flex items-baseline space-x-2">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        <span className="text-sm text-gray-500">{unit}</span>
      </div>
      {subtitle && (
        <p className={`text-sm mt-1 ${getTrendColor()}`}>{subtitle}</p>
      )}
    </div>
  );
};