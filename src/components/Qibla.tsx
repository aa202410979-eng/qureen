import { useState, useEffect, useCallback } from 'react';
import { MapPin, Navigation, RotateCcw, AlertCircle, Compass } from 'lucide-react';

const KAABA_LAT = 21.3891;
const KAABA_LNG = 39.8579;

function calcQiblaAngle(lat: number, lng: number): number {
  const latRad = (lat * Math.PI) / 180;
  const kaabaLatRad = (KAABA_LAT * Math.PI) / 180;
  const deltaLng = ((KAABA_LNG - lng) * Math.PI) / 180;

  const y = Math.sin(deltaLng) * Math.cos(kaabaLatRad);
  const x =
    Math.cos(latRad) * Math.sin(kaabaLatRad) -
    Math.sin(latRad) * Math.cos(kaabaLatRad) * Math.cos(deltaLng);

  let angle = (Math.atan2(y, x) * 180) / Math.PI;
  return (angle + 360) % 360;
}

function calcDistance(lat: number, lng: number): number {
  const R = 6371;
  const dLat = ((KAABA_LAT - lat) * Math.PI) / 180;
  const dLng = ((KAABA_LNG - lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat * Math.PI) / 180) *
      Math.cos((KAABA_LAT * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export default function Qibla() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [qiblaAngle, setQiblaAngle] = useState<number | null>(null);
  const [compassHeading, setCompassHeading] = useState<number>(0);
  const [distance, setDistance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState<string | null>(null);
  const [hasCompass, setHasCompass] = useState(false);

  const getLocation = useCallback(() => {
    setLoading(true);
    setError(null);
    if (!navigator.geolocation) {
      setError('المتصفح لا يدعم تحديد الموقع');
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });
        setQiblaAngle(calcQiblaAngle(latitude, longitude));
        setDistance(calcDistance(latitude, longitude));
        setLoading(false);
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
          .then(r => r.json())
          .then(data => {
            const addr = data.address;
            setCity(addr.city || addr.town || addr.village || addr.county || '');
          })
          .catch(() => {});
      },
      err => {
        setError(
          err.code === 1
            ? 'يرجى السماح بالوصول إلى موقعك'
            : 'تعذّر تحديد موقعك، يرجى المحاولة مجدداً'
        );
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    getLocation();
    // Try device orientation for real compass
    if (typeof DeviceOrientationEvent !== 'undefined') {
      const handleOrientation = (e: DeviceOrientationEvent) => {
        const alpha = (e as any).webkitCompassHeading ?? e.alpha ?? 0;
        setCompassHeading(alpha);
        setHasCompass(true);
      };
      window.addEventListener('deviceorientation', handleOrientation);
      return () => window.removeEventListener('deviceorientation', handleOrientation);
    }
  }, [getLocation]);

  const needleAngle = qiblaAngle !== null ? qiblaAngle - compassHeading : 0;

  const directions = [
    { label: 'ش', angle: 0 },
    { label: 'ش.ش', angle: 45 },
    { label: 'ش.غ', angle: 315 },
    { label: 'ج', angle: 180 },
    { label: 'ج.ش', angle: 135 },
    { label: 'ج.غ', angle: 225 },
    { label: 'غ', angle: 270 },
    { label: 'ق', angle: 90 },
  ];

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-amber-50 to-orange-50 p-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="bg-qibla-gradient rounded-2xl p-5 text-white mb-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Compass size={28} />
            <h1 className="text-2xl font-bold arabic-text">بوصلة القبلة</h1>
          </div>
          <p className="text-amber-100 text-sm">اتجاه القبلة نحو الكعبة المشرفة</p>
        </div>

        {/* Location info */}
        {location && (
          <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-500">
              <span className="text-sm">{location.lat.toFixed(4)}°، {location.lng.toFixed(4)}°</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin size={16} className="text-amber-500" />
              <span className="font-semibold">{city || 'موقعك الحالي'}</span>
            </div>
          </div>
        )}

        {/* Main compass */}
        <div className="flex flex-col items-center mb-6">
          {loading && (
            <div className="flex flex-col items-center gap-4 py-12">
              <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500">جاري تحديد موقعك...</p>
            </div>
          )}

          {error && (
            <div className="w-full bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-red-700 font-semibold text-sm">{error}</p>
                <button
                  onClick={getLocation}
                  className="mt-2 flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700"
                >
                  <RotateCcw size={12} />
                  إعادة المحاولة
                </button>
              </div>
            </div>
          )}

          {qiblaAngle !== null && !loading && (
            <>
              {/* Compass Rose */}
              <div className="relative w-72 h-72 mb-6">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-4 border-amber-200 bg-white shadow-2xl compass-glow" />

                {/* Direction labels */}
                {directions.map(({ label, angle }) => {
                  const rad = ((angle - 90) * Math.PI) / 180;
                  const r = 115;
                  const x = 144 + r * Math.cos(rad);
                  const y = 144 + r * Math.sin(rad);
                  return (
                    <div
                      key={label}
                      className="absolute text-xs font-bold text-gray-500"
                      style={{
                        left: x,
                        top: y,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      {label}
                    </div>
                  );
                })}

                {/* Tick marks */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 288 288">
                  {Array.from({ length: 72 }).map((_, i) => {
                    const angle = (i * 5 * Math.PI) / 180;
                    const inner = i % 6 === 0 ? 118 : 122;
                    const outer = 130;
                    return (
                      <line
                        key={i}
                        x1={144 + inner * Math.cos(angle - Math.PI / 2)}
                        y1={144 + inner * Math.sin(angle - Math.PI / 2)}
                        x2={144 + outer * Math.cos(angle - Math.PI / 2)}
                        y2={144 + outer * Math.sin(angle - Math.PI / 2)}
                        stroke={i % 6 === 0 ? '#d97706' : '#e5e7eb'}
                        strokeWidth={i % 6 === 0 ? 2 : 1}
                      />
                    );
                  })}
                </svg>

                {/* Needle container (rotates with qibla) */}
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ transform: `rotate(${needleAngle}deg)`, transition: 'transform 0.3s ease-out' }}
                >
                  {/* Kaaba needle */}
                  <svg viewBox="-10 -100 20 200" className="w-full h-full absolute inset-0">
                    {/* North side - Qibla (green) */}
                    <polygon points="0,-90 5,-10 -5,-10" fill="#10b981" opacity="0.9" />
                    {/* South side (gray) */}
                    <polygon points="0,90 5,10 -5,10" fill="#9ca3af" opacity="0.7" />
                    {/* Center dot */}
                    <circle cx="0" cy="0" r="6" fill="#065f46" />
                    <circle cx="0" cy="0" r="3" fill="white" />
                  </svg>
                </div>

                {/* Kaaba icon at needle tip */}
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  style={{ transform: `rotate(${needleAngle}deg)` }}
                >
                  <div
                    className="absolute text-lg"
                    style={{ transform: 'translateY(-85px)', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                  >
                    🕋
                  </div>
                </div>

                {/* Center label */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-amber-50 rounded-full flex flex-col items-center justify-center border-2 border-amber-200">
                    <span className="text-xs font-bold text-amber-700">{Math.round(qiblaAngle)}°</span>
                  </div>
                </div>
              </div>

              {/* Info cards */}
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
                  <Navigation size={24} className="mx-auto mb-2 text-emerald-500" />
                  <p className="text-2xl font-bold text-gray-800">{Math.round(qiblaAngle)}°</p>
                  <p className="text-xs text-gray-500 mt-1">اتجاه القبلة</p>
                </div>
                <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
                  <MapPin size={24} className="mx-auto mb-2 text-amber-500" />
                  <p className="text-2xl font-bold text-gray-800">
                    {distance !== null ? distance.toLocaleString('ar-SA') : '--'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">كيلومتر من مكة</p>
                </div>
              </div>

              {!hasCompass && (
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
                  <p className="text-xs text-amber-700">
                    💡 لتشغيل البوصلة التلقائية، افتح التطبيق على جهاز محمول يدعم البوصلة
                  </p>
                </div>
              )}

              <button
                onClick={getLocation}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-xl hover:bg-amber-200 transition-colors text-sm"
              >
                <RotateCcw size={14} />
                تحديث الموقع
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
