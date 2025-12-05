// src/pages/home/Home.jsx
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import SEOHead from '../../components/SEOHead';
import Carousel from '../../components/Carousel';

import {
  BookOpen,
  Heart,
  Users,
  Calendar,
  ArrowRight,
  Play,
  Star,
  Sparkles,
  Globe2,
} from 'lucide-react';

export default function Home() {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const { isAuthenticated } = useAuth();

  // HATUNA API: tunatumia fake data kwenye slider tu kwa sasa
  const slides = [
    {
      image: '/images/picture1.jpg',
      title: 'Karibu GOD CARES 365',
      subtitle:
        'Kutoka kutomjua Mungu kabisa, hadi kuwa mshuhudia wa Ujumbe wa Malaika Watatu – safari yako inaanza hapa.',
      align: 'left',
      badge: 'Discover • Understand • Mission',
      cta: isAuthenticated
        ? {
            label: 'Endelea na Mafunzo',
            link: '/mafunzo',
          }
        : {
            label: 'Anza Safari ya Imani',
            link: '/login',
          },
    },
    {
      image: '/images/picture2.jpg',
      title: 'Omba Nasi Kila Siku',
      subtitle:
        'Tuma maombi yako, pata watu wa kukuombea, na uone mkono wa Mungu ukifanya kazi 365.',
      align: 'right',
      badge: 'Maombi • Faraja • Tumaini',
      cta: {
        label: 'Tuma Ombi la Maombi',
        link: '/maombi',
      },
    },
    {
      image: '/images/picture3.jpg',
      title: 'Jiunge na Harakati ya Kimataifa',
      subtitle:
        'Hudhuria semina, ibada na matukio ya kimataifa ya God Cares 365 – mtandaoni na ana kwa ana.',
      align: 'left',
      badge: 'Matukio • Ushirika • Mission',
      cta: {
        label: 'Angalia Matukio',
        link: '/matukio',
      },
    },
  ];

  return (
    <>
      <SEOHead
        title="Nyumbani"
        description="Karibu GOD CARES 365 - Safari ya kidigitali ya kujifunza Biblia, kuomba, na kuishi ujumbe wa milele kila siku."
        keywords="kiroho, biblia, maombi, imani, tanzania, masomo, habari, mission, malaika watatu"
        structuredData={{
          name: 'GOD CARES 365',
          description:
            'Safari ya kidigitali ya kujifunza Biblia, maombi na mission – God Cares 365.',
          url: window.location.origin,
          logo: `${window.location.origin}/logo.png`,
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+255767525234',
            contactType: 'customer service',
            email: 'fmklink@gmail.com',
          },
        }}
      />

      <div
        className={`min-h-screen transition-colors ${
          isDark
            ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950'
            : 'bg-gradient-to-b from-emerald-50 via-white to-sky-50'
        }`}
      >
        {/* HERO SLIDER */}
        <div className="border-b border-white/10 dark:border-gray-800">
          <Carousel slides={slides} />
        </div>

        {/* SAFARI YA IMANI – 3 stages */}
        <section className="py-14 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 mb-3">
                <Sparkles size={14} />
                <span>Safari ya Imani • Seeker → Scholar → Missionary</span>
              </div>
              <h2
                className={`text-2xl md:text-3xl font-extrabold tracking-tight mb-3 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Kutoka Kugundua Kweli hadi Kuishi Ujumbe
              </h2>
              <p
                className={`text-sm md:text-base leading-relaxed ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                God Cares 365 inakusaidia kusonga hatua kwa hatua: kwanza
                kugundua Neno, kisha kuelewa unabii, na mwishowe kuishi kama
                mmishenari wa kila siku.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {/* Stage 1 */}
              <div
                className={`relative overflow-hidden rounded-2xl border p-5 md:p-6 shadow-sm ${
                  isDark
                    ? 'bg-gray-900/60 border-gray-800'
                    : 'bg-white border-emerald-50'
                }`}
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-sky-500" />
                <div className="mt-2 mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-emerald-500 font-semibold">
                      Stage 1
                    </p>
                    <h3
                      className={`text-base md:text-lg font-bold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      The Seeker – Discover Truth
                    </h3>
                  </div>
                </div>
                <p
                  className={`text-sm mb-4 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  Masomo ya msingi ya Biblia: upendo wa Mungu, wokovu, ubatizo,
                  afya na tumaini la kurudi kwa Yesu.
                </p>
                <div className="mb-3 h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500" />
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-4">
                  Wastani wa wanafunzi wako hapa kabla ya kuendelea na Unabii.
                </p>
                <Link
                  to="/mafunzo"
                  className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-300"
                >
                  Anza na masomo ya msingi
                  <ArrowRight size={14} />
                </Link>
              </div>

              {/* Stage 2 */}
              <div
                className={`relative overflow-hidden rounded-2xl border p-5 md:p-6 shadow-sm ${
                  isDark
                    ? 'bg-gray-900/60 border-gray-800'
                    : 'bg-white border-indigo-50'
                }`}
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-400 via-purple-500 to-violet-500" />
                <div className="mt-2 mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-indigo-500 font-semibold">
                      Stage 2
                    </p>
                    <h3
                      className={`text-base md:text-lg font-bold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      The Scholar – Understand Prophecy
                    </h3>
                  </div>
                </div>
                <p
                  className={`text-sm mb-4 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  Mafunzo ya Danieli na Ufunuo, Sabato ya kweli, Patakatifu na
                  mpango wa hukumu ya Mungu.
                </p>
                <div className="mb-3 h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500" />
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-4">
                  Wanafunzi waliohitimu hapa wako tayari kuanza kushirikisha
                  kweli.
                </p>
                <Link
                  to="/mafunzo"
                  className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-300"
                >
                  Tazama masomo ya unabii
                  <ArrowRight size={14} />
                </Link>
              </div>

              {/* Stage 3 */}
              <div
                className={`relative overflow-hidden rounded-2xl border p-5 md:p-6 shadow-sm ${
                  isDark
                    ? 'bg-gray-900/60 border-gray-800'
                    : 'bg-white border-amber-50'
                }`}
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500" />
                <div className="mt-2 mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-300">
                    <Globe2 size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-amber-500 font-semibold">
                      Stage 3
                    </p>
                    <h3
                      className={`text-base md:text-lg font-bold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      The Missionary – Live & Share
                    </h3>
                  </div>
                </div>
                <p
                  className={`text-sm mb-4 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  Kuongoza vikundi vya Biblia, kushuhudia, na kupeleka habari za
                  wokovu kutoka mlango hadi mlango na mtandaoni.
                </p>
                <div className="mb-3 h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-amber-400 to-rose-500" />
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-4">
                  Hapa ndipo God Cares 365 inakuwa harakati ya kimissioni, si
                  tu darasa la mtandaoni.
                </p>
                <Link
                  to={isAuthenticated ? '/profile' : '/login'}
                  className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-300"
                >
                  {isAuthenticated
                    ? 'Fungua dashibodi ya mission'
                    : 'Ingia uanze mission'}
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES: Chagua Kituo */}
        <section className="pb-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between gap-2 mb-6">
              <h2
                className={`text-xl md:text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Chagua Kituo cha Safari Yako
              </h2>
              <p className="hidden md:block text-xs text-gray-500 dark:text-gray-400">
                Masomo • Maombi • Habari • Matukio • Media • Michango
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Bible Studies */}
              <Link
                to="/mafunzo"
                className={`group relative overflow-hidden rounded-2xl border p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${
                  isDark
                    ? 'bg-gray-900/80 border-gray-800 hover:border-emerald-500/60'
                    : 'bg-white border-gray-100 hover:border-emerald-500/40'
                }`}
              >
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-400 to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <h3
                        className={`text-lg font-semibold ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        Masomo ya Biblia
                      </h3>
                      <p className="text-[11px] uppercase tracking-wide text-emerald-500 font-semibold">
                        Discovery & Prophecy
                      </p>
                    </div>
                  </div>
                </div>
                <p
                  className={`text-sm mb-4 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  Masomo yaliyopangwa kwa misimu: misingi ya imani, Danieli &
                  Ufunuo, na maisha ya ushuhuda.
                </p>
                <div className="flex items-center text-[12px] font-semibold text-emerald-600 group-hover:text-emerald-700 dark:text-emerald-300">
                  <span className="mr-2">Fungua masomo</span>
                  <ArrowRight size={14} />
                </div>
              </Link>

              {/* Prayer Requests */}
              <Link
                to="/maombi"
                className={`group relative overflow-hidden rounded-2xl border p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${
                  isDark
                    ? 'bg-gray-900/80 border-gray-800 hover:border-rose-500/60'
                    : 'bg-white border-gray-100 hover:border-rose-500/40'
                }`}
              >
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-rose-400 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 group-hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-300">
                    <Heart size={24} />
                  </div>
                  <div>
                    <h3
                      className={`text-lg font-semibold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      Maombi
                    </h3>
                    <p className="text-[11px] uppercase tracking-wide text-rose-500 font-semibold">
                      Prayer & Support
                    </p>
                  </div>
                </div>
                <p
                  className={`text-sm mb-4 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  Tuma maombi binafsi, maombi ya familia, au maombi ya huduma –
                  na tuombe pamoja kama mwili wa Kristo.
                </p>
                <div className="flex items-center text-[12px] font-semibold text-rose-600 group-hover:text-rose-700 dark:text-rose-300">
                  <span className="mr-2">Omba nasi</span>
                  <ArrowRight size={14} />
                </div>
              </Link>

              {/* News */}
              <Link
                to="/habari"
                className={`group relative overflow-hidden rounded-2xl border p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${
                  isDark
                    ? 'bg-gray-900/80 border-gray-800 hover:border-sky-500/60'
                    : 'bg-white border-gray-100 hover:border-sky-500/40'
                }`}
              >
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-sky-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 text-sky-600 group-hover:bg-sky-100 dark:bg-sky-500/10 dark:text-sky-300">
                    <Users size={24} />
                  </div>
                  <div>
                    <h3
                      className={`text-lg font-semibold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      Habari & Vipengele
                    </h3>
                    <p className="text-[11px] uppercase tracking-wide text-sky-500 font-semibold">
                      Stories & Testimonies
                    </p>
                  </div>
                </div>
                <p
                  className={`text-sm mb-4 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  Tafakari makala za kiroho, ushuhuda wa watumishi na taarifa
                  za harakati za God Cares 365.
                </p>
                <div className="flex items-center text-[12px] font-semibold text-sky-600 group-hover:text-sky-700 dark:text-sky-300">
                  <span className="mr-2">Soma habari</span>
                  <ArrowRight size={14} />
                </div>
              </Link>

              {/* Events */}
              <Link
                to="/matukio"
                className={`group relative overflow-hidden rounded-2xl border p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${
                  isDark
                    ? 'bg-gray-900/80 border-gray-800 hover:border-purple-500/60'
                    : 'bg-white border-gray-100 hover:border-purple-500/40'
                }`}
              >
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-purple-400 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-50 text-purple-600 group-hover:bg-purple-100 dark:bg-purple-500/10 dark:text-purple-300">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h3
                      className={`text-lg font-semibold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      Matukio Maalum
                    </h3>
                    <p className="text-[11px] uppercase tracking-wide text-purple-500 font-semibold">
                      Seminars & Gatherings
                    </p>
                  </div>
                </div>
                <p
                  className={`text-sm mb-4 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  Hudhuria semina, kambi za injili, warsha na ibada za kipekee
                  mtandaoni na ana kwa ana.
                </p>
                <div className="flex items-center text-[12px] font-semibold text-purple-600 group-hover:text-purple-700 dark:text-purple-300">
                  <span className="mr-2">Angalia matukio</span>
                  <ArrowRight size={14} />
                </div>
              </Link>

              {/* Media Library */}
              <Link
                to="/media"
                className={`group relative overflow-hidden rounded-2xl border p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${
                  isDark
                    ? 'bg-gray-900/80 border-gray-800 hover:border-amber-500/60'
                    : 'bg-white border-gray-100 hover:border-amber-500/40'
                }`}
              >
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 group-hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-300">
                    <Play size={24} />
                  </div>
                  <div>
                    <h3
                      className={`text-lg font-semibold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      Maktaba ya Media
                    </h3>
                    <p className="text-[11px] uppercase tracking-wide text-amber-500 font-semibold">
                      Video • Audio • Resources
                    </p>
                  </div>
                </div>
                <p
                  className={`text-sm mb-4 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  Tazama mahubiri, vipindi, nyimbo na rasilimali za sauti na
                  video, popote ulipo.
                </p>
                <div className="flex items-center text-[12px] font-semibold text-amber-600 group-hover:text-amber-700 dark:text-amber-300">
                  <span className="mr-2">Fungua maktaba</span>
                  <ArrowRight size={14} />
                </div>
              </Link>

              {/* Donations */}
              <Link
                to="/michango"
                className={`group relative overflow-hidden rounded-2xl border p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${
                  isDark
                    ? 'bg-gray-900/80 border-gray-800 hover:border-emerald-500/60'
                    : 'bg-white border-gray-100 hover:border-emerald-500/40'
                }`}
              >
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-400 to-lime-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300">
                    <Star size={24} />
                  </div>
                  <div>
                    <h3
                      className={`text-lg font-semibold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      Michango
                    </h3>
                    <p className="text-[11px] uppercase tracking-wide text-emerald-500 font-semibold">
                      Support the Mission
                    </p>
                  </div>
                </div>
                <p
                  className={`text-sm mb-4 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  Changia kazi ya Mungu, kusaidia media, mission za vijana, na
                  vikundi vya Biblia duniani kote.
                </p>
                <div className="flex items-center text-[12px] font-semibold text-emerald-600 group-hover:text-emerald-700 dark:text-emerald-300">
                  <span className="mr-2">Changia sasa</span>
                  <ArrowRight size={14} />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="py-14 md:py-16 bg-gradient-to-r from-emerald-600 via-sky-600 to-blue-700 text-white">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <p className="text-xs uppercase tracking-[0.25em] mb-3 text-emerald-100/90">
                God Cares 365 • Love that never sleeps
              </p>
              <blockquote className="text-2xl md:text-3xl font-bold mb-4 leading-relaxed">
                &quot;Hili ndilo pendo, si kwamba sisi tulimpenda Mungu, bali
                kwamba yeye alitupenda sisi, akamtuma Mwanawe kuwa kipatanisho
                kwa dhambi zetu.&quot;
              </blockquote>
              <cite className="text-sm md:text-base font-medium text-emerald-100/90">
                – 1 Yohana 4:10
              </cite>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section
          className={`py-14 md:py-16 ${
            isDark ? 'bg-gray-950' : 'bg-amber-50'
          }`}
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto rounded-2xl border bg-white/80 shadow-sm shadow-amber-100/60 px-5 py-8 md:px-8 md:py-10 dark:bg-gray-900/80 dark:border-gray-700 dark:shadow-none">
              <div className="text-center mb-6">
                <h2
                  className={`text-xl md:text-2xl font-bold mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Jiunge na Jarida la Maombi & Mafunzo
                </h2>
                <p
                  className={`text-sm md:text-base ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  Pata ujumbe wa kila wiki, maombi maalum, vifungu vya Biblia na
                  rasilimali mpya moja kwa moja kwenye barua pepe yako.
                </p>
              </div>

              <form
                className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="Barua pepe yako"
                  className={`flex-1 px-4 py-2.5 rounded-lg sm:rounded-r-none border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDark
                      ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
                  }`}
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-lg sm:rounded-l-none bg-gradient-to-r from-emerald-600 to-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:brightness-110"
                >
                  Jiunge
                </button>
              </form>
              <p className="mt-3 text-[11px] text-center text-gray-500 dark:text-gray-400">
                Hatutakutumia spam. Unaweza kujitoa wakati wowote.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
