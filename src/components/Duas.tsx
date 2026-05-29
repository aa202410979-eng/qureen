import { useState } from 'react';
import { Heart, Search, Copy, Check, BookOpen, Share2 } from 'lucide-react';
import { duasData, duaCategories } from '../data/duas';

const GOLD = '#d4af37';
const GOLD_DIM = 'rgba(212,175,55,0.1)';
const GOLD_BORDER = 'rgba(212,175,55,0.2)';
const CREAM = '#f0e6c8';
const MUTED = '#6b7280';
const CARD_BG = '#111827';
const PAGE_BG = '#080d18';

const catColors: Record<string, string> = {
  'الصلاة':'rgba(16,185,129,0.15)','الكرب والضيق':'rgba(139,92,246,0.15)','الرزق':'rgba(212,175,55,0.15)',
  'المرض':'rgba(239,68,68,0.15)','السفر':'rgba(59,130,246,0.15)','النوم':'rgba(99,102,241,0.15)',
  'الطعام':'rgba(249,115,22,0.15)','الاستخارة':'rgba(20,184,166,0.15)','القرآن':'rgba(34,197,94,0.15)',
  'الوالدين':'rgba(236,72,153,0.15)',
};
const catText: Record<string, string> = {
  'الصلاة':'#10b981','الكرب والضيق':'#a78bfa','الرزق':GOLD,'المرض':'#f87171',
  'السفر':'#60a5fa','النوم':'#818cf8','الطعام':'#fb923c','الاستخارة':'#2dd4bf','القرآن':'#4ade80','الوالدين':'#f472b6',
};
const catIcons: Record<string,string> = {
  'الصلاة':'🕌','الكرب والضيق':'💙','الرزق':'✨','المرض':'💊','السفر':'✈️','النوم':'🌙','الطعام':'🍽️','الاستخارة':'🤲','القرآن':'📖','الوالدين':'❤️',
};

export default function Duas() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const filtered = duasData.filter(dua => {
    const matchCat = !selectedCategory || dua.category === selectedCategory;
    const matchSearch = !search || dua.title.includes(search) || dua.arabic.includes(search) || dua.category.includes(search);
    return matchCat && matchSearch;
  });

  const copyDua = (arabic: string, id: number) => {
    navigator.clipboard.writeText(arabic);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="h-full overflow-y-auto" style={{ background: PAGE_BG }}>

      {/* Header */}
      <div className="p-5 shadow-lg" style={{ background: 'linear-gradient(180deg,#0d1526 0%,#0a1020 100%)', borderBottom: `1px solid ${GOLD_BORDER}` }}>
        <div className="flex items-center gap-3 mb-1">
          <BookOpen size={24} style={{ color: GOLD }} />
          <h1 className="text-2xl font-bold arabic-text" style={{ color: GOLD }}>الأدعية</h1>
        </div>
        <p className="text-sm mb-4" style={{ color: MUTED }}>مجموعة من الأدعية المأثورة</p>

        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2" size={16} style={{ color: MUTED }} />
          <input type="text" placeholder="ابحث عن دعاء..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 rounded-xl text-sm focus:outline-none"
            style={{ background: GOLD_DIM, color: CREAM, border: `1px solid ${GOLD_BORDER}` }} />
        </div>
      </div>

      {/* Categories */}
      <div className="p-4 pb-0">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button onClick={() => setSelectedCategory(null)}
            className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all"
            style={{
              background: !selectedCategory ? GOLD : GOLD_DIM,
              color: !selectedCategory ? '#080d18' : CREAM,
              border: `1px solid ${!selectedCategory ? GOLD : GOLD_BORDER}`,
            }}>
            الكل ({duasData.length})
          </button>
          {duaCategories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold transition-all"
              style={{
                background: selectedCategory === cat ? GOLD : GOLD_DIM,
                color: selectedCategory === cat ? '#080d18' : CREAM,
                border: `1px solid ${selectedCategory === cat ? GOLD : GOLD_BORDER}`,
              }}>
              <span>{catIcons[cat] || '🤲'}</span>
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Duas list */}
      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        {filtered.length === 0 && (
          <div className="text-center py-12" style={{ color: MUTED }}>
            <div className="text-4xl mb-3">🔍</div>
            <p>لم يتم العثور على نتائج</p>
          </div>
        )}

        {filtered.map(dua => (
          <div key={dua.id} className="rounded-2xl overflow-hidden"
            style={{ background: CARD_BG, border: `1px solid ${GOLD_BORDER}` }}>

            {/* Category + title */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: catColors[dua.category] || GOLD_DIM, color: catText[dua.category] || GOLD }}>
                {catIcons[dua.category]} {dua.category}
              </span>
              <h3 className="font-bold" style={{ color: CREAM }}>{dua.title}</h3>
            </div>

            {/* Arabic */}
            <div className="px-4 pb-3">
              <p className="arabic-text text-right text-lg leading-loose" style={{ color: CREAM }}>{dua.arabic}</p>
            </div>

            {/* Translation */}
            <div className="px-4 pb-3">
              <p className="text-sm text-right leading-relaxed pr-3"
                style={{ color: 'rgba(240,230,200,0.5)', borderRight: `2px solid ${GOLD_BORDER}` }}>
                {dua.translation}
              </p>
            </div>

            {/* Actions */}
            <div className="px-4 py-3 flex items-center justify-between"
              style={{ borderTop: `1px solid ${GOLD_BORDER}`, background: 'rgba(212,175,55,0.03)' }}>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleFavorite(dua.id)}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ color: favorites.has(dua.id) ? '#f87171' : MUTED, background: favorites.has(dua.id) ? 'rgba(239,68,68,0.1)' : 'transparent' }}>
                  <Heart size={16} fill={favorites.has(dua.id) ? 'currentColor' : 'none'} />
                </button>
                <button onClick={() => copyDua(dua.arabic, dua.id)}
                  className="p-1.5 rounded-lg transition-colors" style={{ color: MUTED }}>
                  {copiedId === dua.id ? <Check size={16} style={{ color: '#10b981' }} /> : <Copy size={16} />}
                </button>
                <button onClick={() => navigator.share?.({ text: `${dua.title}\n\n${dua.arabic}` })}
                  className="p-1.5 rounded-lg" style={{ color: MUTED }}>
                  <Share2 size={16} />
                </button>
              </div>
              <span className="text-xs" style={{ color: MUTED }}>{dua.source}</span>
            </div>
          </div>
        ))}

        {favorites.size > 0 && (
          <div className="text-center text-xs py-2" style={{ color: MUTED }}>
            ❤️ {favorites.size} دعاء محفوظ في المفضلة
          </div>
        )}
      </div>
    </div>
  );
}
