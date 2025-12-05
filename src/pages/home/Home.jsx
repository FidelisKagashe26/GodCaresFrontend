import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import useApi from '../../hooks/useApi';
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
} from 'lucide-react';

export default function Home() {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const { isAuthenticated } = useAuth();

  const { data: featuredPosts, loading: postsLoading } =
    useApi('featured-posts');
  const { data: upcomingEvents, loading: eventsLoading } =
    useApi('upcoming-events');

  const slides = [
    {
      image: '/images/picture1.jpg', // badilisha picha zako hapa
      title: 'Karibu GOD CARES 365',
      subtitle:
        'Tovuti ya kiroho yenye masomo ya Biblia, maombi, na rasilimali za imani.',
      align: 'left',
      badge: 'Imani • Biblia • Maombi',
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
      title: 'Omba Nasi',
      subtitle:
        'Tuma maombi yako na tukusindikize katika kusali na kukuombea.',
      align: 'right',
      badge: 'Maombi • Msaada • Faraja',
      cta: {
        label: 'Tuma Ombi la Maombi',
        link: '/maombi',
      },
    },
    {
      image: '/images/picture3.jpg',
      title: 'Jiunge na Matukio Yetu',
      subtitle:
        'Hudhuria semina, ibada, na matukio maalum ya kujengewa kiroho.',
      align: 'left',
      badge: 'Matukio • Ushirika',
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
        description="Karibu GOD CARES 365 - Tovuti ya kiroho yenye masomo ya Biblia, maombi, na rasilimali za imani"
        keywords="kiroho, biblia, maombi, imani, tanzania, masomo, habari"
        structuredData={{
          name: 'GOD CARES 365',
          description:
            'Tovuti ya kiroho yenye masomo ya Biblia, maombi, na rasilimali za imani',
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
          isDark ? 'bg-gray-900' : 'bg-gray-50'
        }`}
      >
        {/* HERO SLIDER */}
        <Carousel slides={slides} />

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <h2
              className={`text-3xl font-bold text-center mb-12 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}
            >
              Chagua Kituo
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Bible Studies */}
              <Link
                to="/mafunzo"
                className={`card p-6 text-center group hover:scale-105 transition-transform ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                }`}
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <BookOpen className="text-green-600" size={32} />
                </div>
                <h3
                  className={`text-xl font-semibold mb-2 ${
                    isDark ? 'text-white' : 'text-gray-800'
                  }`}
                >
                  Masomo ya Biblia
                </h3>
                <p
                  className={`${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  } mb-4`}
                >
                  Pata masomo ya kina ya Biblia yaliyopangwa kwa misimu na
                  mfululizo.
                </p>
                <div className="flex items-center justify-center text-green-600 group-hover:text-green-700">
                  <span className="mr-2">Jifunze Zaidi</span>
                  <ArrowRight size={16} />
                </div>
              </Link>

              {/* Prayer Requests */}
              <Link
                to="/maombi"
                className={`card p-6 text-center group hover:scale-105 transition-transform ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                }`}
              >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
                  <Heart className="text-red-600" size={32} />
                </div>
                <h3
                  className={`text-xl font-semibold mb-2 ${
                    isDark ? 'text-white' : 'text-gray-800'
                  }`}
                >
                  Maombi
                </h3>
                <p
                  className={`${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  } mb-4`}
                >
                  Tuma maombi yako na tuombe pamoja kama jamii ya imani.
                </p>
                <div className="flex items-center justify-center text-red-600 group-hover:text-red-700">
                  <span className="mr-2">Omba Nasi</span>
                  <ArrowRight size={16} />
                </div>
              </Link>

              {/* News */}
              <Link
                to="/habari"
                className={`card p-6 text-center group hover:scale-105 transition-transform ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                }`}
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <Users className="text-blue-600" size={32} />
                </div>
                <h3
                  className={`text-xl font-semibold mb-2 ${
                    isDark ? 'text-white' : 'text-gray-800'
                  }`}
                >
                  Habari & Vipengele
                </h3>
                <p
                  className={`${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  } mb-4`}
                >
                  Soma makala za kiroho na habari za jamii yetu.
                </p>
                <div className="flex items-center justify-center text-blue-600 group-hover:text-blue-700">
                  <span className="mr-2">Soma Habari</span>
                  <ArrowRight size={16} />
                </div>
              </Link>

              {/* Events */}
              <Link
                to="/matukio"
                className={`card p-6 text-center group hover:scale-105 transition-transform ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                }`}
              >
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                  <Calendar className="text-purple-600" size={32} />
                </div>
                <h3
                  className={`text-xl font-semibold mb-2 ${
                    isDark ? 'text-white' : 'text-gray-800'
                  }`}
                >
                  Matukio Maalum
                </h3>
                <p
                  className={`${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  } mb-4`}
                >
                  Angalia matukio yetu ya siku zijazo na jiunge nasi.
                </p>
                <div className="flex items-center justify-center text-purple-600 group-hover:text-purple-700">
                  <span className="mr-2">Angalia Matukio</span>
                  <ArrowRight size={16} />
                </div>
              </Link>

              {/* Media Library */}
              <Link
                to="/media"
                className={`card p-6 text-center group hover:scale-105 transition-transform ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                }`}
              >
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-colors">
                  <Play className="text-yellow-600" size={32} />
                </div>
                <h3
                  className={`text-xl font-semibold mb-2 ${
                    isDark ? 'text-white' : 'text-gray-800'
                  }`}
                >
                  Maktaba ya Media
                </h3>
                <p
                  className={`${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  } mb-4`}
                >
                  Tazama video, sikia audio, na pakua rasilimali za kiroho.
                </p>
                <div className="flex items-center justify-center text-yellow-600 group-hover:text-yellow-700">
                  <span className="mr-2">Angalia Media</span>
                  <ArrowRight size={16} />
                </div>
              </Link>

              {/* Donations */}
              <Link
                to="/michango"
                className={`card p-6 text-center group hover:scale-105 transition-transform ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                }`}
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <Star className="text-green-600" size={32} />
                </div>
                <h3
                  className={`text-xl font-semibold mb-2 ${
                    isDark ? 'text-white' : 'text-gray-800'
                  }`}
                >
                  Michango
                </h3>
                <p
                  className={`${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  } mb-4`}
                >
                  Changia katika kazi ya Mungu na usaidie jamii yetu.
                </p>
                <div className="flex items-center justify-center text-green-600 group-hover:text-green-700">
                  <span className="mr-2">Changia Sasa</span>
                  <ArrowRight size={16} />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <blockquote className="text-2xl md:text-3xl font-bold mb-4 max-w-4xl mx-auto">
              "Hili ndilo pendo, si kwamba sisi tulimpenda Mungu, bali kwamba
              yeye alitupenda sisi, akamtuma Mwanawe kuwa kipatanisho kwa
              dhambi zetu"
            </blockquote>
            <cite className="text-xl">– 1 Yohana 4:10</cite>
          </div>
        </section>

        {/* Newsletter Section */}
        <section
          className={`py-16 ${
            isDark ? 'bg-gray-808' : 'bg-yellow-50'
          }`.replace('808', '800')}
        >
          <div className="container mx-auto px-6 text-center">
            <h2
              className={`text-3xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}
            >
              Jiunge na Jarida letu la Maombi
            </h2>
            <p
              className={`text-lg mb-8 max-w-2xl mx-auto ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Pata ujumbe wa kila wiki, maombi maalum, na rasilimali mpya moja
              kwa moja kwenye barua pepe yako.
            </p>
            <form className="max-w-md mx-auto flex">
              <input
                type="email"
                placeholder="Barua Pepe Yako"
                className={`flex-1 px-4 py-3 rounded-l-lg border focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-r-lg font-semibold transition-colors"
              >
                Jiunge
              </button>
            </form>
          </div>
        </section>
      </div>
    </>
  );
}
