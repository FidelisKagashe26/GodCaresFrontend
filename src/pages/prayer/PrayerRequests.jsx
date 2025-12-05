// src/pages/prayer/PrayerRequests.jsx
import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { isValidEmail, isValidPhone } from '../../utils/helpers';
import apiService from '../../services/api';
import SEOHead from '../../components/SEOHead';
import {
  Heart,
  Send,
  CheckCircle,
  Users,
  Clock,
  Shield,
  AlertCircle,
} from 'lucide-react';

export default function PrayerRequests() {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    request: '',
    category: 'personal',
    anonymous: false,
    urgent: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.anonymous && !formData.name.trim()) {
      newErrors.name = 'Jina ni lazima kama hutumii anonymous.';
    }
    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = 'Barua pepe si sahihi.';
    }
    if (formData.phone && !isValidPhone(formData.phone)) {
      newErrors.phone = 'Nambari ya simu si sahihi.';
    }
    if (!formData.request.trim()) {
      newErrors.request = 'Ombi ni lazima.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    setSubmitError(null);

    try {
      await apiService.submitPrayerRequest({
        name: formData.anonymous ? '' : formData.name,
        email: formData.email,
        phone: formData.phone,
        category: formData.category,
        request: formData.request,
        is_anonymous: formData.anonymous,
        is_urgent: formData.urgent,
      });

      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          request: '',
          category: 'personal',
          anonymous: false,
          urgent: false,
        });
      }, 3000);
    } catch (error) {
      const msg =
        error?.message && typeof error.message === 'string'
          ? error.message
          : 'Hitilafu katika kutuma ombi. Jaribu tena.';
      setSubmitError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
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
              ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950'
              : 'bg-gradient-to-b from-slate-50 via-white to-rose-50'
          }`}
        >
          <div className="container mx-auto px-4 md:px-6">
            <div
              className={`max-w-2xl mx-auto text-center rounded-2xl border p-8 md:p-12 shadow-lg ${
                isDark ? 'bg-gray-900/90 border-gray-800' : 'bg-white border-gray-100'
              }`}
            >
              <CheckCircle
                className="text-green-500 mx-auto mb-6"
                size={64}
              />
              <h1
                className={`text-2xl md:text-3xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Ombi Lako Limepokewa!
              </h1>
              <p
                className={`text-sm md:text-lg mb-6 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                Asante kwa kutuamini na ombi lako. Timu yetu ya maombi
                itaomba kwa ajili yako. Mungu akusikie na akujibu kwa wakati
                wake kamili.
              </p>
              <div
                className={`p-4 rounded-lg mb-6 ${
                  isDark
                    ? 'bg-green-900/20 border border-green-800'
                    : 'bg-green-50 border border-green-200'
                }`}
              >
                <p className="text-green-700 dark:text-green-300 text-sm md:text-base font-medium">
                  "Msiwe na wasiwasi juu ya chochote, bali katika kila jambo,
                  kwa maombi na dua, pamoja na shukrani, mjulishe Mungu mahitaji
                  yenu." – Wafilipi 4:6
                </p>
              </div>
              <button
                onClick={() => setSubmitted(false)}
                className="bg-rose-600 hover:bg-rose-700 text-white px-6 md:px-8 py-3 rounded-lg font-semibold text-sm md:text-base transition-colors"
              >
                Tuma Ombi Lingine
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title="Maombi ya Pamoja"
        description="Tuma ombi lako na tuombe pamoja kama jamii ya imani. Hakuna ombi dogo au kubwa - Mungu anasikia yote."
        keywords="maombi, ombi, prayer, imani, jamii, kiroho"
      />
      <div
        className={`min-h-screen py-10 md:py-12 transition-colors ${
          isDark
            ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950'
            : 'bg-gradient-to-b from-slate-50 via-white to-rose-50'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <header className="text-center mb-10 md:mb-12">
            <div className="w-16 h-16 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md shadow-rose-400/50">
              <Heart className="text-white" size={32} />
            </div>
            <h1
              className={`text-2xl md:text-4xl font-extrabold mb-3 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Maombi ya Pamoja
            </h1>
            <p
              className={`text-sm md:text-lg max-w-2xl mx-auto ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Tuma ombi lako na tuombe pamoja kama jamii ya imani. Hakuna ombi
              dogo au kubwa – Mungu anasikia yote.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <div
                className={`rounded-2xl border shadow-lg p-6 md:p-8 ${
                  isDark
                    ? 'bg-gray-900/90 border-gray-800'
                    : 'bg-white border-gray-100'
                }`}
              >
                <h2
                  className={`text-lg md:text-2xl font-bold mb-4 md:mb-6 ${
                    isDark ? 'text-white' : 'text-gray-900'
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

                <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                  {/* Personal info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        className={`block text-xs md:text-sm font-medium mb-2 ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        Jina Lako{' '}
                        {!formData.anonymous && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={formData.anonymous}
                        className={`w-full px-3 md:px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                          errors.name ? 'border-red-500' : ''
                        } ${
                          isDark
                            ? 'bg-gray-800 border-gray-700 text-white disabled:bg-gray-700'
                            : 'bg-white border-gray-300 text-gray-900 disabled:bg-gray-100'
                        }`}
                        placeholder="Jina lako kamili"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        className={`block text-xs md:text-sm font-medium mb-2 ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        Barua Pepe
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-3 md:px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                          errors.email ? 'border-red-500' : ''
                        } ${
                          isDark
                            ? 'bg-gray-800 border-gray-700 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="email@example.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      className={`block text-xs md:text-sm font-medium mb-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      Nambari ya Simu
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-3 md:px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                        errors.phone ? 'border-red-500' : ''
                      } ${
                        isDark
                          ? 'bg-gray-800 border-gray-700 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="+255 xxx xxx xxx"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label
                      className={`block text-xs md:text-sm font-medium mb-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      Aina ya Ombi <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full px-3 md:px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                        isDark
                          ? 'bg-gray-800 border-gray-700 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
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

                  {/* Request */}
                  <div>
                    <label
                      className={`block text-xs md:text-sm font-medium mb-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      Ombi Lako <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="request"
                      value={formData.request}
                      onChange={handleChange}
                      rows={6}
                      className={`w-full px-3 md:px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                        errors.request ? 'border-red-500' : ''
                      } ${
                        isDark
                          ? 'bg-gray-800 border-gray-700 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Andika ombi lako hapa... Mungu anasikia kila neno la moyo wako."
                    />
                    {errors.request && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.request}
                      </p>
                    )}
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="anonymous"
                        name="anonymous"
                        checked={formData.anonymous}
                        onChange={handleChange}
                        className="w-4 h-4 text-rose-600 bg-gray-100 border-gray-300 rounded focus:ring-rose-500"
                      />
                      <label
                        htmlFor="anonymous"
                        className={`ml-2 text-xs md:text-sm ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
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
                        className="w-4 h-4 text-rose-600 bg-gray-100 border-gray-300 rounded focus:ring-rose-500"
                      />
                      <label
                        htmlFor="urgent"
                        className={`ml-2 text-xs md:text-sm ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        Ombi la haraka (Urgent)
                      </label>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center justify-center text-sm md:text-base"
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

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Guidelines */}
              <div
                className={`rounded-2xl border p-5 ${
                  isDark
                    ? 'bg-gray-900/90 border-gray-800'
                    : 'bg-white border-gray-100'
                }`}
              >
                <h3
                  className={`text-base md:text-lg font-semibold mb-3 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Miongozo ya Maombi
                </h3>
                <ul
                  className={`space-y-2 text-xs md:text-sm ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  <li className="flex items-start">
                    <Heart
                      className="text-rose-500 mr-2 mt-0.5 flex-shrink-0"
                      size={16}
                    />
                    Omba kwa moyo wa uwazi na imani.
                  </li>
                  <li className="flex items-start">
                    <Shield
                      className="text-rose-500 mr-2 mt-0.5 flex-shrink-0"
                      size={16}
                    />
                    Maombi yako yanahifadhiwa kwa siri na usalama.
                  </li>
                  <li className="flex items-start">
                    <Users
                      className="text-rose-500 mr-2 mt-0.5 flex-shrink-0"
                      size={16}
                    />
                    Timu yetu ya maombi itaombea ombi lako.
                  </li>
                  <li className="flex items-start">
                    <Clock
                      className="text-rose-500 mr-2 mt-0.5 flex-shrink-0"
                      size={16}
                    />
                    Maombi ya haraka yanapewa kipaumbele maalum.
                  </li>
                </ul>
              </div>

              {/* Verse */}
              <div
                className={`rounded-2xl p-5 border ${
                  isDark
                    ? 'bg-rose-900/20 border-rose-800'
                    : 'bg-rose-50 border-rose-200'
                }`}
              >
                <blockquote className="text-rose-700 dark:text-rose-200 text-sm md:text-base font-medium mb-2">
                  "Msiwe na wasiwasi juu ya chochote, bali katika kila jambo,
                  kwa maombi na dua, pamoja na shukrani, mjulishe Mungu mahitaji
                  yenu."
                </blockquote>
                <cite className="text-rose-600 dark:text-rose-300 text-xs md:text-sm">
                  – Wafilipi 4:6
                </cite>
              </div>

              {/* Urgent contact */}
              <div
                className={`rounded-2xl border p-5 ${
                  isDark
                    ? 'bg-gray-900/90 border-gray-800'
                    : 'bg-white border-gray-100'
                }`}
              >
                <h3
                  className={`text-base md:text-lg font-semibold mb-3 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Maombi ya Haraka Sana
                </h3>
                <p
                  className={`text-xs md:text-sm mb-3 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  Kwa maombi ya haraka sana, unaweza kuwasiliana nasi moja kwa
                  moja:
                </p>
                <div className="space-y-2 text-xs md:text-sm">
                  <div
                    className={
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }
                  >
                    📞 +255 767 525 234
                  </div>
                  <div
                    className={
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }
                  >
                    ✉️ fmklink@gmail.com
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
