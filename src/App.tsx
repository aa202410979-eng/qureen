import { useState } from 'react';
import { BookOpen, Compass, Star, Heart } from 'lucide-react';
import QuranReader from './components/QuranReader';
import Qibla from './components/Qibla';
import Adhkar from './components/Adhkar';
import Duas from './components/Duas';

type Tab = 'quran' | 'qibla' | 'adhkar' | 'duas';

const tabs = [
  { id: 'quran' as Tab, label: 'القرآن', icon: BookOpen, color: 'text-emerald-600', activeBg: 'bg-emerald-600', hoverBg: 'hover:bg-emerald-50' },
  { id: 'adhkar' as Tab, label: 'الأذكار', icon: Star, color: 'text-blue-600', activeBg: 'bg-blue-600', hoverBg: 'hover:bg-blue-50' },
  { id: 'duas' as Tab, label: 'الأدعية', icon: Heart, color: 'text-purple-600', activeBg: 'bg-purple-600', hoverBg: 'hover:bg-purple-50' },
  { id: 'qibla' as Tab, label: 'القبلة', icon: Compass, color: 'text-amber-600', activeBg: 'bg-amber-600', hoverBg: 'hover:bg-amber-50' },
];

const lightBgs: Record<Tab, string> = {
  quran: 'bg-emerald-50',
  adhkar: 'bg-blue-50',
  duas: 'bg-purple-50',
  qibla: 'bg-amber-50',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('quran');

  return (
    <div className="flex flex-col min-h-screen bg-gray-50" dir="rtl">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white text-xl">☽</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-900 leading-tight text-lg">قُرِّين</h1>
              <p className="text-xs text-gray-400">تطبيق القرآن الكريم</p>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                    isActive
                      ? `${tab.activeBg} text-white shadow-sm`
                      : `text-gray-500 ${tab.hoverBg} ${tab.color}`
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          <div className="text-xs text-gray-400 hidden sm:block text-left">
            {new Date().toLocaleDateString('ar-SA', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-6xl mx-auto w-full">
        {activeTab === 'quran' && <QuranReader />}
        {activeTab === 'qibla' && <Qibla />}
        {activeTab === 'adhkar' && <Adhkar />}
        {activeTab === 'duas' && <Duas />}
      </main>

      {/* Mobile bottom navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-50">
        <div className="flex">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-all ${
                  isActive ? tab.color : 'text-gray-400'
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-all ${isActive ? lightBgs[tab.id] : ''}`}>
                  <Icon size={20} />
                </div>
                <span className="text-xs font-semibold">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile bottom padding */}
      <div className="md:hidden h-20" />
    </div>
  );
}
