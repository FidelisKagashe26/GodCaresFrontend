import { useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import SEOHead from '../../components/SEOHead';
import { UserPlus, Mail, Lock, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://godcares.pythonanywhere.com').replace(/\/$/, '');

function normalizeApiError(payload, fallback) {
  if (!payload) return fallback;
  if (typeof payload === 'string') return payload;
  if (payload.detail) return payload.detail;

  const firstKey = Object.keys(payload)[0];
  if (firstKey) {
    const v = payload[firstKey];
    if (Array.isArray(v) && v[0]) return String(v[0]);
    if (typeof v === 'string') return v;
  }
  return fallback;
}

export default function Register() {
  const { isDark } = useTheme();
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      form.username.trim().length >= 2 &&
      form.email.trim().length >= 5 &&
      form.password.length >= 8 &&
      form.confirmPassword.length >= 8 &&
      !loading
    );
  }, [form, loading]);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password !== form.confirmPassword) {
      setError(t('passwordMismatch') || (language === 'sw' ? 'Neno la siri na uthibitisho havilingani.' : 'Passwords do not match.'));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });

      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        setError(
          normalizeApiError(
            payload,
            t('registerFailed') || (language === 'sw' ? 'Imeshindikana. Tafadhali jaribu tena.' : 'Registration failed. Please try again.')
          )
        );
        return;
      }

      setSuccess(
        payload?.detail ||
          t('registerSuccessVerifyEmail') ||
          (language === 'sw'
            ? 'Usajili umefanikiwa. Tafadhali angalia email yako uthibitishe akaunti.'
            : 'Registration successful. Please check your email to verify your account.')
      );
      setForm({ username: '', email: '', password: '', confirmPassword: '' });
    } catch {
      setError(t('networkError') || (language === 'sw' ? 'Mtandao umesumbua. Tafadhali jaribu tena.' : 'Network error. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title={language === 'sw' ? 'Jisajili | GOD CARES 365' : 'Register | GOD CARES 365'}
        description={language === 'sw' ? 'Fungua akaunti ya GOD CARES 365.' : 'Create your GOD CARES 365 account.'}
      />

      <section
        className={`min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-10 transition-colors ${
          isDark ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950' : 'bg-gradient-to-b from-sky-50 via-white to-emerald-50'
        }`}
      >
        <div className="w-full max-w-4xl grid gap-8 md:grid-cols-[1.05fr,0.95fr] items-center">
          <div className="hidden md:block">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 mb-3">
              <Sparkles size={14} />
              <span>{language === 'sw' ? 'Hatua 1 • Jiunge na familia ya God Cares 365' : 'Step 1 • Join the God Cares 365 family'}</span>
            </div>

            <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('registerHeroTitle') || (language === 'sw' ? 'Tengeneza akaunti yako ya safari ya imani' : 'Create your faith journey account')}
            </h1>

            <p className={`text-sm md:text-base mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('registerHeroDesc') ||
                (language === 'sw'
                  ? 'Baada ya kusajili, utapokea email ya verification. Ukisha-verify, utaingia (login) kwenye frontend.'
                  : 'After registering, you will receive a verification email. Once verified, you will login on the frontend.')}
            </p>

            <ul className={`space-y-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              <li>{language === 'sw' ? '• Kuhifadhi progress ya masomo.' : '• Save your learning progress.'}</li>
              <li>{language === 'sw' ? '• Historia ya maombi.' : '• Prayer history.'}</li>
              <li>{language === 'sw' ? '• Taarifa za matukio.' : '• Event updates.'}</li>
              <li>{language === 'sw' ? '• Safari ya mission 365.' : '• Mission 365 journey.'}</li>
            </ul>
          </div>

          <div className={`w-full max-w-md mx-auto rounded-2xl shadow-xl p-7 md:p-8 border ${isDark ? 'bg-gray-900/85 border-gray-800' : 'bg-white/95 border-gray-100'}`}>
            <div className="flex items-center mb-4 gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-600 flex items-center justify-center text-white shadow-sm shadow-emerald-500/50">
                <UserPlus size={20} />
              </div>
              <div>
                <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {t('register') || (language === 'sw' ? 'Jisajili' : 'Register')}
                </h2>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {t('registerSubtitle') || (language === 'sw' ? 'Tutakutumia email ya uthibitisho.' : 'We will send a verification email.')}
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs md:text-sm text-red-700 dark:border-red-500/40 dark:bg-red-900/40 dark:text-red-100 flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs md:text-sm text-green-700 dark:border-green-500/40 dark:bg-green-900/40 dark:text-green-100 flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block mb-1 text-xs font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  {t('username') || 'Username'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <UserPlus size={16} />
                  </span>
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    required
                    className={`w-full rounded-lg border pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-gray-900 border-gray-700 text-white placeholder:text-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
                    }`}
                    placeholder={language === 'sw' ? 'Jina la mtumiaji' : 'Username'}
                  />
                </div>
              </div>

              <div>
                <label className={`block mb-1 text-xs font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  {t('email') || (language === 'sw' ? 'Barua pepe' : 'Email')}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className={`w-full rounded-lg border pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-gray-900 border-gray-700 text-white placeholder:text-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
                    }`}
                    placeholder="wewe@example.com"
                  />
                </div>
              </div>

              <div>
                <label className={`block mb-1 text-xs font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  {t('password') || (language === 'sw' ? 'Neno la siri' : 'Password')}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={16} />
                  </span>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className={`w-full rounded-lg border pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-gray-900 border-gray-700 text-white placeholder:text-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
                    }`}
                    placeholder={t('passwordMinHint') || (language === 'sw' ? 'Angalau herufi 8' : 'At least 8 characters')}
                  />
                </div>
              </div>

              <div>
                <label className={`block mb-1 text-xs font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  {t('confirmPassword') || (language === 'sw' ? 'Thibitisha neno la siri' : 'Confirm password')}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={16} />
                  </span>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    className={`w-full rounded-lg border pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-gray-900 border-gray-700 text-white placeholder:text-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
                    }`}
                    placeholder={language === 'sw' ? 'Rudia neno la siri' : 'Repeat password'}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!canSubmit}
                className={`w-full rounded-lg text-white text-sm font-semibold py-2.5 transition flex items-center justify-center gap-2 shadow-sm shadow-emerald-500/40 ${
                  loading ? 'bg-emerald-400 cursor-wait' : 'bg-gradient-to-r from-emerald-600 to-sky-600 hover:brightness-110'
                }`}
              >
                {loading && <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {loading ? (t('registering') || (language === 'sw' ? 'Inasajili...' : 'Registering...')) : (t('register') || (language === 'sw' ? 'Jisajili' : 'Register'))}
              </button>
            </form>

            <p className={`mt-4 text-[11px] text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('alreadyHaveAccount') || (language === 'sw' ? 'Tayari una akaunti?' : 'Already have an account?')}{' '}
              <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-300">
                {t('login') || (language === 'sw' ? 'Ingia' : 'Login')}
              </Link>
            </p>

            <p className="mt-3 text-[11px] text-center text-gray-400 dark:text-gray-500">
              {t('forgotPassword') || (language === 'sw' ? 'Umesahau nenosiri?' : 'Forgot password?')}{' '}
              <Link to="/password/forgot" className="font-semibold text-emerald-600 hover:underline dark:text-emerald-300">
                {t('startReset') || (language === 'sw' ? 'Anza reset' : 'Start reset')}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
