// src/pages/account/Profile.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import SEOHead from '../../components/SEOHead';
import LoadingSpinner from '../../components/LoadingSpinner';
import apiService from '../../services/api';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  CalendarDays,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export default function Profile() {
  const { isDark } = useTheme();
  const { user } = useAuth();

  const [form, setForm] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    location: '',
  });
  const [rawProfile, setRawProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiService.getProfile();
        setRawProfile(data);
        setForm({
          username: data.username || '',
          email: data.email || '',
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          phone: data.phone || '',
          location: data.location || '',
        });
      } catch (err) {
        setError(err.message || 'Imeshindikana kupakia profaili.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await apiService.updateProfile(form);
      setMessage('Taarifa za profaili zimehifadhiwa kikamilifu.');
    } catch (err) {
      setError(err.message || 'Imeshindikana kuhifadhi mabadiliko.');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (value) => {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('sw-TZ', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    });
  };

  // Extra fields zisizojulikana ili tusipoteze data yoyote ya API
  const extraFields = useMemo(() => {
    if (!rawProfile) return [];
    const known = new Set([
      'id',
      'username',
      'email',
      'first_name',
      'last_name',
      'phone',
      'location',
      'date_joined',
      'last_login',
      'is_staff',
      'is_superuser',
      'is_active',
    ]);
    return Object.entries(rawProfile).filter(([key]) => !known.has(key));
  }, [rawProfile]);

  if (loading) {
    return (
      <>
        <SEOHead title="Profaili Yangu" description="Dhibiti taarifa zako za akaunti" />
        <section
          className={`min-h-[calc(100vh-200px)] flex items-center justify-center transition-colors ${
            isDark ? 'bg-gray-900' : 'bg-gray-50'
          }`}
        >
          <LoadingSpinner text="Inapakia profaili..." />
        </section>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title="Profaili Yangu"
        description="Dhibiti taarifa zako binafsi na mpangilio wa akaunti katika GOD CARES 365"
      />

      <section
        className={`min-h-[calc(100vh-200px)] py-10 transition-colors ${
          isDark ? 'bg-gray-900' : 'bg-gray-50'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4">
          <div
            className={`rounded-2xl shadow-lg border p-6 md:p-8 ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white">
                  <User size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Profaili Yangu
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Dhibiti taarifa zako binafsi na mawasiliano.
                  </p>
                </div>
              </div>

              <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                <p>{user?.username || user?.email || 'Mtumiaji'}</p>
                {rawProfile?.date_joined && (
                  <p className="flex items-center gap-1 justify-end">
                    <CalendarDays size={12} />
                    Umejiunga: {formatDate(rawProfile.date_joined)}
                  </p>
                )}
              </div>
            </div>

            {/* Alerts */}
            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-900/40 dark:text-red-100 flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-500/40 dark:bg-green-900/40 dark:text-green-100 flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{message}</span>
              </div>
            )}

            <div className="grid md:grid-cols-[2fr,1.2fr] gap-8">
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                      Jina la kwanza
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={form.first_name}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                      Jina la mwisho
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={form.last_name}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                    Username
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <User size={16} />
                    </span>
                    <input
                      type="text"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
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
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                      Namba ya simu
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Phone size={16} />
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                      Mahali ulipo
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <MapPin size={16} />
                      </span>
                      <input
                        type="text"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <Link
                    to="/profile/password"
                    className="text-xs text-green-600 hover:underline flex items-center gap-1"
                  >
                    <Shield size={12} />
                    Badili neno la siri
                  </Link>

                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-green-600 hover:bg-green-700 text-white disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {saving && (
                      <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    {saving ? 'Inahifadhi...' : 'Hifadhi Mabadiliko'}
                  </button>
                </div>
              </form>

              {/* Sidebar: taarifa za akaunti + extra fields */}
              <aside className="space-y-4 text-sm">
                <div
                  className={`rounded-xl p-4 ${
                    isDark ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <h2 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Muhtasari wa Akaunti
                  </h2>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-300 text-xs">
                    {rawProfile?.id && (
                      <li>
                        <span className="font-medium">ID:</span> {rawProfile.id}
                      </li>
                    )}
                    {rawProfile?.last_login && (
                      <li>
                        <span className="font-medium">Mara ya mwisho kuingia:</span>{' '}
                        {formatDate(rawProfile.last_login)}
                      </li>
                    )}
                    {typeof rawProfile?.is_active === 'boolean' && (
                      <li>
                        <span className="font-medium">Status:</span>{' '}
                        {rawProfile.is_active ? 'Active' : 'Inactive'}
                      </li>
                    )}
                    {typeof rawProfile?.is_staff === 'boolean' && (
                      <li>
                        <span className="font-medium">Staff:</span>{' '}
                        {rawProfile.is_staff ? 'Ndiyo' : 'Hapana'}
                      </li>
                    )}
                  </ul>
                </div>

                {extraFields.length > 0 && (
                  <div
                    className={`rounded-xl p-4 ${
                      isDark
                        ? 'bg-gray-900 border border-gray-700'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <h2 className="font-semibold text-gray-900 dark:text-white mb-2 text-xs">
                      Taarifa Nyingine kutoka API
                    </h2>
                    <ul className="space-y-1 text-[11px] text-gray-500 dark:text-gray-400 max-h-40 overflow-auto">
                      {extraFields.map(([key, value]) => (
                        <li key={key} className="flex justify-between gap-2">
                          <span className="font-medium">{key}:</span>
                          <span className="truncate">
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </aside>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
