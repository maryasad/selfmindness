import { useState, useEffect } from 'react';
import { VoiceSettings } from '../types';

export const useSpeech = (voiceSettings: VoiceSettings) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported] = useState({
    speechSynthesis: 'speechSynthesis' in window,
    speechRecognition: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
  });

  useEffect(() => {
    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };

    loadVoices();
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const speak = (text: string) => {
    if (!isSupported.speechSynthesis) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    setIsSpeaking(false);

    // Split text into smaller chunks at sentence boundaries
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    
    let currentIndex = 0;

    const speakNextSentence = () => {
      if (currentIndex < sentences.length) {
        const utterance = new SpeechSynthesisUtterance(sentences[currentIndex].trim());
        utterance.lang = voiceSettings.language === 'en' ? 'en-US' : 'fa-IR';
        utterance.rate = 0.9; // Slightly slower rate for better clarity
        utterance.pitch = voiceSettings.gender === 'female' ? 1.2 : 0.8;
        utterance.volume = 1;

        // Try to find a voice matching both language and gender
        const preferredVoice = voices.find(v => {
          const matchesLanguage = v.lang.startsWith(voiceSettings.language);
          const matchesGender = voiceSettings.gender === 'female' ? 
            v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('woman') :
            v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('man');
          return matchesLanguage && matchesGender;
        });

        // If no perfect match, try to find a voice matching just the language
        const fallbackVoice = voices.find(v => v.lang.startsWith(voiceSettings.language));

        utterance.voice = preferredVoice || fallbackVoice || null;

        utterance.onstart = () => {
          setIsSpeaking(true);
        };

        utterance.onend = () => {
          currentIndex++;
          if (currentIndex < sentences.length) {
            setTimeout(speakNextSentence, 300); // Add a small pause between sentences
          } else {
            setIsSpeaking(false);
          }
        };

        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event);
          setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
      }
    };

    speakNextSentence();
  };

  const startListening = (onResult: (text: string) => void) => {
    if (!isSupported.speechRecognition) return null;

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = voiceSettings.language === 'en' ? 'en-US' : 'fa-IR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      onResult(text);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.start();
    return recognition;
  };

  return {
    speak,
    startListening,
    isSupported,
    isSpeaking,
  };
};
