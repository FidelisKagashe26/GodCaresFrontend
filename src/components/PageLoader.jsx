import { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

export default function PageLoader({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <span className="text-white font-bold text-xl">GC</span>
          </div>
          <LoadingSpinner text="Inapakia GOD CARES 365..." size="lg" />
        </div>
      </div>
    );
  }

  return children;
}