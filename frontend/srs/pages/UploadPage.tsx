import React, { useState } from 'react';
import { FileUpload } from '../components/FileUpload';
import { AIInsights } from '../components/AIInsights';
import { Upload, FileText, Brain, AlertCircle } from 'lucide-react';

// Define proper TypeScript interfaces
interface ActivityAnalysis {
  accuracy: number;
  improvementRate: number;
  recommendations: string[];
}

interface AnalysisResult {
  filename: string;
  date: string;
  aiAnalysis: ActivityAnalysis;
  movements: Record<string, number>;
  predictions: string[];
  confidenceScores: number[];
  totalWindows: number;
}

export const UploadPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // Use environment variable for API URL with fallback
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8030';

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setIsProcessing(true);
    setError(null);
    setProgress(0);
    
    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    try {
      // Create FormData and append the file
      const formData = new FormData();
      formData.append('file', file);

      // Send to your FastAPI backend using environment variable
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Complete progress
      setProgress(100);
      
      // Calculate average confidence score from the API response
      const confidenceScores = result.confidence_scores || [];
      const averageConfidence = confidenceScores.length > 0 
        ? confidenceScores.reduce((sum: number, score: number) => sum + score, 0) / confidenceScores.length 
        : 92; // Fallback if no confidence scores
      
      // Count activities using the actual predictions from API
      const activityCount = result.predictions.reduce((acc: any, activity: string) => {
        acc[activity] = (acc[activity] || 0) + 1;
        return acc;
      }, {});

      const totalWindows = result.predictions.length;
      
      // Calculate percentages for each activity
      const movementScores: Record<string, number> = {};
      Object.entries(activityCount).forEach(([activity, count]: [string, any]) => {
        movementScores[activity.toLowerCase()] = (count / totalWindows) * 100;
      });

      setAnalysisResult({
        filename: file.name,
        date: new Date().toISOString().split('T')[0],
        aiAnalysis: {
          accuracy: Math.round(averageConfidence),
          improvementRate: 15,
          recommendations: [
            "Maintain consistent activity patterns",
            "Focus on posture during transitions",
            "Regular movement breaks recommended"
          ]
        },
        movements: movementScores,
        predictions: result.predictions,
        confidenceScores: result.confidence_scores,
        totalWindows: result.total_windows
      });

    } catch (error: any) {
      console.error('API Error:', error);
      setError(error.message || 'Failed to process file. Please make sure the API server is running.');
      setAnalysisResult(null);
    } finally {
      clearInterval(progressInterval);
      setIsProcessing(false);
    }
  };

  // Helper function to format activity names
  const formatActivityName = (activity: string): string => {
    return activity
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Upload Motion Session</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload your sensor data file (TXT/CSV format) and our AI will analyze your movement patterns 
          to detect human activities in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <Upload className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Data Upload</h2>
            </div>
            
            <FileUpload 
              onFileSelect={handleFileSelect} 
              acceptedTypes=".txt,.csv"
              isLoading={isProcessing}
            />
            
            {selectedFile && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Selected File</p>
                    <p className="text-sm text-blue-700">{selectedFile.name}</p>
                    <p className="text-xs text-blue-600">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium text-red-800">Error</span>
              </div>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <p className="text-xs text-red-600 mt-2">
                Make sure the API server is running: <code>python api.py</code>
              </p>
            </div>
          )}

          {/* Processing Status */}
          {isProcessing && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <h3 className="text-lg font-semibold text-gray-900">AI Processing</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Analyzing sensor data...</span>
                  <span className="text-blue-600">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Processing {selectedFile?.name} with machine learning model
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {analysisResult && !isProcessing && (
            <>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3 mb-4">
                  <Brain className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Activity Analysis</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{analysisResult.totalWindows}</p>
                    <p className="text-sm text-blue-800">Windows Analyzed</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    
                    <p className="text-sm text-green-800">Average Confidence and Activity Distribution</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Activity Distribution</h4>
                  {Object.entries(analysisResult.movements).map(([movement, score]) => (
                    <div key={movement} className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">
                        {formatActivityName(movement)}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-400 to-green-500 h-2 rounded-full"
                            style={{ width: `${score}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {Math.round(score)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <AIInsights 
                session={analysisResult} 
                confidenceScores={analysisResult.confidenceScores} 
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};