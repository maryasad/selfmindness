import { createContext, useContext, ReactNode, useState } from 'react';
import { Language, Translations } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: Translations;
}

const translations: Record<Language, Translations> = {
  en: {
    welcome: "Hello! I'm your mindfulness companion. How are you feeling today?",
    placeholder: "Type your message...",
    chatSupport: "AI Chat Support",
    voiceInput: "Voice input",
    send: "Send",
    switchLanguage: "Switch to Persian",
    emotions: {
      anxiety: "I hear that you're feeling anxious. That's very normal. Would you like to try a breathing exercise?",
      sadness: "I'm sorry you're feeling sad. Remember that it's okay to feel this way. Would you like to talk about it?",
      happiness: "I'm glad you're feeling happy! Would you like to share what's making you feel good?",
      anger: "I understand you're feeling angry. Let's work through this together. What triggered these feelings?",
      gratitude: "It's wonderful that you're feeling grateful. Gratitude can really brighten our perspective.",
    }
  },
  fa: {
    welcome: "سلام! من همراه ذهن‌آگاهی شما هستم. امروز چه احساسی دارید؟",
    placeholder: "پیام خود را بنویسید...",
    chatSupport: "پشتیبانی گفتگوی هوشمند",
    voiceInput: "ورودی صوتی",
    send: "ارسال",
    switchLanguage: "Switch to English",
    emotions: {
      anxiety: "می‌فهمم که احساس اضطراب می‌کنید. این کاملاً طبیعی است. می‌خواهید تمرین تنفس را امتحان کنیم؟",
      sadness: "متأسفم که احساس ناراحتی می‌کنید. یادتان باشد که داشتن این احساس اشکالی ندارد. می‌خواهید درباره‌اش صحبت کنیم؟",
      happiness: "خوشحالم که احساس خوبی دارید! دوست دارید بگویید چه چیزی باعث این احساس خوب شده؟",
      anger: "درک می‌کنم که عصبانی هستید. بیایید با هم این موضوع را حل کنیم. چه چیزی باعث این احساسات شده؟",
      gratitude: "چقدر عالی که احساس قدردانی می‌کنید. قدردانی می‌تواند دیدگاه ما را روشن‌تر کند.",
    }
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      translations: translations[language] 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
