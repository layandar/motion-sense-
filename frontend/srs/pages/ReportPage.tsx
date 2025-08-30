import React, { useState } from 'react';
import { FileText, Download, Share2, Calendar, User, Mail } from 'lucide-react';
import { mockUser, mockSessions, mockProgressMetrics } from '../data/mockData';
import jsPDF from 'jspdf';

export const ReportPage: React.FC = () => {
  const [reportType, setReportType] = useState<'pdf' | 'link'>('pdf');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [dateRange, setDateRange] = useState('last-week');
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDFReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      const pdf = new jsPDF();
      
      // Add title
      pdf.setFontSize(20);
      pdf.text('Rehabilitation Progress Report', 20, 30);
      
      // Add patient info
      pdf.setFontSize(12);
      pdf.text(`Patient: ${mockUser.name}`, 20, 50);
      pdf.text(`Recovery Type: ${mockUser.injuryType}`, 20, 60);
      pdf.text(`Report Date: ${new Date().toLocaleDateString()}`, 20, 70);
      
      // Add progress metrics
      pdf.text('Progress Summary:', 20, 90);
      pdf.text(`Overall Score: ${mockProgressMetrics.overallScore}%`, 30, 100);
      pdf.text(`Improvement Trend: ${mockProgressMetrics.improvementTrend}`, 30, 110);
      pdf.text(`Total Sessions: ${mockProgressMetrics.totalSessions}`, 30, 120);
      
      // Add latest insights
      pdf.text('Latest AI Insights:', 20, 140);
      const latestSession = mockSessions[mockSessions.length - 1];
      latestSession.aiAnalysis.insights.forEach((insight, index) => {
        pdf.text(`• ${insight}`, 30, 150 + (index * 10));
      });
      
      pdf.save('rehab-progress-report.pdf');
      setIsGenerating(false);
    }, 2000);
  };

  const generateShareableLink = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const shareableUrl = `${window.location.origin}/shared-report/${mockUser.id}/${Date.now()}`;
      navigator.clipboard.writeText(shareableUrl);
      alert('Shareable link copied to clipboard!');
      setIsGenerating(false);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reportType === 'pdf') {
      generatePDFReport();
    } else {
      generateShareableLink();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Generate Progress Report</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Create a comprehensive report of your rehabilitation progress to share with healthcare providers, 
          coaches, or for your personal records.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Report Configuration */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <FileText className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Report Settings</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Report Type</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setReportType('pdf')}
                  className={`p-4 rounded-lg border-2 text-left transition-colors ${
                    reportType === 'pdf'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <Download className="w-5 h-5 text-blue-600 mb-2" />
                  <p className="font-medium text-gray-900">PDF Download</p>
                  <p className="text-xs text-gray-600">Generate and download a PDF report</p>
                </button>
                <button
                  type="button"
                  onClick={() => setReportType('link')}
                  className={`p-4 rounded-lg border-2 text-left transition-colors ${
                    reportType === 'link'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <Share2 className="w-5 h-5 text-blue-600 mb-2" />
                  <p className="font-medium text-gray-900">Shareable Link</p>
                  <p className="text-xs text-gray-600">Create a secure link to share</p>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="last-week">Last Week</option>
                <option value="last-month">Last Month</option>
                <option value="last-3-months">Last 3 Months</option>
                <option value="all-time">All Time</option>
              </select>
            </div>

            {reportType === 'link' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Email (Optional)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="doctor@hospital.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  We'll send them a notification about the shared report
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl hover:from-blue-700 hover:to-green-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  {reportType === 'pdf' ? <Download className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
                  <span>Generate {reportType === 'pdf' ? 'PDF Report' : 'Shareable Link'}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Report Preview */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Report Preview</h2>
          
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <div className="flex items-center space-x-3 mb-3">
                <User className="w-5 h-5 text-blue-600" />
                <h3 className="font-medium text-gray-900">Patient Information</h3>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Name: {mockUser.name}</p>
                <p>Recovery Type: {mockUser.injuryType}</p>
                <p>Start Date: {new Date(mockUser.startDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-medium text-gray-900 mb-3">Progress Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{mockProgressMetrics.overallScore}%</p>
                  <p className="text-xs text-blue-800">Overall Score</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{mockProgressMetrics.totalSessions}</p>
                  <p className="text-xs text-green-800">Sessions</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">Key Insights</h3>
              <div className="space-y-2">
                {latestSession.aiAnalysis.insights.slice(0, 2).map((insight, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};