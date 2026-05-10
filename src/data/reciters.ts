import type { Reciter } from '../types';

export const reciters: Reciter[] = [
  {
    id: '1',
    name: 'Mishary Rashid Alafasy',
    arabicName: 'مشاري راشد العفاسي',
    identifier: 'ar.alafasy',
    style: 'مرتل',
  },
  {
    id: '2',
    name: 'Abdul Basit Abdul Samad',
    arabicName: 'عبد الباسط عبد الصمد',
    identifier: 'ar.abdulbasitmurattal',
    style: 'مرتل',
  },
  {
    id: '3',
    name: 'Mahmoud Khalil Al-Husary',
    arabicName: 'محمود خليل الحصري',
    identifier: 'ar.husary',
    style: 'مرتل',
  },
  {
    id: '4',
    name: 'Mohamed Siddiq Al-Minshawi',
    arabicName: 'محمد صديق المنشاوي',
    identifier: 'ar.minshawi',
    style: 'مرتل',
  },
  {
    id: '5',
    name: 'Saad Al-Ghamdi',
    arabicName: 'سعد الغامدي',
    identifier: 'ar.saoodshuraym',
    style: 'مرتل',
  },
  {
    id: '6',
    name: 'Saud Al-Shuraim',
    arabicName: 'سعود الشريم',
    identifier: 'ar.shaatree',
    style: 'مرتل',
  },
  {
    id: '7',
    name: 'Maher Al Mueaqly',
    arabicName: 'ماهر المعيقلي',
    identifier: 'ar.mahermuaiqly',
    style: 'مرتل',
  },
  {
    id: '8',
    name: 'Ahmad Al-Ajmi',
    arabicName: 'أحمد بن علي العجمي',
    identifier: 'ar.ahmadajmi',
    style: 'مرتل',
  },
];

export const getAudioUrl = (reciterIdentifier: string, surahNumber: number, ayahNumber: number): string => {
  const surahPadded = String(surahNumber).padStart(3, '0');
  const ayahPadded = String(ayahNumber).padStart(3, '0');
  return `https://cdn.islamic.network/quran/audio/128/${reciterIdentifier}/${surahPadded}${ayahPadded}.mp3`;
};

export const getSurahAudioUrl = (reciterIdentifier: string, surahNumber: number): string => {
  const surahPadded = String(surahNumber).padStart(3, '0');
  return `https://cdn.islamic.network/quran/audio-surah/128/${reciterIdentifier}/${surahPadded}.mp3`;
};
