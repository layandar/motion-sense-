export interface MotionSession {
  id: string;
  date: string;
  duration: number; // in minutes
  exerciseType: string;
  filename: string;
  aiAnalysis: {
    accuracy: number;
    classification: string;
    insights: string[];
    riskLevel: 'low' | 'medium' | 'high';
    improvementRate: number;
  };
  movements: {
    walking: number;
    sitting: number;
    standing: number;
    reaching: number;
  };
}

export interface ProgressMetrics {
  overallScore: number;
  consistencyScore: number;
  improvementTrend: 'improving' | 'stable' | 'declining';
  weeklyChange: number;
  totalSessions: number;
}

export interface User {
  id: string;
  name: string;
  type: 'patient' | 'physiotherapist' | 'coach';
  injuryType?: string;
  startDate: string;
}