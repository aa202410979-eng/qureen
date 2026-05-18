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
    <div className="flex h-[calc(100dvh-56px)] sm:h-[calc(100dvh-64px)] relative overflow-hidden">

      {/* Mobile drawer */}
      {showMobileList && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileList(false)} />
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col mr-auto">
            <div className="flex items-center justify-between px-4 py-3 bg-emerald-700">
              <button onClick={() => setShowMobileList(false)}><X size={22} className="text-white" /></button>
              <span className="text-white font-bold text-base" style={{fontFamily:'Amiri,serif'}}>قائمة السور</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <SurahList onSelectSurah={handleSelectSurah} selectedSurah={selectedSurah} />
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className={`hidden md:flex flex-col transition-all duration-300 border-l border-amber-200 bg-white ${showList ? 'w-72' : 'w-0 overflow-hidden'}`}>
        <SurahList onSelectSurah={handleSelectSurah} selectedSurah={selectedSurah} />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{background:'linear-gradient(170deg,#fdf8ed 0%,#fef6e0 60%,#fdf0cc 100%)'}}>

        {/* Toolbar */}
        <div className="flex items-center gap-2 px-3 py-2 bg-amber-50/80 backdrop-blur border-b border-amber-200 shadow-sm flex-shrink-0">
          <button onClick={() => { setShowList(!showList); setShowMobileList(true); }} className="md:hidden p-1.5 hover:bg-amber-100 rounded-lg">
            <Menu size={20} className="text-emerald-700" />
          </button>
          <button onClick={() => setShowList(!showList)} className="hidden md:flex p-1.5 hover:bg-amber-100 rounded-lg">
            <BookOpen size={18} className="text-emerald-700" />
          </button>

          {selectedSurah ? (
            <>
              <button onClick={() => navigateSurah('prev')} disabled={selectedSurah.number <= 1} className="p-1 hover:bg-amber-100 rounded-lg disabled:opacity-30">
                <ChevronLeft size={18} className="text-gray-600" />
              </button>
              <div className="flex-1 text-center">
                <span className="font-bold text-amber-900 text-base sm:text-lg" style={{fontFamily:'Amiri,serif'}}>{selectedSurah.name}</span>
                <span className="text-gray-400 text-xs mx-1.5">·</span>
                <span className="text-gray-500 text-xs">{selectedSurah.numberOfAyahs} آية</span>
              </div>
              <button onClick={() => navigateSurah('next')} disabled={selectedSurah.number >= 114} className="p-1 hover:bg-amber-100 rounded-lg disabled:opacity-30">
                <ChevronRight size={18} className="text-gray-600" />
              </button>
            </>
          ) : (
            <div className="flex-1 text-center text-sm text-amber-700">اختر سورة</div>
          )}

          {/* Font controls */}
          <div className="flex items-center gap-0.5 bg-amber-100 border border-amber-300 rounded-lg overflow-hidden">
            <button onClick={() => setFontSize(s => Math.max(16, s - 2))} className="px-2 py-1 text-amber-800 hover:bg-amber-200 text-sm font-bold">−</button>
            <button onClick={() => setFontSize(s => Math.min(38, s + 2))} className="px-2 py-1 text-amber-800 hover:bg-amber-200 text-sm font-bold">+</button>
          </div>
        </div>

        {/* Quran content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto">
          {!selectedSurah && !loading && (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 gap-4">
              <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center">
                <span className="text-5xl">📖</span>
              </div>
              <h2 className="text-3xl text-amber-800 font-bold" style={{fontFamily:'Amiri,serif'}}>القرآن الكريم</h2>
              <p className="text-amber-600 text-sm">اختر سورة من القائمة لتبدأ القراءة</p>
              <button onClick={() => setShowMobileList(true)} className="md:hidden px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg">
                اختر سورة
              </button>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center h-40">
              <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {surahDetail && !loading && (
            <div className="mushaf-page mx-auto px-4 sm:px-8 py-6 max-w-2xl">

              {/* Surah header */}
              <div className="mushaf-header text-center mb-5">
                <div className="inline-block border-2 border-amber-400 rounded-xl px-8 py-3"
                  style={{background:'linear-gradient(135deg,#c8960c,#a07208)', boxShadow:'0 2px 12px rgba(160,114,8,0.3)'}}>
                  <p className="text-white font-bold text-2xl sm:text-3xl" style={{fontFamily:'Amiri,serif', letterSpacing:'0.05em'}}>
                    سُورَةُ {surahDetail.name}
                  </p>
                  <div className="flex items-center justify-center gap-4 mt-1">
                    <span className="text-amber-200 text-xs">{surahDetail.numberOfAyahs} آية</span>
                    <span className="text-amber-300 text-xs">·</span>
                    <span className="text-amber-200 text-xs">{surahDetail.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</span>
                  </div>
                </div>
              </div>

              {/* Bismillah */}
              {surahDetail.number !== 1 && surahDetail.number !== 9 && (
                <div className="text-center mb-5">
                  <p className="text-amber-900" style={{
                    fontFamily:'Amiri,serif',
                    fontSize: `${fontSize + 4}px`,
                    lineHeight: 2.2,
                    letterSpacing: '0.02em',
                  }}>
                    بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
                  </p>
                  <div className="w-32 h-px bg-amber-300 mx-auto mt-2" />
                </div>
              )}

              {/* Mushaf text - all ayahs flow together like a real page */}
              <div
                className="mushaf-text text-right leading-loose"
                style={{
                  fontFamily: 'Amiri, serif',
                  fontSize: `${fontSize}px`,
                  lineHeight: 2.4,
                  color: '#2d1a00',
                  wordSpacing: '0.12em',
                  textAlign: 'justify',
                  textAlignLast: 'right',
                }}
              >
                {surahDetail.ayahs.map((ayah, idx) => (
                  <span key={ayah.number} className="ayah-span">
                    {ayah.text}
                    {/* Ayah number in Arabic-style circle */}
                    <span
                      className="ayah-num inline-flex items-center justify-center mx-1"
                      style={{
                        fontFamily: 'Amiri, serif',
                        fontSize: `${fontSize - 6}px`,
                        color: '#8B6914',
                        verticalAlign: 'middle',
                        lineHeight: 1,
                      }}
                    >
                      {' '}﴿{toArabicNum(ayah.numberInSurah)}﴾{' '}
                    </span>
                    {/* Extra space between every ~5 ayahs for readability */}
                    {(idx + 1) % 5 === 0 && <span> </span>}
                  </span>
                ))}
              </div>

              {/* Page footer decoration */}
              <div className="flex items-center gap-3 mt-8 mb-2">
                <div className="flex-1 h-px bg-amber-300" />
                <span className="text-amber-500 text-lg">❧</span>
                <div className="flex-1 h-px bg-amber-300" />
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => navigateSurah('next')}
                  disabled={selectedSurah?.number === 114}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 text-white rounded-xl hover:bg-emerald-800 disabled:opacity-30 text-sm font-bold shadow active:scale-95 transition-transform"
                >
                  التالية <ChevronRight size={15} />
                </button>
                <button
                  onClick={() => navigateSurah('prev')}
                  disabled={selectedSurah?.number === 1}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 text-white rounded-xl hover:bg-emerald-800 disabled:opacity-30 text-sm font-bold shadow active:scale-95 transition-transform"
                >
                  <ChevronLeft size={15} /> السابقة
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Audio player */}
        <div className="flex-shrink-0 p-2 sm:p-3 bg-white/60 backdrop-blur border-t border-amber-200">
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
