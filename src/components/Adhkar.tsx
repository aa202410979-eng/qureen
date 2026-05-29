import { useState } from 'react';
import { Sun, Moon, RotateCcw, Check, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { adhkarData } from '../data/adhkar';

const GOLD = '#d4af37';
const GOLD_DIM = 'rgba(212,175,55,0.15)';
const GOLD_BORDER = 'rgba(212,175,55,0.2)';
const CREAM = '#f0e6c8';
const MUTED = '#6b7280';
const CARD_BG = '#111827';
const PAGE_BG = '#080d18';

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

  const reset = (id: number) => setCounts(prev => ({ ...prev, [id]: 0 }));
  const resetAll = () => setCounts({});
  const toggleExpand = (id: number) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const totalCompleted = filtered.filter(a => (counts[a.id] || 0) >= a.count).length;
  const progress = filtered.length ? (totalCompleted / filtered.length) * 100 : 0;

  return (
    <div className="h-full overflow-y-auto" style={{ background: PAGE_BG }}>

      {/* Header */}
      <div className="p-5 shadow-lg" style={{ background: 'linear-gradient(180deg,#0d1526 0%,#0a1020 100%)', borderBottom: `1px solid ${GOLD_BORDER}` }}>
        <h1 className="text-2xl font-bold arabic-text mb-1" style={{ color: GOLD }}>الأذكار</h1>
        <p className="text-sm mb-4" style={{ color: MUTED }}>أذكار الصباح والمساء</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {[{id:'morning',label:'أذكار الصباح',icon:Sun},{id:'evening',label:'أذكار المساء',icon:Moon}].map(t => (
            <button key={t.id} onClick={() => setTab(t.id as 'morning'|'evening')}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all"
              style={{
                background: tab === t.id ? GOLD : GOLD_DIM,
                color: tab === t.id ? '#080d18' : CREAM,
                border: `1px solid ${tab === t.id ? GOLD : GOLD_BORDER}`,
              }}>
              <t.icon size={16} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Progress */}
        <div className="rounded-xl p-3" style={{ background: GOLD_DIM, border: `1px solid ${GOLD_BORDER}` }}>
          <div className="flex items-center justify-between mb-2">
            <button onClick={resetAll} className="flex items-center gap-1 text-xs transition-colors" style={{ color: MUTED }}>
              <RotateCcw size={12} /> إعادة تعيين
            </button>
            <span className="text-sm font-bold" style={{ color: GOLD }}>{totalCompleted}/{filtered.length} مكتمل</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(212,175,55,0.1)' }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: `linear-gradient(90deg,${GOLD},#f0d060)` }} />
          </div>
        </div>
      </div>

      {/* List */}
      <div className="p-4 space-y-3 max-w-2xl mx-auto">
        {filtered.map((dhikr, index) => {
          const currentCount = counts[dhikr.id] || 0;
          const isCompleted = currentCount >= dhikr.count;
          const isExp = expanded[dhikr.id];

          return (
            <div key={dhikr.id} className="rounded-2xl overflow-hidden transition-all"
              style={{ background: CARD_BG, border: `1px solid ${isCompleted ? 'rgba(212,175,55,0.4)' : GOLD_BORDER}` }}>

              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold"
                      style={{ background: GOLD_DIM, color: GOLD }}>{index + 1}</span>
                    {isCompleted && (
                      <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                        style={{ color:'#10b981', background:'rgba(16,185,129,0.1)' }}>
                        <Check size={10} /> مكتمل
                      </span>
                    )}
                  </div>
                  {dhikr.count > 1 && (
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(dhikr.count, 10) }).map((_, i) => (
                        <div key={i} className="w-2 h-2 rounded-full"
                          style={{ background: i < currentCount ? GOLD : 'rgba(212,175,55,0.15)' }} />
                      ))}
                      {dhikr.count > 10 && <span className="text-xs" style={{ color: MUTED }}>×{dhikr.count}</span>}
                    </div>
                  )}
                </div>

                <p className="arabic-text text-right leading-loose text-lg mb-3" style={{ color: CREAM }}>
                  {dhikr.text}
                </p>

                <div className="flex items-center justify-between">
                  <button onClick={() => toggleExpand(dhikr.id)}
                    className="text-xs flex items-center gap-1" style={{ color: GOLD }}>
                    {isExp ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    {dhikr.benefit ? 'الفضل' : 'المصدر'}
                  </button>
                  <span className="text-xs" style={{ color: MUTED }}>{dhikr.source}</span>
                </div>

                {isExp && dhikr.benefit && (
                  <div className="mt-2 p-2 rounded-lg flex items-start gap-2"
                    style={{ background: 'rgba(212,175,55,0.06)', border: `1px solid ${GOLD_BORDER}` }}>
                    <Star size={14} style={{ color: GOLD, flexShrink: 0, marginTop: '2px' }} />
                    <p className="text-xs" style={{ color: 'rgba(240,230,200,0.7)' }}>{dhikr.benefit}</p>
                  </div>
                )}
              </div>

              {/* Counter */}
              <div className="px-4 py-3 flex items-center justify-between"
                style={{ borderTop: `1px solid ${GOLD_BORDER}`, background: 'rgba(212,175,55,0.03)' }}>
                <button onClick={() => reset(dhikr.id)} style={{ color: MUTED }}>
                  <RotateCcw size={14} />
                </button>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold" style={{ color: CREAM }}>
                    {currentCount}<span className="text-sm" style={{ color: MUTED }}>/{dhikr.count}</span>
                  </span>
                  <button onClick={() => increment(dhikr.id, dhikr.count)} disabled={isCompleted}
                    className="px-6 py-2 rounded-xl text-sm font-bold transition-all active:scale-95"
                    style={{
                      background: isCompleted ? 'rgba(16,185,129,0.15)' : `linear-gradient(135deg,${GOLD},#b8960c)`,
                      color: isCompleted ? '#10b981' : '#080d18',
                      cursor: isCompleted ? 'default' : 'pointer',
                    }}>
                    {isCompleted ? '✓ تم' : 'تسبيح'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {totalCompleted === filtered.length && filtered.length > 0 && (
          <div className="rounded-2xl p-5 text-center shadow-lg"
            style={{ background: `linear-gradient(135deg,${GOLD},#b8960c)`, color: '#080d18' }}>
            <div className="text-3xl mb-2">🌟</div>
            <p className="font-bold text-lg arabic-text">أحسنت! أكملت جميع الأذكار</p>
            <p className="text-sm mt-1 opacity-70">تقبّل الله منك</p>
            <button onClick={resetAll}
              className="mt-3 flex items-center gap-2 mx-auto px-4 py-2 rounded-xl text-sm font-bold"
              style={{ background: 'rgba(8,13,24,0.2)', color: '#080d18' }}>
              <RotateCcw size={14} /> إعادة البدء
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
