// src/pages/User/ChangePassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, ShieldCheck, AlertCircle } from 'lucide-react';

function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (form.newPassword !== form.confirmNewPassword) {
      setError('Neno jipya la siri na uthibitisho havilingani.');
      return;
    }

    // HATUNA API KWA SASA: tuna-simulate mabadiliko ya nenosiri
    setSaving(true);
    setTimeout(() => {
      setMessage('Neno la siri limebadilishwa (mfano wa frontend).');
      setForm({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
      setSaving(false);
    }, 800);
  };

  return (
    <section className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-10 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 flex items-center justify-center text-white">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
              Badili Neno la Siri
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Tunashauri utumie neno lenye mchanganyiko wa herufi kubwa,
              ndogo, namba na alama.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs md:text-sm text-red-700 dark:border-red-500/40 dark:bg-red-900/40 dark:text-red-100 flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs md:text-sm text-green-700 dark:border-green-500/40 dark:bg-green-900/40 dark:text-green-100 flex items-center gap-2">
            <ShieldCheck size={16} />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-200">
              Neno la siri la sasa
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={16} />
              </span>
              <input
                type="password"
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-200">
              Neno jipya la siri
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={16} />
              </span>
              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                placeholder="Neno jipya la siri"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-200">
              Thibitisha neno jipya la siri
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={16} />
              </span>
              <input
                type="password"
                name="confirmNewPassword"
                value={form.confirmNewPassword}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                placeholder="Rudia neno jipya la siri"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link
              to="/profile"
              className="text-[11px] text-sky-600 hover:underline dark:text-sky-400"
            >
              &larr; Rudi kwenye profaili
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-sky-600 to-emerald-600 hover:brightness-110 text-white disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving && (
                <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {saving ? 'Inahifadhi...' : 'Hifadhi neno la siri'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default ChangePassword;
