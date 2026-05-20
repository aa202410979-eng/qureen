import { useState } from 'react';
import { Sun, Moon, RotateCcw, Check, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { adhkarData } from '../data/adhkar';

export default function Adhkar() {
  const [tab, setTab] = useState<'morning' | 'evening'>('morning');
  const [counts, setCounts] = useState<Record<number, number>>({});
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const filtered = adhkarData.filter(a => a.category === tab);

  const increment = (id: number, max: number) => {
    setCounts(prev => {
      const current = prev[id] || 0;
      if (current >= max) return prev;
      return { ...prev, [id]: current + 1 };
    });
  };

  const reset = (id: number) => {
    setCounts(prev => ({ ...prev, [id]: 0 }));
  };

  const resetAll = () => {
    setCounts({});
  };

  const toggleExpand = (id: number) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const totalCompleted = filtered.filter(a => (counts[a.id] || 0) >= a.count).length;
  const progress = (totalCompleted / filtered.length) * 100;

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-adhkar-gradient text-white p-5 shadow-lg">
        <h1 className="text-2xl font-bold arabic-text mb-1">الأذكار</h1>
        <p className="text-blue-200 text-sm mb-4">أذكار الصباح والمساء</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab('morning')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              tab === 'morning'
                ? 'bg-white text-blue-700 shadow-md'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Sun size={16} />
            أذكار الصباح
          </button>
          <button
            onClick={() => setTab('evening')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              tab === 'evening'
                ? 'bg-white text-indigo-700 shadow-md'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Moon size={16} />
            أذكار المساء
          </button>
        </div>

        {/* Progress */}
        <div className="bg-white/20 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={resetAll}
              className="flex items-center gap-1 text-xs text-blue-200 hover:text-white transition-colors"
            >
              <RotateCcw size={12} />
              إعادة تعيين
            </button>
            <span className="text-sm font-bold">
              {totalCompleted}/{filtered.length} مكتمل
            </span>
          </div>
          <div className="h-2 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Adhkar List */}
      <div className="p-4 space-y-3 max-w-2xl mx-auto">
        {filtered.map((dhikr, index) => {
          const currentCount = counts[dhikr.id] || 0;
          const isCompleted = currentCount >= dhikr.count;
          const isExpanded = expanded[dhikr.id];

          return (
            <div
              key={dhikr.id}
              className={`bg-white rounded-2xl shadow-sm overflow-hidden transition-all ${
                isCompleted ? 'ring-2 ring-emerald-400' : ''
              }`}
            >
              {/* Header */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    {isCompleted && (
                      <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <Check size={10} />
                        مكتمل
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {dhikr.count > 1 && (
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(dhikr.count, 10) }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < currentCount ? 'bg-emerald-500' : 'bg-gray-200'
                            }`}
                          />
                        ))}
                        {dhikr.count > 10 && (
                          <span className="text-xs text-gray-400">×{dhikr.count}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Arabic text */}
                <p className="arabic-text text-gray-800 text-right leading-loose text-lg mb-3">
                  {dhikr.text}
                </p>

                {/* Source and benefit */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleExpand(dhikr.id)}
                    className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1"
                  >
                    {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    {dhikr.benefit ? 'الفضل' : 'المصدر'}
                  </button>
                  <span className="text-xs text-gray-400">{dhikr.source}</span>
                </div>

                {isExpanded && dhikr.benefit && (
                  <div className="mt-2 p-2 bg-amber-50 rounded-lg flex items-start gap-2">
                    <Star size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700">{dhikr.benefit}</p>
                  </div>
                )}
              </div>

              {/* Counter */}
              <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between bg-gray-50">
                <button
                  onClick={() => reset(dhikr.id)}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <RotateCcw size={14} />
                </button>

                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-gray-700">
                    {currentCount}
                    <span className="text-sm text-gray-400">/{dhikr.count}</span>
                  </span>
                  <button
                    onClick={() => increment(dhikr.id, dhikr.count)}
                    disabled={isCompleted}
                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-600 cursor-default'
                        : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-sm'
                    }`}
                  >
                    {isCompleted ? '✓ تم' : 'تسبيح'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Completion message */}
        {totalCompleted === filtered.length && filtered.length > 0 && (
          <div className="bg-emerald-500 text-white rounded-2xl p-5 text-center shadow-lg">
            <div className="text-3xl mb-2">🌟</div>
            <p className="font-bold text-lg arabic-text">أحسنت! أكملت جميع الأذكار</p>
            <p className="text-emerald-100 text-sm mt-1">تقبّل الله منك</p>
            <button
              onClick={resetAll}
              className="mt-3 flex items-center gap-2 mx-auto px-4 py-2 bg-white text-emerald-600 rounded-xl text-sm font-bold hover:bg-emerald-50 transition-colors"
            >
              <RotateCcw size={14} />
              إعادة البدء
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
