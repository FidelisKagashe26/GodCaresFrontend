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

  // Slider (picha za juu)
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

        {/* SAFARI YA IMANI – na background picture ya nyuma */}
        <section className="relative py-14 md:py-16">
          {/* Background image ya section nzima */}
          <div className="pointer-events-none absolute inset-0 opacity-10">
            <img
              src="/images/picture2.jpg"
              alt="Prayer background"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Overlay gradient */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/70 via-white/80 to-white/90 dark:from-gray-950/90 dark:via-gray-950/85 dark:to-gray-950/95" />

          {/* Content halisi */}
          <div className="relative">
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

              {/* 3 Stage cards – full image background cards */}
              <div className="grid gap-5 md:grid-cols-3">
                {/* Stage 1 */}
                <div className="relative group rounded-2xl overflow-hidden shadow-sm border border-emerald-100/70 dark:border-gray-800 bg-black">
                  <div className="absolute inset-0">
                    <img
                      src="/images/picture1.jpg"
                      alt="Bible discovery"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20 group-hover:from-black/70 group-hover:via-black/40 group-hover:to-black/10 transition-colors" />
                  </div>

                  <div className="relative flex flex-col justify-between h-64 p-5 md:p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-200">
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-emerald-300 font-semibold">
                          Stage 1
                        </p>
                        <h3 className="text-base md:text-lg font-bold text-white">
                          The Seeker – Discover Truth
                        </h3>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs md:text-sm mb-3 text-emerald-50/90">
                        Masomo ya msingi ya Biblia: upendo wa Mungu, wokovu,
                        ubatizo, afya na tumaini la kurudi kwa Yesu.
                      </p>
                      <div className="mb-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500" />
                      </div>
                      <p className="text-[11px] text-emerald-100/80 mb-3">
                        Wengi huanzia hapa kabla ya kuingia kwenye unabii wa
                        kina.
                      </p>
                      <Link
                        to="/mafunzo"
                        className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-emerald-200 hover:text-white"
                      >
                        Anza na masomo ya msingi
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Stage 2 */}
                <div className="relative group rounded-2xl overflow-hidden shadow-sm border border-indigo-100/70 dark:border-gray-800 bg-black">
                  <div className="absolute inset-0">
                    <img
                      src="/images/picture2.jpg"
                      alt="Prophecy studies"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20 group-hover:from-black/70 group-hover:via-black/40 group-hover:to-black/10 transition-colors" />
                  </div>

                  <div className="relative flex flex-col justify-between h-64 p-5 md:p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-100">
                        <Sparkles size={20} />
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-indigo-200 font-semibold">
                          Stage 2
                        </p>
                        <h3 className="text-base md:text-lg font-bold text-white">
                          The Scholar – Understand Prophecy
                        </h3>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs md:text-sm mb-3 text-indigo-50/90">
                        Mafunzo ya Danieli &amp; Ufunuo, Sabato ya kweli,
                        Patakatifu na mpango wa hukumu ya Mungu.
                      </p>
                      <div className="mb-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500" />
                      </div>
                      <p className="text-[11px] text-indigo-100/80 mb-3">
                        Wanafunzi waliokomaa hapa wako tayari kwa mission ya
                        kushirikisha kweli.
                      </p>
                      <Link
                        to="/mafunzo"
                        className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-indigo-100 hover:text-white"
                      >
                        Tazama masomo ya unabii
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Stage 3 */}
                <div className="relative group rounded-2xl overflow-hidden shadow-sm border border-amber-100/70 dark:border-gray-800 bg-black">
                  <div className="absolute inset-0">
                    <img
                      src="/images/picture3.jpg"
                      alt="Missionary work"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20 group-hover:from-black/70 group-hover:via-black/40 group-hover:to-black/10 transition-colors" />
                  </div>

                  <div className="relative flex flex-col justify-between h-64 p-5 md:p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-100">
                        <Globe2 size={20} />
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-amber-200 font-semibold">
                          Stage 3
                        </p>
                        <h3 className="text-base md:text-lg font-bold text-white">
                          The Missionary – Live &amp; Share
                        </h3>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs md:text-sm mb-3 text-amber-50/90">
                        Kuongoza vikundi vya Biblia, kushuhudia, na kufikia
                        watu ana kwa ana na mtandaoni.
                      </p>
                      <div className="mb-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-amber-400 to-emerald-500" />
                      </div>
                      <p className="text-[11px] text-amber-100/80 mb-3">
                        Hapa God Cares 365 inageuka kuwa harakati hai ya
                        kimissioni.
                      </p>
                      <Link
                        to={isAuthenticated ? '/profile' : '/login'}
                        className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-amber-100 hover:text-white"
                      >
                        {isAuthenticated
                          ? 'Fungua dashibodi ya mission'
                          : 'Ingia uanze mission'}
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES: Chagua Kituo – kila card ni full image background */}
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
                className={`group relative overflow-hidden rounded-2xl border shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${
                  isDark
                    ? 'border-gray-800 bg-black'
                    : 'border-gray-100 bg-black'
                }`}
              >
                <div className="absolute inset-0">
                  <img
                    src="/images/MasomoYaBiblia.jpg"
                    alt="Masomo ya Biblia"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/20 group-hover:from-black/75 group-hover:via-black/45 group-hover:to-black/10 transition-colors" />
                </div>

                <div className="relative flex flex-col justify-between h-64 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/25 text-emerald-100">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">
                        Masomo ya Biblia
                      </h3>
                      <p className="text-[11px] uppercase tracking-wide text-emerald-200 font-semibold">
                        Discovery &amp; Prophecy
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm mb-4 text-emerald-50/90">
                      Masomo yaliyopangwa kwa misimu: misingi ya imani, Danieli
                      &amp; Ufunuo, na maisha ya ushuhuda.
                    </p>
                    <div className="flex items-center text-[12px] font-semibold text-emerald-100 group-hover:text-white">
                      <span className="mr-2">Fungua masomo</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>

              {/* Prayer Requests */}
              <Link
                to="/maombi"
                className={`group relative overflow-hidden rounded-2xl border shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${
                  isDark
                    ? 'border-gray-800 bg-black'
                    : 'border-gray-100 bg-black'
                }`}
              >
                <div className="absolute inset-0">
                  <img
                    src="/images/maombi.jpg"
                    alt="Maombi"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/20 group-hover:from-black/75 group-hover:via-black/45 group-hover:to-black/10 transition-colors" />
                </div>

                <div className="relative flex flex-col justify-between h-64 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/25 text-emerald-100">
                      <Heart size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">
                        Maombi
                      </h3>
                      <p className="text-[11px] uppercase tracking-wide text-emerald-200 font-semibold">
                        Prayer &amp; Support
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm mb-4 text-emerald-50/90">
                      Tuma maombi binafsi, ya familia au huduma – na tuombe
                      pamoja kama mwili wa Kristo.
                    </p>
                    <div className="flex items-center text-[12px] font-semibold text-emerald-100 group-hover:text-white">
                      <span className="mr-2">Omba nasi</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>

              {/* News */}
              <Link
                to="/habari"
                className={`group relative overflow-hidden rounded-2xl border shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${
                  isDark
                    ? 'border-gray-800 bg-black'
                    : 'border-gray-100 bg-black'
                }`}
              >
                <div className="absolute inset-0">
                  <img
                    src="/images/habari.webp"
                    alt="Habari na Vipengele"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/20 group-hover:from-black/75 group-hover:via-black/45 group-hover:to-black/10 transition-colors" />
                </div>

                <div className="relative flex flex-col justify-between h-64 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/25 text-sky-100">
                      <Users size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">
                        Habari &amp; Vipengele
                      </h3>
                      <p className="text-[11px] uppercase tracking-wide text-sky-200 font-semibold">
                        Stories &amp; Testimonies
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm mb-4 text-sky-50/90">
                      Makala za kiroho, ushuhuda wa watumishi na taarifa za
                      harakati za God Cares 365.
                    </p>
                    <div className="flex items-center text-[12px] font-semibold text-sky-100 group-hover:text-white">
                      <span className="mr-2">Soma habari</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>

              {/* Events */}
              <Link
                to="/matukio"
                className={`group relative overflow-hidden rounded-2xl border shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${
                  isDark
                    ? 'border-gray-800 bg-black'
                    : 'border-gray-100 bg-black'
                }`}
              >
                <div className="absolute inset-0">
                  <img
                    src="/images/matukio.jpg"
                    alt="Matukio Maalum"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/20 group-hover:from-black/75 group-hover:via-black/45 group-hover:to-black/10 transition-colors" />
                </div>

                <div className="relative flex flex-col justify-between h-64 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/25 text-blue-100">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">
                        Matukio Maalum
                      </h3>
                      <p className="text-[11px] uppercase tracking-wide text-blue-200 font-semibold">
                        Seminars &amp; Gatherings
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm mb-4 text-blue-50/90">
                      Semina, kambi za injili, warsha na ibada za kipekee –
                      mtandaoni na ana kwa ana.
                    </p>
                    <div className="flex items-center text-[12px] font-semibold text-blue-100 group-hover:text-white">
                      <span className="mr-2">Angalia matukio</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>

              {/* Media Library */}
              <Link
                to="/media"
                className={`group relative overflow-hidden rounded-2xl border shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${
                  isDark
                    ? 'border-gray-800 bg-black'
                    : 'border-gray-100 bg-black'
                }`}
              >
                <div className="absolute inset-0">
                  <img
                    src="/images/media.jpeg"
                    alt="Maktaba ya Media"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/20 group-hover:from-black/75 group-hover:via-black/45 group-hover:to-black/10 transition-colors" />
                </div>

                <div className="relative flex flex-col justify-between h-64 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/25 text-amber-100">
                      <Play size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">
                        Maktaba ya Media
                      </h3>
                      <p className="text-[11px] uppercase tracking-wide text-amber-200 font-semibold">
                        Video • Audio • Resources
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm mb-4 text-amber-50/90">
                      Tazama mahubiri, vipindi, nyimbo na rasilimali za media
                      popote ulipo.
                    </p>
                    <div className="flex items-center text-[12px] font-semibold text-amber-100 group-hover:text-white">
                      <span className="mr-2">Fungua maktaba</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>

              {/* Donations */}
              <Link
                to="/michango"
                className={`group relative overflow-hidden rounded-2xl border shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${
                  isDark
                    ? 'border-gray-800 bg-black'
                    : 'border-gray-100 bg-black'
                }`}
              >
                <div className="absolute inset-0">
                  <img
                    src="/images/sadaka.jpg"
                    alt="Michango"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/20 group-hover:from-black/75 group-hover:via-black/45 group-hover:to-black/10 transition-colors" />
                </div>

                <div className="relative flex flex-col justify-between h-64 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/25 text-emerald-100">
                      <Star size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">
                        Michango
                      </h3>
                      <p className="text-[11px] uppercase tracking-wide text-emerald-200 font-semibold">
                        Support the Mission
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm mb-4 text-emerald-50/90">
                      Changia kazi ya Mungu, media, mission za vijana na vikundi
                      vya Biblia duniani kote.
                    </p>
                    <div className="flex items-center text-[12px] font-semibold text-emerald-100 group-hover:text-white">
                      <span className="mr-2">Changia sasa</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
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
                  Jiunge na Jarida la Maombi &amp; Mafunzo
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
