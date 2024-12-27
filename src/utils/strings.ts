import { Language } from '../types';

interface UIStrings {
  writeMessage: string;
  send: string;
  voiceResponseOn: string;
  voiceResponseOff: string;
  errorProcessing: string;
}

const strings: Record<Language, UIStrings> = {
  en: {
    writeMessage: 'Write your message...',
    send: 'Send',
    voiceResponseOn: 'Voice Response On',
    voiceResponseOff: 'Voice Response Off',
    errorProcessing: "I'm sorry, I couldn't process your request. Please try again."
  },
  da: {
    writeMessage: 'Skriv din besked...',
    send: 'Send',
    voiceResponseOn: 'Stemmerespons til',
    voiceResponseOff: 'Stemmerespons fra',
    errorProcessing: "Jeg beklager, jeg kunne ikke behandle din anmodning. Prøv igen."
  },
  fa: {
    writeMessage: '...پیام خود را بنویسید',
    send: 'ارسال',
    voiceResponseOn: 'پاسخ صوتی روشن',
    voiceResponseOff: 'پاسخ صوتی خاموش',
    errorProcessing: "متأسفم، نتوانستم درخواست شما را پردازش کنم. لطفا دوباره تلاش کنید."
  }
};

export const getUIStrings = (language: Language): UIStrings => {
  return strings[language];
};
