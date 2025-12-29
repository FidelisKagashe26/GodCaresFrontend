import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import SEOHead from "../../components/SEOHead";
import LoadingSpinner from "../../components/LoadingSpinner";
import api from "../../services/api";
import { User, Mail, Phone, MapPin, Shield, CalendarDays, AlertCircle, CheckCircle2 } from "lucide-react";

export default function Profile() {
  const { isDark } = useTheme();
  const { t, language } = useLanguage();

  const [me, setMe] = useState(null);
  const [form, setForm] = useState({
    username: "",
    first_name: "",
    last_name: "",
    phone: "",
    location: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const loadMe = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getMe(); // OpenAPI: GET /api/v1/auth/me/
      setMe(data);
      setForm({
        username: data.username || "",
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        phone: data.phone || "",
        location: data.location || "",
      });
    } catch (err) {
      setError(err?.message || (language === "sw" ? "Imeshindikana kupakia profaili." : "Failed to load profile."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const initials = useMemo(() => {
    const fn = form.first_name?.trim();
    const ln = form.last_name?.trim();
    if (fn || ln) return `${(fn || "")[0] || ""}${(ln || "")[0] || ""}`.toUpperCase();
    return (form.username || "U").charAt(0).toUpperCase();
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      // OpenAPI: PATCH /api/v1/auth/me/ accepts ProfileUpdate fields (no email!)
      const updated = await api.patchMe({
        username: form.username,
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone,
        location: form.location,
      });

      setMe(updated);
      setMessage(t("profileSaved") || (language === "sw" ? "Taarifa zimehifadhiwa." : "Profile saved."));
    } catch (err) {
      setError(err?.message || (language === "sw" ? "Imeshindikana kuhifadhi." : "Failed to save changes."));
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString(language === "sw" ? "sw-TZ" : "en-US", { year: "numeric", month: "long", day: "2-digit" });
  };

  if (loading) {
    return (
      <>
        <SEOHead title={t("profileTitle") || (language === "sw" ? "Profaili Yangu" : "My Profile")} description="" />
        <section className={`min-h-[calc(100vh-200px)] flex items-center justify-center ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
          <LoadingSpinner text={t("loadingProfile") || (language === "sw" ? "Inapakia profaili..." : "Loading profile...")} />
        </section>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title={t("profileTitle") || (language === "sw" ? "Profaili Yangu" : "My Profile")}
        description={t("profileMetaDesc") || (language === "sw" ? "Dhibiti taarifa zako binafsi." : "Manage your profile.")}
      />

      <section className={`min-h-[calc(100vh-200px)] py-10 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="max-w-4xl mx-auto px-4">
          <div className={`rounded-2xl shadow-lg border p-6 md:p-8 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
            <div className="flex items-start justify-between mb-6 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-green-600 flex items-center justify-center text-white text-lg md:text-xl font-bold">
                  {initials}
                </div>

                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                    {t("profileTitle") || (language === "sw" ? "Profaili Yangu" : "My Profile")}
                  </h1>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                    {t("profileSubTitle") || (language === "sw" ? "Dhibiti taarifa zako binafsi na mawasiliano." : "Manage your personal info.")}
                  </p>
                </div>
              </div>

              <div className="text-right text-[11px] md:text-xs text-gray-500 dark:text-gray-400">
                {me?.date_joined && (
                  <p className="flex items-center gap-1 justify-end">
                    <CalendarDays size={12} />
                    {language === "sw" ? "Umejiunga:" : "Joined:"} {formatDate(me.date_joined)}
                  </p>
                )}
                {typeof me?.email_verified === "boolean" && (
                  <p className="mt-1">
                    {language === "sw" ? "Email status:" : "Email status:"}{" "}
                    <span className={me.email_verified ? "text-emerald-500 font-semibold" : "text-amber-500 font-semibold"}>
                      {me.email_verified ? (language === "sw" ? "Verified" : "Verified") : (language === "sw" ? "Haijathibitishwa" : "Not verified")}
                    </span>
                  </p>
                )}
              </div>
            </div>

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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-xs md:text-sm font-medium text-gray-700 dark:text-gray-200">
                      {language === "sw" ? "Jina la kwanza" : "First name"}
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
                    <label className="block mb-1 text-xs md:text-sm font-medium text-gray-700 dark:text-gray-200">
                      {language === "sw" ? "Jina la mwisho" : "Last name"}
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
                  <label className="block mb-1 text-xs md:text-sm font-medium text-gray-700 dark:text-gray-200">
                    {language === "sw" ? "Username" : "Username"}
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

                {/* EMAIL: READ-ONLY (OpenAPI haikubali email update kwenye /me/) */}
                <div>
                  <label className="block mb-1 text-xs md:text-sm font-medium text-gray-700 dark:text-gray-200">
                    {language === "sw" ? "Barua pepe" : "Email"}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Mail size={16} />
                    </span>
                    <input
                      type="email"
                      value={me?.email || ""}
                      readOnly
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 pl-9 pr-3 py-2 text-sm text-gray-700 dark:text-gray-200"
                    />
                  </div>

                  <div className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
                    {language === "sw" ? "Kubadili email tumia: " : "To change email use: "}
                    <Link to="/profile/email" className="font-semibold text-emerald-600 hover:underline dark:text-emerald-300">
                      {language === "sw" ? "Badili Email" : "Change Email"}
                    </Link>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-xs md:text-sm font-medium text-gray-700 dark:text-gray-200">
                      {language === "sw" ? "Namba ya simu" : "Phone"}
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
                    <label className="block mb-1 text-xs md:text-sm font-medium text-gray-700 dark:text-gray-200">
                      {language === "sw" ? "Mahali ulipo" : "Location"}
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
                  <Link to="/profile/password" className="text-xs text-green-600 hover:underline flex items-center gap-1">
                    <Shield size={12} />
                    {language === "sw" ? "Badili nenosiri" : "Change password"}
                  </Link>

                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-green-600 hover:bg-green-700 text-white disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {saving && <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                    {saving ? (language === "sw" ? "Inahifadhi..." : "Saving...") : (language === "sw" ? "Hifadhi Mabadiliko" : "Save changes")}
                  </button>
                </div>
              </form>

              <aside className="space-y-4 text-sm">
                <div className={`rounded-xl p-4 ${isDark ? "bg-gray-900 border border-gray-700" : "bg-gray-50 border border-gray-200"}`}>
                  <h2 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                    {language === "sw" ? "Muhtasari wa Akaunti" : "Account summary"}
                  </h2>

                  <ul className="space-y-1 text-gray-600 dark:text-gray-300 text-xs">
                    {/* {me?.id && (
                      <li>
                        <span className="font-medium">ID:</span> {me.id}
                      </li>
                    )} */}
                    <li>
                      <span className="font-medium">{language === "sw" ? "Username:" : "Username:"}</span> {me?.username || "-"}
                    </li>
                    <li>
                      <span className="font-medium">{language === "sw" ? "Email:" : "Email:"}</span> {me?.email || "-"}
                    </li>
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
