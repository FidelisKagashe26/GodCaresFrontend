import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import SEOHead from '../../components/SEOHead';
import { Lock, Mail, ArrowLeftCircle, Sparkles } from 'lucide-react';

function isProbablyEmail(value = '') {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function Login() {
  const { isDark } = useTheme();
  const { t, language } = useLanguage();
  const { login, authLoading, resendVerification } = useAuth();

  const [searchParams] = useSearchParams();
  const verified = searchParams.get('verified');
  const emailChanged = searchParams.get('email_changed');

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  const identifierLooksLikeEmail = useMemo(() => isProbablyEmail(identifier), [identifier]);

  useEffect(() => {
    if (verified === '1') {
      setErrorMsg('');
      setInfoMsg(
        t('emailVerifiedLogin') ||
          (language === 'sw'
            ? 'Email imethibitishwa kikamilifu. Tafadhali ingia sasa.'
            : 'Email verified successfully. Please login now.')
      );
    } else if (emailChanged === '1') {
      setErrorMsg('');
      setInfoMsg(
        t('emailChangedLogin') ||
          (language === 'sw'
            ? 'Email mpya imethibitishwa. Tafadhali ingia tena.'
            : 'New email verified. Please login again.')
      );
    }
  }, [verified, emailChanged, t, language]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');
    try {
      await login(identifier.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(err?.message || t('loginFailed') || (language === 'sw' ? 'Imeshindikana kuingia.' : 'Login failed.'));
    }
  };

  const handleResend = async () => {
    setErrorMsg('');
    setInfoMsg('');
    setResendLoading(true);
    try {
      const email = identifier.trim().toLowerCase();
      const res = await resendVerification(email);
      setInfoMsg(
        res?.detail ||
          t('verificationSent') ||
          (language === 'sw' ? 'Verification imetumwa (kama email ipo).' : 'Verification sent (if email exists).')
      );
    } catch (err) {
      setErrorMsg(
        err?.message ||
          t('verificationResendFailed') ||
          (language === 'sw' ? 'Imeshindikana kutuma verification.' : 'Failed to resend verification.')
      );
    } finally {
      setResendLoading(false);
    }
  };

  const lowerErr = (errorMsg || '').toLowerCase();
  const showResend =
    identifierLooksLikeEmail && (lowerErr.includes('thibitisha email') || lowerErr.includes('verify your email'));

  return (
    <>
      <SEOHead
        title={language === 'sw' ? 'Ingia | GOD CARES 365' : 'Login | GOD CARES 365'}
        description={
          language === 'sw'
            ? 'Ingia kwenye akaunti yako ya GOD CARES 365.'
            : 'Login to your GOD CARES 365 account.'
        }
      />

      <div
        className={`min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-10 ${
          isDark
            ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950'
            : 'bg-gradient-to-b from-emerald-50 via-white to-sky-50'
        }`}
      >
        <div className="w-full max-w-5xl grid gap-8 md:grid-cols-[1.1fr,0.9fr] items-center">
          <div className="hidden md:block">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 mb-3">
              <Sparkles size={14} />
              <span>Every Door • Every Soul • Every Day</span>
            </div>

            <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('loginHeroTitle') || (language === 'sw' ? 'Karibu kwenye safari yako ya God Cares 365' : 'Welcome to your God Cares 365 journey')}
            </h1>

            <p className={`text-sm md:text-base mb-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('loginHeroDesc') ||
                (language === 'sw'
                  ? 'Kwa kuingia, utaweza kufuatilia masomo uliyoanza, kuhifadhi maombi yako na kuona ripoti za mission.'
                  : 'By logging in, you can track lessons, save prayers and view mission reports.')}
            </p>

            <div className="mt-6">
              <Link
                to="/"
                className="inline-flex items-center text-[12px] font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-300"
              >
                <ArrowLeftCircle size={16} className="mr-1.5" />
                {t('backHome') || (language === 'sw' ? 'Rudi kwenye ukurasa wa nyumbani' : 'Back to home')}
              </Link>
            </div>
          </div>

          <div
            className={`w-full max-w-md mx-auto rounded-2xl border shadow-xl p-7 md:p-8 backdrop-blur-sm ${
              isDark ? 'bg-gray-900/80 border-gray-800' : 'bg-white/95 border-gray-100'
            }`}
          >
            <div className="flex items-center mb-6 gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-sky-600 rounded-xl flex items-center justify-center shadow-sm shadow-emerald-500/40">
                <span className="text-white font-bold text-sm">GC</span>
              </div>
              <div>
                <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>GOD CARES 365</h2>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {t('loginSubtitle') || (language === 'sw' ? 'Ingia kwenye akaunti yako' : 'Sign in to your account')}
                </p>
              </div>
            </div>

            {infoMsg && (
              <div className="mb-4 text-xs md:text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg dark:bg-emerald-900/30 dark:border-emerald-500/40 dark:text-emerald-100">
                {infoMsg}
              </div>
            )}

            {errorMsg && (
              <div className="mb-4 text-xs md:text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg dark:bg-red-900/30 dark:border-red-500/40 dark:text-red-100">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  {t('usernameOrEmail') || 'Username / Email'}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center">
                    <Mail size={16} className="text-gray-400" />
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
                    placeholder={t('usernameOrEmailPlaceholder') || (language === 'sw' ? 'mf: jina_ako au barua pepe' : 'e.g. username or email')}
                  />
                </div>

                {showResend && (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendLoading}
                    className={`mt-2 text-[11px] font-semibold ${
                      resendLoading ? 'text-gray-400' : 'text-emerald-600 hover:text-emerald-700 dark:text-emerald-300'
                    }`}
                  >
                    {resendLoading
                      ? t('sendingVerification') || (language === 'sw' ? 'Inatuma verification...' : 'Sending verification...')
                      : t('resendVerification') || (language === 'sw' ? 'Tuma verification tena kwenye email' : 'Resend verification email')}
                  </button>
                )}
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  {t('password') || (language === 'sw' ? 'Nenosiri' : 'Password')}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center">
                    <Lock size={16} className="text-gray-400" />
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
                    placeholder={t('passwordPlaceholder') || '••••••••'}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <Link to="/password/forgot" className="text-emerald-600 hover:underline dark:text-emerald-300">
                  {t('forgotPassword') || (language === 'sw' ? 'Umesahau nenosiri?' : 'Forgot password?')}
                </Link>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className={`w-full py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center shadow-sm ${
                  authLoading ? 'bg-emerald-400 cursor-wait' : 'bg-gradient-to-r from-emerald-600 to-sky-600 hover:brightness-110'
                }`}
              >
                {authLoading ? t('processing') || (language === 'sw' ? 'Inaprosesi...' : 'Processing...') : t('login') || (language === 'sw' ? 'Ingia' : 'Login')}
              </button>
            </form>

            <p className={`mt-4 text-[11px] text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('noAccount') || (language === 'sw' ? 'Huna akaunti?' : "Don't have an account?")}{' '}
              <Link to="/register" className="font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-300">
                {t('register') || (language === 'sw' ? 'Jisajili' : 'Register')}
              </Link>
            </p>

            <p className="mt-3 text-[11px] text-center text-gray-400 dark:text-gray-500">
              {t('publicAccessNote') ||
                (language === 'sw'
                  ? 'Unaweza kutumia sehemu za public bila login, lakini dashboard na progress vinahitaji akaunti.'
                  : 'You can use public sections without login, but dashboard and progress require an account.')}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
