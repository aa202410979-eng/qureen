import { useState, useCallback } from 'react';
import { BookOpen, Compass, Star, Heart } from 'lucide-react';
import QuranReader from './components/QuranReader';
import Qibla from './components/Qibla';
import Adhkar from './components/Adhkar';
import Duas from './components/Duas';
import SplashScreen from './components/SplashScreen';

type Tab = 'quran' | 'qibla' | 'adhkar' | 'duas';

const tabs = [
  { id: 'quran' as Tab, label: 'القرآن', icon: BookOpen, color: 'text-emerald-600', activeBg: 'bg-emerald-600', lightBg: 'bg-emerald-50' },
  { id: 'adhkar' as Tab, label: 'الأذكار', icon: Star, color: 'text-blue-600', activeBg: 'bg-blue-600', lightBg: 'bg-blue-50' },
  { id: 'duas' as Tab, label: 'الأدعية', icon: Heart, color: 'text-purple-600', activeBg: 'bg-purple-600', lightBg: 'bg-purple-50' },
  { id: 'qibla' as Tab, label: 'القبلة', icon: Compass, color: 'text-amber-600', activeBg: 'bg-amber-600', lightBg: 'bg-amber-50' },
];

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('quran');
  const handleSplashDone = useCallback(() => setShowSplash(false), []);

  if (showSplash) {
    return <SplashScreen onDone={handleSplashDone} />;
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-gray-50 overflow-hidden" dir="rtl">
      {/* Mobile header */}
      <header className="bg-white border-b border-gray-100 shadow-sm flex-shrink-0 z-40">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <svg width="34" height="34" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="50" fill="#059669"/>
              <rect x="47" y="8" width="6" height="28" rx="3" fill="#d4b483"/>
              <ellipse cx="50" cy="8" rx="4" ry="5" fill="#d4b483"/>
              <path d="M50 4 Q54 2 54 6 Q51 5 50 8 Q49 5 46 6 Q46 2 50 4Z" fill="#d4b483"/>
              <path d="M34 36 Q50 20 66 36Z" fill="#d4b483"/>
              <path d="M20 55 Q35 45 50 50 Q65 45 80 55 L80 82 Q65 72 50 77 Q35 72 20 82Z" fill="#d4b483" opacity="0.9"/>
              <line x1="50" y1="50" x2="50" y2="80" stroke="#059669" strokeWidth="1.5"/>
              <line x1="27" y1="60" x2="46" y2="57" stroke="#059669" strokeWidth="1" opacity="0.6"/>
              <line x1="27" y1="65" x2="46" y2="62" stroke="#059669" strokeWidth="1" opacity="0.6"/>
              <line x1="27" y1="70" x2="46" y2="67" stroke="#059669" strokeWidth="1" opacity="0.6"/>
              <line x1="54" y1="57" x2="73" y2="60" stroke="#059669" strokeWidth="1" opacity="0.6"/>
              <line x1="54" y1="62" x2="73" y2="65" stroke="#059669" strokeWidth="1" opacity="0.6"/>
              <line x1="54" y1="67" x2="73" y2="70" stroke="#059669" strokeWidth="1" opacity="0.6"/>
            </svg>
            <span className="font-bold text-gray-900 text-lg" style={{fontFamily:'Amiri,serif'}}>القرآن</span>
          </div>
          <span className="text-xs text-gray-400">
            {new Date().toLocaleDateString('ar-SA', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        {activeTab === 'quran' && <QuranReader />}
        {activeTab === 'qibla' && <Qibla />}
        {activeTab === 'adhkar' && <Adhkar />}
        {activeTab === 'duas' && <Duas />}
      </main>

      {/* Bottom navigation */}
      <nav className="bg-white border-t border-gray-100 shadow-lg flex-shrink-0 safe-area-bottom z-50">
        <div className="flex">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-all ${
                  isActive ? tab.color : 'text-gray-400'
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-all ${isActive ? tab.lightBg : ''}`}>
                  <Icon size={22} />
                </div>
                <span className="text-xs font-semibold">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
