import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onDone: () => void;
}

export default function SplashScreen({ onDone }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const DURATION = 7000;

  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(pct);
      if (elapsed >= DURATION) {
        clearInterval(timer);
        setFadeOut(true);
        setTimeout(onDone, 600);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [onDone]);

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-between z-[999] overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #064e3b 0%, #065f46 40%, #047857 70%, #065f46 100%)',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.6s ease',
      }}
    >
      {/* Top decoration */}
      <div className="w-full flex justify-between px-6 pt-12 opacity-20">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="text-amber-300 text-2xl" style={{ animationDelay: `${i * 0.15}s` }}>
            ✦
          </div>
        ))}
      </div>

      {/* Center content */}
      <div className="flex flex-col items-center gap-6 px-8">
        {/* Logo */}
        <div className="relative">
          {/* Logo SVG */}
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg width="176" height="176" viewBox="0 0 200 200" fill="none">
              {/* Minaret body – two thin vertical lines */}
              <line x1="97" y1="28" x2="97" y2="80" stroke="#d4b483" strokeWidth="2.2"/>
              <line x1="103" y1="28" x2="103" y2="80" stroke="#d4b483" strokeWidth="2.2"/>
              {/* Minaret arch */}
              <path d="M92 50 Q100 38 108 50" fill="none" stroke="#d4b483" strokeWidth="2.2"/>
              {/* Crescent at top of minaret */}
              <path d="M100 20 Q106 17 106 23 Q103 21 100 24 Q97 21 94 23 Q94 17 100 20Z" fill="#d4b483"/>
              {/* Ball under crescent */}
              <circle cx="100" cy="27" r="2.5" fill="#d4b483"/>
              {/* Dome – circle outline */}
              <path d="M62 82 A38 38 0 0 1 138 82" fill="none" stroke="#d4b483" strokeWidth="2.5"/>
              {/* Small crescent on dome (left) */}
              <path d="M68 66 Q65 61 68 57 Q66.5 60 70 61.5 Q68 63 68 66Z" fill="#d4b483"/>
              <circle cx="68" cy="67" r="1.6" fill="#d4b483"/>
              {/* Open Quran – left wing */}
              <line x1="100" y1="86" x2="44" y2="112" stroke="#d4b483" strokeWidth="2"/>
              <line x1="100" y1="92" x2="44" y2="118" stroke="#d4b483" strokeWidth="2"/>
              <line x1="100" y1="98" x2="45" y2="125" stroke="#d4b483" strokeWidth="2"/>
              <line x1="100" y1="104" x2="47" y2="132" stroke="#d4b483" strokeWidth="2"/>
              <line x1="44" y1="112" x2="47" y2="132" stroke="#d4b483" strokeWidth="2"/>
              {/* Open Quran – right wing */}
              <line x1="100" y1="86" x2="156" y2="112" stroke="#d4b483" strokeWidth="2"/>
              <line x1="100" y1="92" x2="156" y2="118" stroke="#d4b483" strokeWidth="2"/>
              <line x1="100" y1="98" x2="155" y2="125" stroke="#d4b483" strokeWidth="2"/>
              <line x1="100" y1="104" x2="153" y2="132" stroke="#d4b483" strokeWidth="2"/>
              <line x1="156" y1="112" x2="153" y2="132" stroke="#d4b483" strokeWidth="2"/>
              {/* Arabic "قرآن" calligraphy */}
              <text x="100" y="112" textAnchor="middle" fill="#d4b483" fontSize="18" fontFamily="Amiri, serif" fontWeight="bold">قرآن</text>
            </svg>
          </div>
        </div>

        {/* App name */}
        <div className="text-center">
          <h1
            className="text-white font-bold text-5xl mb-2"
            style={{ fontFamily: 'Amiri, serif', textShadow: '0 2px 12px rgba(0,0,0,0.3)', letterSpacing: '0.04em' }}
          >
            القرآن
          </h1>
          <div className="flex items-center gap-3 justify-center">
            <div className="w-12 h-px bg-amber-400 opacity-60" />
            <span className="text-amber-300 text-sm tracking-widest font-semibold">AL QURAN</span>
            <div className="w-12 h-px bg-amber-400 opacity-60" />
          </div>
          <p className="text-emerald-200 text-sm mt-3 opacity-80" style={{ fontFamily: 'Cairo, sans-serif' }}>
            اقرأ • استمع • تذكّر
          </p>
        </div>

        {/* Decorative ayah */}
        <div className="text-center px-4 mt-2">
          <p className="text-amber-200 opacity-70 leading-loose" style={{ fontFamily: 'Amiri, serif', fontSize: '1.1rem' }}>
            ﴿ إِنَّ هَذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ ﴾
          </p>
          <p className="text-emerald-300 text-xs mt-1 opacity-60">سورة الإسراء: ٩</p>
        </div>
      </div>

      {/* Bottom: progress bar */}
      <div className="w-full px-8 pb-14">
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #d4b483, #f0d080)',
              transition: 'width 0.05s linear',
            }}
          />
        </div>
        <p className="text-center text-emerald-300 text-xs mt-3 opacity-50">
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </p>
      </div>
    </div>
  );
}
