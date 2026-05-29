import { useState, useCallback } from 'react';
import { BookOpen, Star, Heart } from 'lucide-react';
import QuranReader from './components/QuranReader';
import Adhkar from './components/Adhkar';
import Duas from './components/Duas';
import SplashScreen from './components/SplashScreen';

type Tab = 'quran' | 'adhkar' | 'duas';

const tabs = [
  { id: 'quran' as Tab,  label: 'القرآن',  icon: BookOpen },
  { id: 'adhkar' as Tab, label: 'الأذكار', icon: Star    },
  { id: 'duas' as Tab,   label: 'الأدعية', icon: Heart   },
];

function AlQuranLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      <circle cx="100" cy="100" r="100" fill="url(#logoGrad)"/>
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0d4f3c"/>
          <stop offset="100%" stopColor="#06352a"/>
        </linearGradient>
      </defs>
      <line x1="97" y1="28" x2="97" y2="80" stroke="#d4af37" strokeWidth="2.2"/>
      <line x1="103" y1="28" x2="103" y2="80" stroke="#d4af37" strokeWidth="2.2"/>
      <path d="M92 50 Q100 38 108 50" fill="none" stroke="#d4af37" strokeWidth="2.2"/>
      <path d="M100 20 Q106 17 106 23 Q103 21 100 24 Q97 21 94 23 Q94 17 100 20Z" fill="#d4af37"/>
      <circle cx="100" cy="27" r="2.5" fill="#d4af37"/>
      <path d="M62 82 A38 38 0 0 1 138 82" fill="none" stroke="#d4af37" strokeWidth="2.5"/>
      <path d="M68 66 Q65 61 68 57 Q66.5 60 70 61.5 Q68 63 68 66Z" fill="#d4af37"/>
      <circle cx="68" cy="67" r="1.6" fill="#d4af37"/>
      <line x1="100" y1="86" x2="44" y2="112" stroke="#d4af37" strokeWidth="2"/>
      <line x1="100" y1="92" x2="44" y2="118" stroke="#d4af37" strokeWidth="2"/>
      <line x1="100" y1="98" x2="45" y2="125" stroke="#d4af37" strokeWidth="2"/>
      <line x1="100" y1="104" x2="47" y2="132" stroke="#d4af37" strokeWidth="2"/>
      <line x1="44" y1="112" x2="47" y2="132" stroke="#d4af37" strokeWidth="2"/>
      <line x1="100" y1="86" x2="156" y2="112" stroke="#d4af37" strokeWidth="2"/>
      <line x1="100" y1="92" x2="156" y2="118" stroke="#d4af37" strokeWidth="2"/>
      <line x1="100" y1="98" x2="155" y2="125" stroke="#d4af37" strokeWidth="2"/>
      <line x1="100" y1="104" x2="153" y2="132" stroke="#d4af37" strokeWidth="2"/>
      <line x1="156" y1="112" x2="153" y2="132" stroke="#d4af37" strokeWidth="2"/>
      <text x="100" y="112" textAnchor="middle" fill="#d4af37" fontSize="18" fontFamily="Amiri, serif" fontWeight="bold">قرآن</text>
    </svg>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('quran');
  const handleSplashDone = useCallback(() => setShowSplash(false), []);

  if (showSplash) return <SplashScreen onDone={handleSplashDone} />;

  return (
    <div className="flex flex-col h-full overflow-hidden" dir="rtl"
      style={{ background: '#080d18', color: '#f0e6c8' }}>

      {/* Header */}
      <header className="flex-shrink-0 z-40"
        style={{ background: 'linear-gradient(180deg,#0d1526 0%,#0a1020 100%)', borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2.5">
            <AlQuranLogo size={36} />
            <div>
              <span className="font-bold text-base" style={{ fontFamily: 'Amiri,serif', color: '#d4af37' }}>القرآن الكريم</span>
            </div>
          </div>
          <span className="text-xs" style={{ color: '#6b7280' }}>
            {new Date().toLocaleDateString('ar-SA', { weekday: 'short', day: 'numeric', month: 'short' })}
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-hidden">
        {activeTab === 'quran'  && <QuranReader />}
        {activeTab === 'adhkar' && <Adhkar />}
        {activeTab === 'duas'   && <Duas />}
      </main>

      {/* Bottom nav */}
      <nav className="flex-shrink-0 safe-area-bottom z-50"
        style={{ background: '#0d1526', borderTop: '1px solid rgba(212,175,55,0.12)' }}>
        <div className="flex">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-all relative">
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-b-full"
                    style={{ background: '#d4af37' }} />
                )}
                <div className="p-1.5 rounded-xl transition-all"
                  style={{ background: active ? 'rgba(212,175,55,0.12)' : 'transparent' }}>
                  <Icon size={22} style={{ color: active ? '#d4af37' : '#4b5563' }} />
                </div>
                <span className="text-xs font-semibold"
                  style={{ color: active ? '#d4af37' : '#4b5563' }}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
