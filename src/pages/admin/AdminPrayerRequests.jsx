// src/pages/admin/AdminPrayerRequests.jsx
import { useEffect, useMemo, useState } from 'react';
import {
  Heart,
  AlertCircle,
  CheckCircle2,
  Clock,
  Filter,
  User,
  Phone,
  Mail,
  Flag,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import SEOHead from '../../components/SEOHead';
import LoadingSpinner from '../../components/LoadingSpinner';
import apiService from '../../services/api';

export default function AdminPrayerRequests() {
  const { isDark } = useTheme();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all'); // all, pending, praying, done
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        let data = null;

        if (typeof apiService.getPrayerRequestsAdmin === 'function') {
          data = await apiService.getPrayerRequestsAdmin();
        } else if (typeof apiService.getPrayerRequests === 'function') {
          data = await apiService.getPrayerRequests();
        } else {
          throw new Error(
            'apiService.getPrayerRequestsAdmin/getPrayerRequests haijasanidiwa bado.'
          );
        }

        const list = Array.isArray(data)
          ? data
          : data?.results || data?.data || [];
        setItems(list);
      } catch (err) {
        console.error('AdminPrayerRequests load error:', err);
        const msg =
          err?.message && typeof err.message === 'string'
            ? err.message
            : 'Imeshindikana kupakia maombi.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const formatDateTime = (value) => {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleString('sw-TZ', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleStatusChange = async (id, newStatus) => {
    // optimistic update
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: newStatus,
            }
          : item
      )
    );

    try {
      if (typeof apiService.updatePrayerRequestStatus === 'function') {
        await apiService.updatePrayerRequestStatus(id, { status: newStatus });
      } else {
        console.warn(
          'updatePrayerRequestStatus haijasanidiwa; update inafanyika local tu kwa sasa.'
        );
      }
    } catch (err) {
      console.error('Update status error:', err);
      setError(
        err?.message ||
          'Imeshindikana kubadili status ya ombi. Jaribu tena baadaye.'
      );
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const status = (item.status || 'pending').toLowerCase();
      const cat = (item.category || '').toLowerCase();

      if (statusFilter !== 'all' && status !== statusFilter) return false;
      if (categoryFilter !== 'all' && cat !== categoryFilter) return false;
      return true;
    });
  }, [items, statusFilter, categoryFilter]);

  const categories = useMemo(() => {
    const set = new Set();
    items.forEach((i) => {
      if (i.category) set.add(i.category.toLowerCase());
    });
    return Array.from(set);
  }, [items]);

  const statusLabel = (status) => {
    const s = (status || 'pending').toLowerCase();
    switch (s) {
      case 'praying':
        return 'Inaombewa';
      case 'done':
        return 'Imeshaombewa';
      default:
        return 'Haijashughulikiwa';
    }
  };

  const statusClass = (status) => {
    const s = (status || 'pending').toLowerCase();
    switch (s) {
      case 'praying':
        return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-200';
      case 'done':
        return 'bg-green-50 text-green-700 dark:bg-green-900/40 dark:text-green-200';
      default:
        return 'bg-red-50 text-red-700 dark:bg-red-900/40 dark:text-red-200';
    }
  };

  return (
    <>
      <SEOHead
        title="Admin – Maombi ya Pamoja"
        description="Panel ya admin kusimamia maombi ya watumiaji wa GOD CARES 365."
      />

      <section
        className={`min-h-[calc(100vh-200px)] py-8 md:py-10 transition-colors ${
          isDark
            ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950'
            : 'bg-gradient-to-b from-slate-50 via-white to-rose-50'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-400/40">
                <Heart size={22} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
                  Admin – Maombi ya Pamoja
                </h1>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                  Tazama maombi yote, weka status, na panga yale ya haraka kwa
                  timu ya maombi.
                </p>
              </div>
            </div>
          </header>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-500/40 dark:bg-red-900/40 dark:text-red-100 flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={14} className="text-gray-500 dark:text-gray-400" />
              <div className="inline-flex rounded-full bg-gray-100/80 dark:bg-gray-800/60 p-1 border border-gray-200 dark:border-gray-700">
                {[
                  { id: 'all', label: 'Status: Zote' },
                  { id: 'pending', label: 'Haijashughulikiwa' },
                  { id: 'praying', label: 'Inaombewa' },
                  { id: 'done', label: 'Imeshaombewa' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setStatusFilter(f.id)}
                    className={`px-3 py-1 rounded-full font-medium transition-colors ${
                      statusFilter === f.id
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-700/40'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-gray-500 dark:text-gray-400">Aina ya ombi:</span>
              <div className="inline-flex rounded-full bg-gray-100/80 dark:bg-gray-800/60 p-1 border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-3 py-1 rounded-full font-medium transition-colors ${
                    categoryFilter === 'all'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-700/40'
                  }`}
                >
                  Zote
                </button>
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategoryFilter(c)}
                    className={`px-3 py-1 rounded-full font-medium transition-colors ${
                      categoryFilter === c
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-700/40'
                    }`}
                  >
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* List */}
          <div
            className={`rounded-2xl border shadow-sm min-h-[280px] ${
              isDark
                ? 'bg-gray-900/90 border-gray-800'
                : 'bg-white/95 border-gray-100'
            }`}
          >
            {loading ? (
              <div className="py-10 flex justify-center">
                <LoadingSpinner text="Inapakia maombi..." />
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                Hakuna maombi kwa vigezo ulivyotumia.
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-[520px] overflow-auto">
                {filteredItems.map((item) => {
                  const date = formatDateTime(item.created_at);
                  const isAnonymous = item.is_anonymous;
                  const urgent = item.is_urgent;
                  const status = item.status || 'pending';

                  return (
                    <div
                      key={item.id}
                      className="px-4 py-3 flex flex-col md:flex-row gap-3 text-xs md:text-sm"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        <Heart
                          size={18}
                          className={
                            urgent
                              ? 'text-red-500'
                              : 'text-rose-500 dark:text-rose-300'
                          }
                        />
                      </div>

                      <div className="flex-1">
                        {/* Top line */}
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-1">
                              <User size={14} className="text-gray-500" />
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {isAnonymous
                                  ? 'Anonymous'
                                  : item.name || 'Mtumiaji'}
                              </span>
                            </div>
                            {item.category && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200">
                                <Flag size={10} />
                                {String(item.category)
                                  .replace(/_/g, ' ')
                                  .toUpperCase()}
                              </span>
                            )}
                            {urgent && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-700 dark:bg-red-900/40 dark:text-red-200">
                                HARAKA
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 flex-wrap justify-between">
                            {date && (
                              <span className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400">
                                <Clock size={10} />
                                {date}
                              </span>
                            )}
                            <div className="inline-flex rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 text-[10px]">
                              <button
                                onClick={() => handleStatusChange(item.id, 'pending')}
                                className={`px-2 py-1 ${
                                  status === 'pending'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-transparent text-gray-600 dark:text-gray-300'
                                }`}
                              >
                                Pending
                              </button>
                              <button
                                onClick={() => handleStatusChange(item.id, 'praying')}
                                className={`px-2 py-1 border-l border-gray-200 dark:border-gray-700 ${
                                  status === 'praying'
                                    ? 'bg-yellow-500 text-white'
                                    : 'bg-transparent text-gray-600 dark:text-gray-300'
                                }`}
                              >
                                Inaombewa
                              </button>
                              <button
                                onClick={() => handleStatusChange(item.id, 'done')}
                                className={`px-2 py-1 border-l border-gray-200 dark:border-gray-700 ${
                                  status === 'done'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-transparent text-gray-600 dark:text-gray-300'
                                }`}
                              >
                                Imeshaombewa
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Request body */}
                        <p className="text-gray-700 dark:text-gray-200 whitespace-pre-line">
                          {item.request}
                        </p>

                        {/* Meta */}
                        <div className="mt-2 flex flex-wrap gap-3 text-[10px] text-gray-500 dark:text-gray-400">
                          {item.email && !isAnonymous && (
                            <span className="inline-flex items-center gap-1">
                              <Mail size={10} />
                              {item.email}
                            </span>
                          )}
                          {item.phone && !isAnonymous && (
                            <span className="inline-flex items-center gap-1">
                              <Phone size={10} />
                              {item.phone}
                            </span>
                          )}
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${statusClass(
                              status
                            )}`}
                          >
                            <CheckCircle2 size={10} />
                            {statusLabel(status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
