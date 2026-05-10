import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import type { Surah } from '../types';

interface SurahListProps {
  onSelectSurah: (surah: Surah) => void;
  selectedSurah: Surah | null;
}

export default function SurahList({ onSelectSurah, selectedSurah }: SurahListProps) {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'meccan' | 'medinan'>('all');

  useEffect(() => {
    fetch('https://api.alquran.cloud/v1/surah')
      .then(r => r.json())
      .then(data => {
        setSurahs(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = surahs.filter(s => {
    const matchSearch =
      s.name.includes(search) ||
      s.englishName.toLowerCase().includes(search.toLowerCase()) ||
      s.englishNameTranslation.toLowerCase().includes(search.toLowerCase()) ||
      String(s.number).includes(search);
    const matchFilter =
      filter === 'all' ||
      (filter === 'meccan' && s.revelationType === 'Meccan') ||
      (filter === 'medinan' && s.revelationType === 'Medinan');
    return matchSearch && matchFilter;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-3 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="ابحث عن سورة..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pr-10 pl-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-400 bg-gray-50"
          />
        </div>
        <div className="flex gap-2 mt-2">
          {(['all', 'meccan', 'medinan'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 text-xs py-1 rounded-full transition-colors ${
                filter === f
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {f === 'all' ? 'الكل' : f === 'meccan' ? 'مكية' : 'مدنية'}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          filtered.map(surah => (
            <button
              key={surah.number}
              onClick={() => onSelectSurah(surah)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 border-b border-gray-50 hover:bg-emerald-50 transition-colors text-right ${
                selectedSurah?.number === surah.number ? 'bg-emerald-50 border-r-4 border-r-emerald-500' : ''
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold flex-shrink-0">
                {surah.number}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{surah.englishName}</span>
                  <span className="font-bold text-gray-800 arabic-text text-sm">{surah.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{surah.numberOfAyahs} آية</span>
                  <span className="text-xs text-emerald-600">
                    {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
                  </span>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
