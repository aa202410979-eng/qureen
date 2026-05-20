import type { Reciter } from '../types';

// URL builders per reciter (all verified working)
const qdc = (slug: string, n: number) =>
  `https://download.quranicaudio.com/qdc/${slug}/murattal/${n}.mp3`;

const quaDouble = (slug: string, n: number) =>
  `https://download.quranicaudio.com/quran/${slug}//${String(n).padStart(3, '0')}.mp3`;

export interface ReciterFull extends Reciter {
  getUrl: (surahNumber: number) => string;
}

export const reciters: ReciterFull[] = [
  {
    id: '1',
    name: 'Mishary Rashid Alafasy',
    arabicName: 'مشاري راشد العفاسي',
    identifier: 'alafasy',
    style: 'مرتل',
    getUrl: (n) => qdc('mishari_al_afasy', n),
  },
  {
    id: '2',
    name: 'Abdul Basit Murattal',
    arabicName: 'عبد الباسط عبد الصمد',
    identifier: 'abdulbasit',
    style: 'مرتل',
    getUrl: (n) => qdc('abdul_baset', n),
  },
  {
    id: '3',
    name: 'Mahmoud Khalil Al-Husary',
    arabicName: 'محمود خليل الحصري',
    identifier: 'husary',
    style: 'مرتل',
    getUrl: (n) => qdc('khalil_al_husary', n),
  },
  {
    id: '4',
    name: 'Mohamed Siddiq Al-Minshawi',
    arabicName: 'محمد صديق المنشاوي',
    identifier: 'minshawi',
    style: 'مرتل',
    getUrl: (n) => qdc('siddiq_minshawi', n),
  },
  {
    id: '5',
    name: 'Saad Al-Ghamdi',
    arabicName: 'سعد الغامدي',
    identifier: 'ghamdi',
    style: 'مرتل',
    getUrl: (n) => quaDouble('sa3d_al-ghaamidi/complete', n),
  },
  {
    id: '7',
    name: 'Abu Bakr Al-Shatri',
    arabicName: 'أبو بكر الشاطري',
    identifier: 'shatri',
    style: 'مرتل',
    getUrl: (n) => qdc('abu_bakr_shatri', n),
  },
  {
    id: '8',
    name: 'Ahmad Al-Ajmi',
    arabicName: 'أحمد بن علي العجمي',
    identifier: 'ajmi',
    style: 'مرتل',
    getUrl: (n) => quaDouble('ahmed_ibn_3ali_al-3ajamy', n),
  },
];

export const getSurahAudioUrl = (reciterId: string, surahNumber: number): string => {
  const r = reciters.find(r => r.id === reciterId);
  return r ? r.getUrl(surahNumber) : '';
};
