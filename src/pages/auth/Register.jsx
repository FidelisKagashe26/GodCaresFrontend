// src/pages/auth/Register.jsx
import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import SEOHead from '../../components/SEOHead';
import {
  UserPlus,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function Register() {
  const { isDark } = useTheme();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (form.password !== form.confirmPassword) {
      setError('Neno la siri na uthibitisho havilingani.');
      return;
    }

    // HATUNA API KWA SASA: tuna-simulate usajili wa mafanikio
    setLoading(true);
    setTimeout(() => {
      setSuccess(
        'Usajili umefanikiwa (mfano wa frontend). Tutakuunganisha na backend baadaye, tafadhali endelea kwa kuingia.'
      );
      setLoading(false);
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    }, 800);
  };

  return (
    <>
      <SEOHead
        title="Jisajili - GOD CARES 365"
        description="Fungua akaunti yako ya GOD CARES 365 ili upate mafunzo, taarifa na safari binafsi ya kiroho."
      />

      <section
        className={`min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-10 transition-colors ${
          isDark
            ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950'
            : 'bg-gradient-to-b from-sky-50 via-white to-emerald-50'
        }`}
      >
        <div className="w-full max-w-4xl grid gap-8 md:grid-cols-[1.05fr,0.95fr] items-center">
          {/* Left side: vision text */}
          <div className="hidden md:block">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 mb-3">
              <Sparkles size={14} />
              <span>Step 1 • Kujiunga na familia ya God Cares 365</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-3">
              Tengeneza akaunti yako ya safari ya milele
            </h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-4">
              Kwa akaunti ya God Cares 365 utaweza kufuatilia masomo, kuhifadhi
              maombi, na kuona hatua zako katika safari ya kuwa missioner wa
              Ujumbe wa Malaika Watatu.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>• Kumbukumbu ya masomo na vyeti vyako vya kukamilisha.</li>
              <li>• Historia ya maombi na majibu ya maombi.</li>
              <li>• Pokea taarifa za matukio na mafunzo mapya moja kwa moja.</li>
              <li>• Kujiandaa kwa mission ya kudumu 365 – kila mtu, kila siku.</li>
            </ul>
          </div>

          {/* Right side: form card */}
          <div
            className={`w-full max-w-md mx-auto rounded-2xl shadow-xl p-7 md:p-8 border ${
              isDark
                ? 'bg-gray-900/85 border-gray-800'
                : 'bg-white/95 border-gray-100'
            }`}
          >
            <div className="flex items-center mb-4 gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-sky-600 flex items-center justify-center text-white shadow-sm shadow-emerald-500/50">
                <UserPlus size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Jisajili
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Tengeneza akaunti ili kupata huduma zaidi na safari
                  binafsi ya kiroho.
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
                <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-200">
                  Username
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
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    placeholder="Jina la mtumiaji"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-200">
                  Barua pepe
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
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    placeholder="mf: wewe@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-200">
                  Neno la siri
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
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-200">
                  Thibitisha neno la siri
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
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    placeholder="Rudia neno la siri"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-gradient-to-r from-emerald-600 to-sky-600 hover:brightness-110 text-white text-sm font-semibold py-2.5 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm shadow-emerald-500/40"
              >
                {loading && (
                  <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {loading ? 'Inasajili...' : 'Jisajili'}
              </button>
            </form>

            <p className="mt-4 text-[11px] text-gray-500 dark:text-gray-400 text-center">
              Tayari una akaunti?{' '}
              <Link
                to="/login"
                className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-300 hover:underline"
              >
                Ingia hapa
              </Link>
            </p>

            <p className="mt-3 text-[11px] text-center text-gray-400 dark:text-gray-500">
              Huu ni mfano wa frontend pekee. Tutakuunganisha na backend ya
              usajili (API) mara tu itakapokuwa tayari.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
