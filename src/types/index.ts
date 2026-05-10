export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
  sajda: boolean;
}

export interface SurahDetail {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
  ayahs: Ayah[];
}

export interface Reciter {
  id: string;
  name: string;
  arabicName: string;
  identifier: string;
  style?: string;
}

export interface Adhkar {
  id: number;
  category: 'morning' | 'evening' | 'general';
  text: string;
  source: string;
  count: number;
  benefit?: string;
}

export interface Dua {
  id: number;
  category: string;
  title: string;
  arabic: string;
  transliteration?: string;
  translation: string;
  source: string;
}
