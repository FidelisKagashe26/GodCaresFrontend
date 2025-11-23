import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
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
  Home
} from 'lucide-react';

export default function Donations() {
  const { isDark } = useTheme();
  const [copiedText, setCopiedText] = useState('');

  const copyToClipboard = (text, label) => {
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
            'Ingiza PIN yako'
          ]
        },
        {
          name: 'Tigo Pesa',
          number: '0767525234',
          instructions: [
            'Dial *150*01#',
            'Chagua "Send Money"',
            'Ingiza nambari: 0767525234',
            'Ingiza kiasi',
            'Ingiza PIN yako'
          ]
        },
        {
          name: 'Airtel Money',
          number: '0767525234',
          instructions: [
            'Dial *150*60#',
            'Chagua "Send Money"',
            'Ingiza nambari: 0767525234',
            'Ingiza kiasi',
            'Ingiza PIN yako'
          ]
        }
      ]
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
            'Thibitisha malipo'
          ]
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
            'Thibitisha malipo'
          ]
        }
      ]
    },
    {
      id: 'control',
      title: 'Control Number',
      icon: CreditCard,
      color: 'purple',
      methods: [
        {
          name: 'GePG Control Number',
          controlNumber: '992001234567890',
          instructions: [
            'Nenda benki yoyote au wakala wa benki',
            'Mwambie unataka kulipa kwa Control Number',
            'Toa Control Number: 992001234567890',
            'Ingiza kiasi unachotaka kuchangia',
            'Pokea risiti ya malipo'
          ]
        }
      ]
    }
  ];

  const impactAreas = [
    {
      icon: BookOpen,
      title: 'Masomo ya Biblia',
      description: 'Kuandaa na kusambaza masomo ya Biblia ya ubora wa hali ya juu',
      percentage: 40
    },
    {
      icon: Users,
      title: 'Matukio ya Jamii',
      description: 'Kuandaa mikutano, semina, na matukio ya kiroho',
      percentage: 30
    },
    {
      icon: Heart,
      title: 'Msaada wa Kijamii',
      description: 'Kusaidia wafuasi wenye mahitaji maalum',
      percentage: 20
    },
    {
      icon: Home,
      title: 'Uendeshaji wa Tovuti',
      description: 'Kudumisha na kuboresha huduma za mtandaoni',
      percentage: 10
    }
  ];

  return (
    <div className={`min-h-screen py-12 transition-colors ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="container mx-auto px-6">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="text-white" size={32} />
          </div>
          <h1 className={`text-4xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>Michango</h1>
          <p className={`text-lg max-w-2xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Changia katika kazi ya Mungu na usaidie jamii yetu kuendelea kutoa huduma za kiroho
          </p>
        </header>

        {/* Impact Section */}
        <section className="mb-12">
          <h2 className={`text-2xl font-bold text-center mb-8 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>Jinsi Michango Yako Inavyotumika</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impactAreas.map((area, index) => {
              const Icon = area.icon;
              return (
                <div key={index} className={`card p-6 text-center ${
                  isDark ? 'bg-gray-800' : 'bg-white'
                }`}>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-green-600" size={24} />
                  </div>
                  <h3 className={`font-semibold mb-2 ${
                    isDark ? 'text-white' : 'text-gray-800'
                  }`}>{area.title}</h3>
                  <p className={`text-sm mb-3 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>{area.description}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${area.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-green-600 font-semibold text-sm mt-1 block">
                    {area.percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Payment Methods */}
        <section>
          <h2 className={`text-2xl font-bold text-center mb-8 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>Njia za Malipo</h2>
          
          <div className="space-y-8">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              const colorClasses = {
                green: 'from-green-500 to-green-600',
                blue: 'from-blue-500 to-blue-600',
                purple: 'from-purple-500 to-purple-600'
              };

              return (
                <div key={method.id} className={`card p-8 ${
                  isDark ? 'bg-gray-800' : 'bg-white'
                }`}>
                  <div className="flex items-center mb-6">
                    <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[method.color]} rounded-lg flex items-center justify-center mr-4`}>
                      <Icon className="text-white" size={24} />
                    </div>
                    <h3 className={`text-2xl font-bold ${
                      isDark ? 'text-white' : 'text-gray-800'
                    }`}>{method.title}</h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {method.methods.map((paymentMethod, index) => (
                      <div key={index} className={`p-6 rounded-lg border ${
                        isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <h4 className={`text-lg font-semibold mb-4 ${
                          isDark ? 'text-white' : 'text-gray-800'
                        }`}>{paymentMethod.name}</h4>
                        
                        {/* Account Details */}
                        <div className="space-y-3 mb-4">
                          {paymentMethod.number && (
                            <div className="flex items-center justify-between">
                              <span className={`text-sm ${
                                isDark ? 'text-gray-300' : 'text-gray-600'
                              }`}>Nambari:</span>
                              <div className="flex items-center">
                                <span className={`font-mono ${
                                  isDark ? 'text-white' : 'text-gray-800'
                                }`}>{paymentMethod.number}</span>
                                <button
                                  onClick={() => copyToClipboard(paymentMethod.number, `${paymentMethod.name} Number`)}
                                  className="ml-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                                >
                                  {copiedText === `${paymentMethod.name} Number` ? 
                                    <CheckCircle className="text-green-600" size={16} /> : 
                                    <Copy className={isDark ? 'text-gray-400' : 'text-gray-500'} size={16} />
                                  }
                                </button>
                              </div>
                            </div>
                          )}
                          
                          {paymentMethod.accountNumber && (
                            <div className="flex items-center justify-between">
                              <span className={`text-sm ${
                                isDark ? 'text-gray-300' : 'text-gray-600'
                              }`}>Account:</span>
                              <div className="flex items-center">
                                <span className={`font-mono ${
                                  isDark ? 'text-white' : 'text-gray-800'
                                }`}>{paymentMethod.accountNumber}</span>
                                <button
                                  onClick={() => copyToClipboard(paymentMethod.accountNumber, `${paymentMethod.name} Account`)}
                                  className="ml-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                                >
                                  {copiedText === `${paymentMethod.name} Account` ? 
                                    <CheckCircle className="text-green-600" size={16} /> : 
                                    <Copy className={isDark ? 'text-gray-400' : 'text-gray-500'} size={16} />
                                  }
                                </button>
                              </div>
                            </div>
                          )}

                          {paymentMethod.accountName && (
                            <div className="flex items-center justify-between">
                              <span className={`text-sm ${
                                isDark ? 'text-gray-300' : 'text-gray-600'
                              }`}>Name:</span>
                              <span className={`font-semibold ${
                                isDark ? 'text-white' : 'text-gray-800'
                              }`}>{paymentMethod.accountName}</span>
                            </div>
                          )}

                          {paymentMethod.controlNumber && (
                            <div className="flex items-center justify-between">
                              <span className={`text-sm ${
                                isDark ? 'text-gray-300' : 'text-gray-600'
                              }`}>Control Number:</span>
                              <div className="flex items-center">
                                <span className={`font-mono text-lg font-bold ${
                                  isDark ? 'text-white' : 'text-gray-800'
                                }`}>{paymentMethod.controlNumber}</span>
                                <button
                                  onClick={() => copyToClipboard(paymentMethod.controlNumber, 'Control Number')}
                                  className="ml-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                                >
                                  {copiedText === 'Control Number' ? 
                                    <CheckCircle className="text-green-600" size={16} /> : 
                                    <Copy className={isDark ? 'text-gray-400' : 'text-gray-500'} size={16} />
                                  }
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Instructions */}
                        <div>
                          <h5 className={`text-sm font-semibold mb-2 ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}>Maelekezo:</h5>
                          <ol className={`text-xs space-y-1 ${
                            isDark ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {paymentMethod.instructions.map((instruction, i) => (
                              <li key={i} className="flex">
                                <span className="mr-2">{i + 1}.</span>
                                <span>{instruction}</span>
                              </li>
                            ))}
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
        <section className={`mt-12 text-center card p-8 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <Heart className="text-red-500 mx-auto mb-4" size={48} />
          <h2 className={`text-2xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>Asante kwa Mchango Wako!</h2>
          <p className={`text-lg mb-6 max-w-2xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Kila mchango, mdogo au mkubwa, unasaidia kueneza neno la Mungu na kuimarisha jamii yetu ya imani. 
            Mungu akubariki kwa ukarimu wako.
          </p>
          <div className={`p-4 rounded-lg ${
            isDark ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200'
          }`}>
            <p className="text-green-700 dark:text-green-300 font-medium">
              "Kila mmoja na atoe kama alivyoamua moyoni mwake, si kwa huzuni wala kwa kulazimishwa; 
              kwa maana Mungu ampenda mtoaji mwenye furaha." - 2 Wakorintho 9:7
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}