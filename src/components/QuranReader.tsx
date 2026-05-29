import { useState, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Menu, X, BookOpen } from 'lucide-react';
import type { Surah, SurahDetail } from '../types';
import SurahList from './SurahList';
import AudioPlayer from './AudioPlayer';

export default function QuranReader() {
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [surahDetail, setSurahDetail] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [showList, setShowList] = useState(true);
  const [showMobileList, setShowMobileList] = useState(false);
  const [fontSize, setFontSize] = useState(22); // px
  const contentRef = useRef<HTMLDivElement>(null);

  const fetchSurah = useCallback((surah: Surah) => {
    setLoading(true);
    setSurahDetail(null);
    // Use quran-uthmani for proper mushaf script
    fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/quran-uthmani`)
      .then(r => r.json())
      .then(data => {
        setSurahDetail(data.data);
        setLoading(false);
        contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSelectSurah = (surah: Surah) => {
    setSelectedSurah(surah);
    fetchSurah(surah);
    setShowMobileList(false);
  };

  const navigateSurah = (dir: 'prev' | 'next') => {
    if (!selectedSurah) return;
    const n = dir === 'prev' ? selectedSurah.number - 1 : selectedSurah.number + 1;
    if (n < 1 || n > 114) return;
    const s = { ...selectedSurah, number: n };
    setSelectedSurah(s);
    fetchSurah(s);
  };

  return (
    <div className="flex h-full relative overflow-hidden">

      {/* Mobile drawer */}
      {showMobileList && (
        <div className="absolute inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowMobileList(false)} />
          <div className="relative w-4/5 max-w-sm h-full shadow-2xl flex flex-col mr-auto"
            style={{ background: '#0d1526', borderLeft: '1px solid rgba(212,175,55,0.15)' }}>
            <div className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: '1px solid rgba(212,175,55,0.15)', background: '#080d18' }}>
              <button onClick={() => setShowMobileList(false)}>
                <X size={22} style={{ color: '#d4af37' }} />
              </button>
              <span className="font-bold text-base" style={{ fontFamily:'Amiri,serif', color:'#d4af37' }}>قائمة السور</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <SurahList onSelectSurah={handleSelectSurah} selectedSurah={selectedSurah} />
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar – hidden on mobile */}
      <div className={`hidden md:flex flex-col transition-all duration-300 ${showList ? 'w-72' : 'w-0 overflow-hidden'}`}
        style={{ borderLeft: '1px solid rgba(212,175,55,0.15)', background: '#0d1526' }}>
        <SurahList onSelectSurah={handleSelectSurah} selectedSurah={selectedSurah} />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#080d18' }}>

        {/* Toolbar */}
        <div className="flex items-center gap-2 px-3 py-2 flex-shrink-0"
          style={{ background: '#0d1526', borderBottom: '1px solid rgba(212,175,55,0.12)' }}>
          <button onClick={() => { setShowList(!showList); setShowMobileList(true); }}
            className="md:hidden p-1.5 rounded-lg" style={{ color: '#d4af37' }}>
            <Menu size={20} />
          </button>
          <button onClick={() => setShowList(!showList)}
            className="hidden md:flex p-1.5 rounded-lg" style={{ color: '#d4af37' }}>
            <BookOpen size={18} />
          </button>

          {selectedSurah ? (
            <>
              <button onClick={() => navigateSurah('prev')} disabled={selectedSurah.number <= 1}
                className="p-1 rounded-lg disabled:opacity-30" style={{ color: '#d4af37' }}>
                <ChevronLeft size={18} />
              </button>
              <div className="flex-1 text-center">
                <span className="font-bold text-base" style={{ fontFamily:'Amiri,serif', color:'#f0e6c8' }}>{selectedSurah.name}</span>
                <span className="text-xs mx-1.5" style={{ color:'rgba(212,175,55,0.4)' }}>·</span>
                <span className="text-xs" style={{ color:'#6b7280' }}>{selectedSurah.numberOfAyahs} آية</span>
              </div>
              <button onClick={() => navigateSurah('next')} disabled={selectedSurah.number >= 114}
                className="p-1 rounded-lg disabled:opacity-30" style={{ color: '#d4af37' }}>
                <ChevronRight size={18} />
              </button>
            </>
          ) : (
            <div className="flex-1 text-center text-sm" style={{ color: 'rgba(212,175,55,0.6)' }}>اختر سورة</div>
          )}

          {/* Font controls */}
          <div className="flex items-center gap-0.5 rounded-lg overflow-hidden"
            style={{ border: '1px solid rgba(212,175,55,0.2)', background: 'rgba(212,175,55,0.05)' }}>
            <button onClick={() => setFontSize(s => Math.max(16, s - 2))}
              className="px-2 py-1 text-sm font-bold" style={{ color: '#d4af37' }}>−</button>
            <button onClick={() => setFontSize(s => Math.min(38, s + 2))}
              className="px-2 py-1 text-sm font-bold" style={{ color: '#d4af37' }}>+</button>
          </div>
        </div>

        {/* Quran content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto">
          {!selectedSurah && !loading && (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 gap-5">
              <div className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}>
                <span style={{ fontSize: '2.8rem' }}>📖</span>
              </div>
              <h2 className="text-3xl font-bold" style={{ fontFamily:'Amiri,serif', color:'#d4af37' }}>القرآن الكريم</h2>
              <p className="text-sm" style={{ color:'#6b7280' }}>اختر سورة من القائمة لتبدأ القراءة</p>
              <button onClick={() => setShowMobileList(true)}
                className="md:hidden px-8 py-3 rounded-2xl font-bold shadow-lg"
                style={{ background: 'linear-gradient(135deg,#d4af37,#b8960c)', color: '#080d18' }}>
                اختر سورة
              </button>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center h-40">
              <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: 'rgba(212,175,55,0.3)', borderTopColor: '#d4af37' }} />
            </div>
          )}

          {surahDetail && !loading && (
            <div className="mx-auto px-4 py-6 max-w-2xl">

              {/* Surah header */}
              <div className="text-center mb-6">
                <div className="inline-block rounded-2xl px-8 py-3"
                  style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)' }}>
                  <p className="font-bold text-2xl" style={{ fontFamily:'Amiri,serif', color:'#d4af37', letterSpacing:'0.05em' }}>
                    سُورَةُ {surahDetail.name}
                  </p>
                  <div className="flex items-center justify-center gap-4 mt-1">
                    <span className="text-xs" style={{ color:'rgba(212,175,55,0.6)' }}>{surahDetail.numberOfAyahs} آية</span>
                    <span className="text-xs" style={{ color:'rgba(212,175,55,0.3)' }}>·</span>
                    <span className="text-xs" style={{ color:'rgba(212,175,55,0.6)' }}>{surahDetail.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</span>
                  </div>
                </div>
              </div>

              {/* Bismillah */}
              {surahDetail.number !== 1 && surahDetail.number !== 9 && (
                <div className="text-center mb-6">
                  <p style={{ fontFamily:'Amiri,serif', fontSize:`${fontSize + 4}px`, lineHeight:2.2, color:'#e8d5a3', direction:'rtl', unicodeBidi:'plaintext' }}>
                    بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
                  </p>
                  <div className="w-32 h-px mx-auto mt-2" style={{ background:'rgba(212,175,55,0.2)' }} />
                </div>
              )}

              {/* Mushaf text */}
              <div className="mushaf-text text-right"
                style={{ fontFamily:'Amiri,serif', fontSize:`${fontSize}px`, lineHeight:2.6, color:'#e8d5a3', textAlign:'right', direction:'rtl', unicodeBidi:'plaintext' }}>
                {surahDetail.ayahs.map((ayah, idx) => (
                  <span key={ayah.number} className="ayah-span">
                    {ayah.text}
                    <span className="ayah-num inline-flex items-center justify-center mx-1"
                      style={{ fontFamily:'Amiri,serif', fontSize:`${fontSize - 6}px`, color:'#d4af37', verticalAlign:'middle', lineHeight:1 }}>
                      {' '}﴿{toArabicNum(ayah.numberInSurah)}﴾{' '}
                    </span>
                    {(idx + 1) % 5 === 0 && <span> </span>}
                  </span>
                ))}
              </div>

              {/* Footer decoration */}
              <div className="flex items-center gap-3 mt-8 mb-2">
                <div className="flex-1 h-px" style={{ background:'rgba(212,175,55,0.2)' }} />
                <span style={{ color:'rgba(212,175,55,0.4)', fontSize:'1.2rem' }}>❧</span>
                <div className="flex-1 h-px" style={{ background:'rgba(212,175,55,0.2)' }} />
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-4">
                <button onClick={() => navigateSurah('next')} disabled={selectedSurah?.number === 114}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-30"
                  style={{ background:'rgba(212,175,55,0.1)', color:'#d4af37', border:'1px solid rgba(212,175,55,0.2)' }}>
                  التالية <ChevronRight size={15} />
                </button>
                <button onClick={() => navigateSurah('prev')} disabled={selectedSurah?.number === 1}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-30"
                  style={{ background:'rgba(212,175,55,0.1)', color:'#d4af37', border:'1px solid rgba(212,175,55,0.2)' }}>
                  <ChevronLeft size={15} /> السابقة
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Audio player */}
        <div className="flex-shrink-0 p-2" style={{ background:'#0d1526', borderTop:'1px solid rgba(212,175,55,0.12)' }}>
          <AudioPlayer surah={selectedSurah} />
        </div>
      </div>
    </div>
  );
}

// Convert to Eastern Arabic numerals ١٢٣
function toArabicNum(n: number): string {
  return n.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d]);
}
