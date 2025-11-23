import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center p-8 max-w-md mx-auto">
            <AlertTriangle className="text-red-500 mx-auto mb-4" size={64} />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Hitilafu Imetokea
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Samahani, hitilafu imetokea wakati wa kupakia ukurasa huu. 
              Tafadhali jaribu tena au rudi kwenye ukurasa wa nyumbani.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
              >
                <RefreshCw size={16} className="mr-2" />
                Jaribu Tena
              </button>
              <a
                href="/"
                className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors text-center"
              >
                Rudi Nyumbani
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;