import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, ChevronDown, Music, Download, Wifi, WifiOff } from 'lucide-react';
import type { Surah } from '../types';
import { reciters, getSurahAudioUrl } from '../data/reciters';
import type { ReciterFull } from '../data/reciters';
import { getCachedAudio, cacheAudio, isAudioCached } from '../utils/audioCache';

interface AudioPlayerProps {
  surah: Surah | null;
}

export default function AudioPlayer({ surah }: AudioPlayerProps) {
  const [selectedReciter, setSelectedReciter] = useState<ReciterFull>(reciters[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [muted, setMuted] = useState(false);
  const [showReciters, setShowReciters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [cached, setCached] = useState(false);
  const [error, setError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentSrcRef = useRef<string>('');

  const cacheKey = surah ? `${selectedReciter.id}_${surah.number}` : '';
  const remoteUrl = surah ? getSurahAudioUrl(selectedReciter.id, surah.number) : '';

  // Check cache and reset on surah/reciter change
  useEffect(() => {
    if (!surah) return;
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.src = '';
    }
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    setError(false);
    setLoading(false);
    currentSrcRef.current = '';

    isAudioCached(cacheKey).then(setCached);
  }, [surah, selectedReciter, cacheKey]);

  const loadAndPlay = async () => {
    if (!surah || !audioRef.current) return;
    setLoading(true);
    setError(false);

    let src = await getCachedAudio(cacheKey);
    if (!src) {
      // Not cached - download and cache it
      setDownloading(true);
      src = await cacheAudio(cacheKey, remoteUrl);
      setDownloading(false);
      setCached(true);
    }

    currentSrcRef.current = src;
    audioRef.current.src = src;
    audioRef.current.load();
    audioRef.current.play()
      .then(() => { setIsPlaying(true); setLoading(false); })
      .catch(() => {
        setLoading(false);
        setError(true);
        // Fallback to streaming
        if (audioRef.current) {
          audioRef.current.src = remoteUrl;
          audioRef.current.play()
            .then(() => { setIsPlaying(true); setError(false); })
            .catch(() => setError(true));
        }
      });
  };

  const togglePlay = () => {
    if (!surah || !audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else if (currentSrcRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setError(true));
    } else {
      loadAndPlay();
    }
  };

  const handleDownload = async () => {
    if (!surah || cached || downloading) return;
    setDownloading(true);
    await cacheAudio(cacheKey, remoteUrl);
    setCached(true);
    setDownloading(false);
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
    audioRef.current.currentTime = (e.clientX - rect.left) / rect.width * duration;
  };

  const formatTime = (s: number) => {
    if (!s || isNaN(s) || !isFinite(s)) return '0:00';
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="rounded-2xl p-3 shadow-lg" style={{background:'linear-gradient(135deg,#065f46,#047857,#059669)'}}>
      <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => { setIsPlaying(false); setProgress(100); }}
        onError={() => { setError(true); setLoading(false); setIsPlaying(false); }}
        muted={muted} preload="none" />

      {/* Header row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Music size={13} className="text-emerald-200" />
          <span className="text-xs text-emerald-200">مشغّل القرآن</span>
          {cached ? (
            <span className="flex items-center gap-0.5 text-xs text-emerald-300 bg-emerald-800/50 px-1.5 py-0.5 rounded-full">
              <WifiOff size={10} /> أوف لاين
            </span>
          ) : (
            <span className="flex items-center gap-0.5 text-xs text-blue-300 bg-blue-900/40 px-1.5 py-0.5 rounded-full">
              <Wifi size={10} /> أون لاين
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {surah && !cached && (
            <button onClick={handleDownload} disabled={downloading}
              className="flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 text-emerald-200 rounded-lg px-2 py-1 transition-colors">
              {downloading
                ? <div className="w-3 h-3 border-2 border-emerald-200 border-t-transparent rounded-full animate-spin" />
                : <Download size={12} />}
              {downloading ? 'جاري...' : 'تحميل'}
            </button>
          )}
          <button onClick={() => setMuted(!muted)} className="text-emerald-200 hover:text-white p-1">
            {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </button>
        </div>
      </div>

      {/* Surah name */}
      {surah && (
        <div className="text-center mb-2">
          <p className="font-bold text-white text-sm" style={{fontFamily:'Amiri,serif'}}>{surah.name}</p>
        </div>
      )}

      {/* Reciter selector */}
      <div className="relative mb-2">
        <button onClick={() => setShowReciters(!showReciters)}
          className="w-full flex items-center justify-between bg-white/10 hover:bg-white/20 rounded-xl px-3 py-1.5 transition-colors">
          <ChevronDown size={14} className={`text-emerald-200 transition-transform flex-shrink-0 ${showReciters ? 'rotate-180' : ''}`} />
          <span className="text-sm font-semibold text-white">{selectedReciter.arabicName}</span>
        </button>
        {showReciters && (
          <div className="absolute bottom-full mb-1 right-0 left-0 bg-white rounded-xl shadow-2xl overflow-hidden z-50 max-h-48 overflow-y-auto">
            {reciters.map(r => (
              <button key={r.id} onClick={() => { setSelectedReciter(r); setShowReciters(false); }}
                className={`w-full flex items-center justify-between px-4 py-2.5 hover:bg-emerald-50 transition-colors border-b border-gray-50 last:border-0 ${selectedReciter.id === r.id ? 'bg-emerald-50' : ''}`}>
                <span className={`text-sm font-semibold ${selectedReciter.id === r.id ? 'text-emerald-700' : 'text-gray-700'}`}>{r.arabicName}</span>
                {selectedReciter.id === r.id && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-200 bg-red-500/20 rounded-lg px-3 py-1.5 mb-2 text-center">
          تعذّر التشغيل. تأكد من الاتصال بالإنترنت
        </p>
      )}

      {/* Progress */}
      <div className="mb-2">
        <div className="progress-bar" onClick={handleProgressClick}>
          <div className="progress-fill" style={{width:`${progress}%`}} />
        </div>
        <div className="flex justify-between text-xs text-emerald-200 mt-0.5">
          <span>{formatTime(duration - currentTime)}</span>
          <span>{formatTime(currentTime)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-5">
        <button className="text-emerald-200 hover:text-white transition-colors"><SkipBack size={20} /></button>
        <button onClick={togglePlay} disabled={!surah}
          className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-emerald-700 hover:scale-105 transition-transform disabled:opacity-40 shadow-lg active:scale-95">
          {loading || downloading
            ? <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            : isPlaying ? <Pause size={20} /> : <Play size={20} className="mr-[-2px]" />}
        </button>
        <button className="text-emerald-200 hover:text-white transition-colors"><SkipForward size={20} /></button>
      </div>
    </div>
  );
}
