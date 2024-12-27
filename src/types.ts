export type Language = 'en' | 'fa' | 'da' | 'fr' | 'ar';

export type CounselingCategory = 
  | 'general'
  | 'self-esteem'
  | 'relationships'
  | 'career'
  | 'depression'
  | 'anxiety'
  | 'trauma'
  | 'grief'
  | 'addiction'
  | 'stress';

export interface VoiceSettings {
  gender: 'male' | 'female';
  language: Language;
  category: CounselingCategory;
}

export const languageNames: Record<Language, string> = {
  en: 'English',
  fa: 'فارسی',
  da: 'Dansk',
  fr: 'Français',
  ar: 'العربية'
};

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'bot-typing' | 'bot-error';
  timestamp: Date;
}

export interface ChatResponse {
  text: string;
  followUp?: string;
}

export interface Translations {
  welcome: string;
  placeholder: string;
  chatSupport: string;
  voiceInput: string;
  send: string;
  switchLanguage: string;
  emotions: {
    anxiety: string;
    sadness: string;
    happiness: string;
    anger: string;
    gratitude: string;
  };
}
