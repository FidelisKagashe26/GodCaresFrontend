// src/pages/home/Home.jsx
import { useMemo } from 'react';
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
  const slides = useMemo(
    () => [
      {
        image: '/images/picture1.jpg',
        title: t('homeHeroSlide1Title') || 'Karibu GOD CARES 365',
        subtitle:
          t('homeHeroSlide1Subtitle') ||
          'Kutoka kutomjua Mungu kabisa, hadi kuwa mshuhudia wa Ujumbe wa Malaika Watatu – safari yako inaanza hapa.',
        align: 'left',
        badge: t('homeHeroSlide1Badge') || 'Discover • Understand • Mission',
        cta: isAuthenticated
          ? {
              label: t('homeHeroSlide1CtaContinue') || 'Endelea na Mafunzo',
              link: '/mafunzo',
            }
          : {
              label: t('homeHeroSlide1CtaStart') || 'Anza Safari ya Imani',
              link: '/login',
            },
      },
      {
        image: '/images/picture2.jpg',
        title: t('homeHeroSlide2Title') || 'Omba Nasi Kila Siku',
        subtitle:
          t('homeHeroSlide2Subtitle') ||
          'Tuma maombi yako, pata watu wa kukuombea, na uone mkono wa Mungu ukifanya kazi 365.',
        align: 'right',
        badge: t('homeHeroSlide2Badge') || 'Maombi • Faraja • Tumaini',
        cta: {
          label: t('homeHeroSlide2Cta') || 'Tuma Ombi la Maombi',
          link: '/maombi',
        },
      },
      {
        image: '/images/picture3.jpg',
        title: t('homeHeroSlide3Title') || 'Jiunge na Harakati za Kimataifa',
        subtitle:
          t('homeHeroSlide3Subtitle') ||
          'Hudhuria semina, ibada na matukio ya kimataifa ya God Cares 365 – mtandaoni na ana kwa ana.',
        align: 'left',
        badge: t('homeHeroSlide3Badge') || 'Matukio • Ushirika • Mission',
        cta: {
          label: t('homeHeroSlide3Cta') || 'Angalia Matukio',
          link: '/matukio',
        },
      },
    ],
    [t, isAuthenticated]
  );

  const seoTitle = t('homeSeoTitle') || 'Nyumbani';
  const seoDesc =
    t('homeSeoDesc') ||
    'Karibu GOD CARES 365 - Safari ya kidigitali ya kujifunza Biblia, kuomba, na kuishi ujumbe wa milele kila siku.';
  const seoKeywords =
    t('homeSeoKeywords') ||
    'kiroho, biblia, maombi, imani, tanzania, masomo, habari, mission, malaika watatu';

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDesc}
        keywords={seoKeywords}
        structuredData={{
          name: 'GOD CARES 365',
          description:
            t('homeStructuredDesc') ||
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

        {/* SAFARI YA IMANI */}
        <section className="relative py-14 md:py-16">
          {/* Background image ya section nzima */}
          <div className="pointer-events-none absolute inset-0 opacity-10">
            <img
              src="/images/picture2.jpg"
              alt={t('homeJourneyBgAlt') || 'Prayer background'}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Overlay gradient */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/70 via-white/80 to-white/90 dark:from-gray-950/90 dark:via-gray-950/85 dark:to-gray-950/95" />

          {/* Content */}
          <div className="relative">
            <div className="container mx-auto px-4 md:px-6">
              {/* Glass intro card */}
              <div
                className={`max-w-3xl mx-auto mb-10 rounded-2xl border p-5 md:p-7 text-center backdrop-blur-xl ${
                  isDark
                    ? 'bg-gray-950/35 border-white/10 shadow-lg shadow-black/20'
                    : 'bg-white/55 border-white/40 shadow-lg shadow-emerald-200/40'
                }`}
              >
                <div
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold mb-3 border backdrop-blur ${
                    isDark
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-400/20'
                      : 'bg-emerald-500/10 text-emerald-700 border-emerald-600/15'
                  }`}
                >
                  <Sparkles size={14} />
                  <span>
                    {t('homeJourneyPill') ||
                      'Safari ya Imani • Seeker → Scholar → Missionary'}
                  </span>
                </div>

                <h2
                  className={`text-2xl md:text-3xl font-extrabold tracking-tight mb-3 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {t('homeJourneyTitle') ||
                    'Kutoka Kugundua Kweli hadi Kuishi Ujumbe'}
                </h2>

                <p
                  className={`text-sm md:text-base leading-relaxed ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  {t('homeJourneyDesc') ||
                    'God Cares 365 inakusaidia kusonga hatua kwa hatua: kwanza kugundua Neno, kisha kuelewa unabii, na mwishowe kuishi kama mmishenari wa kila siku.'}
                </p>
              </div>

              {/* 3 Stage cards */}
              <div className="grid gap-5 md:grid-cols-3">
                {/* Stage 1 */}
                <div className="relative group rounded-2xl overflow-hidden shadow-sm border border-emerald-100/70 dark:border-gray-800 bg-black">
                  <div className="absolute inset-0">
                    <img
                      src="/images/picture1.jpg"
                      alt={t('homeStage1Alt') || 'Bible discovery'}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20 group-hover:from-black/70 group-hover:via-black/40 group-hover:to-black/10 transition-colors" />
                  </div>

                  <div className="relative flex flex-col justify-between h-64 p-5 md:p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-200 backdrop-blur border border-white/10">
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-emerald-300 font-semibold">
                          {t('homeStage1Label') || 'Stage 1'}
                        </p>
                        <h3 className="text-base md:text-lg font-bold text-white">
                          {t('homeStage1Title') ||
                            'The Seeker – Discover Truth'}
                        </h3>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs md:text-sm mb-3 text-emerald-50/90">
                        {t('homeStage1Desc') ||
                          'Masomo ya msingi ya Biblia: upendo wa Mungu, wokovu, ubatizo, afya na tumaini la kurudi kwa Yesu.'}
                      </p>

                      <div className="mb-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500" />
                      </div>

                      <p className="text-[11px] text-emerald-100/80 mb-3">
                        {t('homeStage1Hint') ||
                          'Wengi huanzia hapa kabla ya kuingia kwenye unabii wa kina.'}
                      </p>

                      <Link
                        to="/mafunzo"
                        className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-emerald-200 hover:text-white"
                      >
                        {t('homeStage1Cta') || 'Anza na masomo ya msingi'}
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
                      alt={t('homeStage2Alt') || 'Prophecy studies'}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20 group-hover:from-black/70 group-hover:via-black/40 group-hover:to-black/10 transition-colors" />
                  </div>

                  <div className="relative flex flex-col justify-between h-64 p-5 md:p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-100 backdrop-blur border border-white/10">
                        <Sparkles size={20} />
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-indigo-200 font-semibold">
                          {t('homeStage2Label') || 'Stage 2'}
                        </p>
                        <h3 className="text-base md:text-lg font-bold text-white">
                          {t('homeStage2Title') ||
                            'The Scholar – Understand Prophecy'}
                        </h3>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs md:text-sm mb-3 text-indigo-50/90">
                        {t('homeStage2Desc') ||
                          'Mafunzo ya Danieli & Ufunuo, Sabato ya kweli, Patakatifu na mpango wa hukumu ya Mungu.'}
                      </p>

                      <div className="mb-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500" />
                      </div>

                      <p className="text-[11px] text-indigo-100/80 mb-3">
                        {t('homeStage2Hint') ||
                          'Wanafunzi waliokomaa hapa wako tayari kwa mission ya kushirikisha kweli.'}
                      </p>

                      <Link
                        to="/mafunzo"
                        className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-indigo-100 hover:text-white"
                      >
                        {t('homeStage2Cta') || 'Tazama masomo ya unabii'}
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
                      alt={t('homeStage3Alt') || 'Missionary work'}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20 group-hover:from-black/70 group-hover:via-black/40 group-hover:to-black/10 transition-colors" />
                  </div>

                  <div className="relative flex flex-col justify-between h-64 p-5 md:p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-100 backdrop-blur border border-white/10">
                        <Globe2 size={20} />
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-amber-200 font-semibold">
                          {t('homeStage3Label') || 'Stage 3'}
                        </p>
                        <h3 className="text-base md:text-lg font-bold text-white">
                          {t('homeStage3Title') ||
                            'The Missionary – Live & Share'}
                        </h3>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs md:text-sm mb-3 text-amber-50/90">
                        {t('homeStage3Desc') ||
                          'Kuongoza vikundi vya Biblia, kushuhudia, na kufikia watu ana kwa ana na mtandaoni.'}
                      </p>

                      <div className="mb-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-amber-400 to-emerald-500" />
                      </div>

                      <p className="text-[11px] text-amber-100/80 mb-3">
                        {t('homeStage3Hint') ||
                          'Hapa God Cares 365 inageuka kuwa harakati hai ya kimissioni.'}
                      </p>

                      <Link
                        to={isAuthenticated ? '/profile' : '/login'}
                        className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-amber-100 hover:text-white"
                      >
                        {isAuthenticated
                          ? t('homeStage3CtaAuthed') ||
                            'Fungua dashibodi ya mission'
                          : t('homeStage3CtaGuest') || 'Ingia uanze mission'}
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="pb-16">
          <div className="container mx-auto px-4 md:px-6">
            {/* Glass header row */}
            <div
              className={`mb-6 flex items-center justify-between gap-2 rounded-2xl border px-4 py-3 backdrop-blur-xl ${
                isDark
                  ? 'bg-gray-950/30 border-white/10'
                  : 'bg-white/60 border-white/40 shadow-sm shadow-sky-200/40'
              }`}
            >
              <h2
                className={`text-xl md:text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {t('homeChooseHubTitle') || 'Chagua Kituo cha Safari Yako'}
              </h2>

              <p className="hidden md:block text-xs text-gray-500 dark:text-gray-400">
                {t('homeChooseHubMeta') ||
                  'Masomo • Maombi • Habari • Matukio • Media • Michango'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Bible Studies */}
              <Link
                to="/mafunzo"
                className={`group relative overflow-hidden rounded-2xl border shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${
                  isDark ? 'border-gray-800 bg-black' : 'border-gray-100 bg-black'
                }`}
              >
                <div className="absolute inset-0">
                  <img
                    src="/images/MasomoYaBiblia.jpg"
                    alt={t('homeFeatureStudiesAlt') || 'Masomo ya Biblia'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/20 group-hover:from-black/75 group-hover:via-black/45 group-hover:to-black/10 transition-colors" />
                </div>

                <div className="relative flex flex-col justify-between h-64 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/25 text-emerald-100 backdrop-blur border border-white/10">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">
                        {t('homeFeatureStudiesTitle') || 'Masomo ya Biblia'}
                      </h3>
                      <p className="text-[11px] uppercase tracking-wide text-emerald-200 font-semibold">
                        {t('homeFeatureStudiesTag') || 'Discovery & Prophecy'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs md:text-sm mb-4 text-emerald-50/90">
                      {t('homeFeatureStudiesDesc') ||
                        'Masomo yaliyopangwa kwa misimu: misingi ya imani, Danieli & Ufunuo, na maisha ya ushuhuda.'}
                    </p>
                    <div className="flex items-center text-[12px] font-semibold text-emerald-100 group-hover:text-white">
                      <span className="mr-2">
                        {t('homeFeatureStudiesCta') || 'Fungua masomo'}
                      </span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>

              {/* Prayer Requests */}
              <Link
                to="/maombi"
                className={`group relative overflow-hidden rounded-2xl border shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${
                  isDark ? 'border-gray-800 bg-black' : 'border-gray-100 bg-black'
                }`}
              >
                <div className="absolute inset-0">
                  <img
                    src="/images/maombi.jpg"
                    alt={t('homeFeaturePrayerAlt') || 'Maombi'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/20 group-hover:from-black/75 group-hover:via-black/45 group-hover:to-black/10 transition-colors" />
                </div>

                <div className="relative flex flex-col justify-between h-64 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/25 text-emerald-100 backdrop-blur border border-white/10">
                      <Heart size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">
                        {t('homeFeaturePrayerTitle') || 'Maombi'}
                      </h3>
                      <p className="text-[11px] uppercase tracking-wide text-emerald-200 font-semibold">
                        {t('homeFeaturePrayerTag') || 'Prayer & Support'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs md:text-sm mb-4 text-emerald-50/90">
                      {t('homeFeaturePrayerDesc') ||
                        'Tuma maombi binafsi, ya familia au huduma – na tuombe pamoja kama mwili wa Kristo.'}
                    </p>
                    <div className="flex items-center text-[12px] font-semibold text-emerald-100 group-hover:text-white">
                      <span className="mr-2">
                        {t('homeFeaturePrayerCta') || 'Omba nasi'}
                      </span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>

              {/* News */}
              <Link
                to="/habari"
                className={`group relative overflow-hidden rounded-2xl border shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${
                  isDark ? 'border-gray-800 bg-black' : 'border-gray-100 bg-black'
                }`}
              >
                <div className="absolute inset-0">
                  <img
                    src="/images/habari.webp"
                    alt={t('homeFeatureNewsAlt') || 'Habari na Vipengele'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/20 group-hover:from-black/75 group-hover:via-black/45 group-hover:to-black/10 transition-colors" />
                </div>

                <div className="relative flex flex-col justify-between h-64 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/25 text-sky-100 backdrop-blur border border-white/10">
                      <Users size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">
                        {t('homeFeatureNewsTitle') || 'Habari & Vipengele'}
                      </h3>
                      <p className="text-[11px] uppercase tracking-wide text-sky-200 font-semibold">
                        {t('homeFeatureNewsTag') || 'Stories & Testimonies'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs md:text-sm mb-4 text-sky-50/90">
                      {t('homeFeatureNewsDesc') ||
                        'Makala za kiroho, ushuhuda wa watumishi na taarifa za harakati za God Cares 365.'}
                    </p>
                    <div className="flex items-center text-[12px] font-semibold text-sky-100 group-hover:text-white">
                      <span className="mr-2">
                        {t('homeFeatureNewsCta') || 'Soma habari'}
                      </span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>

              {/* Events */}
              <Link
                to="/matukio"
                className={`group relative overflow-hidden rounded-2xl border shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${
                  isDark ? 'border-gray-800 bg-black' : 'border-gray-100 bg-black'
                }`}
              >
                <div className="absolute inset-0">
                  <img
                    src="/images/matukio.jpg"
                    alt={t('homeFeatureEventsAlt') || 'Matukio Maalum'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/20 group-hover:from-black/75 group-hover:via-black/45 group-hover:to-black/10 transition-colors" />
                </div>

                <div className="relative flex flex-col justify-between h-64 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/25 text-blue-100 backdrop-blur border border-white/10">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">
                        {t('homeFeatureEventsTitle') || 'Matukio Maalum'}
                      </h3>
                      <p className="text-[11px] uppercase tracking-wide text-blue-200 font-semibold">
                        {t('homeFeatureEventsTag') || 'Seminars & Gatherings'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs md:text-sm mb-4 text-blue-50/90">
                      {t('homeFeatureEventsDesc') ||
                        'Semina, kambi za injili, warsha na ibada za kipekee – mtandaoni na ana kwa ana.'}
                    </p>
                    <div className="flex items-center text-[12px] font-semibold text-blue-100 group-hover:text-white">
                      <span className="mr-2">
                        {t('homeFeatureEventsCta') || 'Angalia matukio'}
                      </span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>

              {/* Media Library */}
              <Link
                to="/media"
                className={`group relative overflow-hidden rounded-2xl border shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${
                  isDark ? 'border-gray-800 bg-black' : 'border-gray-100 bg-black'
                }`}
              >
                <div className="absolute inset-0">
                  <img
                    src="/images/media.jpeg"
                    alt={t('homeFeatureMediaAlt') || 'Maktaba ya Media'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/20 group-hover:from-black/75 group-hover:via-black/45 group-hover:to-black/10 transition-colors" />
                </div>

                <div className="relative flex flex-col justify-between h-64 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/25 text-amber-100 backdrop-blur border border-white/10">
                      <Play size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">
                        {t('homeFeatureMediaTitle') || 'Maktaba ya Media'}
                      </h3>
                      <p className="text-[11px] uppercase tracking-wide text-amber-200 font-semibold">
                        {t('homeFeatureMediaTag') || 'Video • Audio • Resources'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs md:text-sm mb-4 text-amber-50/90">
                      {t('homeFeatureMediaDesc') ||
                        'Tazama mahubiri, vipindi, nyimbo na rasilimali za media popote ulipo.'}
                    </p>
                    <div className="flex items-center text-[12px] font-semibold text-amber-100 group-hover:text-white">
                      <span className="mr-2">
                        {t('homeFeatureMediaCta') || 'Fungua maktaba'}
                      </span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>

              {/* Donations */}
              <Link
                to="/michango"
                className={`group relative overflow-hidden rounded-2xl border shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${
                  isDark ? 'border-gray-800 bg-black' : 'border-gray-100 bg-black'
                }`}
              >
                <div className="absolute inset-0">
                  <img
                    src="/images/sadaka.jpg"
                    alt={t('homeFeatureGivingAlt') || 'Michango'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/20 group-hover:from-black/75 group-hover:via-black/45 group-hover:to-black/10 transition-colors" />
                </div>

                <div className="relative flex flex-col justify-between h-64 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/25 text-emerald-100 backdrop-blur border border-white/10">
                      <Star size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">
                        {t('homeFeatureGivingTitle') || 'Michango'}
                      </h3>
                      <p className="text-[11px] uppercase tracking-wide text-emerald-200 font-semibold">
                        {t('homeFeatureGivingTag') || 'Support the Mission'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs md:text-sm mb-4 text-emerald-50/90">
                      {t('homeFeatureGivingDesc') ||
                        'Changia kazi ya Mungu, media, mission za vijana na vikundi vya Biblia duniani kote.'}
                    </p>
                    <div className="flex items-center text-[12px] font-semibold text-emerald-100 group-hover:text-white">
                      <span className="mr-2">
                        {t('homeFeatureGivingCta') || 'Changia sasa'}
                      </span>
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
            <div
              className={`max-w-3xl mx-auto rounded-2xl border px-5 py-8 md:px-10 backdrop-blur-xl ${
                isDark ? 'border-white/10 bg-black/10' : 'border-white/20 bg-white/10'
              }`}
            >
              <p className="text-xs uppercase tracking-[0.25em] mb-3 text-emerald-100/90">
                {t('homeQuoteKicker') || 'God Cares 365 • Love that never sleeps'}
              </p>
              <blockquote className="text-2xl md:text-3xl font-bold mb-4 leading-relaxed">
                {t('homeQuoteText') ||
                  '"Hili ndilo pendo, si kwamba sisi tulimpenda Mungu, bali kwamba yeye alitupenda sisi, akamtuma Mwanawe kuwa kipatanisho kwa dhambi zetu."'}
              </blockquote>
              <cite className="text-sm md:text-base font-medium text-emerald-100/90">
                {t('homeQuoteCite') || '– 1 Yohana 4:10'}
              </cite>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className={`py-14 md:py-16 ${isDark ? 'bg-gray-950' : 'bg-amber-50'}`}>
          <div className="container mx-auto px-4 md:px-6">
            <div
              className={`max-w-3xl mx-auto rounded-2xl border px-5 py-8 md:px-8 md:py-10 backdrop-blur-xl ${
                isDark
                  ? 'bg-gray-900/50 border-white/10 shadow-none'
                  : 'bg-white/65 border-white/50 shadow-sm shadow-amber-100/60'
              }`}
            >
              <div className="text-center mb-6">
                <h2
                  className={`text-xl md:text-2xl font-bold mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {t('homeNewsletterTitle') || 'Jiunge na Jarida la Maombi & Mafunzo'}
                </h2>
                <p className={`text-sm md:text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t('homeNewsletterDesc') ||
                    'Pata ujumbe wa kila wiki, maombi maalum, vifungu vya Biblia na rasilimali mpya moja kwa moja kwenye barua pepe yako.'}
                </p>
              </div>

              <form
                className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder={t('homeNewsletterEmailPlaceholder') || 'Barua pepe yako'}
                  className={`flex-1 px-4 py-2.5 rounded-lg sm:rounded-r-none border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDark
                      ? 'bg-gray-800/70 border-gray-700 text-white placeholder:text-gray-500'
                      : 'bg-white/80 border-gray-300 text-gray-900 placeholder:text-gray-400'
                  }`}
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-lg sm:rounded-l-none bg-gradient-to-r from-emerald-600 to-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:brightness-110"
                >
                  {t('homeNewsletterBtn') || 'Jiunge'}
                </button>
              </form>

              <p className="mt-3 text-[11px] text-center text-gray-500 dark:text-gray-400">
                {t('homeNewsletterNote') || 'Hatutakutumia spam. Unaweza kujitoa wakati wowote.'}
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
