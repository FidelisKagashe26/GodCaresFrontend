import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import SEOHead from '../../components/SEOHead';
import { Lock, Mail } from 'lucide-react';

export default function Login() {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { login, authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      await login(identifier.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Imeshindikana kuingia.');
    }
  };

  return (
    <>
      <SEOHead
        title="Ingia | GOD CARES 365"
        description="Ingia kwenye akaunti yako ya GOD CARES 365."
      />

      <div
        className={`min-h-screen flex items-center justify-center px-4 ${
          isDark ? 'bg-gray-900' : 'bg-gray-50'
        }`}
      >
        <div
          className={`w-full max-w-md rounded-2xl shadow-xl p-8 ${
            isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}
        >
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">GC</span>
            </div>
            <div>
              <h1
                className={`text-xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                GOD CARES 365
              </h1>
              <p
                className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                {t('login') || 'Ingia kwenye akaunti yako'}
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  isDark ? 'text-gray-200' : 'text-gray-700'
                }`}
              >
                Username / Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center">
                  <Mail
                    size={16}
                    className={isDark ? 'text-gray-400' : 'text-gray-400'}
                  />
                </span>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  isDark ? 'text-gray-200' : 'text-gray-700'
                }`}
              >
                {t('password') || 'Nenosiri'}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center">
                  <Lock
                    size={16}
                    className={isDark ? 'text-gray-400' : 'text-gray-400'}
                  />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span
                className={isDark ? 'text-gray-400' : 'text-gray-500'}
              >
                {/* TODO: Hapa tuta-link password reset mara backend ipatikane */}
                Umesahau nenosiri? (tutaweka link baadae)
              </span>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className={`w-full py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center ${
                authLoading
                  ? 'bg-green-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {authLoading ? 'Inaprosesi...' : t('login') || 'Ingia'}
            </button>
          </form>

          <p
            className={`mt-4 text-xs text-center ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            Huna akaunti?{' '}
            <span className="font-semibold text-green-600">
              (Signup endpoint ya backend haijawekwa, tutaiunganisha
              baadaye.)
            </span>
          </p>

          <p className="mt-3 text-xs text-center text-gray-400">
            Unaweza kuendelea kutumia sehemu za public bila login, lakini
            baadhi ya features kama progress, dashboard na prayer history
            zinahitaji akaunti.
          </p>
        </div>
      </div>
    </>
  );
}
