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
      className="fixed inset-0 flex flex-col items-center justify-between z-[999] overflow-hidden"
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
          {/* Glow ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(212,180,67,0.3) 0%, transparent 70%)',
              transform: 'scale(1.8)',
            }}
          />
          {/* Logo SVG */}
          <div className="relative w-40 h-40 rounded-full flex items-center justify-center shadow-2xl"
            style={{ background: 'linear-gradient(145deg, #059669, #047857)' }}>
            <svg width="110" height="110" viewBox="0 0 100 100" fill="none">
              {/* Minaret */}
              <rect x="47" y="6" width="6" height="26" rx="3" fill="#d4b483"/>
              <ellipse cx="50" cy="6" rx="4.5" ry="5.5" fill="#d4b483"/>
              {/* Crescent */}
              <path d="M50 1 Q55 0 55 5 Q51.5 3.5 50 7 Q48.5 3.5 45 5 Q45 0 50 1Z" fill="#d4b483"/>
              {/* Dome arch */}
              <path d="M32 38 Q50 18 68 38Z" fill="#d4b483"/>
              {/* Open Quran */}
              <path d="M18 54 Q34 43 50 49 Q66 43 82 54 L82 84 Q66 74 50 80 Q34 74 18 84Z"
                fill="#d4b483" opacity="0.92"/>
              <line x1="50" y1="49" x2="50" y2="82" stroke="#059669" strokeWidth="1.5"/>
              {/* Page lines left */}
              <line x1="24" y1="60" x2="46" y2="57" stroke="#059669" strokeWidth="1" opacity="0.55"/>
              <line x1="24" y1="66" x2="46" y2="63" stroke="#059669" strokeWidth="1" opacity="0.55"/>
              <line x1="24" y1="72" x2="46" y2="69" stroke="#059669" strokeWidth="1" opacity="0.55"/>
              {/* Page lines right */}
              <line x1="54" y1="57" x2="76" y2="60" stroke="#059669" strokeWidth="1" opacity="0.55"/>
              <line x1="54" y1="63" x2="76" y2="66" stroke="#059669" strokeWidth="1" opacity="0.55"/>
              <line x1="54" y1="69" x2="76" y2="72" stroke="#059669" strokeWidth="1" opacity="0.55"/>
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
