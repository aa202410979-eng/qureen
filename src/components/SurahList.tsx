import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import type { Surah } from '../types';

interface SurahListProps {
  onSelectSurah: (surah: Surah) => void;
  selectedSurah: Surah | null;
}

const GOLD = '#d4af37';
const GOLD_DIM = 'rgba(212,175,55,0.1)';
const GOLD_BORDER = 'rgba(212,175,55,0.15)';

export default function SurahList({ onSelectSurah, selectedSurah }: SurahListProps) {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'meccan' | 'medinan'>('all');

  useEffect(() => {
    fetch('https://api.alquran.cloud/v1/surah')
      .then(r => r.json())
      .then(data => { setSurahs(data.data); setLoading(false); })
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
    <div className="flex flex-col h-full" style={{ background: '#0d1526' }}>
      {/* Search */}
      <div className="p-3" style={{ borderBottom: `1px solid ${GOLD_BORDER}` }}>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2" size={16} style={{ color: 'rgba(212,175,55,0.4)' }} />
          <input type="text" placeholder="ابحث عن سورة..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pr-10 pl-3 py-2 text-sm rounded-lg focus:outline-none"
            style={{ background: GOLD_DIM, color: '#f0e6c8', border: `1px solid ${GOLD_BORDER}` }} />
        </div>
        <div className="flex gap-2 mt-2">
          {(['all', 'meccan', 'medinan'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="flex-1 text-xs py-1 rounded-full transition-colors"
              style={{
                background: filter === f ? GOLD : GOLD_DIM,
                color: filter === f ? '#080d18' : 'rgba(212,175,55,0.6)',
                border: `1px solid ${filter === f ? GOLD : GOLD_BORDER}`,
              }}>
              {f === 'all' ? 'الكل' : f === 'meccan' ? 'مكية' : 'مدنية'}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: 'rgba(212,175,55,0.2)', borderTopColor: GOLD }} />
          </div>
        ) : (
          filtered.map(surah => {
            const isActive = selectedSurah?.number === surah.number;
            return (
              <button key={surah.number} onClick={() => onSelectSurah(surah)}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-right transition-colors"
                style={{
                  borderBottom: `1px solid ${GOLD_BORDER}`,
                  borderRight: isActive ? `3px solid ${GOLD}` : '3px solid transparent',
                  background: isActive ? GOLD_DIM : 'transparent',
                }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: isActive ? GOLD : 'rgba(212,175,55,0.08)', color: isActive ? '#080d18' : GOLD }}>
                  {surah.number}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: 'rgba(107,114,128,1)' }}>{surah.englishName}</span>
                    <span className="font-bold arabic-text text-sm" style={{ color: isActive ? GOLD : '#f0e6c8' }}>{surah.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: '#4b5563' }}>{surah.numberOfAyahs} آية</span>
                    <span className="text-xs" style={{ color: 'rgba(212,175,55,0.5)' }}>
                      {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
                    </span>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
