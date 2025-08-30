import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, Brain, TrendingUp, Shield } from 'lucide-react';

export const HomePage: React.FC = () => {
  const features = [
    {
      icon: Activity,
      title: 'Motion Analysis',
      description: 'AI-powered movement tracking and classification for accurate progress monitoring'
    },
    {
      icon: Brain,
      title: 'Smart Insights',
      description: 'Get personalized recommendations and warnings based on your recovery patterns'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Visual charts and timeline comparisons to see your improvement over time'
    },
    {
      icon: Shield,
      title: 'Secure Sharing',
      description: 'Generate reports and share progress securely with healthcare providers'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="py-16 lg:py-24">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Track Your
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent"> Recovery Journey</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Harness the power of AI motion sensing to monitor your rehabilitation progress. 
            Upload session data, receive intelligent insights, and share your recovery story with healthcare professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/upload"
              className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg"
            >
              Start Tracking
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center px-8 py-4 text-lg font-medium text-blue-600 bg-white border-2 border-blue-600 rounded-xl hover:bg-blue-50 transition-colors"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-16 lg:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need for Recovery
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform combines cutting-edge AI technology with user-friendly design 
            to support your rehabilitation journey every step of the way.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 lg:py-20">
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 lg:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Begin Your Recovery?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of patients and healthcare professionals who trust RehabTracker 
            for accurate, AI-driven rehabilitation monitoring.
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center px-8 py-4 text-lg font-medium text-blue-600 bg-white rounded-xl hover:bg-gray-50 transition-colors transform hover:scale-105"
          >
            Upload Your First Session
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};