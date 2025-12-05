import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Home, ArrowLeft } from 'lucide-react';
import SEOHead from './SEOHead';

export default function NotFound() {
  const { isDark } = useTheme();

  return (
    <>
      <SEOHead
        title="Ukurasa Haujapatikana"
        description="Ukurasa unaotafuta haujapatikana. Rudi kwenye ukurasa wa nyumbani au tafuta maudhui mengine."
      />
      <div
        className={`min-h-screen flex items-center justify-center transition-colors ${
          isDark
            ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950'
            : 'bg-gradient-to-b from-slate-50 via-white to-emerald-50'
        }`}
      >
        <div className="text-center p-8 max-w-md mx-auto">
          <div className="text-6xl font-extrabold text-emerald-500 mb-2">
            404
          </div>
          <h1
            className={`text-2xl font-bold mb-3 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}
          >
            Ukurasa Haujapatikana
          </h1>
          <p
            className={`mb-8 text-sm ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            Samahani, ukurasa unaotafuta haujapatikana. Huenda umehamishwa au
            kufutwa.
          </p>
          <div className="space-y-3">
            <Link
              to="/"
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:brightness-110 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center text-sm shadow-sm shadow-emerald-500/40"
            >
              <Home size={16} className="mr-2" />
              Rudi Nyumbani
            </Link>
            <button
              onClick={() => window.history.back()}
              className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center text-sm ${
                isDark
                  ? 'bg-gray-800 hover:bg-gray-700 text-white'
                  : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-200'
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
