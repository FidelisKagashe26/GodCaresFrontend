// src/pages/prayer/PrayerRequests.jsx
import { useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { isValidEmail, isValidPhone } from "../../utils/helpers";
import apiService from "../../services/api";
import SEOHead from "../../components/SEOHead";
import {
  Heart,
  Send,
  CheckCircle,
  Users,
  Clock,
  Shield,
  AlertCircle,
  UserCircle2,
} from "lucide-react";

export default function PrayerRequests() {
  const { isDark } = useTheme();

  const [account, setAccount] = useState({ name: "", email: "", phone: "" });
  const [loadingAccount, setLoadingAccount] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    request: "",
    category: "personal",
    anonymous: false,
    urgent: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);

  const isLoggedIn = Boolean(apiService.getAccessToken?.());

  // Auto-fill kutoka /api/v1/auth/me/ (OpenAPI: User schema)
  useEffect(() => {
    let mounted = true;

    const loadMe = async () => {
      if (!isLoggedIn) return;

      setLoadingAccount(true);
      try {
        const me = await apiService.getMe();

        const fullName =
          [me?.first_name, me?.last_name].filter(Boolean).join(" ").trim() ||
          (me?.username ? String(me.username) : "");

        const email = me?.email ? String(me.email) : "";
        const phone = me?.phone ? String(me.phone) : "";

        if (!mounted) return;

        const normalized = { name: fullName, email, phone };
        setAccount(normalized);

        setFormData((prev) => ({
          ...prev,
          name: normalized.name || prev.name,
          email: normalized.email || prev.email,
          phone: normalized.phone || prev.phone,
        }));
      } catch {
        // api.js itajaribu refresh ikiwa token ime-expire.
      } finally {
        if (mounted) setLoadingAccount(false);
      }
    };

    loadMe();
    return () => {
      mounted = false;
    };
  }, [isLoggedIn]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.anonymous && !String(formData.name || "").trim()) {
      newErrors.name = "Jina ni lazima kama hutumii anonymous.";
    }

    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = "Barua pepe si sahihi.";
    }

    if (formData.phone && !isValidPhone(formData.phone)) {
      newErrors.phone = "Nambari ya simu si sahihi.";
    }

    if (!String(formData.request || "").trim()) {
      newErrors.request = "Ombi ni lazima.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    setSubmitError(null);

    try {
      await apiService.submitPrayerRequest({
        name: formData.anonymous ? "" : String(formData.name || "").trim(),
        email: String(formData.email || "").trim(),
        phone: String(formData.phone || "").trim(),
        category: formData.category,
        request: String(formData.request || "").trim(),
        is_anonymous: Boolean(formData.anonymous),
        is_urgent: Boolean(formData.urgent),
      });

      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        setFormData((prev) => ({
          ...prev,
          request: "",
          category: "personal",
          anonymous: false,
          urgent: false,
          // keep autofill kwa aliye-login
          name: isLoggedIn ? account.name : "",
          email: isLoggedIn ? account.email : "",
          phone: isLoggedIn ? account.phone : "",
        }));
      }, 2500);
    } catch (error) {
      const msg =
        error?.message && typeof error.message === "string"
          ? error.message
          : "Hitilafu katika kutuma ombi. Jaribu tena.";
      setSubmitError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      if (name === "anonymous") {
        const next = { ...prev, anonymous: checked };
        if (checked) {
          next.name = "";
        } else if (isLoggedIn && !String(next.name || "").trim()) {
          next.name = account.name || "";
        }
        return next;
      }

      return {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
    });

    setErrors((prev) => {
      if (!prev[name]) return prev;
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  };

  if (submitted) {
    return (
      <>
        <SEOHead
          title="Ombi Limepokewa"
          description="Ombi lako la maombi limepokewa. Timu yetu itaomba kwa ajili yako."
        />
        <div
          className={`min-h-screen py-12 transition-colors ${
            isDark
              ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"
              : "bg-gradient-to-b from-slate-50 via-white to-emerald-50"
          }`}
        >
          <div className="container mx-auto px-4 md:px-6">
            <div
              className={`max-w-2xl mx-auto text-center rounded-2xl border p-8 md:p-12 shadow-lg ${
                isDark
                  ? "bg-gray-900/90 border-gray-800"
                  : "bg-white border-gray-100"
              }`}
            >
              <CheckCircle className="text-emerald-500 mx-auto mb-6" size={64} />
              <h1
                className={`text-2xl md:text-3xl font-bold mb-4 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Ombi Lako Limepokewa!
              </h1>
              <p
                className={`text-sm md:text-lg mb-6 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Asante. Timu yetu ya maombi itaomba kwa ajili yako. Mungu akusikie
                na akujibu kwa wakati wake kamili.
              </p>

              <div
                className={`p-4 rounded-lg mb-6 ${
                  isDark
                    ? "bg-emerald-900/20 border border-emerald-800"
                    : "bg-emerald-50 border border-emerald-200"
                }`}
              >
                <p className="text-emerald-700 dark:text-emerald-300 text-sm md:text-base font-medium">
                  "Msiwe na wasiwasi juu ya chochote..." – Wafilipi 4:6
                </p>
              </div>

              <button
                onClick={() => setSubmitted(false)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 md:px-8 py-3 rounded-lg font-semibold text-sm md:text-base transition-colors"
              >
                Tuma Ombi Lingine
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const showProfileCard = isLoggedIn && !formData.anonymous;

  return (
    <>
      <SEOHead
        title="Maombi ya Pamoja"
        description="Tuma ombi lako na tuombe pamoja kama jamii ya imani."
        keywords="maombi, ombi, prayer, imani, jamii, kiroho"
      />

      <div
        className={`min-h-screen py-10 md:py-12 transition-colors ${
          isDark
            ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"
            : "bg-gradient-to-b from-slate-50 via-white to-emerald-50"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <header className="text-center mb-10 md:mb-12">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 via-sky-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md shadow-emerald-400/50">
              <Heart className="text-white" size={32} />
            </div>
            <h1
              className={`text-2xl md:text-4xl font-extrabold mb-3 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Maombi ya Pamoja
            </h1>
            <p
              className={`text-sm md:text-lg max-w-2xl mx-auto ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Tuma ombi lako na tuombe pamoja kama jamii ya imani.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div
                className={`rounded-2xl border shadow-lg p-6 md:p-8 ${
                  isDark
                    ? "bg-gray-900/90 border-gray-800"
                    : "bg-white border-gray-100"
                }`}
              >
                <h2
                  className={`text-lg md:text-2xl font-bold mb-4 md:mb-6 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Tuma Ombi Lako
                </h2>

                {submitError && (
                  <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs md:text-sm text-red-700 dark:border-red-500/40 dark:bg-red-900/40 dark:text-red-100 flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>{submitError}</span>
                  </div>
                )}

                {showProfileCard && (
                  <div
                    className={`mb-5 rounded-2xl border p-4 md:p-5 ${
                      isDark
                        ? "bg-gray-900/60 border-gray-800"
                        : "bg-emerald-50/60 border-emerald-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <UserCircle2
                        size={18}
                        className={isDark ? "text-emerald-300" : "text-emerald-700"}
                      />
                      <p
                        className={`text-xs md:text-sm font-semibold ${
                          isDark ? "text-gray-100" : "text-gray-900"
                        }`}
                      >
                        Taarifa zako (auto)
                      </p>
                      {loadingAccount && (
                        <span className="text-[11px] text-gray-400">inapakia...</span>
                      )}
                    </div>
                    <div
                      className={`text-xs md:text-sm ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      <div>
                        <span className="font-semibold">Jina:</span>{" "}
                        {formData.name || "-"}
                      </div>
                      <div>
                        <span className="font-semibold">Email:</span>{" "}
                        {formData.email || "-"}
                      </div>
                      <div>
                        <span className="font-semibold">Simu:</span>{" "}
                        {formData.phone || "-"}
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                  {!isLoggedIn && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            className={`block text-xs md:text-sm font-medium mb-2 ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            Jina Lako {!formData.anonymous && <span className="text-red-500">*</span>}
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={formData.anonymous}
                            className={`w-full px-3 md:px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                              errors.name ? "border-red-500" : ""
                            } ${
                              isDark
                                ? "bg-gray-800 border-gray-700 text-white disabled:bg-gray-700"
                                : "bg-white border-gray-300 text-gray-900 disabled:bg-gray-100"
                            }`}
                            placeholder="Jina lako kamili"
                          />
                          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        <div>
                          <label
                            className={`block text-xs md:text-sm font-medium mb-2 ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            Barua Pepe
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-3 md:px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                              errors.email ? "border-red-500" : ""
                            } ${
                              isDark
                                ? "bg-gray-800 border-gray-700 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                            }`}
                            placeholder="email@example.com"
                          />
                          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                      </div>

                      <div>
                        <label
                          className={`block text-xs md:text-sm font-medium mb-2 ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Nambari ya Simu
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`w-full px-3 md:px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                            errors.phone ? "border-red-500" : ""
                          } ${
                            isDark
                              ? "bg-gray-800 border-gray-700 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                          placeholder="+255 xxx xxx xxx"
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                      </div>
                    </>
                  )}

                  <div>
                    <label
                      className={`block text-xs md:text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Aina ya Ombi <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full px-3 md:px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        isDark
                          ? "bg-gray-800 border-gray-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      <option value="personal">Binafsi</option>
                      <option value="family">Familia</option>
                      <option value="health">Afya</option>
                      <option value="work">Kazi</option>
                      <option value="spiritual">Kiroho</option>
                      <option value="community">Jamii</option>
                      <option value="other">Nyingine</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-xs md:text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Ombi Lako <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="request"
                      value={formData.request}
                      onChange={handleChange}
                      rows={6}
                      className={`w-full px-3 md:px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        errors.request ? "border-red-500" : ""
                      } ${
                        isDark
                          ? "bg-gray-800 border-gray-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                      placeholder="Andika ombi lako hapa..."
                    />
                    {errors.request && <p className="text-red-500 text-xs mt-1">{errors.request}</p>}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="anonymous"
                        name="anonymous"
                        checked={formData.anonymous}
                        onChange={handleChange}
                        className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <label
                        htmlFor="anonymous"
                        className={`ml-2 text-xs md:text-sm ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Tuma bila kutaja jina (Anonymous)
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="urgent"
                        name="urgent"
                        checked={formData.urgent}
                        onChange={handleChange}
                        className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <label
                        htmlFor="urgent"
                        className={`ml-2 text-xs md:text-sm ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Special Prayer (Haraka / Kipaumbele)
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center justify-center text-sm md:text-base"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Inatuma...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2" size={18} />
                        Tuma Ombi
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            <div className="space-y-6">
              <div
                className={`rounded-2xl border p-5 ${
                  isDark ? "bg-gray-900/90 border-gray-800" : "bg-white border-gray-100"
                }`}
              >
                <h3 className={`text-base md:text-lg font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Miongozo ya Maombi
                </h3>
                <ul className={`space-y-2 text-xs md:text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  <li className="flex items-start">
                    <Heart className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
                    Omba kwa moyo wa uwazi na imani.
                  </li>
                  <li className="flex items-start">
                    <Shield className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
                    Maombi yako yanahifadhiwa kwa siri na usalama.
                  </li>
                  <li className="flex items-start">
                    <Users className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
                    Timu yetu ya maombi itaombea ombi lako.
                  </li>
                  <li className="flex items-start">
                    <Clock className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
                    Maombi ya haraka yanapewa kipaumbele.
                  </li>
                </ul>
              </div>

              <div
                className={`rounded-2xl p-5 border ${
                  isDark ? "bg-emerald-900/20 border-emerald-800" : "bg-emerald-50 border-emerald-200"
                }`}
              >
                <blockquote className="text-emerald-700 dark:text-emerald-200 text-sm md:text-base font-medium mb-2">
                  "Msiwe na wasiwasi juu ya chochote, bali katika kila jambo, kwa maombi na dua..."
                </blockquote>
                <cite className="text-emerald-600 dark:text-emerald-300 text-xs md:text-sm">– Wafilipi 4:6</cite>
              </div>

              <div
                className={`rounded-2xl border p-5 ${
                  isDark ? "bg-gray-900/90 border-gray-800" : "bg-white border-gray-100"
                }`}
              >
                <h3 className={`text-base md:text-lg font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Maombi ya Haraka Sana
                </h3>
                <p className={`text-xs md:text-sm mb-3 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  Kwa maombi ya haraka sana, unaweza kuwasiliana nasi moja kwa moja:
                </p>
                <div className="space-y-2 text-xs md:text-sm">
                  <div className={isDark ? "text-gray-300" : "text-gray-700"}>📞 +255 767 525 234</div>
                  <div className={isDark ? "text-gray-300" : "text-gray-700"}>✉️ fmklink@gmail.com</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
