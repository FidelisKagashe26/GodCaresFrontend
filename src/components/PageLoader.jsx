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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="text-center">
          <LoadingSpinner text="Inapakia GOD CARES 365..." size="lg" />
        </div>
      </div>
    );
  }

  return children;
}
