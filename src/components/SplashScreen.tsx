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
      setProgress(Math.min((elapsed / DURATION) * 100, 100));
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
        background: 'linear-gradient(160deg, #04080f 0%, #080d18 40%, #0d1526 70%, #080d18 100%)',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.6s ease',
      }}
    >
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div key={i} className="absolute rounded-full"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              background: `rgba(212,175,55,${Math.random() * 0.6 + 0.2})`,
              top: `${Math.random() * 60}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Top ornament */}
      <div className="w-full flex justify-between px-8 pt-12" style={{ opacity: 0.25 }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="text-2xl" style={{ color: '#d4af37' }}>✦</div>
        ))}
      </div>

      {/* Center */}
      <div className="flex flex-col items-center gap-7 px-8">
        {/* Logo on dark circle with gold ring */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)',
              transform: 'scale(2)',
            }} />
          <div className="relative w-44 h-44 rounded-full flex items-center justify-center"
            style={{ border: '2px solid rgba(212,175,55,0.3)', background: 'rgba(13,21,38,0.8)' }}>
            <svg width="170" height="170" viewBox="0 0 200 200" fill="none">
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
          </div>
        </div>

        {/* Name */}
        <div className="text-center">
          <h1 className="font-bold text-5xl mb-2"
            style={{ fontFamily: 'Amiri,serif', color: '#d4af37', textShadow: '0 0 30px rgba(212,175,55,0.4)', letterSpacing: '0.04em' }}>
            القرآن الكريم
          </h1>
          <div className="flex items-center gap-3 justify-center mb-3">
            <div className="w-10 h-px" style={{ background: 'rgba(212,175,55,0.4)' }} />
            <span className="text-xs tracking-widest font-semibold" style={{ color: 'rgba(212,175,55,0.7)' }}>AL QURAN</span>
            <div className="w-10 h-px" style={{ background: 'rgba(212,175,55,0.4)' }} />
          </div>
          <p className="text-sm" style={{ fontFamily: 'Cairo,sans-serif', color: 'rgba(240,230,200,0.5)' }}>
            اقرأ • استمع • تذكّر
          </p>
        </div>

        {/* Ayah */}
        <div className="text-center px-4">
          <p className="leading-loose" style={{ fontFamily: 'Amiri,serif', fontSize: '1.05rem', color: 'rgba(212,175,55,0.6)' }}>
            ﴿ إِنَّ هَذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ ﴾
          </p>
          <p className="text-xs mt-1" style={{ color: 'rgba(240,230,200,0.35)' }}>سورة الإسراء: ٩</p>
        </div>
      </div>

      {/* Progress */}
      <div className="w-full px-8 pb-14">
        <div className="w-full h-px rounded-full overflow-hidden" style={{ background: 'rgba(212,175,55,0.1)' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#d4af37,#f0d060)' }} />
        </div>
        <p className="text-center text-xs mt-3" style={{ color: 'rgba(212,175,55,0.35)' }}>
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </p>
      </div>
    </div>
  );
}
