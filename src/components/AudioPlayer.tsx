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
    <div className="rounded-2xl p-3" style={{background:'rgba(13,21,38,0.9)', border:'1px solid rgba(212,175,55,0.15)'}}>
      <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => { setIsPlaying(false); setProgress(100); }}
        onError={() => { setError(true); setLoading(false); setIsPlaying(false); }}
        muted={muted} preload="none" />

      {/* Header row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Music size={13} style={{color:'#d4af37'}} />
          <span className="text-xs" style={{color:'rgba(212,175,55,0.7)'}}>مشغّل القرآن</span>
          {cached ? (
            <span className="flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-full" style={{color:'#10b981', background:'rgba(16,185,129,0.1)'}}>
              <WifiOff size={10} /> أوف لاين
            </span>
          ) : (
            <span className="flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-full" style={{color:'#60a5fa', background:'rgba(96,165,250,0.1)'}}>
              <Wifi size={10} /> أون لاين
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {surah && !cached && (
            <button onClick={handleDownload} disabled={downloading}
              className="flex items-center gap-1 text-xs rounded-lg px-2 py-1"
              style={{background:'rgba(212,175,55,0.1)', color:'#d4af37', border:'1px solid rgba(212,175,55,0.2)'}}>
              {downloading ? <div className="w-3 h-3 border-2 border-t-transparent rounded-full animate-spin" style={{borderColor:'rgba(212,175,55,0.3)',borderTopColor:'#d4af37'}} />
                : <Download size={12} />}
              {downloading ? 'جاري...' : 'تحميل'}
            </button>
          )}
          <button onClick={() => setMuted(!muted)} className="p-1" style={{color:'rgba(212,175,55,0.6)'}}>
            {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </button>
        </div>
      </div>

      {/* Surah name */}
      {surah && (
        <div className="text-center mb-2">
          <p className="font-bold text-sm" style={{fontFamily:'Amiri,serif', color:'#f0e6c8'}}>{surah.name}</p>
        </div>
      )}

      {/* Reciter selector */}
      <div className="relative mb-2">
        <button onClick={() => setShowReciters(!showReciters)}
          className="w-full flex items-center justify-between rounded-xl px-3 py-1.5"
          style={{background:'rgba(212,175,55,0.06)', border:'1px solid rgba(212,175,55,0.15)'}}>
          <ChevronDown size={14} className={`transition-transform flex-shrink-0 ${showReciters ? 'rotate-180' : ''}`} style={{color:'#d4af37'}} />
          <span className="text-sm font-semibold" style={{color:'#f0e6c8'}}>{selectedReciter.arabicName}</span>
        </button>
        {showReciters && (
          <div className="absolute bottom-full mb-1 right-0 left-0 rounded-xl shadow-2xl overflow-hidden z-50 max-h-48 overflow-y-auto"
            style={{background:'#111827', border:'1px solid rgba(212,175,55,0.2)'}}>
            {reciters.map(r => (
              <button key={r.id} onClick={() => { setSelectedReciter(r); setShowReciters(false); }}
                className="w-full flex items-center justify-between px-4 py-2.5 transition-colors"
                style={{borderBottom:'1px solid rgba(212,175,55,0.08)', background: selectedReciter.id === r.id ? 'rgba(212,175,55,0.1)' : 'transparent'}}>
                <span className="text-sm font-semibold" style={{color: selectedReciter.id === r.id ? '#d4af37' : '#9ca3af'}}>{r.arabicName}</span>
                {selectedReciter.id === r.id && <span className="w-2 h-2 rounded-full" style={{background:'#d4af37'}} />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs rounded-lg px-3 py-1.5 mb-2 text-center" style={{color:'#fca5a5', background:'rgba(239,68,68,0.1)'}}>
          تعذّر التشغيل. تأكد من الاتصال بالإنترنت
        </p>
      )}

      {/* Progress */}
      <div className="mb-2">
        <div className="progress-bar" onClick={handleProgressClick}>
          <div style={{width:`${progress}%`, height:'100%', borderRadius:'2px', background:'linear-gradient(90deg,#d4af37,#f0d060)', transition:'width 0.1s linear'}} />
        </div>
        <div className="flex justify-between text-xs mt-0.5" style={{color:'rgba(212,175,55,0.5)'}}>
          <span>{formatTime(duration - currentTime)}</span>
          <span>{formatTime(currentTime)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-5">
        <button style={{color:'rgba(212,175,55,0.5)'}}><SkipBack size={20} /></button>
        <button onClick={togglePlay} disabled={!surah}
          className="w-11 h-11 rounded-full flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-40 active:scale-95"
          style={{background:'linear-gradient(135deg,#d4af37,#b8960c)', color:'#080d18', boxShadow:'0 4px 20px rgba(212,175,55,0.3)'}}>
          {loading || downloading
            ? <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{borderColor:'rgba(8,13,24,0.3)',borderTopColor:'#080d18'}} />
            : isPlaying ? <Pause size={20} /> : <Play size={20} className="mr-[-2px]" />}
        </button>
        <button style={{color:'rgba(212,175,55,0.5)'}}><SkipForward size={20} /></button>
      </div>
    </div>
  );
}
