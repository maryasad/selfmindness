import React, { useState, useEffect } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { TherapistSelector, therapists } from '../components/TherapistSelector';
import { CategorySelector } from '../components/CategorySelector';
import { QuestionSelector } from '../components/QuestionSelector';
import { CounselingCategory, Language, languageNames } from '../types';
import { MenuItem, Select, FormControl } from '@mui/material';

// Type for chat messages
interface ChatMessage {
  text: string;
  isBot: boolean;
  timestamp: number;
}

export const Chat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [language, setLanguage] = useState<Language>('en');
  const [selectedTherapist, setSelectedTherapist] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CounselingCategory>('general');
  
  const voiceSettings = {
    language,
    gender: 'female' as const,
    category: selectedCategory
  };
  
  const { speak, startListening, isSupported, isSpeaking } = useSpeech(voiceSettings);
  const [isListening, setIsListening] = useState(false);

  // Load chat history on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  const handleVoiceInput = () => {
    if (!isSupported.speechRecognition) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    startListening((text) => {
      setInputText(text);
      setIsListening(false);
    });
  };

  const handleQuestionSelect = (question: string) => {
    setInputText(question);
  };

  const clearHistory = () => {
    if (window.confirm(language === 'en' 
      ? 'Are you sure you want to clear the chat history?' 
      : language === 'fa' ? 'آیا مطمئن هستید که می‌خواهید تاریخچه چت را پاک کنید؟' 
      : language === 'da' ? 'Er du sikker på, at du vil slette chattehistorikken?' 
      : language === 'fr' ? 'Êtes-vous sûr de vouloir effacer l\'historique du chat?' 
      : 'هل أنت متأكد من أنك تريد مسح سجل الدردشة؟')) {
      setMessages([]);
      localStorage.removeItem('chatHistory');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const currentTherapist = therapists.find(t => t.id === selectedTherapist);
    const timestamp = Date.now();

    // Add user message
    setMessages(prev => [...prev, { 
      text: inputText, 
      isBot: false,
      timestamp 
    }]);

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: inputText,
          voiceSettings,
          systemPrompt: currentTherapist?.systemPrompt
        }),
      });

      const data = await response.json();
      const botMessage = data.response;
      setMessages(prev => [...prev, { 
        text: botMessage, 
        isBot: true,
        timestamp: Date.now()
      }]);
      
      // Speak the response
      if (isSupported.speechSynthesis) {
        speak(botMessage);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = language === 'en' 
        ? "Sorry, I'm having trouble responding right now. Please try again."
        : language === 'fa' ? "متأسفم، در حال حاضر در پاسخگویی مشکل دارم. لطفاً دوباره امتحان کنید."
        : language === 'da' ? "Undskyld, jeg har problemer med at svare lige nu. Prøv igen."
        : language === 'fr' ? "Désolé, j'ai des problèmes pour répondre pour le moment. Réessayez."
        : " آسف، أنا أعاني من مشاكل في الرد الآن. حاول مرة أخرى.";
      setMessages(prev => [...prev, { 
        text: errorMessage, 
        isBot: true,
        timestamp: Date.now()
      }]);
    }

    setInputText('');
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(language === 'en' ? 'en-US' : language === 'fa' ? 'fa-IR' : 'fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px' }}>
      {/* Language Selector and Clear History */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        marginBottom: '20px',
        alignItems: 'center'
      }}>
        <FormControl size="small" style={{ minWidth: 120 }}>
          <Select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            style={{
              backgroundColor: 'white',
              borderRadius: '4px',
              direction: language === 'ar' || language === 'fa' ? 'rtl' : 'ltr'
            }}
          >
            {Object.entries(languageNames).map(([code, name]) => (
              <MenuItem 
                key={code} 
                value={code}
                style={{
                  direction: code === 'ar' || code === 'fa' ? 'rtl' : 'ltr',
                  textAlign: code === 'ar' || code === 'fa' ? 'right' : 'left'
                }}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <button
          onClick={clearHistory}
          style={{
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            background: '#ff4081',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {language === 'en' ? 'Clear History' : 
           language === 'fa' ? 'پاک کردن تاریخچه' :
           language === 'da' ? 'Ryd historik' :
           language === 'fr' ? 'Effacer l\'historique' :
           'مسح السجل'}
        </button>
      </div>

      {/* Therapist Selector */}
      <TherapistSelector
        selectedTherapist={selectedTherapist}
        onSelect={setSelectedTherapist}
        language={language}
      />

      {/* Category Selector */}
      <CategorySelector
        currentCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        language={language}
      />

      {/* Question Selector */}
      <QuestionSelector
        category={selectedCategory}
        language={language}
        onQuestionSelect={handleQuestionSelect}
      />

      {/* Input Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '6px',
            border: '1px solid #ddd',
            fontSize: '16px',
            outline: 'none',
            direction: language === 'ar' || language === 'fa' ? 'rtl' : 'ltr'
          }}
          placeholder={
            language === 'en' ? "Type your message..." : 
            language === 'fa' ? "پیام خود را بنویسید..." :
            language === 'da' ? "Skriv din besked..." :
            language === 'fr' ? "Tapez votre message..." :
            "اكتب رسالتك..."
          }
        />
        {isSupported.speechRecognition && (
          <button
            type="button"
            onClick={handleVoiceInput}
            style={{
              padding: '12px',
              borderRadius: '6px',
              border: 'none',
              background: isListening ? '#ff4081' : '#f0f0f0',
              cursor: 'pointer',
              fontSize: '16px',
              width: '50px'
            }}
            title={language === 'en' ? 'Voice Input' : 
             language === 'fa' ? 'ورودی صوتی' :
             language === 'da' ? 'Stemmeindtastning' :
             language === 'fr' ? 'Entrée vocale' :
             'مدخل الصوت'}
          >
            🎤
          </button>
        )}
        <button 
          type="submit"
          style={{
            padding: '12px 24px',
            borderRadius: '6px',
            border: 'none',
            background: '#2196f3',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background 0.2s',
            fontWeight: 500
          }}
          onMouseOver={(e) => e.currentTarget.style.background = '#1976d2'}
          onMouseOut={(e) => e.currentTarget.style.background = '#2196f3'}
        >
          {language === 'en' ? 'Send' : 
           language === 'fa' ? 'ارسال' :
           language === 'da' ? 'Send' :
           language === 'fr' ? 'Envoyer' :
           'إرسال'}
        </button>
      </form>

      {/* Chat Messages */}
      <div style={{ 
        border: '1px solid #ccc',
        borderRadius: '8px',
        height: '400px',
        overflowY: 'auto',
        padding: '20px',
        marginTop: '20px',
        backgroundColor: '#f8f9fa',
        direction: language === 'ar' || language === 'fa' ? 'rtl' : 'ltr'
      }}>
        {messages.map((msg, index) => (
          <div key={index} style={{
            marginBottom: '10px',
            textAlign: msg.isBot ? 'left' : 'right',
            direction: language === 'ar' || language === 'fa' ? 'rtl' : 'ltr'
          }}>
            <div style={{
              display: 'inline-block',
              background: msg.isBot ? '#e3f2fd' : '#e8f5e9',
              padding: '12px',
              borderRadius: '12px',
              maxWidth: '70%',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              color: '#333'
            }}>
              <div style={{ marginBottom: '4px' }}>{msg.text}</div>
              <div style={{ 
                fontSize: '12px', 
                color: '#666', 
                textAlign: 'right',
                marginTop: '4px'
              }}>
                {formatTimestamp(msg.timestamp)}
                {msg.isBot && isSupported.speechSynthesis && (
                  <button
                    onClick={() => speak(msg.text)}
                    style={{
                      marginLeft: '8px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      opacity: 0.6,
                      fontSize: '16px'
                    }}
                    title={language === 'en' ? 'Listen' : 
                     language === 'fa' ? 'گوش کنید' :
                     language === 'da' ? 'Lytt' :
                     language === 'fr' ? 'Écouter' :
                     'استمع'}
                  >
                    🔊
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chat;
