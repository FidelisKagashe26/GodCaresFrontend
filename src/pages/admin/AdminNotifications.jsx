// src/pages/admin/AdminNotifications.jsx
import { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  Send,
  AlertCircle,
  CheckCircle2,
  Filter,
  Users,
  Mail,
  Smartphone,
  Globe,
  Clock,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import SEOHead from '../../components/SEOHead';
import LoadingSpinner from '../../components/LoadingSpinner';
import apiService from '../../services/api';

export default function AdminNotifications() {
  const { isDark } = useTheme();

  const [items, setItems] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const [filter, setFilter] = useState('all'); // all, unread, info, alert, prayer, shop, system

  const [form, setForm] = useState({
    title: '',
    message: '',
    type: 'info', // info, alert, prayer, shop, system
    priority: 'normal', // low, normal, high
    audience: 'all', // all, prayer_team, shop_customers, single_user
    target_user: '',
    send_email: false,
    send_sms: false,
    send_in_app: true,
  });

  // Load existing notifications
  useEffect(() => {
    const load = async () => {
      setLoadingList(true);
      setError(null);

      try {
        let data = null;

        if (typeof apiService.getAdminNotifications === 'function') {
          data = await apiService.getAdminNotifications();
        } else if (typeof apiService.getNotifications === 'function') {
          // fallback: tumia ile ya kawaida kama ya admin haipo bado
          data = await apiService.getNotifications();
        } else {
          throw new Error(
            'Hakuna method ya kupakia notifications (getAdminNotifications/getNotifications) ndani ya apiService.'
          );
        }

        const list = Array.isArray(data)
          ? data
          : data?.results || data?.data || [];

        setItems(list);
      } catch (err) {
        console.error('AdminNotifications load error:', err);
        const msg =
          err?.message && typeof err.message === 'string'
            ? err.message
            : 'Imeshindikana kupakia orodha ya notifications.';
        setError(msg);
      } finally {
        setLoadingList(false);
      }
    };

    load();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    if (!form.title.trim()) {
      return 'Kichwa cha taarifa (title) ni lazima.';
    }
    if (!form.message.trim()) {
      return 'Ujumbe wa taarifa ni lazima.';
    }
    if (form.audience === 'single_user' && !form.target_user.trim()) {
      return 'Tafadhali weka mtumiaji lengwa (Target user ID / email).';
    }
    if (!form.send_email && !form.send_in_app && !form.send_sms) {
      return 'Chagua angalau njia moja ya kutuma (email / in-app / SMS).';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);

    const payload = {
      title: form.title,
      message: form.message,
      type: form.type,
      priority: form.priority,
      audience: form.audience,
      target_user: form.audience === 'single_user' ? form.target_user : null,
      send_email: form.send_email,
      send_sms: form.send_sms,
      send_in_app: form.send_in_app,
    };

    try {
      if (typeof apiService.createNotification !== 'function') {
        throw new Error(
          'apiService.createNotification haijasanidiwa bado. Tafadhali ongeza method hii kwenye services/api.'
        );
      }

      const created = await apiService.createNotification(payload);

      // ongeza juu ya list bila kusubiri reload
      setItems((prev) => [
        created || {
          id: Date.now(),
          title: payload.title,
          message: payload.message,
          type: payload.type,
          priority: payload.priority,
          audience: payload.audience,
          created_at: new Date().toISOString(),
          is_read: false,
        },
        ...prev,
      ]);

      setMessage('Notification imetumwa kikamilifu.');

      // clear form kidogo
      setForm((prev) => ({
        ...prev,
        title: '',
        message: '',
        priority: 'normal',
        audience: 'all',
        target_user: '',
      }));
    } catch (err) {
      console.error('Create notification error:', err);
      const msg =
        err?.message && typeof err.message === 'string'
          ? err.message
          : 'Imeshindikana kutuma notification. Jaribu tena.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

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

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const type = (item.type || item.category || '').toLowerCase();
      const read = item.is_read ?? false;

      if (filter === 'all') return true;
      if (filter === 'unread') return !read;
      return type === filter;
    });
  }, [items, filter]);

  const unreadCount = items.filter((n) => !n.is_read).length;

  const getTypeBadge = (type) => {
    const t = (type || '').toLowerCase();
    if (!t) {
      return {
        label: 'GENERAL',
        className:
          'bg-gray-100 text-gray-700 dark:bg-gray-700/60 dark:text-gray-100',
      };
    }

    switch (t) {
      case 'alert':
        return {
          label: 'ALERT',
          className:
            'bg-red-50 text-red-700 dark:bg-red-900/40 dark:text-red-200',
        };
      case 'prayer':
        return {
          label: 'PRAYER',
          className:
            'bg-purple-50 text-purple-700 dark:bg-purple-900/40 dark:text-purple-200',
        };
      case 'shop':
        return {
          label: 'SHOP',
          className:
            'bg-orange-50 text-orange-700 dark:bg-orange-900/40 dark:text-orange-200',
        };
      case 'system':
        return {
          label: 'SYSTEM',
          className:
            'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200',
        };
      default:
        return {
          label: t.toUpperCase(),
          className:
            'bg-green-50 text-green-700 dark:bg-green-900/40 dark:text-green-200',
        };
    }
  };

  return (
    <>
      <SEOHead
        title="Admin – Taarifa & Notifications"
        description="Panel ya admin kusimamia na kutuma notifications kwa watumiaji wa GOD CARES 365."
      />

      <section
        className={`min-h-[calc(100vh-200px)] py-8 md:py-10 transition-colors ${
          isDark
            ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950'
            : 'bg-gradient-to-b from-slate-50 via-white to-blue-50'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-400/40">
                <Bell size={22} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
                  Admin – Taarifa &amp; Notifications
                </h1>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                  Tuma ujumbe muhimu kwa watumiaji, tengeneza alerts, na tangaza
                  taarifa za shop au maombi.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end text-xs">
              <p className="text-gray-500 dark:text-gray-400">
                Jumla: {items.length}
              </p>
              <p className="text-blue-600 dark:text-blue-300 font-semibold">
                Zisizosomwa: {unreadCount}
              </p>
            </div>
          </header>

          <div className="grid lg:grid-cols-[1.4fr,2fr] gap-6 items-start">
            {/* Left: Compose form */}
            <div
              className={`rounded-2xl border shadow-sm p-5 md:p-6 ${
                isDark
                  ? 'bg-gray-900/90 border-gray-800'
                  : 'bg-white/95 border-gray-100'
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <Send
                  size={18}
                  className={isDark ? 'text-blue-300' : 'text-blue-600'}
                />
                <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                  Tuma Notification Mpya
                </h2>
              </div>

              {error && (
                <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-500/40 dark:bg-red-900/40 dark:text-red-100 flex items-center gap-2">
                  <AlertCircle size={14} />
                  <span>{error}</span>
                </div>
              )}

              {message && (
                <div className="mb-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700 dark:border-green-500/40 dark:bg-green-900/40 dark:text-green-100 flex items-center gap-2">
                  <CheckCircle2 size={14} />
                  <span>{message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                {/* Title */}
                <div>
                  <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-200">
                    Kichwa cha taarifa <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                      isDark
                        ? 'bg-gray-800 border-gray-700 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Mfano: Taarifa muhimu ya ibada ya kesho..."
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-200">
                    Ujumbe kamili <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                      isDark
                        ? 'bg-gray-800 border-gray-700 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Andika ujumbe utakaoonekana kwa mtumiaji..."
                  />
                </div>

                {/* Type & priority */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-200">
                      Aina ya taarifa
                    </label>
                    <select
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark
                          ? 'bg-gray-800 border-gray-700 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="info">Habari ya kawaida</option>
                      <option value="alert">Tahadhari / Alert</option>
                      <option value="prayer">Maombi</option>
                      <option value="shop">Shop / Mauzo</option>
                      <option value="system">System Update</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-200">
                      Kipaumbele
                    </label>
                    <select
                      name="priority"
                      value={form.priority}
                      onChange={handleChange}
                      className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark
                          ? 'bg-gray-800 border-gray-700 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                {/* Audience */}
                <div>
                  <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-200">
                    Walengwa
                  </label>
                  <select
                    name="audience"
                    value={form.audience}
                    onChange={handleChange}
                    className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark
                        ? 'bg-gray-800 border-gray-700 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="all">Watumiaji wote</option>
                    <option value="prayer_team">Timu ya Maombi</option>
                    <option value="shop_customers">Wateja wa shop</option>
                    <option value="single_user">Mtumiaji mmoja maalum</option>
                  </select>
                </div>

                {form.audience === 'single_user' && (
                  <div>
                    <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-200">
                      Mtumiaji lengwa (ID / email / phone)
                    </label>
                    <input
                      type="text"
                      name="target_user"
                      value={form.target_user}
                      onChange={handleChange}
                      className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark
                          ? 'bg-gray-800 border-gray-700 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Mfano: user@example.com"
                    />
                  </div>
                )}

                {/* Channels */}
                <div>
                  <p className="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-200">
                    Njia za kutuma
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <label className="inline-flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        name="send_in_app"
                        checked={form.send_in_app}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <Globe size={14} />
                      <span>In-app (Notifications page)</span>
                    </label>
                    <label className="inline-flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        name="send_email"
                        checked={form.send_email}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <Mail size={14} />
                      <span>Email</span>
                    </label>
                    <label className="inline-flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        name="send_sms"
                        checked={form.send_sms}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <Smartphone size={14} />
                      <span>SMS</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full mt-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Inatuma...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Tuma Notification
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right: List */}
            <div>
              {/* Filters */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3 text-xs">
                <div className="flex items-center gap-2">
                  <Filter size={14} className="text-gray-500 dark:text-gray-400" />
                  <div className="inline-flex rounded-full bg-gray-100/80 dark:bg-gray-800/60 p-1 border border-gray-200 dark:border-gray-700">
                    {[
                      { id: 'all', label: 'Zote' },
                      { id: 'unread', label: 'Zisizosomwa' },
                      { id: 'info', label: 'Info' },
                      { id: 'alert', label: 'Alert' },
                      { id: 'prayer', label: 'Prayer' },
                      { id: 'shop', label: 'Shop' },
                      { id: 'system', label: 'System' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setFilter(f.id)}
                        className={`px-3 py-1 rounded-full font-medium transition-colors ${
                          filter === f.id
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-700/40'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                  <Users size={12} />
                  <span>Notifications zinazoonekana kwa watumiaji wa kawaida.</span>
                </div>
              </div>

              {/* List area */}
              <div
                className={`rounded-2xl border shadow-sm min-h-[260px] ${
                  isDark
                    ? 'bg-gray-900/90 border-gray-800'
                    : 'bg-white/95 border-gray-100'
                }`}
              >
                {loadingList ? (
                  <div className="py-10 flex justify-center">
                    <LoadingSpinner text="Inapakia orodha ya notifications..." />
                  </div>
                ) : filteredItems.length === 0 ? (
                  <div className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    Hakuna notifications kwa vigezo ulivyotumia.
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-[460px] overflow-auto">
                    {filteredItems.map((item) => {
                      const typeBadge = getTypeBadge(item.type || item.category);
                      const read = item.is_read ?? false;
                      const date = formatDateTime(
                        item.created_at || item.timestamp
                      );
                      const title = item.title || 'Taarifa';
                      const body = item.message || item.body || '';

                      return (
                        <div
                          key={item.id || `${title}-${date}`}
                          className={`px-4 py-3 text-xs md:text-sm flex gap-3 ${
                            read
                              ? 'bg-transparent'
                              : 'bg-blue-50/60 dark:bg-blue-900/20'
                          }`}
                        >
                          <div className="mt-1">
                            {read ? (
                              <CheckCircle2
                                size={18}
                                className="text-green-500"
                              />
                            ) : (
                              <Bell size={18} className="text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <div className="flex items-center gap-2">
                                <h2 className="font-semibold text-gray-900 dark:text-white">
                                  {title}
                                </h2>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[9px] font-semibold ${typeBadge.className}`}
                                >
                                  {typeBadge.label}
                                </span>
                                {item.priority && (
                                  <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                                    PRIORITY:{' '}
                                    {String(item.priority).toUpperCase()}
                                  </span>
                                )}
                              </div>
                              {date && (
                                <span className="flex items-center text-[10px] text-gray-500 dark:text-gray-400 gap-1 flex-shrink-0">
                                  <Clock size={10} />
                                  {date}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-700 dark:text-gray-200">
                              {body}
                            </p>
                            <div className="mt-1.5 flex flex-wrap gap-2 text-[10px] text-gray-500 dark:text-gray-400">
                              {item.audience && (
                                <span>
                                  Walengwa:{' '}
                                  {String(item.audience)
                                    .replace(/_/g, ' ')
                                    .toUpperCase()}
                                </span>
                              )}
                              {item.source && <span>Chanzo: {item.source}</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
