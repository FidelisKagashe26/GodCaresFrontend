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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
          <div className="text-center p-8 max-w-md mx-auto rounded-2xl shadow-lg shadow-emerald-500/10 border border-emerald-500/10 bg-white/80 dark:bg-gray-900/90 dark:border-gray-800">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 via-amber-400 to-emerald-500 shadow-md shadow-yellow-500/40">
              <AlertTriangle className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-3">
              Hitilafu Imetokea
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Samahani, hitilafu imetokea wakati wa kupakia ukurasa huu.
              Tafadhali jaribu tena au rudi kwenye ukurasa wa nyumbani.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:brightness-110 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center text-sm shadow-sm shadow-emerald-500/40"
              >
                <RefreshCw size={16} className="mr-2" />
                Jaribu Tena
              </button>
              <a
                href="/"
                className="block w-full px-6 py-3 rounded-lg font-semibold transition-colors text-sm border border-gray-200 bg-gray-50 text-gray-800 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
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
