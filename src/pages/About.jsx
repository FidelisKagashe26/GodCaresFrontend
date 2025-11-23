import { useTheme } from '../contexts/ThemeContext';
import { Info, Users, Heart, Target, Mail, Phone, MapPin } from 'lucide-react';

export default function About() {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen py-12 transition-colors ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="container mx-auto px-6">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info className="text-white" size={32} />
          </div>
          <h1 className={`text-4xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>Kuhusu Sisi</h1>
          <p className={`text-lg max-w-2xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Jifunze zaidi kuhusu historia, dhamira, na timu ya GOD CARES 365
          </p>
        </header>

        {/* Mission & Vision */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className={`card p-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Target className="text-green-600" size={24} />
            </div>
            <h2 className={`text-2xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>Dhamira Yetu</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
              Kupitia GOD CARES 365, tunalenga kueneza Upendo wa Mungu na Habari Njema kwa kila mtu. 
              Tunataka kutoa mafunzo ya Biblia yaliyojengwa kwa ufasaha, habari zenye kukutia moyo, 
              na rasilimali za kiroho ambazo zitawasaidia watu kujenga imani yao na kupata matumaini 
              katika magumu wanayopitia.
            </p>
          </div>

          <div className={`card p-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Heart className="text-blue-600" size={24} />
            </div>
            <h2 className={`text-2xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>Maono Yetu</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
              Maono yetu ni kuona jamii ya waumini ikinyanyuka katika umoja wa kiroho, ikisaidia 
              watu kupata neema na uponyaji wa kiroho. Tunataka kuwa kitovu kinachoaminika kupitia 
              mitandao yote, ambapo kila mtu, popote alipo, anaweza kupata neno la Mungu, ushauri, 
              na msaada wa kiroho.
            </p>
          </div>
        </section>

        {/* History */}
        <section className={`card p-8 mb-16 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-2xl font-bold mb-6 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>Historia Yetu</h2>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed mb-4`}>
            GOD CARES 365 ilianzishwa mnamo mwaka 2023 na kundi la vijana wapenzi wa mafundisho ya 
            Biblia. Ilikusudiwa kuwa na tovuti yenye kutoa habari na rasilimali za kiroho kila siku, 
            ili waweze kupata faraja, nguvu, na mafunzo yatakayowaimarisha katika mwendo wao na Mungu.
          </p>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
            Tulianza kama kikundi kidogo cha waumini wanayosoma pamoja, na sasa tumekuwa jukwaa 
            lenye watazamaji wengi kutoka sehemu mbalimbali za dunia. Kila siku, tunajitahidi kutoa 
            maudhui ya hali ya juu yanayojenga imani na kuimarisha uhusiano wa kibinafsi na Mungu.
          </p>
        </section>

        {/* Team */}
        <section className="mb-16">
          <h2 className={`text-2xl font-bold text-center mb-8 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>
            <Users className="inline mr-2" size={24} />
            Timu Yetu
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`card p-6 text-center ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">FV</span>
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>Fidelis Y. Vitabu</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                Mwanzilishi & Muongoza Masomo ya Biblia
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Mwongozi wa kiroho mwenye uzoefu wa miaka mingi katika mafundisho ya Biblia
              </p>
            </div>

            <div className={`card p-6 text-center ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">AS</span>
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>Anna M. Simba</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                Mhariri Mkuu wa Habari & Vipengele
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Mhariri mwenye ujuzi wa kuandika makala za kiroho zenye kuvutia
              </p>
            </div>

            <div className={`card p-6 text-center ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">ZM</span>
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>Zawadi A. Mwinyi</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                Mratibu wa Mitandao ya Kijamii
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Mtaalamu wa mitandao ya kijamii na mawasiliano ya kidijitali
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className={`card p-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-2xl font-bold mb-6 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>Wasiliana Nasi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="text-green-600" size={20} />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                    fmklink@gmail.com
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="text-green-600" size={20} />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                    +255 767 525 234
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="text-green-600" size={20} />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                    Dar es Salaam, Tanzania
                  </span>
                </div>
              </div>
            </div>
            <div>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Jina Lako"
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <input
                  type="email"
                  placeholder="Barua Pepe"
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <textarea
                  rows="4"
                  placeholder="Ujumbe Wako"
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  Tuma Ujumbe
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}