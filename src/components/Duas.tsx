import { useState } from 'react';
import { Heart, Search, Copy, Check, BookOpen, Share2 } from 'lucide-react';
import { duasData, duaCategories } from '../data/duas';

const categoryColors: Record<string, string> = {
  'الصلاة': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'الكرب والضيق': 'bg-purple-100 text-purple-700 border-purple-200',
  'الرزق': 'bg-amber-100 text-amber-700 border-amber-200',
  'المرض': 'bg-red-100 text-red-700 border-red-200',
  'السفر': 'bg-blue-100 text-blue-700 border-blue-200',
  'النوم': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'الطعام': 'bg-orange-100 text-orange-700 border-orange-200',
  'الاستخارة': 'bg-teal-100 text-teal-700 border-teal-200',
  'القرآن': 'bg-green-100 text-green-700 border-green-200',
  'الوالدين': 'bg-pink-100 text-pink-700 border-pink-200',
};

const categoryIcons: Record<string, string> = {
  'الصلاة': '🕌',
  'الكرب والضيق': '💙',
  'الرزق': '✨',
  'المرض': '💊',
  'السفر': '✈️',
  'النوم': '🌙',
  'الطعام': '🍽️',
  'الاستخارة': '🤲',
  'القرآن': '📖',
  'الوالدين': '❤️',
};

export default function Duas() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const filtered = duasData.filter(dua => {
    const matchCat = !selectedCategory || dua.category === selectedCategory;
    const matchSearch =
      !search ||
      dua.title.includes(search) ||
      dua.arabic.includes(search) ||
      dua.category.includes(search);
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
    <div className="h-full overflow-y-auto bg-gradient-to-b from-purple-50 to-violet-50">
      {/* Header */}
      <div className="bg-dua-gradient text-white p-5 shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen size={26} />
          <h1 className="text-2xl font-bold arabic-text">الأدعية</h1>
        </div>
        <p className="text-purple-200 text-sm mb-4">مجموعة من الأدعية المأثورة</p>

        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300" size={16} />
          <input
            type="text"
            placeholder="ابحث عن دعاء..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 bg-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:bg-white/30 text-sm"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="p-4 pb-0">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
              !selectedCategory
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'
            }`}
          >
            الكل ({duasData.length})
          </button>
          {duaCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold transition-all border ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white border-purple-600'
                  : `bg-white border-gray-200 hover:border-purple-300 text-gray-600`
              }`}
            >
              <span>{categoryIcons[cat] || '🤲'}</span>
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Duas list */}
      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">🔍</div>
            <p>لم يتم العثور على نتائج</p>
          </div>
        )}

        {filtered.map(dua => (
          <div
            key={dua.id}
            className="bg-white rounded-2xl shadow-sm overflow-hidden card-hover"
          >
            {/* Category badge */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${categoryColors[dua.category] || 'bg-gray-100 text-gray-600 border-gray-200'}`}
              >
                {categoryIcons[dua.category]} {dua.category}
              </span>
              <h3 className="font-bold text-gray-800">{dua.title}</h3>
            </div>

            {/* Arabic text */}
            <div className="px-4 pb-3">
              <p className="arabic-text text-gray-800 text-right text-lg leading-loose">
                {dua.arabic}
              </p>
            </div>

            {/* Translation */}
            <div className="px-4 pb-3">
              <p className="text-gray-500 text-sm text-right leading-relaxed border-r-2 border-purple-200 pr-3">
                {dua.translation}
              </p>
            </div>

            {/* Source + Actions */}
            <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleFavorite(dua.id)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    favorites.has(dua.id)
                      ? 'text-red-500 bg-red-50'
                      : 'text-gray-400 hover:text-red-400 hover:bg-red-50'
                  }`}
                >
                  <Heart size={16} fill={favorites.has(dua.id) ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={() => copyDua(dua.arabic, dua.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-purple-500 hover:bg-purple-50 transition-colors"
                >
                  {copiedId === dua.id ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                </button>
                <button
                  onClick={() => navigator.share?.({ text: `${dua.title}\n\n${dua.arabic}` })}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-purple-500 hover:bg-purple-50 transition-colors"
                >
                  <Share2 size={16} />
                </button>
              </div>
              <span className="text-xs text-gray-400">{dua.source}</span>
            </div>
          </div>
        ))}

        {favorites.size > 0 && (
          <div className="text-center text-xs text-gray-400 py-2">
            ❤️ {favorites.size} دعاء محفوظ في المفضلة
          </div>
        )}
      </div>
    </div>
  );
}
