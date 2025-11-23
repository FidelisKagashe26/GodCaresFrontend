import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Home, ArrowLeft, Search } from 'lucide-react';
import SEOHead from './SEOHead';

export default function NotFound() {
  const { isDark } = useTheme();

  return (
    <>
      <SEOHead 
        title="Ukurasa Haujapatikana"
        description="Ukurasa unaotafuta haujapatikana. Rudi kwenye ukurasa wa nyumbani au tafuta maudhui mengine."
      />
      <div className={`min-h-screen flex items-center justify-center transition-colors ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center p-8 max-w-md mx-auto">
          <div className="text-6xl font-bold text-gray-400 mb-4">404</div>
          <h1 className={`text-2xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>
            Ukurasa Haujapatikana
          </h1>
          <p className={`mb-8 ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Samahani, ukurasa unaotafuta haujapatikana. Huenda umehamishwa au kufutwa.
          </p>
          <div className="space-y-3">
            <Link
              to="/"
              className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
            >
              <Home size={16} className="mr-2" />
              Rudi Nyumbani
            </Link>
            <button
              onClick={() => window.history.back()}
              className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                isDark 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              <ArrowLeft size={16} className="mr-2" />
              Rudi Nyuma
            </button>
          </div>
        </div>
      </div>
    </>
  );
}