// src/pages/account/Notifications.jsx
import { useEffect, useState } from 'react';
import { Bell, Inbox, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import SEOHead from '../../components/SEOHead';
import LoadingSpinner from '../../components/LoadingSpinner';
import apiService from '../../services/api';

export default function Notifications() {
  const { isDark } = useTheme();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiService.getNotifications();
        const list = Array.isArray(data) ? data : data.results || data.data || [];
        setItems(list);
      } catch (err) {
        setError(err.message || 'Imeshindikana kupakia notifications.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const unreadCount = items.filter((n) => !n.is_read).length;

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

  const getTypeLabel = (item) => {
    const type = item.type || item.category || '';
    if (!type) return null;
    return type.replace(/_/g, ' ').toUpperCase();
  };

  return (
    <>
      <SEOHead
        title="Taarifa & Notifications"
        description="Orodha ya taarifa muhimu kutoka mfumo wa GOD CARES 365"
      />

      <section
        className={`min-h-[calc(100vh-200px)] py-10 transition-colors ${
          isDark ? 'bg-gray-900' : 'bg-gray-50'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <header className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <Bell size={22} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Taarifa &amp; Notifications
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Hapa utaona taarifa muhimu kutoka kwenye mfumo na viongozi wa GOD CARES 365.
                </p>
              </div>
            </div>

            <div className="text-right text-xs">
              <p className="text-gray-500 dark:text-gray-400">Jumla: {items.length}</p>
              <p className="text-blue-600 dark:text-blue-400 font-semibold">
                Zisizosomwa: {unreadCount}
              </p>
            </div>
          </header>

          {/* State: loading */}
          {loading && (
            <div className="flex justify-center py-16">
              <LoadingSpinner text="Inapakia notifications..." />
            </div>
          )}

          {/* State: error */}
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-900/40 dark:text-red-100 flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* State: empty */}
          {!loading && !error && items.length === 0 && (
            <div
              className={`card p-8 text-center ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <Inbox
                className={isDark ? 'text-gray-400 mx-auto mb-4' : 'text-gray-500 mx-auto mb-4'}
                size={40}
              />
              <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                Bado hakuna notifications kwa sasa.
              </p>
            </div>
          )}

          {/* List */}
          <div className="space-y-3">
            {items.map((item) => {
              const title = item.title || 'Taarifa';
              const body = item.message || item.body || '';
              const date = formatDateTime(item.created_at || item.timestamp);
              const read = item.is_read ?? false;
              const typeLabel = getTypeLabel(item);

              return (
                <div
                  key={item.id || `${title}-${date}`}
                  className={`rounded-xl border px-4 py-3 text-sm flex gap-3 ${
                    read
                      ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                      : 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-500/50'
                  }`}
                >
                  <div className="mt-1">
                    {read ? (
                      <CheckCircle2
                        size={18}
                        className={read ? 'text-green-500' : 'text-blue-600'}
                      />
                    ) : (
                      <Bell size={18} className="text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h2 className="font-semibold text-gray-900 dark:text-white">
                          {title}
                        </h2>
                        {typeLabel && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                            {typeLabel}
                          </span>
                        )}
                      </div>
                      {date && (
                        <span className="flex items-center text-[10px] text-gray-500 dark:text-gray-400 gap-1">
                          <Clock size={10} />
                          {date}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 dark:text-gray-200">{body}</p>

                    {/* Extra meta kama zipo (hakuna data ipotee) */}
                    <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-gray-500 dark:text-gray-400">
                      {item.source && <span>Chanzo: {item.source}</span>}
                      {item.priority && <span>Kipaumbele: {item.priority}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
