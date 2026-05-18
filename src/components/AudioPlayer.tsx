import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, ChevronDown, Music, AlertCircle } from 'lucide-react';
import type { Reciter, Surah } from '../types';
import { reciters, getSurahAudioUrl } from '../data/reciters';

interface AudioPlayerProps {
  surah: Surah | null;
}

export default function AudioPlayer({ surah }: AudioPlayerProps) {
  const [selectedReciter, setSelectedReciter] = useState<Reciter>(reciters[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [muted, setMuted] = useState(false);
  const [showReciters, setShowReciters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.load();
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    setError(false);
    setLoading(false);
  }, [surah, selectedReciter]);

  const togglePlay = () => {
    if (!surah || !audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setLoading(true);
      setError(false);
      audioRef.current.play()
        .then(() => { setIsPlaying(true); setLoading(false); })
        .catch(() => { setLoading(false); setError(true); });
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const ct = audioRef.current.currentTime;
    const dur = audioRef.current.duration || 0;
    setCurrentTime(ct);
    setProgress(dur ? (ct / dur) * 100 : 0);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    audioRef.current.currentTime = (x / rect.width) * duration;
  };

  const formatTime = (s: number) => {
    if (!s || isNaN(s) || !isFinite(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const audioUrl = surah ? getSurahAudioUrl(selectedReciter.identifier, surah.number) : '';

  return (
    <div className="rounded-2xl p-3 sm:p-4 shadow-lg" style={{background:'linear-gradient(135deg,#065f46,#047857,#059669)'}}>
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => { setIsPlaying(false); setProgress(0); setCurrentTime(0); }}
        onError={() => { setError(true); setLoading(false); setIsPlaying(false); }}
        muted={muted}
        preload="none"
      />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Music size={14} className="text-emerald-200" />
          <span className="text-xs text-emerald-200">مشغّل القرآن</span>
        </div>
        <div className="text-center">
          {surah ? (
            <>
              <p className="font-bold text-white text-sm sm:text-base leading-tight" style={{fontFamily:'Amiri,serif'}}>{surah.name}</p>
              <p className="text-xs text-emerald-200">{surah.numberOfAyahs} آية</p>
            </>
          ) : (
            <p className="text-xs text-emerald-200">اختر سورة للاستماع</p>
          )}
        </div>
        <button onClick={() => setMuted(!muted)} className="text-emerald-200 hover:text-white transition-colors p-1">
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>

      {/* Reciter selector */}
      <div className="relative mb-3">
        <button
          onClick={() => setShowReciters(!showReciters)}
          className="w-full flex items-center justify-between bg-white/10 hover:bg-white/20 rounded-xl px-3 py-2 transition-colors"
        >
          <ChevronDown size={16} className={`text-emerald-200 transition-transform flex-shrink-0 ${showReciters ? 'rotate-180' : ''}`} />
          <div className="text-right flex-1 mr-2">
            <p className="text-sm font-semibold text-white">{selectedReciter.arabicName}</p>
          </div>
        </button>
        {showReciters && (
          <div className="absolute bottom-full mb-1 right-0 left-0 bg-white rounded-xl shadow-2xl overflow-hidden z-50 max-h-52 overflow-y-auto border border-emerald-100">
            {reciters.map(r => (
              <button
                key={r.id}
                onClick={() => { setSelectedReciter(r); setShowReciters(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 hover:bg-emerald-50 transition-colors border-b border-gray-50 last:border-0 ${
                  selectedReciter.id === r.id ? 'bg-emerald-50' : ''
                }`}
              >
                {selectedReciter.id === r.id && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                )}
                {selectedReciter.id !== r.id && <span className="w-2 h-2 flex-shrink-0" />}
                <span className={`font-semibold text-sm ${selectedReciter.id === r.id ? 'text-emerald-700' : 'text-gray-700'}`}>{r.arabicName}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 bg-red-500/20 rounded-lg px-3 py-2 mb-2">
          <AlertCircle size={14} className="text-red-200 flex-shrink-0" />
          <p className="text-xs text-red-200">تعذّر تحميل الصوت. تأكد من اتصال الإنترنت وأعد المحاولة.</p>
        </div>
      )}

      {/* Progress bar */}
      <div className="mb-2">
        <div className="progress-bar cursor-pointer" onClick={handleProgressClick}>
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between text-xs text-emerald-200 mt-1">
          <span>{formatTime(duration - currentTime)}</span>
          <span>{formatTime(currentTime)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-5 sm:gap-6">
        <button className="text-emerald-200 hover:text-white transition-colors">
          <SkipBack size={22} />
        </button>
        <button
          onClick={togglePlay}
          disabled={!surah || loading}
          className="w-11 h-11 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center text-emerald-700 hover:scale-105 transition-transform disabled:opacity-50 shadow-lg active:scale-95"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause size={22} />
          ) : (
            <Play size={22} className="mr-[-2px]" />
          )}
        </button>
        <button className="text-emerald-200 hover:text-white transition-colors">
          <SkipForward size={22} />
        </button>
      </div>
    </div>
  );
}
