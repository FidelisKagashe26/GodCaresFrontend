// src/pages/ChangePassword.jsx
import React, { useState } from 'react';
import apiService from '../../services/api';
import { Link } from 'react-router-dom';

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

    setSaving(true);
    try {
      await apiService.changePassword({
        old_password: form.currentPassword,
        new_password: form.newPassword,
      });
      setMessage('Neno la siri limebadilishwa kwa mafanikio.');
      setForm({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (err) {
      setError(err.message || 'Imeshindikana kubadilisha neno la siri.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-200px)] px-4 py-10">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 md:p-8">
        <h1 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
          Badili Neno la Siri
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Tunashauri utumie neno la siri lenye mchanganyiko wa herufi, namba na alama.
        </p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-900/40 dark:text-red-100">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-500/40 dark:bg-green-900/40 dark:text-green-100">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
              Neno la siri la sasa
            </label>
            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
              Neno jipya la siri
            </label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
              Thibitisha neno jipya la siri
            </label>
            <input
              type="password"
              name="confirmNewPassword"
              value={form.confirmNewPassword}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link
              to="/profile"
              className="text-xs text-blue-600 hover:underline"
            >
              &larr; Rudi kwenye profaili
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? 'Inahifadhi...' : 'Hifadhi neno la siri'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default ChangePassword;
