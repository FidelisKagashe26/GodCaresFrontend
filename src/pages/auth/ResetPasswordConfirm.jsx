import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import SEOHead from '../../components/SEOHead';
import { Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://godcares.pythonanywhere.com').replace(/\/$/, '');

function normalizeApiError(payload, fallback) {
  if (!payload) return fallback;
  if (payload.detail) return payload.detail;
  const k = Object.keys(payload)[0];
  if (k) {
    const v = payload[k];
    if (Array.isArray(v) && v[0]) return String(v[0]);
  }
  return fallback;
}

export default function ResetPasswordConfirm() {
  const { isDark } = useTheme();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const params = useParams();
  const [search] = useSearchParams();

  const uid = params.uid || search.get('uid') || '';
  const token = params.token || search.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const missingToken = !uid || !token;

  const canSubmit = useMemo(() => {
    return !missingToken && newPassword.length >= 8 && confirm.length >= 8 && !loading;
  }, [missingToken, newPassword, confirm, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (missingToken) return;

    if (newPassword !== confirm) {
      setError(t('passwordMismatch') || (language === 'sw' ? 'Nenosiri jipya na uthibitisho havilingani.' : 'Passwords do not match.'));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/password/reset/confirm/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, token, new_password: newPassword }),
      });

      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        setError(
          normalizeApiError(
            payload,
            t('resetConfirmFailed') || (language === 'sw' ? 'Imeshindikana kubadili nenosiri.' : 'Failed to reset password.')
          )
        );
        return;
      }

      setSuccess(payload?.detail || (language === 'sw' ? 'Nenosiri limebadilishwa. Unaweza kuingia sasa.' : 'Password changed. You can login now.'));
      setNewPassword('');
      setConfirm('');

      // optional: peleka login moja kwa moja
      setTimeout(() => navigate('/login', { replace: true }), 900);
    } catch {
      setError(t('networkError') || (language === 'sw' ? 'Mtandao umesumbua. Tafadhali jaribu tena.' : 'Network error. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title={language === 'sw' ? 'Badili Nenosiri | GOD CARES 365' : 'Change Password | GOD CARES 365'}
        description={language === 'sw' ? 'Weka nenosiri jipya kukamilisha reset.' : 'Set a new password to complete the reset.'}
      />

      <section
        className={`min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-10 ${
          isDark ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950' : 'bg-gradient-to-b from-sky-50 via-white to-emerald-50'
        }`}
      >
        <div className="w-full max-w-xl">
          <div className={`rounded-2xl border shadow-xl p-7 md:p-8 ${isDark ? 'bg-gray-900/85 border-gray-800' : 'bg-white/95 border-gray-100'}`}>
            <h1 className={`text-xl md:text-2xl font-extrabold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('changePasswordTitle') || (language === 'sw' ? 'Badili nenosiri' : 'Change password')}
            </h1>

            {missingToken && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs md:text-sm text-red-700 dark:border-red-500/40 dark:bg-red-900/40 dark:text-red-100 flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{t('resetLinkInvalid') || (language === 'sw' ? 'Link si sahihi au haijabeba token.' : 'Reset link is invalid or missing token.')}</span>
              </div>
            )}

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
                  {t('newPassword') || (language === 'sw' ? 'Nenosiri jipya' : 'New password')}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <Lock size={16} />
                  </span>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={missingToken}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-gray-900 border-gray-700 text-white placeholder:text-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
                    }`}
                    placeholder={t('passwordMinHint') || (language === 'sw' ? 'Angalau herufi 8' : 'At least 8 characters')}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  {t('confirmPassword') || (language === 'sw' ? 'Thibitisha nenosiri' : 'Confirm password')}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <Lock size={16} />
                  </span>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    disabled={missingToken}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-gray-900 border-gray-700 text-white placeholder:text-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
                    }`}
                    placeholder={language === 'sw' ? 'Rudia nenosiri' : 'Repeat password'}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!canSubmit}
                className={`w-full py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center shadow-sm ${
                  loading ? 'bg-emerald-400 cursor-wait' : 'bg-gradient-to-r from-emerald-600 to-sky-600 hover:brightness-110'
                }`}
              >
                {loading ? (t('saving') || (language === 'sw' ? 'Inahifadhi...' : 'Saving...')) : (t('changePasswordBtn') || (language === 'sw' ? 'Badili nenosiri' : 'Change password'))}
              </button>
            </form>

            <div className={`mt-4 text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <Link to="/login" className="font-semibold text-emerald-600 hover:underline dark:text-emerald-300">
                {t('goLogin') || (language === 'sw' ? 'Nenda Login' : 'Go to Login')}
              </Link>
              <span className="mx-2 opacity-60">•</span>
              <Link to="/password/forgot" className="font-semibold text-emerald-600 hover:underline dark:text-emerald-300">
                {t('sendResetAgain') || (language === 'sw' ? 'Tuma reset tena' : 'Send reset again')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
