// src/pages/news/NewsDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  Calendar,
  User,
  Eye,
  ArrowLeft,
  Facebook,
  Twitter,
  Clock,
} from 'lucide-react';

export default function NewsDetail() {
  const { slug } = useParams();
  const { isDark } = useTheme();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);

  // Sample data (demo)
  const samplePost = {
    id: 1,
    title: 'Jinsi ya Kujenga Imani Imara Katika Magumu',
    slug: 'kujenga-imani-imara',
    content: `
      <h2>Utangulizi</h2>
      <p>Maisha ya kikristo yanaweza kuwa na changamoto nyingi. Wakati mwingine tunakutana na hali ambazo zinafanya tujiulize kama Mungu yu pamoja nasi. Lakini Biblia inatuambia kwamba Mungu yu pamoja nasi katika kila hali.</p>
      
      <h2>Msingi wa Imani</h2>
      <p>Imani ni msingi wa kila kitu tunachofanya kama wakristo. Bila imani, haiwezekani kumpendeza Mungu (Waebrania 11:6). Imani ni kuamini kile tusichokiona, lakini tunakijua ni kweli kwa sababu Mungu amesema.</p>
      
      <h2>Jinsi ya Kuimarisha Imani</h2>
      <ul>
        <li><strong>Kusoma Biblia kila siku:</strong> Neno la Mungu ni chakula cha roho yetu</li>
        <li><strong>Maombi ya kila siku:</strong> Mawasiliano na Mungu ni muhimu</li>
        <li><strong>Kushiriki na waumini wengine:</strong> Umoja unatupa nguvu</li>
        <li><strong>Kutenda mema:</strong> Imani bila matendo ni maiti</li>
      </ul>
      
      <h2>Hitimisho</h2>
      <p>Imani ni safari, si hatua moja. Kila siku ni fursa ya kuimarisha uhusiano wetu na Mungu. Hata katika magumu, tunaweza kuwa na hakika kwamba Mungu ana mpango mzuri kwa maisha yetu.</p>
    `,
    excerpt:
      'Magumu ya maisha yanaweza kuwa changamoto, lakini Mungu anatupa nguvu ya kushinda kila kitu.',
    featured_image:
      'https://images.pexels.com/photos/8468/pray-hands-bible-christian.jpg?auto=compress&cs=tinysrgb&w=1200',
    category: { id: 1, name: 'Kiroho', slug: 'kiroho' },
    author_name: 'Fidelis Vitabu',
    views: 1250,
    created_at: '2024-01-15T10:00:00Z',
    published_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    read_time: 5,
  };

  const sampleRelated = [
    {
      id: 2,
      title: 'Umuhimu wa Maombi ya Pamoja',
      slug: 'umuhimu-maombi-pamoja',
      featured_image:
        'https://images.pexels.com/photos/1708936/pexels-photo-1708936.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: { name: 'Jamii' },
      read_time: 3,
    },
    {
      id: 3,
      title: 'Mafunzo ya Biblia: Agano Jipya',
      slug: 'mafunzo-agano-jipya',
      featured_image:
        'https://images.pexels.com/photos/1112048/pexels-photo-1112048.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: { name: 'Mafunzo' },
      read_time: 8,
    },
  ];

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        // Production: fetch from API by slug
        await new Promise((resolve) => setTimeout(resolve, 700));
        setPost(samplePost);
        setRelatedPosts(sampleRelated);
      } catch (err) {
        setError('Hitilafu katika kupakia makala');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sw-TZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const shareUrl =
    typeof window !== 'undefined' ? window.location.href : '';
  const shareText = post ? `${post.title} - GOD CARES 365` : '';

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
          <LoadingSpinner text="Inapakia makala..." size="lg" />
        </div>
      </div>
    );
  }

  if (error || !post) {
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
            <p className="text-red-600 text-base md:text-lg">
              {error || 'Makala haijapatikana'}
            </p>
            <Link
              to="/habari"
              className="inline-flex items-center mt-4 text-emerald-600 hover:text-emerald-700 dark:text-emerald-300 text-sm font-semibold"
            >
              <ArrowLeft size={16} className="mr-1" />
              Rudi kwenye Habari
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
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
          to="/habari"
          className="inline-flex items-center mb-6 md:mb-8 text-emerald-600 hover:text-emerald-700 dark:text-emerald-300 text-xs md:text-sm font-semibold"
        >
          <ArrowLeft size={16} className="mr-1" />
          Rudi kwenye Habari
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Main Content */}
          <article className="lg:col-span-3">
            <div
              className={`rounded-2xl border shadow-sm p-5 md:p-7 ${
                isDark
                  ? 'bg-gray-900/85 border-gray-800'
                  : 'bg-white/95 border-gray-100'
              }`}
            >
              {/* Header */}
              <header className="mb-6 md:mb-8">
                <div className="flex items-center flex-wrap gap-3 mb-4">
                  <span className="bg-emerald-600 text-white text-[10px] px-3 py-1 rounded-full font-semibold">
                    {post.category.name}
                  </span>
                  <span
                    className={`text-[11px] ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {formatDate(post.published_at)}
                  </span>
                </div>

                <h1
                  className={`text-xl md:text-3xl lg:text-4xl font-extrabold mb-4 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {post.title}
                </h1>

                <div className="flex flex-wrap items-center justify-between gap-3 mb-6 text-[11px] md:text-xs">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="flex items-center">
                      <User size={16} className="mr-1" />
                      {post.author_name}
                    </span>
                    <span className="flex items-center">
                      <Clock size={16} className="mr-1" />
                      {post.read_time} min kusoma
                    </span>
                    <span className="flex items-center">
                      <Eye size={16} className="mr-1" />
                      {post.views} mara
                    </span>
                  </div>

                  {/* Share Buttons */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      Shiriki:
                    </span>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        shareUrl,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-sky-600 text-white hover:bg-sky-700 transition-colors"
                    >
                      <Facebook size={16} />
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                        shareUrl,
                      )}&text=${encodeURIComponent(shareText)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-sky-500 text-white hover:bg-sky-600 transition-colors"
                    >
                      <Twitter size={16} />
                    </a>
                  </div>
                </div>

                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-56 md:h-72 lg:h-80 object-cover rounded-xl mb-6"
                />
              </header>

              {/* Content */}
              <div
                className={`prose prose-sm md:prose-base lg:prose-lg max-w-none ${
                  isDark ? 'prose-invert' : ''
                }`}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Related Posts */}
            <div
              className={`rounded-2xl border p-5 md:p-6 ${
                isDark
                  ? 'bg-gray-900/85 border-gray-800'
                  : 'bg-white/95 border-gray-100'
              }`}
            >
              <h3
                className={`text-sm md:text-base font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Makala Zinazohusiana
              </h3>
              <div className="space-y-4">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    to={`/habari/${relatedPost.slug}`}
                    className="block group"
                  >
                    <div className="flex gap-3">
                      <img
                        src={relatedPost.featured_image}
                        alt={relatedPost.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4
                          className={`text-xs md:text-sm font-semibold group-hover:text-emerald-600 transition-colors ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {relatedPost.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-[11px]">
                          <span className="bg-slate-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                            {relatedPost.category.name}
                          </span>
                          <span
                            className={
                              isDark ? 'text-gray-400' : 'text-gray-600'
                            }
                          >
                            {relatedPost.read_time} min
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div
              className={`rounded-2xl border p-5 md:p-6 ${
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
                Jiunge na Jarida letu
              </h3>
              <p
                className={`text-xs md:text-sm mb-4 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                Pata habari na makala mpya moja kwa moja kwenye barua
                pepe yako.
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="space-y-3"
              >
                <input
                  type="email"
                  placeholder="Barua pepe yako"
                  className={`w-full px-3 py-2 rounded-full border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    isDark
                      ? 'bg-gray-900 border-gray-700 text-white'
                      : 'bg-white border-gray-200 text-gray-900'
                  }`}
                />
                <button
                  type="submit"
                  className="w-full rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2.5 transition-colors"
                >
                  Jiunge
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
