import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { isValidEmail, isValidPhone } from '../utils/helpers';
import apiService from '../services/api';
import SEOHead from '../components/SEOHead';
import { Heart, Send, CheckCircle, Users, Clock, Shield } from 'lucide-react';

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const newErrors = {};
    if (!formData.anonymous && !formData.name.trim()) {
      newErrors.name = 'Jina ni lazima';
    }
    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = 'Barua pepe si sahihi';
    }
    if (formData.phone && !isValidPhone(formData.phone)) {
      newErrors.phone = 'Nambari ya simu si sahihi';
    }
    if (!formData.request.trim()) {
      newErrors.request = 'Ombi ni lazima';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

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

      // Reset form after 3 seconds
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
      setErrors({ submit: 'Hitilafu katika kutuma ombi. Jaribu tena.' });
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
            isDark ? 'bg-gray-900' : 'bg-gray-50'
          }`}
        >
          <div className="container mx-auto px-6">
            <div
              className={`max-w-2xl mx-auto text-center card p-12 ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <CheckCircle className="text-green-600 mx-auto mb-6" size={64} />
              <h1
                className={`text-3xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}
              >
                Ombi Lako Limepokewa!
              </h1>
              <p
                className={`text-lg mb-6 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                Asante kwa kutuamini na ombi lako. Timu yetu ya maombi itaomba kwa ajili yako.
                Mungu akusikie na akukabidhi maombi ya moyo wako.
              </p>
              <div
                className={`p-4 rounded-lg mb-6 ${
                  isDark
                    ? 'bg-green-900/20 border border-green-800'
                    : 'bg-green-50 border border-green-200'
                }`}
              >
                <p className="text-green-700 dark:text-green-300 font-medium">
                  "Msiwe na wasiwasi juu ya chochote, bali katika kila jambo, kwa maombi na dua,
                  pamoja na shukrani, mjulishe Mungu mahitaji yenu." - Wafilipi 4:6
                </p>
              </div>
              <button
                onClick={() => setSubmitted(false)}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
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
        className={`min-h-screen py-12 transition-colors ${
          isDark ? 'bg-gray-900' : 'bg-gray-50'
        }`}
      >
        <div className="container mx-auto px-6">
          {/* Header */}
          <header className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="text-white" size={32} />
            </div>
            <h1
              className={`text-4xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}
            >
              Maombi ya Pamoja
            </h1>
            <p
              className={`text-lg max-w-2xl mx-auto ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Tuma ombi lako na tuombe pamoja kama jamii ya imani. Hakuna ombi dogo au kubwa -
              Mungu anasikia yote.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Prayer Form */}
            <div className="lg:col-span-2">
              <div className={`card p-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <h2
                  className={`text-2xl font-bold mb-6 ${
                    isDark ? 'text-white' : 'text-gray-800'
                  }`}
                >
                  Tuma Ombi Lako
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        Jina Lako {!formData.anonymous && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={formData.anonymous}
                        required={!formData.anonymous}
                        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                          errors.name ? 'border-red-500' : ''
                        } ${
                          isDark
                            ? 'bg-gray-700 border-gray-600 text-white disabled:bg-gray-600'
                            : 'bg-white border-gray-300 text-gray-900 disabled:bg-gray-100'
                        }`}
                        placeholder="Jina lako kamili"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                      )}
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
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
                        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-500 ${
                          errors.email ? 'border-red-500' : ''
                        } ${
                          isDark
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="email@example.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
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
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        errors.phone ? 'border-red-500' : ''
                      } ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="+255 xxx xxx xxx"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      Aina ya Ombi <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white'
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

                  {/* Prayer Request */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      Ombi Lako <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="request"
                      value={formData.request}
                      onChange={handleChange}
                      required
                      rows={6}
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        errors.request ? 'border-red-500' : ''
                      } ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Andika ombi lako hapa... Mungu anasikia kila neno la moyo wako."
                    />
                    {errors.request && (
                      <p className="text-red-500 text-xs mt-1">{errors.request}</p>
                    )}
                  </div>

                  {/* Options */}
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="anonymous"
                        name="anonymous"
                        checked={formData.anonymous}
                        onChange={handleChange}
                        className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                      />
                      <label
                        htmlFor="anonymous"
                        className={`ml-2 text-sm ${
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
                        className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                      />
                      <label
                        htmlFor="urgent"
                        className={`ml-2 text-sm ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        Ombi la haraka (Urgent)
                      </label>
                    </div>
                  </div>

                  {errors.submit && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      {errors.submit}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold px-6 py-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Inatuma...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2" size={20} />
                        Tuma Ombi
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Prayer Guidelines */}
              <div className={`card p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <h3
                  className={`text-lg font-semibold mb-4 ${
                    isDark ? 'text-white' : 'text-gray-800'
                  }`}
                >
                  Miongozo ya Maombi
                </h3>
                <ul
                  className={`space-y-2 text-sm ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  <li className="flex items-start">
                    <Heart className="text-red-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
                    Omba kwa moyo wa uwazi na imani
                  </li>
                  <li className="flex items-start">
                    <Shield className="text-red-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
                    Maombi yako ni siri na salama
                  </li>
                  <li className="flex items-start">
                    <Users className="text-red-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
                    Timu yetu itaomba kwa ajili yako
                  </li>
                  <li className="flex items-start">
                    <Clock className="text-red-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
                    Maombi ya haraka yanajibiwa haraka
                  </li>
                </ul>
              </div>

              {/* Bible Verse */}
              <div
                className={`p-6 rounded-lg ${
                  isDark
                    ? 'bg-red-900/20 border border-red-800'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                <blockquote className="text-red-700 dark:text-red-300 font-medium mb-2">
                  "Msiwe na wasiwasi juu ya chochote, bali katika kila jambo, kwa maombi na dua,
                  pamoja na shukrani, mjulishe Mungu mahitaji yenu."
                </blockquote>
                <cite className="text-red-600 dark:text-red-400 text-sm">- Wafilipi 4:6</cite>
              </div>

              {/* Contact for Urgent */}
              <div className={`card p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <h3
                  className={`text-lg font-semibold mb-4 ${
                    isDark ? 'text-white' : 'text-gray-800'
                  }`}
                >
                  Maombi ya Haraka
                </h3>
                <p
                  className={`text-sm mb-4 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  Kwa maombi ya haraka, wasiliana nasi moja kwa moja:
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      📞 +255 767 525 234
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      ✉️ fmklink@gmail.com
                    </span>
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
