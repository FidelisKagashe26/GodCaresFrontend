import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import SEOHead from '../components/SEOHead';
import {
  DollarSign,
  Copy,
  CheckCircle,
  CreditCard,
  Smartphone,
  Building,
  Heart,
  Users,
  BookOpen,
  Home,
} from 'lucide-react';

export default function Donations() {
  const { isDark } = useTheme();
  const [copiedText, setCopiedText] = useState('');

  const copyToClipboard = (text, label) => {
    if (!navigator?.clipboard) return;
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const paymentMethods = [
    {
      id: 'mobile',
      title: 'Mobile Money',
      icon: Smartphone,
      color: 'green',
      methods: [
        {
          name: 'M-Pesa',
          number: '0767525234',
          instructions: [
            'Nenda kwenye M-Pesa menu',
            'Chagua "Lipa kwa M-Pesa"',
            'Chagua "Pay Bill"',
            'Ingiza Business Number: 400200',
            'Account Number: GOD365',
            'Ingiza kiasi',
            'Ingiza PIN yako',
          ],
        },
        {
          name: 'Tigo Pesa',
          number: '0767525234',
          instructions: [
            'Dial *150*01#',
            'Chagua "Send Money"',
            'Ingiza nambari: 0767525234',
            'Ingiza kiasi',
            'Ingiza PIN yako',
          ],
        },
        {
          name: 'Airtel Money',
          number: '0767525234',
          instructions: [
            'Dial *150*60#',
            'Chagua "Send Money"',
            'Ingiza nambari: 0767525234',
            'Ingiza kiasi',
            'Ingiza PIN yako',
          ],
        },
      ],
    },
    {
      id: 'bank',
      title: 'Bank Transfer',
      icon: Building,
      color: 'blue',
      methods: [
        {
          name: 'CRDB Bank',
          accountNumber: '0150123456789',
          accountName: 'GOD CARES 365',
          swiftCode: 'CORUTZTZ',
          instructions: [
            'Nenda benki au tumia mobile banking',
            'Chagua "Transfer Money"',
            'Ingiza Account Number: 0150123456789',
            'Account Name: GOD CARES 365',
            'Ingiza kiasi',
            'Thibitisha malipo',
          ],
        },
        {
          name: 'NMB Bank',
          accountNumber: '20110123456',
          accountName: 'GOD CARES 365',
          swiftCode: 'NMIBTZTZ',
          instructions: [
            'Nenda benki au tumia NMB Mobile',
            'Chagua "Transfer"',
            'Ingiza Account Number: 20110123456',
            'Account Name: GOD CARES 365',
            'Ingiza kiasi',
            'Thibitisha malipo',
          ],
        },
      ],
    },
    {
      id: 'control',
      title: 'Control Number',
      icon: CreditCard,
      color: 'yellow',
      methods: [
        {
          name: 'GePG Control Number',
          controlNumber: '992001234567890',
          instructions: [
            'Nenda benki yoyote au wakala wa benki',
            'Mwambie unataka kulipa kwa Control Number',
            'Toa Control Number: 992001234567890',
            'Ingiza kiasi unachotaka kuchangia',
            'Pokea risiti ya malipo',
          ],
        },
      ],
    },
  ];

  const impactAreas = [
    {
      icon: BookOpen,
      title: 'Masomo ya Biblia',
      description:
        'Kuandaa na kusambaza masomo ya Biblia ya ubora wa hali ya juu',
      percentage: 40,
    },
    {
      icon: Users,
      title: 'Matukio ya Jamii',
      description: 'Kuandaa mikutano, semina, na matukio ya kiroho',
      percentage: 30,
    },
    {
      icon: Heart,
      title: 'Msaada wa Kijamii',
      description: 'Kusaidia wafuasi wenye mahitaji maalum',
      percentage: 20,
    },
    {
      icon: Home,
      title: 'Uendeshaji wa Tovuti',
      description: 'Kudumisha na kuboresha huduma za mtandaoni',
      percentage: 10,
    },
  ];

  const colorClasses = {
    green: 'from-emerald-500 to-emerald-600',
    blue: 'from-blue-500 to-blue-600',
    yellow: 'from-yellow-400 to-amber-500',
  };

  return (
    <>
      <SEOHead
        title="Michango | God Cares 365"
        description="Changia kazi ya Mungu kupitia God Cares 365 na saidia kuendeleza huduma za kiroho, masomo ya Biblia na matukio ya injili."
        keywords="michango, sadaka, God Cares 365, kutoa, donations"
      />
      <div
        className={`min-h-screen py-10 md:py-12 transition-colors ${
          isDark
            ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950'
            : 'bg-gradient-to-b from-slate-50 via-white to-emerald-50'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <header className="text-center mb-10 md:mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-emerald-500/40">
              <DollarSign className="text-white" size={32} />
            </div>
            <p className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300 mb-3">
              Partner in the Mission
            </p>
            <h1
              className={`text-2xl md:text-4xl font-extrabold mb-3 md:mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Michango ya Kuitia Nguvu Injili
            </h1>
            <p
              className={`text-sm md:text-lg max-w-2xl mx-auto ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Changia katika kazi ya Mungu na usaidie jamii yetu kuendelea
              kutoa masomo ya Biblia, maombi na matukio ya kiroho siku zote za
              mwaka.
            </p>
          </header>

          {/* Impact Section */}
          <section className="mb-12 md:mb-16">
            <h2
              className={`text-xl md:text-2xl font-bold text-center mb-6 md:mb-8 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Jinsi Michango Yako Inavyotumika
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {impactAreas.map((area, index) => {
                const Icon = area.icon;
                return (
                  <div
                    key={index}
                    className={`card rounded-2xl p-6 text-center shadow-md ${
                      isDark
                        ? 'bg-gray-900/80 border border-gray-800'
                        : 'bg-white border border-emerald-50'
                    }`}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/10 via-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon
                        className="text-emerald-600 dark:text-emerald-400"
                        size={22}
                      />
                    </div>
                    <h3
                      className={`font-semibold mb-2 text-sm md:text-base ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {area.title}
                    </h3>
                    <p
                      className={`text-xs md:text-sm mb-4 ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      {area.description}
                    </p>
                    <div className="w-full bg-gray-200/70 dark:bg-gray-800 rounded-full h-2 mb-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500"
                        style={{ width: `${area.percentage}%` }}
                      ></div>
                    </div>
                    <span className="inline-flex items-center justify-center rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                      {area.percentage}% ya mchango wako
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Payment Methods */}
          <section>
            <h2
              className={`text-xl md:text-2xl font-bold text-center mb-3 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Njia za Malipo
            </h2>
            <p
              className={`text-xs md:text-sm text-center max-w-2xl mx-auto mb-8 ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Chagua njia yoyote iliyo rahisi kwako. Baada ya malipo unaweza
              kututumia uthibitisho wa muamala kwa WhatsApp au barua pepe kwa
              kumbukumbu.
            </p>

            <div className="space-y-8">
              {paymentMethods.map((method) => {
                const Icon = method.icon;

                return (
                  <div
                    key={method.id}
                    className={`card rounded-2xl p-6 md:p-8 shadow-md ${
                      isDark
                        ? 'bg-gray-900/80 border border-gray-800'
                        : 'bg-white border border-emerald-50'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
                      <div className="flex items-center">
                        <div
                          className={`w-12 h-12 bg-gradient-to-r ${colorClasses[method.color]} rounded-xl flex items-center justify-center mr-4 shadow-sm shadow-emerald-500/40`}
                        >
                          <Icon className="text-white" size={24} />
                        </div>
                        <div>
                          <h3
                            className={`text-lg md:text-2xl font-bold ${
                              isDark ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {method.title}
                          </h3>
                          <p
                            className={`text-xs md:text-sm ${
                              isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}
                          >
                            Fuata hatua rahisi hapa chini kukamilisha mchango
                            wako.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {method.methods.map((paymentMethod, index) => (
                        <div
                          key={index}
                          className={`rounded-2xl p-6 border shadow-sm ${
                            isDark
                              ? 'bg-gray-900/70 border-gray-700'
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <h4
                            className={`text-base md:text-lg font-semibold mb-3 ${
                              isDark ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {paymentMethod.name}
                          </h4>

                          {/* Account Details */}
                          <div className="space-y-3 mb-4 text-[13px]">
                            {paymentMethod.number && (
                              <div className="flex items-center justify-between">
                                <span
                                  className={
                                    isDark
                                      ? 'text-gray-300'
                                      : 'text-gray-600'
                                  }
                                >
                                  Nambari:
                                </span>
                                <div className="flex items-center">
                                  <span
                                    className={`font-mono text-sm ${
                                      isDark
                                        ? 'text-white'
                                        : 'text-gray-900'
                                    }`}
                                  >
                                    {paymentMethod.number}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      copyToClipboard(
                                        paymentMethod.number,
                                        `${paymentMethod.name} Number`
                                      )
                                    }
                                    className="ml-2 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                                  >
                                    {copiedText ===
                                    `${paymentMethod.name} Number` ? (
                                      <CheckCircle
                                        className="text-emerald-500"
                                        size={16}
                                      />
                                    ) : (
                                      <Copy
                                        className={
                                          isDark
                                            ? 'text-gray-400'
                                            : 'text-gray-500'
                                        }
                                        size={16}
                                      />
                                    )}
                                  </button>
                                </div>
                              </div>
                            )}

                            {paymentMethod.accountNumber && (
                              <div className="flex items-center justify-between">
                                <span
                                  className={
                                    isDark
                                      ? 'text-gray-300'
                                      : 'text-gray-600'
                                  }
                                >
                                  Account:
                                </span>
                                <div className="flex items-center">
                                  <span
                                    className={`font-mono text-sm ${
                                      isDark
                                        ? 'text-white'
                                        : 'text-gray-900'
                                    }`}
                                  >
                                    {paymentMethod.accountNumber}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      copyToClipboard(
                                        paymentMethod.accountNumber,
                                        `${paymentMethod.name} Account`
                                      )
                                    }
                                    className="ml-2 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                                  >
                                    {copiedText ===
                                    `${paymentMethod.name} Account` ? (
                                      <CheckCircle
                                        className="text-emerald-500"
                                        size={16}
                                      />
                                    ) : (
                                      <Copy
                                        className={
                                          isDark
                                            ? 'text-gray-400'
                                            : 'text-gray-500'
                                        }
                                        size={16}
                                      />
                                    )}
                                  </button>
                                </div>
                              </div>
                            )}

                            {paymentMethod.accountName && (
                              <div className="flex items-center justify-between">
                                <span
                                  className={
                                    isDark
                                      ? 'text-gray-300'
                                      : 'text-gray-600'
                                  }
                                >
                                  Name:
                                </span>
                                <span
                                  className={`font-semibold ${
                                    isDark
                                      ? 'text-white'
                                      : 'text-gray-900'
                                  }`}
                                >
                                  {paymentMethod.accountName}
                                </span>
                              </div>
                            )}

                            {paymentMethod.controlNumber && (
                              <div className="flex items-center justify-between">
                                <span
                                  className={
                                    isDark
                                      ? 'text-gray-300'
                                      : 'text-gray-600'
                                  }
                                >
                                  Control Number:
                                </span>
                                <div className="flex items-center">
                                  <span
                                    className={`font-mono text-base font-bold ${
                                      isDark
                                        ? 'text-white'
                                        : 'text-gray-900'
                                    }`}
                                  >
                                    {paymentMethod.controlNumber}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      copyToClipboard(
                                        paymentMethod.controlNumber,
                                        'Control Number'
                                      )
                                    }
                                    className="ml-2 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                                  >
                                    {copiedText === 'Control Number' ? (
                                      <CheckCircle
                                        className="text-emerald-500"
                                        size={16}
                                      />
                                    ) : (
                                      <Copy
                                        className={
                                          isDark
                                            ? 'text-gray-400'
                                            : 'text-gray-500'
                                        }
                                        size={16}
                                      />
                                    )}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Instructions */}
                          <div>
                            <h5
                              className={`text-xs font-semibold mb-2 ${
                                isDark ? 'text-gray-300' : 'text-gray-700'
                              }`}
                            >
                              Maelekezo:
                            </h5>
                            <ol
                              className={`text-[11px] space-y-1 ${
                                isDark ? 'text-gray-400' : 'text-gray-600'
                              }`}
                            >
                              {paymentMethod.instructions.map(
                                (instruction, i) => (
                                  <li key={i} className="flex">
                                    <span className="mr-2">
                                      {i + 1}.
                                    </span>
                                    <span>{instruction}</span>
                                  </li>
                                )
                              )}
                            </ol>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Thank You Message */}
          <section
            className={`mt-10 md:mt-12 text-center card rounded-2xl p-8 md:p-10 shadow-md ${
              isDark
                ? 'bg-gray-900/80 border border-gray-800'
                : 'bg-white border border-emerald-50'
            }`}
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 via-green-500 to-blue-600 shadow-md shadow-emerald-500/40">
              <Heart className="text-white" size={30} />
            </div>
            <h2
              className={`text-xl md:text-2xl font-bold mb-3 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Asante kwa Mchango Wako!
            </h2>
            <p
              className={`text-sm md:text-lg mb-5 max-w-2xl mx-auto ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Kila mchango, mdogo au mkubwa, unasaidia kueneza Neno la Mungu na
              kuimarisha jamii yetu ya imani. Mungu akubariki kwa ukarimu wako
              na aijaze nyumba yako kwa amani.
            </p>
            <div
              className={`p-4 md:p-5 rounded-xl border ${
                isDark
                  ? 'bg-emerald-900/20 border-emerald-700'
                  : 'bg-emerald-50 border-emerald-200'
              }`}
            >
              <p className="text-xs md:text-sm text-emerald-700 dark:text-emerald-200 font-medium">
                “Kila mmoja na atoe kama alivyoamua moyoni mwake, si kwa huzuni
                wala kwa kulazimishwa; kwa maana Mungu ampenda mtoaji mwenye
                furaha.” – 2 Wakorintho 9:7
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
