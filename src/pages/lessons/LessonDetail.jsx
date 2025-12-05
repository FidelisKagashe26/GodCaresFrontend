// src/pages/lessons/LessonDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import SEOHead from '../../components/SEOHead';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  BookOpen,
  Play,
  Download,
  FileText,
  ArrowLeft,
  Clock,
  Eye,
  Share2,
} from 'lucide-react';

export default function LessonDetail() {
  const { slug } = useParams();
  const { isDark } = useTheme();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('content');

  // Sample data for demo
  const sampleLesson = {
    id: 1,
    title: 'Utangulizi wa Injili ya Mathayo',
    slug: 'utangulizi-injili-mathayo',
    description:
      'Jifunze kuhusu muandishi, lengo, na ujumbe mkuu wa Injili ya Mathayo.',
    content: `
      <h2>Utangulizi</h2>
      <p>Injili ya Mathayo ni kitabu cha kwanza katika Agano Jipya na kimoja kwa vitabu muhimu zaidi katika Ukristo. Kitabu hiki kiliandikwa kwa Wayahudi ili kuwaonyesha kwamba Yesu ndiye Masihi waliyemngoja.</p>
      
      <h2>Muandishi</h2>
      <p>Mathayo, aliyeitwa pia Lawi, alikuwa mtoza ushuru kabla ya kumfuata Yesu. Uzoefu wake wa biashara na uandishi ulimsaidia kuandika kumbukumbu za kina za mafundisho ya Yesu.</p>
      
      <h2>Lengo la Kitabu</h2>
      <ul>
        <li>Kuonyesha kwamba Yesu ndiye Masihi wa Israeli</li>
        <li>Kueleza jinsi ufalme wa mbinguni unavyofanya kazi</li>
        <li>Kutoa mafundisho ya Yesu kwa utaratibu</li>
        <li>Kuimarisha imani ya Wakristo wa kwanza</li>
      </ul>
      
      <h2>Muundo wa Kitabu</h2>
      <p>Injili ya Mathayo imegawanywa katika sehemu kuu tano, kila moja ikimalizika na hotuba kubwa ya Yesu.</p>
    `,
    featured_image:
      'https://images.pexels.com/photos/1112048/pexels-photo-1112048.jpeg?auto=compress&cs=tinysrgb&w=1200',
    series: {
      id: 1,
      name: 'Injili za Kwanza',
      slug: 'injili-za-kwanza',
      season_name: 'Agano Jipya 2024',
    },
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    video_embed_code: '',
    pdf_file: '/media/lessons/mathayo-utangulizi.pdf',
    audio_file: '/media/lessons/mathayo-utangulizi.mp3',
    duration_minutes: 45,
    bible_references: 'Mathayo 1:1-17',
    has_video: true,
    has_pdf: true,
    has_audio: true,
    order: 1,
    views: 890,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  };

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        // Production: fetch lesson by slug kutoka backend
        await new Promise((resolve) => setTimeout(resolve, 800));
        setLesson(sampleLesson);
      } catch (err) {
        setError('Hitilafu katika kupakia somo');
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [slug]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sw-TZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen py-12 transition-colors ${
          isDark
            ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950'
            : 'bg-gradient-to-b from-slate-50 via-white to-emerald-50'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-center min-h-[400px]">
          <LoadingSpinner text="Inapakia somo..." size="lg" />
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div
        className={`min-h-screen py-12 transition-colors ${
          isDark
            ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950'
            : 'bg-gradient-to-b from-slate-50 via-white to-emerald-50'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div
            className={`text-center rounded-2xl border px-6 py-10 ${
              isDark
                ? 'bg-gray-900/85 border-gray-800'
                : 'bg-white/95 border-gray-100'
            }`}
          >
            <p className="text-emerald-600 text-base md:text-lg mb-3">
              {error || 'Somo halijapatikana'}
            </p>
            <Link
              to="/mafunzo"
              className="inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-300"
            >
              <ArrowLeft size={16} className="mr-1.5" />
              Rudi kwenye Mafunzo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={`${lesson.title} | Masomo ya Biblia`}
        description={lesson.description}
      />
      <div
        className={`min-h-screen py-10 md:py-12 transition-colors ${
          isDark
            ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950'
            : 'bg-gradient-to-b from-slate-50 via-white to-emerald-50'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          {/* Back Button */}
          <Link
            to="/mafunzo"
            className="inline-flex items-center mb-6 md:mb-8 text-emerald-600 hover:text-emerald-700 dark:text-emerald-300 text-xs md:text-sm transition-colors"
          >
            <ArrowLeft size={16} className="mr-1.5" />
            Rudi kwenye Mafunzo
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div
                className={`rounded-2xl border shadow-sm p-5 md:p-7 ${
                  isDark
                    ? 'bg-gray-900/85 border-gray-800'
                    : 'bg-white/95 border-gray-100'
                }`}
              >
                {/* Header */}
                <header className="mb-6 md:mb-8">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-emerald-600 text-white text-[10px] font-semibold px-2.5 py-1">
                        {lesson.series.name}
                      </span>
                      <span
                        className={`text-[11px] ${
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        Somo #{lesson.order}
                      </span>
                    </div>
                    <button className="flex items-center text-xs md:text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-300">
                      <Share2 size={16} className="mr-1" />
                      Shiriki
                    </button>
                  </div>

                  <h1
                    className={`text-xl md:text-2xl lg:text-3xl font-extrabold mb-3 md:mb-4 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {lesson.title}
                  </h1>

                  <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] md:text-xs">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="flex items-center">
                        <BookOpen size={16} className="mr-1 text-emerald-500" />
                        <span
                          className={
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }
                        >
                          {lesson.bible_references}
                        </span>
                      </span>
                      {lesson.duration_minutes && (
                        <span className="flex items-center">
                          <Clock size={16} className="mr-1 text-sky-500" />
                          <span
                            className={
                              isDark ? 'text-gray-300' : 'text-gray-700'
                            }
                          >
                            {lesson.duration_minutes} dakika
                          </span>
                        </span>
                      )}
                      <span className="flex items-center">
                        <Eye size={16} className="mr-1 text-yellow-400" />
                        <span
                          className={
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }
                        >
                          {lesson.views} mara
                        </span>
                      </span>
                    </div>

                    <div
                      className={`text-[11px] ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      Imewekwa: {formatDate(lesson.created_at)}
                    </div>
                  </div>

                  <img
                    src={lesson.featured_image}
                    alt={lesson.title}
                    className="w-full h-56 md:h-72 object-cover rounded-xl mt-5"
                  />
                </header>

                {/* Content Tabs */}
                <div className="mb-5">
                  <div
                    className={`flex border-b text-xs md:text-sm ${
                      isDark ? 'border-gray-700' : 'border-gray-200'
                    }`}
                  >
                    {[
                      { key: 'content', label: 'Maudhui', icon: FileText },
                      ...(lesson.has_video
                        ? [{ key: 'video', label: 'Video', icon: Play }]
                        : []),
                      ...(lesson.has_pdf
                        ? [{ key: 'pdf', label: 'PDF', icon: Download }]
                        : []),
                    ].map(({ key, label, icon: Icon }) => (
                      <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`flex items-center px-5 py-2 font-medium transition-colors ${
                          activeTab === key
                            ? 'border-b-2 border-emerald-600 text-emerald-600'
                            : isDark
                            ? 'text-gray-400 hover:text-white'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Icon size={16} className="mr-1.5" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="min-h-[320px]">
                  {activeTab === 'content' && (
                    <div
                      className={`prose prose-sm md:prose-base max-w-none ${
                        isDark ? 'prose-invert' : ''
                      }`}
                      dangerouslySetInnerHTML={{ __html: lesson.content }}
                    />
                  )}

                  {activeTab === 'video' && lesson.has_video && (
                    <div className="aspect-video">
                      <iframe
                        src={`https://www.youtube.com/embed/${
                          lesson.video_url.split('v=')[1]
                        }`}
                        title={lesson.title}
                        className="w-full h-full rounded-xl"
                        allowFullScreen
                      />
                    </div>
                  )}

                  {activeTab === 'pdf' && lesson.has_pdf && (
                    <div className="text-center py-10">
                      <Download
                        className="mx-auto mb-4 text-sky-600"
                        size={48}
                      />
                      <h3
                        className={`text-lg md:text-xl font-bold mb-3 ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        Pakua PDF ya Somo
                      </h3>
                      <p
                        className={`text-xs md:text-sm mb-4 ${
                          isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        Unaweza kuhifadhi PDF hii na kuisoma hata ukiwa offline.
                      </p>
                      <a
                        href={lesson.pdf_file}
                        download
                        className="inline-flex items-center rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 text-sm font-semibold transition-colors"
                      >
                        <Download size={16} className="mr-2" />
                        Pakua PDF
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-5 md:space-y-6">
              {/* Lesson Info */}
              <div
                className={`rounded-2xl border p-5 ${
                  isDark
                    ? 'bg-gray-900/85 border-gray-800'
                    : 'bg-white/95 border-gray-100'
                }`}
              >
                <h3
                  className={`text-sm md:text-base font-bold mb-3 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Maelezo ya Somo
                </h3>
                <div className="space-y-3 text-[12px] md:text-xs">
                  <div>
                    <p
                      className={`font-medium ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      Mfululizo:
                    </p>
                    <p
                      className={
                        isDark ? 'text-gray-100' : 'text-gray-800'
                      }
                    >
                      {lesson.series.name}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`font-medium ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      Msimu:
                    </p>
                    <p
                      className={
                        isDark ? 'text-gray-100' : 'text-gray-800'
                      }
                    >
                      {lesson.series.season_name}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`font-medium ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      Maandiko:
                    </p>
                    <p
                      className={
                        isDark ? 'text-gray-100' : 'text-gray-800'
                      }
                    >
                      {lesson.bible_references}
                    </p>
                  </div>
                  {lesson.duration_minutes && (
                    <div>
                      <p
                        className={`font-medium ${
                          isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        Muda:
                      </p>
                      <p
                        className={
                          isDark ? 'text-gray-100' : 'text-gray-800'
                        }
                      >
                        {lesson.duration_minutes} dakika
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Resources */}
              <div
                className={`rounded-2xl border p-5 ${
                  isDark
                    ? 'bg-gray-900/85 border-gray-800'
                    : 'bg-white/95 border-gray-100'
                }`}
              >
                <h3
                  className={`text-sm md:text-base font-bold mb-3 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Rasilimali za Somo
                </h3>
                <div className="space-y-3 text-sm">
                  {lesson.has_video && (
                    <button
                      onClick={() => setActiveTab('video')}
                      className="w-full flex items-center justify-center rounded-lg bg-sky-600 hover:bg-sky-700 text-white py-2.5 transition-colors"
                    >
                      <Play size={16} className="mr-2" />
                      Tazama Video
                    </button>
                  )}
                  {lesson.has_pdf && (
                    <a
                      href={lesson.pdf_file}
                      download
                      className="w-full flex items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 transition-colors"
                    >
                      <Download size={16} className="mr-2" />
                      Pakua PDF
                    </a>
                  )}
                  {lesson.has_audio && (
                    <a
                      href={lesson.audio_file}
                      download
                      className="w-full flex items-center justify-center rounded-lg bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-2.5 font-semibold transition-colors"
                    >
                      <FileText size={16} className="mr-2" />
                      Pakua Audio
                    </a>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
