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

function AlQuranLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="100" fill="#0d6b56"/>
      {/* Minaret body – two thin vertical lines */}
      <line x1="97" y1="28" x2="97" y2="80" stroke="#d4b483" strokeWidth="2.2"/>
      <line x1="103" y1="28" x2="103" y2="80" stroke="#d4b483" strokeWidth="2.2"/>
      {/* Minaret arch */}
      <path d="M92 50 Q100 38 108 50" fill="none" stroke="#d4b483" strokeWidth="2.2"/>
      {/* Crescent at top of minaret */}
      <path d="M100 20 Q106 17 106 23 Q103 21 100 24 Q97 21 94 23 Q94 17 100 20Z" fill="#d4b483"/>
      {/* Ball under crescent */}
      <circle cx="100" cy="27" r="2.5" fill="#d4b483"/>
      {/* Dome – circle outline, open at bottom */}
      <path d="M62 82 A38 38 0 0 1 138 82" fill="none" stroke="#d4b483" strokeWidth="2.5"/>
      {/* Small crescent on dome (left) */}
      <path d="M68 66 Q65 61 68 57 Q66.5 60 70 61.5 Q68 63 68 66Z" fill="#d4b483"/>
      <circle cx="68" cy="67" r="1.6" fill="#d4b483"/>
      {/* Open Quran – left wing: 4 parallel lines spreading lower-left */}
      <line x1="100" y1="86" x2="44" y2="112" stroke="#d4b483" strokeWidth="2"/>
      <line x1="100" y1="92" x2="44" y2="118" stroke="#d4b483" strokeWidth="2"/>
      <line x1="100" y1="98" x2="45" y2="125" stroke="#d4b483" strokeWidth="2"/>
      <line x1="100" y1="104" x2="47" y2="132" stroke="#d4b483" strokeWidth="2"/>
      {/* Left wing outer edge */}
      <line x1="44" y1="112" x2="47" y2="132" stroke="#d4b483" strokeWidth="2"/>
      {/* Open Quran – right wing: mirror */}
      <line x1="100" y1="86" x2="156" y2="112" stroke="#d4b483" strokeWidth="2"/>
      <line x1="100" y1="92" x2="156" y2="118" stroke="#d4b483" strokeWidth="2"/>
      <line x1="100" y1="98" x2="155" y2="125" stroke="#d4b483" strokeWidth="2"/>
      <line x1="100" y1="104" x2="153" y2="132" stroke="#d4b483" strokeWidth="2"/>
      {/* Right wing outer edge */}
      <line x1="156" y1="112" x2="153" y2="132" stroke="#d4b483" strokeWidth="2"/>
      {/* Arabic "قرآن" calligraphy at the center intersection */}
      <text x="100" y="112" textAnchor="middle" fill="#d4b483" fontSize="18" fontFamily="Amiri, serif" fontWeight="bold">قرآن</text>
    </svg>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('quran');
  const handleSplashDone = useCallback(() => setShowSplash(false), []);

  if (showSplash) {
    return <SplashScreen onDone={handleSplashDone} />;
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden" dir="rtl">
      {/* Mobile header */}
      <header className="bg-white border-b border-gray-100 shadow-sm flex-shrink-0 z-40">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <AlQuranLogo size={36} />
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
