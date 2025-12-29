import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import SEOHead from "../components/SEOHead";
import { Info, Users, Heart, Target, Mail, Phone, MapPin } from "lucide-react";

export default function About() {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  return (
    <>
      <SEOHead
        title={t("aboutSeoTitle") || "Kuhusu Sisi | God Cares 365"}
        description={
          t("aboutSeoDesc") ||
          "Jifunze kuhusu historia, dhamira na maono ya God Cares 365 – jukwaa la masomo ya Biblia, maombi na habari za kiroho."
        }
        keywords={t("aboutSeoKeywords") || "kuhusu sisi, God Cares 365, historia, dhamira, maono"}
      />

      <div
        className={`min-h-screen py-10 md:py-12 transition-colors ${
          isDark
            ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"
            : "bg-gradient-to-b from-slate-50 via-white to-emerald-50"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <header className="text-center mb-10 md:mb-12">
            {/* <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-emerald-500/40">
              <Info className="text-white" size={32} />
            </div> */}

            <p className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300 mb-3">
              {t("aboutBadge") || "Who We Are"}
            </p>

            <h1 className={`text-2xl md:text-4xl font-extrabold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
              {t("aboutTitle") || "Kuhusu GOD CARES 365"}
            </h1>

            <p className={`text-sm md:text-lg max-w-2xl mx-auto ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              {t("aboutIntro") ||
                "Jifunze zaidi kuhusu historia, dhamira na maono ya jukwaa hili la kiroho linalolenga kufikia kila mlango, kila nafsi, kila siku."}
            </p>
          </header>

          {/* Mission & Vision */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10 md:mb-16">
            <div
              className={`card rounded-2xl p-6 md:p-8 shadow-md ${
                isDark ? "bg-gray-900/80 border border-gray-800" : "bg-white border border-emerald-50"
              }`}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/15 to-blue-500/15 border border-emerald-500/30 rounded-xl flex items-center justify-center mb-4">
                <Target className="text-emerald-600 dark:text-emerald-400" size={24} />
              </div>

              <h2 className={`text-xl md:text-2xl font-bold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
                {t("aboutMissionTitle") || "Dhamira Yetu"}
              </h2>

              <p className={`text-sm md:text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                {t("aboutMissionBody") ||
                  "Kupitia GOD CARES 365, tunalenga kueneza Upendo wa Mungu na Habari Njema kwa kila mtu. Tunataka kutoa mafunzo ya Biblia ya kina, habari zenye kukutia moyo, na rasilimali za kiroho zitakazosaidia watu kujenga imani yao, kupata matumaini na kutambua kwamba Mungu anawajali kila siku."}
              </p>
            </div>

            <div
              className={`card rounded-2xl p-6 md:p-8 shadow-md ${
                isDark ? "bg-gray-900/80 border border-gray-800" : "bg-white border border-emerald-50"
              }`}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/15 to-emerald-500/15 border border-blue-500/30 rounded-xl flex items-center justify-center mb-4">
                <Heart className="text-blue-600 dark:text-blue-400" size={24} />
              </div>

              <h2 className={`text-xl md:text-2xl font-bold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
                {t("aboutVisionTitle") || "Maono Yetu"}
              </h2>

              <p className={`text-sm md:text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                {t("aboutVisionBody") ||
                  "Maono yetu ni kuona jamii ya waumini ikinyanyuka katika umoja wa kiroho, ikisaidia watu kupata neema na uponyaji wa kiroho. Tunataka kuwa kitovu kinachoaminika mtandaoni, ambapo kila mtu, popote alipo, anaweza kupata Neno la Mungu, ushauri na msaada wa kiroho kwa namna iliyo rahisi na ya kisasa."}
              </p>
            </div>
          </section>

          {/* History */}
          <section
            className={`card rounded-2xl p-6 md:p-8 shadow-md mb-10 md:mb-16 ${
              isDark ? "bg-gray-900/80 border border-gray-800" : "bg-white border border-emerald-50"
            }`}
          >
            <h2 className={`text-xl md:text-2xl font-bold mb-4 md:mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>
              {t("aboutHistoryTitle") || "Historia Yetu"}
            </h2>

            <p className={`text-sm md:text-base leading-relaxed mb-3 md:mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              {t("aboutHistoryP1") ||
                "GOD CARES 365 ilianzishwa mnamo mwaka 2023 na kundi la vijana wapenzi wa mafundisho ya Biblia. Kusudi kuu lilikuwa kuanzisha jukwaa la mtandaoni linalotoa habari na rasilimali za kiroho kila siku, ili watu waweze kupata faraja, nguvu na mafunzo yanayoimarisha mwendo wao na Mungu."}
            </p>

            <p className={`text-sm md:text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              {t("aboutHistoryP2") ||
                "Tulianza kama kikundi kidogo cha waumini wanaosoma pamoja, na sasa tumeendelea kuwa jukwaa linalofikiwa na watu kutoka maeneo mbalimbali. Kila siku tunajitahidi kutoa maudhui ya hali ya juu yanayojenga imani, kuleta tumaini na kuhamasisha watu kuishi maisha yanayompendeza Mungu."}
            </p>
          </section>

          {/* Team */}
          <section className="mb-10 md:mb-16">
            <h2 className={`text-xl md:text-2xl font-bold text-center mb-6 md:mb-8 ${isDark ? "text-white" : "text-gray-900"}`}>
              <Users className="inline mr-2 mb-1" size={22} />
              {t("aboutTeamTitle") || "Timu Yetu"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className={`card rounded-2xl p-6 text-center shadow-md ${isDark ? "bg-gray-900/80 border border-gray-800" : "bg-white border border-emerald-50"}`}>
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md shadow-emerald-500/40">
                  <span className="text-white font-bold text-2xl">FV</span>
                </div>
                <h3 className={`text-lg md:text-xl font-semibold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Fidelis Y. Vitabu
                </h3>
                <p className={`text-xs md:text-sm mb-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  {t("aboutTeamRole1") || "Mwanzilishi & Muongoza Masomo ya Biblia"}
                </p>
                <p className={`text-xs md:text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  {t("aboutTeamDesc1") || "Mwongozi wa kiroho mwenye uzoefu wa miaka mingi katika mafundisho ya Biblia na ushauri wa kiroho."}
                </p>
              </div>

              <div className={`card rounded-2xl p-6 text-center shadow-md ${isDark ? "bg-gray-900/80 border border-gray-800" : "bg-white border border-emerald-50"}`}>
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md shadow-blue-500/40">
                  <span className="text-white font-bold text-2xl">AS</span>
                </div>
                <h3 className={`text-lg md:text-xl font-semibold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Anna M. Simba
                </h3>
                <p className={`text-xs md:text-sm mb-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  {t("aboutTeamRole2") || "Mhariri Mkuu wa Habari & Vipengele"}
                </p>
                <p className={`text-xs md:text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  {t("aboutTeamDesc2") || "Mhariri mwenye ujuzi wa kuandika makala za kiroho zenye kugusa maisha na kuhamasisha mabadiliko chanya."}
                </p>
              </div>

              <div className={`card rounded-2xl p-6 text-center shadow-md ${isDark ? "bg-gray-900/80 border border-gray-800" : "bg-white border border-emerald-50"}`}>
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md shadow-yellow-400/40">
                  <span className="text-white font-bold text-2xl">ZM</span>
                </div>
                <h3 className={`text-lg md:text-xl font-semibold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Zawadi A. Mwinyi
                </h3>
                <p className={`text-xs md:text-sm mb-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  {t("aboutTeamRole3") || "Mratibu wa Mitandao ya Kijamii"}
                </p>
                <p className={`text-xs md:text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  {t("aboutTeamDesc3") || "Mtaalamu wa mawasiliano ya kidijitali, anayeratibu ujumbe wetu kufika kwa haraka kupitia majukwaa ya mtandaoni."}
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className={`card rounded-2xl p-6 md:p-8 shadow-md ${isDark ? "bg-gray-900/80 border border-gray-800" : "bg-white border border-emerald-50"}`}>
            <h2 className={`text-xl md:text-2xl font-bold mb-4 md:mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>
              {t("aboutContactTitle") || "Wasiliana Nasi"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center space-x-3">
                    <Mail className="text-emerald-500 dark:text-emerald-400" size={20} />
                    <span className={isDark ? "text-gray-300" : "text-gray-700"}>fmklink@gmail.com</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="text-emerald-500 dark:text-emerald-400" size={20} />
                    <span className={isDark ? "text-gray-300" : "text-gray-700"}>+255 767 525 234</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="text-emerald-500 dark:text-emerald-400" size={20} />
                    <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                      {t("aboutContactLocation") || "Dar es Salaam, Tanzania"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <form className="space-y-3 md:space-y-4 text-sm">
                  <input
                    type="text"
                    placeholder={t("aboutFormNamePlaceholder") || "Jina Lako"}
                    className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />

                  <input
                    type="email"
                    placeholder={t("aboutFormEmailPlaceholder") || "Barua Pepe"}
                    className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />

                  <textarea
                    rows="4"
                    placeholder={t("aboutFormMessagePlaceholder") || "Ujumbe Wako"}
                    className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:brightness-110 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm shadow-sm shadow-emerald-500/40"
                  >
                    {t("aboutFormSendBtn") || "Tuma Ujumbe"}
                  </button>
                </form>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
