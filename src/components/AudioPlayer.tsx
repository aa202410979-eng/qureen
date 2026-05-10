import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, ChevronDown, Music } from 'lucide-react';
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
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    }
  }, [surah, selectedReciter]);

  const togglePlay = () => {
    if (!surah || !audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setLoading(true);
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const ct = audioRef.current.currentTime;
    const dur = audioRef.current.duration;
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
    const pct = x / rect.width;
    audioRef.current.currentTime = pct * duration;
  };

  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const audioUrl = surah ? getSurahAudioUrl(selectedReciter.identifier, surah.number) : '';

  return (
    <div className="bg-quran-gradient text-white rounded-2xl p-4 shadow-lg">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        muted={muted}
        preload="metadata"
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Music size={16} className="text-emerald-200" />
          <span className="text-xs text-emerald-200">مشغّل القرآن</span>
        </div>
        {surah && (
          <div className="text-center">
            <p className="font-bold arabic-text text-lg leading-tight">{surah.name}</p>
            <p className="text-xs text-emerald-200">{surah.numberOfAyahs} آية</p>
          </div>
        )}
        {!surah && <p className="text-sm text-emerald-200">اختر سورة للاستماع</p>}
      </div>

      {/* Reciter selector */}
      <div className="relative mb-4">
        <button
          onClick={() => setShowReciters(!showReciters)}
          className="w-full flex items-center justify-between bg-white/10 hover:bg-white/20 rounded-xl px-3 py-2 transition-colors"
        >
          <ChevronDown size={16} className={`transition-transform ${showReciters ? 'rotate-180' : ''}`} />
          <div className="text-right">
            <p className="text-sm font-semibold">{selectedReciter.arabicName}</p>
            <p className="text-xs text-emerald-200">{selectedReciter.style}</p>
          </div>
        </button>
        {showReciters && (
          <div className="absolute bottom-full mb-1 right-0 left-0 bg-white rounded-xl shadow-xl overflow-hidden z-50 max-h-56 overflow-y-auto">
            {reciters.map(r => (
              <button
                key={r.id}
                onClick={() => { setSelectedReciter(r); setShowReciters(false); }}
                className={`w-full flex items-center justify-between px-4 py-2.5 hover:bg-emerald-50 transition-colors ${
                  selectedReciter.id === r.id ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700'
                }`}
              >
                <span className="text-xs text-gray-400">{r.style}</span>
                <span className="font-semibold text-sm">{r.arabicName}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="mb-3">
        <div className="progress-bar" onClick={handleProgressClick}>
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between text-xs text-emerald-200 mt-1">
          <span>{formatTime(duration - currentTime)}</span>
          <span>{formatTime(currentTime)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={() => setMuted(!muted)}
          className="text-emerald-200 hover:text-white transition-colors"
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <button className="text-emerald-200 hover:text-white transition-colors">
          <SkipBack size={22} />
        </button>
        <button
          onClick={togglePlay}
          disabled={!surah || loading}
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-emerald-700 hover:scale-105 transition-transform disabled:opacity-50 shadow-lg"
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
