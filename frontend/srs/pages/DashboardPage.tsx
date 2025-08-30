import React, { useState } from 'react';
import { ProgressCard } from '../components/ProgressCard';
import { ProgressChart } from '../components/ProgressChart';
import { AIInsights } from '../components/AIInsights';
import { mockSessions, mockProgressMetrics, mockUser } from '../data/mockData';
import { Calendar, User, Award, Target } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [chartMetric, setChartMetric] = useState<'accuracy' | 'movements'>('accuracy');

  const latestSession = mockSessions[mockSessions.length - 1];
  const daysSinceStart = Math.floor(
    (new Date().getTime() - new Date(mockUser.startDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {mockUser.name}
            </h1>
            <p className="text-lg text-gray-600">
              {mockUser.injuryType} • Day {daysSinceStart} of recovery
            </p>
          </div>
          <div className="flex items-center space-x-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <Calendar className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Last Session</p>
              <p className="text-sm text-gray-600">
                {new Date(latestSession.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <ProgressCard
          title="Overall Progress"
          value={mockProgressMetrics.overallScore}
          trend="up"
          subtitle="+12% this week"
        />
        <ProgressCard
          title="Consistency"
          value={mockProgressMetrics.consistencyScore}
          trend="up"
          subtitle="Excellent adherence"
        />
        <ProgressCard
          title="Sessions Completed"
          value={mockProgressMetrics.totalSessions}
          trend="up"
          subtitle="This week"
          unit=""
        />
        <ProgressCard
          title="Weekly Improvement"
          value={mockProgressMetrics.weeklyChange}
          trend="up"
          subtitle="Above target"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Progress Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 sm:mb-0">Progress Visualization</h2>
            <div className="flex flex-wrap gap-2">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setChartMetric('accuracy')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    chartMetric === 'accuracy'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  AI Accuracy
                </button>
                <button
                  onClick={() => setChartMetric('movements')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    chartMetric === 'movements'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  Movements
                </button>
              </div>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setChartType('line')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    chartType === 'line'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  Line
                </button>
                <button
                  onClick={() => setChartType('bar')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    chartType === 'bar'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  Bar
                </button>
              </div>
            </div>
          </div>
          <ProgressChart sessions={mockSessions} type={chartType} metric={chartMetric} />
        </div>

        {/* Latest AI Analysis */}
        <div>
          <AIInsights session={latestSession} />
        </div>
      </div>

      {/* Session Timeline */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <Target className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-900">Session Timeline</h2>
        </div>
        
        <div className="space-y-4">
          {mockSessions.map((session, index) => (
            <div key={session.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  session.aiAnalysis.riskLevel === 'low' ? 'bg-green-100' :
                  session.aiAnalysis.riskLevel === 'medium' ? 'bg-yellow-100' : 'bg-red-100'
                }`}>
                  <Award className={`w-5 h-5 ${
                    session.aiAnalysis.riskLevel === 'low' ? 'text-green-600' :
                    session.aiAnalysis.riskLevel === 'medium' ? 'text-yellow-600' : 'text-red-600'
                  }`} />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">{session.exerciseType}</h3>
                  <span className="text-sm text-gray-500">
                    {new Date(session.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{session.aiAnalysis.classification}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>Duration: {session.duration}min</span>
                  <span>Accuracy: {session.aiAnalysis.accuracy}%</span>
                  <span>Improvement: +{session.aiAnalysis.improvementRate}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};