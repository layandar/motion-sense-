import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { MotionSession } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ProgressChartProps {
  sessions: MotionSession[];
  type: 'line' | 'bar';
  metric: 'accuracy' | 'movements';
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ sessions, type, metric }) => {
  const chartData = {
    labels: sessions.map(session => 
      new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ),
    datasets: metric === 'accuracy' ? [
      {
        label: 'AI Analysis Accuracy',
        data: sessions.map(session => session.aiAnalysis.accuracy),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      }
    ] : [
      {
        label: 'Walking',
        data: sessions.map(session => session.movements.walking),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
      {
        label: 'Standing',
        data: sessions.map(session => session.movements.standing),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
      },
      {
        label: 'Sitting',
        data: sessions.map(session => session.movements.sitting),
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
      },
      {
        label: 'Reaching',
        data: sessions.map(session => session.movements.reaching),
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value: any) {
            return value + '%';
          }
        }
      }
    }
  };

  return (
    <div className="h-80">
      {type === 'line' ? (
        <Line data={chartData} options={options} />
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
};