import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  BookOpen, 
  Play, 
  Download, 
  FileText, 
  ArrowLeft, 
  Clock, 
  Eye,
  Calendar,
  Share2
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
    description: 'Jifunze kuhusu muandishi, lengo, na ujumbe mkuu wa Injili ya Mathayo.',
    content: `
      <h2>Utangulizi</h2>
      <p>Injili ya Mathayo ni kitabu cha kwanza katika Agano Jipya na kimoja kwa vitabu muhimu zaidi katika Ukristo. Kitabu hiki kiliandikwa kwa Wayahudi ili kuwaonyesha kwamba Yesu ndiye Masihi waliyemngoja.</p>
      
      <h2>Muandishi</h2>
      <p>Mathayo, aliyeitwa pia Lawi, alikuwa mtoza ushuru kabla ya kumfuata Yesu. Uzoefu wake wa biashara na uandishi ulimsaidia kuandika kumbukumbu za kina za mafundisho ya Yesu.</p>
      
      <h2>Lengo la Kitabu</h2>
      <ul>
        <li>Kuonyesha kwamba Yesu ndiye Masihi wa Israeli</li>
        <li>Kueleza jinsi ufalme wa imbingu unavyofanya kazi</li>
        <li>Kutoa mafundisho ya Yesu kwa utaratibu</li>
        <li>Kuimarisha imani ya wakristo wa kwanza</li>
      </ul>
      
      <h2>Muundo wa Kitabu</h2>
      <p>Injili ya Mathayo imegawanywa katika sehemu kuu tano, kila moja ikimalizika na hotuba kubwa ya Yesu.</p>
    `,
    featured_image: 'https://images.pexels.com/photos/1112048/pexels-photo-1112048.jpeg?auto=compress&cs=tinysrgb&w=1200',
    series: {
      id: 1,
      name: 'Injili za Kwanza',
      slug: 'injili-za-kwanza',
      season_name: 'Agano Jipya 2024'
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
    updated_at: '2024-01-15T10:00:00Z'
  };

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        // In production: const response = await fetch(`/api/lessons/${slug}/`);
        await new Promise(resolve => setTimeout(resolve, 1000));
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
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={`min-h-screen py-12 transition-colors ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="container mx-auto px-6 flex items-center justify-center min-h-[400px]">
          <LoadingSpinner text="Inapakia somo..." size="lg" />
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className={`min-h-screen py-12 transition-colors ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="container mx-auto px-6">
          <div className={`text-center card p-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <p className="text-red-600 text-lg">{error || 'Somo halijapatikana'}</p>
            <Link
              to="/mafunzo"
              className="inline-flex items-center mt-4 text-green-600 hover:text-green-700"
            >
              <ArrowLeft size={16} className="mr-1" />
              Rudi kwenye Mafunzo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-12 transition-colors ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="container mx-auto px-6">
        {/* Back Button */}
        <Link
          to="/mafunzo"
          className="inline-flex items-center mb-8 text-green-600 hover:text-green-700 transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" />
          Rudi kwenye Mafunzo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className={`card p-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              {/* Header */}
              <header className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                    {lesson.series.name}
                  </span>
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Somo #{lesson.order}
                  </span>
                </div>
                
                <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>{lesson.title}</h1>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="flex items-center">
                      <BookOpen size={16} className="mr-1" />
                      {lesson.bible_references}
                    </span>
                    {lesson.duration_minutes && (
                      <span className="flex items-center">
                        <Clock size={16} className="mr-1" />
                        {lesson.duration_minutes} dakika
                      </span>
                    )}
                    <span className="flex items-center">
                      <Eye size={16} className="mr-1" />
                      {lesson.views} mara
                    </span>
                  </div>
                  
                  <button className="flex items-center text-green-600 hover:text-green-700">
                    <Share2 size={16} className="mr-1" />
                    Shiriki
                  </button>
                </div>

                <img
                  src={lesson.featured_image}
                  alt={lesson.title}
                  className="w-full h-64 md:h-80 object-cover rounded-lg mb-6"
                />
              </header>

              {/* Content Tabs */}
              <div className="mb-6">
                <div className={`flex border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  {[
                    { key: 'content', label: 'Maudhui', icon: FileText },
                    ...(lesson.has_video ? [{ key: 'video', label: 'Video', icon: Play }] : []),
                    ...(lesson.has_pdf ? [{ key: 'pdf', label: 'PDF', icon: Download }] : [])
                  ].map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className={`flex items-center px-6 py-3 font-medium transition-colors ${
                        activeTab === key
                          ? 'border-b-2 border-green-600 text-green-600'
                          : isDark
                            ? 'text-gray-400 hover:text-white'
                            : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <Icon size={16} className="mr-2" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="min-h-[400px]">
                {activeTab === 'content' && (
                  <div 
                    className={`prose prose-lg max-w-none ${
                      isDark ? 'prose-invert' : ''
                    }`}
                    dangerouslySetInnerHTML={{ __html: lesson.content }}
                  />
                )}

                {activeTab === 'video' && lesson.has_video && (
                  <div className="aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${lesson.video_url.split('v=')[1]}`}
                      title={lesson.title}
                      className="w-full h-full rounded-lg"
                      allowFullScreen
                    />
                  </div>
                )}

                {activeTab === 'pdf' && lesson.has_pdf && (
                  <div className="text-center py-12">
                    <Download className="mx-auto mb-4 text-blue-600" size={48} />
                    <h3 className={`text-xl font-bold mb-4 ${
                      isDark ? 'text-white' : 'text-gray-800'
                    }`}>Pakua PDF ya Somo</h3>
                    <a
                      href={lesson.pdf_file}
                      download
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
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
          <aside className="lg:col-span-1">
            {/* Lesson Info */}
            <div className={`card p-6 mb-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`text-lg font-bold mb-4 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>Maelezo ya Somo</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Mfululizo:
                  </span>
                  <p className={isDark ? 'text-white' : 'text-gray-800'}>
                    {lesson.series.name}
                  </p>
                </div>
                <div>
                  <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Msimu:
                  </span>
                  <p className={isDark ? 'text-white' : 'text-gray-800'}>
                    {lesson.series.season_name}
                  </p>
                </div>
                <div>
                  <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Maandiko:
                  </span>
                  <p className={isDark ? 'text-white' : 'text-gray-800'}>
                    {lesson.bible_references}
                  </p>
                </div>
                {lesson.duration_minutes && (
                  <div>
                    <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Muda:
                    </span>
                    <p className={isDark ? 'text-white' : 'text-gray-800'}>
                      {lesson.duration_minutes} dakika
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Downloads */}
            <div className={`card p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`text-lg font-bold mb-4 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>Rasilimali</h3>
              <div className="space-y-3">
                {lesson.has_video && (
                  <button
                    onClick={() => setActiveTab('video')}
                    className="w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors"
                  >
                    <Play size={16} className="mr-2" />
                    Tazama Video
                  </button>
                )}
                {lesson.has_pdf && (
                  <a
                    href={lesson.pdf_file}
                    download
                    className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors"
                  >
                    <Download size={16} className="mr-2" />
                    Pakua PDF
                  </a>
                )}
                {lesson.has_audio && (
                  <a
                    href={lesson.audio_file}
                    download
                    className="w-full flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition-colors"
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
  );
}