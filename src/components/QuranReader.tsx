import { useState, useCallback } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Copy, Check, Share2, Menu, X } from 'lucide-react';
import type { Surah, SurahDetail } from '../types';
import SurahList from './SurahList';
import AudioPlayer from './AudioPlayer';

export default function QuranReader() {
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [surahDetail, setSurahDetail] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [showList, setShowList] = useState(true);
  const [showMobileList, setShowMobileList] = useState(false);
  const [copiedAyah, setCopiedAyah] = useState<number | null>(null);
  const [fontSize, setFontSize] = useState(1.6);

  const fetchSurah = useCallback((surah: Surah) => {
    setLoading(true);
    setSurahDetail(null);
    fetch(`https://api.alquran.cloud/v1/surah/${surah.number}`)
      .then(r => r.json())
      .then(data => {
        setSurahDetail(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSelectSurah = (surah: Surah) => {
    setSelectedSurah(surah);
    fetchSurah(surah);
    setShowMobileList(false);
  };

  const navigateSurah = (direction: 'prev' | 'next') => {
    if (!selectedSurah) return;
    const newNum = direction === 'prev' ? selectedSurah.number - 1 : selectedSurah.number + 1;
    if (newNum < 1 || newNum > 114) return;
    const newSurah = { ...selectedSurah, number: newNum };
    setSelectedSurah(newSurah);
    fetchSurah(newSurah);
  };

  const copyAyah = (text: string, num: number) => {
    navigator.clipboard.writeText(text);
    setCopiedAyah(num);
    setTimeout(() => setCopiedAyah(null), 2000);
  };

  return (
    <div className="flex h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)] relative">

      {/* Mobile list overlay */}
      {showMobileList && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileList(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-4/5 max-w-xs bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-emerald-600">
              <button onClick={() => setShowMobileList(false)} className="text-white p-1">
                <X size={22} />
              </button>
              <span className="text-white font-bold text-base">قائمة السور</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <SurahList onSelectSurah={handleSelectSurah} selectedSurah={selectedSurah} />
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className={`hidden md:flex flex-col ${showList ? 'w-72' : 'w-0'} flex-shrink-0 transition-all duration-300 overflow-hidden border-l border-gray-100 bg-white`}>
        <SurahList onSelectSurah={handleSelectSurah} selectedSurah={selectedSurah} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{background: 'linear-gradient(160deg,#fdf6e3 0%,#fef9ee 40%,#fdf3d0 100%)'}}>

        {/* Top bar */}
        <div className="flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur border-b border-amber-100 shadow-sm">
          {/* Desktop: toggle sidebar */}
          <button
            onClick={() => setShowList(!showList)}
            className="hidden md:flex p-2 hover:bg-amber-50 rounded-lg transition-colors"
          >
            <BookOpen size={18} className="text-emerald-600" />
          </button>
          {/* Mobile: open drawer */}
          <button
            onClick={() => setShowMobileList(true)}
            className="md:hidden p-2 hover:bg-amber-50 rounded-lg transition-colors"
          >
            <Menu size={20} className="text-emerald-600" />
          </button>

          {selectedSurah ? (
            <>
              <button
                onClick={() => navigateSurah('prev')}
                disabled={selectedSurah.number <= 1}
                className="p-1.5 hover:bg-amber-100 rounded-lg disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={18} className="text-gray-600" />
              </button>
              <div className="flex-1 text-center">
                <span className="font-bold text-gray-800 text-base sm:text-lg" style={{fontFamily:'Amiri,serif'}}>{selectedSurah.name}</span>
                <span className="text-xs text-gray-400 mx-1.5">·</span>
                <span className="text-xs text-gray-500">{selectedSurah.numberOfAyahs} آية</span>
                <span className="text-xs text-gray-400 mx-1.5 hidden sm:inline">·</span>
                <span className="text-xs text-emerald-600 hidden sm:inline">
                  {selectedSurah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
                </span>
              </div>
              <button
                onClick={() => navigateSurah('next')}
                disabled={selectedSurah.number >= 114}
                className="p-1.5 hover:bg-amber-100 rounded-lg disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={18} className="text-gray-600" />
              </button>
            </>
          ) : (
            <div className="flex-1 text-center text-sm text-gray-400">اختر سورة للقراءة</div>
          )}

          {/* Font size */}
          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-lg px-1.5 py-1">
            <button onClick={() => setFontSize(s => Math.max(1.1, +(s - 0.15).toFixed(2)))} className="text-gray-600 hover:text-gray-900 text-sm font-bold w-5 h-5 flex items-center justify-center">−</button>
            <button onClick={() => setFontSize(s => Math.min(2.8, +(s + 0.15).toFixed(2)))} className="text-gray-600 hover:text-gray-900 text-sm font-bold w-5 h-5 flex items-center justify-center">+</button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto">
          {!selectedSurah && (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="text-7xl mb-5">📖</div>
              <h2 className="text-3xl font-bold text-amber-800 mb-3" style={{fontFamily:'Amiri,serif'}}>القرآن الكريم</h2>
              <p className="text-amber-600 text-sm">اضغط على قائمة السور لتبدأ القراءة</p>
              <button
                onClick={() => setShowMobileList(true)}
                className="md:hidden mt-5 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-transform"
              >
                اختر سورة
              </button>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center h-40">
              <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {surahDetail && !loading && (
            <div className="max-w-2xl mx-auto px-3 sm:px-6 py-5">

              {/* Surah header card */}
              <div className="text-center mb-6 p-4 rounded-2xl shadow-sm" style={{background:'linear-gradient(135deg,#d4a843,#b8860b)'}}>
                <p className="text-white text-xs mb-1 font-semibold tracking-widest opacity-80">
                  {selectedSurah?.revelationType === 'Meccan' ? '— مكية —' : '— مدنية —'}
                </p>
                <p className="text-white text-2xl sm:text-3xl font-bold" style={{fontFamily:'Amiri,serif'}}>{surahDetail.name}</p>
                <p className="text-amber-100 text-xs mt-1">{surahDetail.numberOfAyahs} آية</p>
              </div>

              {/* Bismillah */}
              {surahDetail.number !== 1 && surahDetail.number !== 9 && (
                <div className="text-center mb-5 pb-5 border-b border-amber-200">
                  <p className="text-amber-900" style={{fontFamily:'Amiri,serif', fontSize:`${fontSize + 0.1}rem`, lineHeight:2.5}}>
                    بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
                  </p>
                </div>
              )}

              {/* Ayahs */}
              <div className="space-y-1">
                {surahDetail.ayahs.map(ayah => (
                  <div key={ayah.number} className="group">
                    <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl hover:bg-white/70 transition-all">
                      {/* Ayah number */}
                      <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-amber-100 border border-amber-300 rounded-full flex items-center justify-center text-amber-800 text-xs font-bold mt-1">
                        {ayah.numberInSurah}
                      </div>

                      {/* Text */}
                      <div className="flex-1 text-right">
                        <p
                          className="text-gray-800 leading-loose"
                          style={{fontFamily:'Amiri,serif', fontSize:`${fontSize}rem`, lineHeight:2.8}}
                        >
                          {ayah.text}
                          {' '}
                          <span className="text-amber-600 text-sm">﴿{ayah.numberInSurah}﴾</span>
                        </p>
                      </div>

                      {/* Actions - show on hover desktop, always show on mobile */}
                      <div className="flex-shrink-0 flex flex-col gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => copyAyah(ayah.text, ayah.numberInSurah)}
                          className="p-1.5 hover:bg-amber-100 rounded-lg text-gray-400 hover:text-amber-600 transition-colors"
                        >
                          {copiedAyah === ayah.numberInSurah ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                        </button>
                        <button
                          onClick={() => navigator.share?.({ text: ayah.text })}
                          className="p-1.5 hover:bg-amber-100 rounded-lg text-gray-400 hover:text-amber-600 transition-colors"
                        >
                          <Share2 size={14} />
                        </button>
                      </div>
                    </div>

                    {ayah.sajda && (
                      <div className="mr-9 sm:mr-11 mb-1 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-2 py-0.5 inline-block">
                        ۩ سجدة تلاوة
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Navigation footer */}
              <div className="flex justify-between mt-8 pt-4 border-t border-amber-200">
                <button
                  onClick={() => navigateSurah('next')}
                  disabled={selectedSurah?.number === 114}
                  className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-30 transition-colors text-sm font-bold shadow-sm active:scale-95"
                >
                  التالية <ChevronRight size={16} />
                </button>
                <button
                  onClick={() => navigateSurah('prev')}
                  disabled={selectedSurah?.number === 1}
                  className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-30 transition-colors text-sm font-bold shadow-sm active:scale-95"
                >
                  <ChevronLeft size={16} /> السابقة
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Audio Player */}
        <div className="p-2 sm:p-3 bg-white/80 backdrop-blur border-t border-amber-100">
          <AudioPlayer surah={selectedSurah} />
        </div>
      </div>
    </div>
  );
}
