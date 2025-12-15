// src/pages/auth/ForgotPassword.jsx
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import SEOHead from '../../components/SEOHead';
import { Mail, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://godcares.pythonanywhere.com').replace(/\/$/, '');

function normalizeApiError(payload, fallback) {
  if (!payload) return fallback;
  if (typeof payload === 'string') return payload;
  if (payload.detail) return payload.detail;

  const k = Object.keys(payload)[0];
  if (k) {
    const v = payload[k];
    if (Array.isArray(v) && v[0]) return String(v[0]);
    if (typeof v === 'string') return v;
  }
  return fallback;
}

export default function ForgotPassword() {
  const { isDark } = useTheme();
  const { t, language } = useLanguage();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => email.trim().length >= 5 && !loading, [email, loading]);

  const ui = useMemo(() => {
    const sw = {
      title: 'Umesahau Nenosiri | GOD CARES 365',
      desc: 'Omba kubadili nenosiri kwa email.',
      badge: 'Reset Nenosiri',
      heading: 'Umesahau nenosiri?',
      subheading: 'Weka barua pepe yako. Tutatuma maelekezo ya kubadili nenosiri.',
      emailLabel: 'Barua pepe',
      sending: 'Inatuma...',
      submit: 'Tuma ombi',
      backToLogin: 'Rudi kwenye Login',
      networkError: 'Mtandao umesumbua. Tafadhali jaribu tena.',
      failed: 'Imeshindikana. Tafadhali jaribu tena.',
      sent: 'Ombi limepokelewa. Tafadhali angalia inbox/spam kwa maelekezo ya kubadili nenosiri.',
    };

    const en = {
      title: 'Forgot Password | GOD CARES 365',
      desc: 'Request password reset by email.',
      badge: 'Reset Password',
      heading: 'Forgot password?',
      subheading: 'Enter your email. We will send password reset instructions.',
      emailLabel: 'Email',
      sending: 'Sending...',
      submit: 'Send request',
      backToLogin: 'Back to Login',
      networkError: 'Network error. Please try again.',
      failed: 'Failed. Please try again.',
      sent: 'Request received. Please check inbox/spam for password reset instructions.',
    };

    return language === 'sw' ? sw : en;
  }, [language]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/password/reset/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        setError(
          normalizeApiError(
            payload,
            t('resetRequestFailed') || ui.failed
          )
        );
        return;
      }

      setSuccess(payload?.detail || t('resetRequestSent') || ui.sent);
      setEmail('');
    } catch {
      setError(t('networkError') || ui.networkError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title={t('forgotPasswordTitle') || ui.title}
        description={t('forgotPasswordDesc') || ui.desc}
      />

      <section
        className={`min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-10 ${
          isDark
            ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950'
            : 'bg-gradient-to-b from-emerald-50 via-white to-sky-50'
        }`}
      >
        <div className="w-full max-w-xl">
          <div
            className={`rounded-2xl border shadow-xl p-7 md:p-8 ${
              isDark ? 'bg-gray-900/85 border-gray-800' : 'bg-white/95 border-gray-100'
            }`}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 mb-4">
              <Sparkles size={14} />
              <span>{t('resetPassword') || ui.badge}</span>
            </div>

            <h1 className={`text-xl md:text-2xl font-extrabold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('forgotPassword') || ui.heading}
            </h1>

            <p className={`text-sm mb-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('resetRequestDesc') || ui.subheading}
            </p>

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
                <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  {t('email') || ui.emailLabel}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark
                        ? 'bg-gray-900 border-gray-700 text-white placeholder:text-gray-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
                    }`}
                    placeholder="wewe@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!canSubmit}
                className={`w-full py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center shadow-sm ${
                  loading
                    ? 'bg-emerald-400 cursor-wait'
                    : 'bg-gradient-to-r from-emerald-600 to-sky-600 hover:brightness-110'
                }`}
              >
                {loading ? (t('sending') || ui.sending) : (t('sendRequest') || ui.submit)}
              </button>
            </form>

            <div className={`mt-4 text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <Link to="/login" className="font-semibold text-emerald-600 hover:underline dark:text-emerald-300">
                {t('backToLogin') || ui.backToLogin}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
