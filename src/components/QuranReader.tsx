import { useState, useCallback } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Copy, Check, Share2 } from 'lucide-react';
import type { Surah, SurahDetail } from '../types';
import SurahList from './SurahList';
import AudioPlayer from './AudioPlayer';

export default function QuranReader() {
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [surahDetail, setSurahDetail] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [showList, setShowList] = useState(true);
  const [copiedAyah, setCopiedAyah] = useState<number | null>(null);
  const [fontSize, setFontSize] = useState(1.5);

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
    if (window.innerWidth < 768) setShowList(false);
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
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar - Surah List */}
      <div className={`${showList ? 'w-72' : 'w-0'} flex-shrink-0 transition-all duration-300 overflow-hidden border-l border-gray-100 bg-white`}>
        <SurahList onSelectSurah={handleSelectSurah} selectedSurah={selectedSurah} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 shadow-sm">
          <button
            onClick={() => setShowList(!showList)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <BookOpen size={20} className="text-emerald-600" />
          </button>

          {selectedSurah && (
            <>
              <button
                onClick={() => navigateSurah('prev')}
                disabled={selectedSurah.number <= 1}
                className="p-1.5 hover:bg-gray-100 rounded-lg disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex-1 text-center">
                <span className="font-bold text-gray-800 arabic-text">{selectedSurah.name}</span>
                <span className="text-xs text-gray-400 mx-2">·</span>
                <span className="text-xs text-gray-500">{selectedSurah.numberOfAyahs} آية</span>
                <span className="text-xs text-gray-400 mx-2">·</span>
                <span className="text-xs text-emerald-600">
                  {selectedSurah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
                </span>
              </div>
              <button
                onClick={() => navigateSurah('next')}
                disabled={selectedSurah.number >= 114}
                className="p-1.5 hover:bg-gray-100 rounded-lg disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          {!selectedSurah && (
            <div className="flex-1 text-center">
              <span className="text-gray-400 text-sm">اختر سورة من القائمة</span>
            </div>
          )}

          {/* Font size */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-2 py-1">
            <button onClick={() => setFontSize(s => Math.max(1, s - 0.1))} className="text-gray-600 hover:text-gray-900 text-sm font-bold">أ-</button>
            <button onClick={() => setFontSize(s => Math.min(2.5, s + 0.1))} className="text-gray-600 hover:text-gray-900 text-sm font-bold">أ+</button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {!selectedSurah && (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="text-6xl mb-4">📖</div>
              <h2 className="text-2xl font-bold text-gray-700 mb-2 arabic-text">القرآن الكريم</h2>
              <p className="text-gray-400">اختر سورة من القائمة للبدء في القراءة</p>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center h-40">
              <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {surahDetail && !loading && (
            <div className="max-w-3xl mx-auto p-6">
              {/* Bismillah */}
              {surahDetail.number !== 1 && surahDetail.number !== 9 && (
                <div className="text-center mb-6 pb-6 border-b border-gray-200">
                  <p className="quran-verse text-gray-700" style={{ fontSize: `${fontSize + 0.3}rem` }}>
                    بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
                  </p>
                </div>
              )}

              {/* Ayahs */}
              <div className="space-y-1">
                {surahDetail.ayahs.map(ayah => (
                  <div key={ayah.number} className="group relative">
                    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all">
                      {/* Ayah number */}
                      <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 text-xs font-bold mt-1">
                        {ayah.numberInSurah}
                      </div>

                      {/* Text */}
                      <div className="flex-1 text-right">
                        <p
                          className="arabic-text text-gray-800 leading-loose"
                          style={{ fontSize: `${fontSize}rem` }}
                        >
                          {ayah.text}
                          {' '}
                          <span className="text-emerald-600 text-sm">
                            ﴿{ayah.numberInSurah}﴾
                          </span>
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex-shrink-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => copyAyah(ayah.text, ayah.numberInSurah)}
                          className="p-1.5 hover:bg-emerald-100 rounded-lg text-gray-400 hover:text-emerald-600 transition-colors"
                          title="نسخ الآية"
                        >
                          {copiedAyah === ayah.numberInSurah ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                        </button>
                        <button
                          onClick={() => navigator.share?.({ text: ayah.text })}
                          className="p-1.5 hover:bg-emerald-100 rounded-lg text-gray-400 hover:text-emerald-600 transition-colors"
                          title="مشاركة"
                        >
                          <Share2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Sajda marker */}
                    {ayah.sajda && (
                      <div className="mr-11 mb-1 text-xs text-amber-600 bg-amber-50 rounded px-2 py-0.5 inline-block">
                        ۩ سجدة تلاوة
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Navigation footer */}
              <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
                <button
                  onClick={() => navigateSurah('next')}
                  disabled={selectedSurah?.number === 114}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 disabled:opacity-30 transition-colors"
                >
                  السورة التالية
                  <ChevronRight size={16} />
                </button>
                <button
                  onClick={() => navigateSurah('prev')}
                  disabled={selectedSurah?.number === 1}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft size={16} />
                  السورة السابقة
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Audio Player */}
        <div className="p-4 bg-white border-t border-gray-100">
          <AudioPlayer surah={selectedSurah} />
        </div>
      </div>
    </div>
  );
}
