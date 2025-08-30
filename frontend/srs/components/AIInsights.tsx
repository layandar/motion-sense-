import React from 'react';
import { Brain, AlertTriangle, CheckCircle, Info, TrendingUp } from 'lucide-react';
import { MotionSession } from '../types';

interface AIInsightsProps {
  session: MotionSession;
  confidenceScores?: number[]; // Add confidence scores prop
}

export const AIInsights: React.FC<AIInsightsProps> = ({ session, confidenceScores = [] }) => {
  // Calculate risk level based on confidence scores
  const calculateRiskLevel = () => {
    if (confidenceScores.length === 0) return 'low';
    
    const lowConfidenceCount = confidenceScores.filter(score => score < 70).length;
    const lowConfidencePercentage = (lowConfidenceCount / confidenceScores.length) * 100;
    
    if (lowConfidencePercentage > 30) return 'high';
    if (lowConfidencePercentage > 10) return 'medium';
    return 'low';
  };

  // Generate insights based on activity distribution
  const generateInsights = () => {
    const insights: string[] = [];
    const movements = session.movements || {};
    
    // Check for sedentary behavior
    const sedentaryActivities = (movements.sitting || 0) + (movements.laying || 0);
    if (sedentaryActivities > 70) {
      insights.push("High sedentary time detected. Consider more movement breaks.");
    }
    
    // Check for activity variety
    const activeActivities = Object.entries(movements)
      .filter(([activity]) => activity.includes('walking') || activity.includes('upstairs') || activity.includes('downstairs'))
      .reduce((sum, [, percentage]) => sum + (percentage || 0), 0);
    
    if (activeActivities < 20) {
      insights.push("Low activity variety. Try incorporating different movement patterns.");
    }
    
    // Check for posture distribution
    if ((movements.standing || 0) > 50) {
      insights.push("Significant standing time. Ensure proper posture and take sitting breaks.");
    }
    
    // Add general recommendations
    insights.push(...(session.aiAnalysis?.recommendations || [
      "Maintain consistent activity patterns",
      "Focus on posture during transitions",
      "Regular movement breaks recommended"
    ]));
    
    return insights;
  };

  const getRiskIcon = () => {
    const riskLevel = calculateRiskLevel();
    switch (riskLevel) {
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'medium':
        return <Info className="w-5 h-5 text-yellow-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  const getRiskBadgeColor = () => {
    const riskLevel = calculateRiskLevel();
    switch (riskLevel) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  // Determine classification based on dominant activity
  const getClassification = () => {
    const movements = session.movements || {};
    const dominantActivity = Object.entries(movements).reduce(
      (max, [activity, percentage]) => 
        (percentage || 0) > (max.percentage || 0) ? { activity, percentage } : max,
      { activity: 'Mixed Activities', percentage: 0 }
    );
    
    return dominantActivity.activity
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const riskLevel = calculateRiskLevel();
  const insights = generateInsights();
  const classification = getClassification();
  const accuracy = session.aiAnalysis?.accuracy || 92;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Analysis</h3>
          <p className="text-sm text-gray-600">Powered by motion detection model</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-gray-700">Primary Activity</p>
            <p className="text-lg font-semibold text-gray-900">{classification}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Confidence</p>
    
          </div>
        </div>

        {confidenceScores.length > 0 && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between text-xs">
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Data Quality</span>
        
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Movement Insights</h4>
          <div className="space-y-2">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-700">{insight}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Activity Score</span>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm font-semibold text-gray-900">
                {session.aiAnalysis?.improvementRate || 15}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};