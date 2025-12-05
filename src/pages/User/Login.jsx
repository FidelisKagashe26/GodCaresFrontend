// src/pages/User/Login.jsx
import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import SEOHead from '../../components/SEOHead';
import { Lock, Mail, ArrowLeftCircle, Sparkles } from 'lucide-react';

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
        description="Ingia kwenye akaunti yako ya GOD CARES 365 ili kufuatilia safari yako ya kiroho na mission."
      />

      <div
        className={`min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-10 ${
          isDark
            ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950'
            : 'bg-gradient-to-b from-emerald-50 via-white to-sky-50'
        }`}
      >
        <div className="w-full max-w-5xl grid gap-8 md:grid-cols-[1.1fr,0.9fr] items-center">
          {/* Side text / vision */}
          <div className="hidden md:block">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 mb-3">
              <Sparkles size={14} />
              <span>Every Door • Every Soul • Every Day</span>
            </div>
            <h1
              className={`text-2xl md:text-3xl font-extrabold tracking-tight mb-3 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Karibu kwenye safari yako ya God Cares 365
            </h1>
            <p
              className={`text-sm md:text-base mb-5 ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Kwa kuingia, utaweza kufuatilia masomo uliyoanza, kuendelea na
              safari ya imani, kuhifadhi maombi yako na kuona ripoti za mission.
            </p>

            <ul
              className={`space-y-2 text-sm ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              <li>• Kuhifadhi progress ya masomo ya Biblia.</li>
              <li>• Kuomba na kuona historia ya maombi uliyotuma.</li>
              <li>• Kupokea taarifa za matukio na mafundisho mapya.</li>
              <li>• Kuanza safari ya kuwa missioner wa God Cares 365.</li>
            </ul>

            <div className="mt-6">
              <Link
                to="/"
                className="inline-flex items-center text-[12px] font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-300"
              >
                <ArrowLeftCircle size={16} className="mr-1.5" />
                Rudi kwenye ukurasa wa nyumbani
              </Link>
            </div>
          </div>

          {/* Form card */}
          <div
            className={`w-full max-w-md mx-auto rounded-2xl border shadow-xl p-7 md:p-8 backdrop-blur-sm ${
              isDark
                ? 'bg-gray-900/80 border-gray-800'
                : 'bg-white/95 border-gray-100'
            }`}
          >
            <div className="flex items-center mb-6 gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-sky-600 rounded-xl flex items-center justify-center shadow-sm shadow-emerald-500/40">
                <span className="text-white font-bold text-sm">GC</span>
              </div>
              <div>
                <h2
                  className={`text-lg font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  GOD CARES 365
                </h2>
                <p
                  className={`text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {t('login') || 'Ingia kwenye akaunti yako ya safari ya imani'}
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 text-xs md:text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg dark:bg-red-900/30 dark:border-red-500/40 dark:text-red-100">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  className={`block text-xs font-medium mb-1 ${
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
                    className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark
                        ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
                    }`}
                    placeholder="mf: jina_ako au barua pepe"
                  />
                </div>
              </div>

              <div>
                <label
                  className={`block text-xs font-medium mb-1 ${
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
                    className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark
                        ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
                    }`}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span
                  className={isDark ? 'text-gray-400' : 'text-gray-500'}
                >
                  Umesahau nenosiri?  
                  <span className="opacity-70">
                    {' '}
                    (tutaunganisha password reset baada ya backend)
                  </span>
                </span>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className={`w-full py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center shadow-sm ${
                  authLoading
                    ? 'bg-emerald-400 cursor-wait'
                    : 'bg-gradient-to-r from-emerald-600 to-sky-600 hover:brightness-110'
                }`}
              >
                {authLoading ? 'Inaprosesi...' : t('login') || 'Ingia'}
              </button>
            </form>

            <p
              className={`mt-4 text-[11px] text-center ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              Huna akaunti?{' '}
              <Link
                to="/register"
                className="font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-300"
              >
                Jisajili kwanza
              </Link>
            </p>

            <p className="mt-3 text-[11px] text-center text-gray-400 dark:text-gray-500">
              Unaweza kuendelea kutumia sehemu za public bila login, lakini
              progress ya masomo, dashboard na historia ya maombi zinahitaji
              akaunti.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

