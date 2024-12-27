import React, { useState, useRef, useEffect } from 'react';
import { Box, Paper, TextField, Button, Typography, IconButton, Alert, Snackbar, Switch, FormControlLabel } from '@mui/material';
import { Send, Stop, VolumeUp, VolumeOff, Mic } from '@mui/icons-material';
import { VoiceSelector } from './VoiceSelector';
import { CategorySelector } from './CategorySelector';
import QuestionSelector from './QuestionSelector';
import { VoiceSettings, CounselingCategory } from '../types';
import { generateResponse } from '../services/chatbot';
import { getUIStrings } from '../utils/strings';

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [textToSpeechEnabled, setTextToSpeechEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    gender: 'female',
    language: 'en',
    category: 'general' as CounselingCategory
  });
  const [selectedCategory, setSelectedCategory] = useState<CounselingCategory>('general');

  const strings = getUIStrings(voiceSettings.language);

  useEffect(() => {
    // Initialize speech recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = voiceSettings.language === 'en' ? 'en-US' : 'fa-IR';

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setInputText(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError('Error with speech recognition. Please try again.');
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      setError('Speech recognition is not supported in your browser.');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [voiceSettings.language]);

  useEffect(() => {
    if (recognitionRef.current) {
      const langMap = {
        'en': 'en-US',
        'da': 'da-DK',
        'fa': 'fa-IR'
      };
      recognitionRef.current.lang = langMap[voiceSettings.language];
      console.log('Recognition language set to:', recognitionRef.current.lang);
    }
  }, [voiceSettings.language]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        console.log('Speech synthesis is supported');
        synthRef.current = window.speechSynthesis;

        // Load voices
        const loadVoices = () => {
          const voices = synthRef.current!.getVoices();
          console.log('Available voices:', voices.map(v => ({
            name: v.name,
            lang: v.lang,
            default: v.default
          })));
        };

        // Chrome loads voices asynchronously
        if (speechSynthesis.onvoiceschanged !== undefined) {
          speechSynthesis.onvoiceschanged = loadVoices;
        }

        loadVoices();
      } else {
        console.error('Speech synthesis is not supported');
        setError('Speech synthesis is not supported in your browser');
      }
    }
  }, []);

  const speakText = async (text: string) => {
    try {
      if (!synthRef.current || !textToSpeechEnabled) {
        console.error('Speech synthesis not available or disabled');
        return;
      }

      // Cancel any ongoing speech
      if (synthRef.current.speaking) {
        synthRef.current.cancel();
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Get voices and wait if they're not loaded yet
      let voices = synthRef.current.getVoices();
      if (voices.length === 0) {
        console.log('Waiting for voices to load...');
        await new Promise<void>((resolve) => {
          const checkVoices = () => {
            voices = synthRef.current!.getVoices();
            if (voices.length > 0) {
              resolve();
            } else {
              setTimeout(checkVoices, 100);
            }
          };
          checkVoices();
        });
      }

      console.log('Current voice settings:', voiceSettings);
      console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));

      // Create utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set event handlers first
      utterance.onstart = () => {
        console.log('Speech started');
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        console.log('Speech ended');
        setIsSpeaking(false);
      };

      utterance.onerror = (event) => {
        console.error('Speech error:', event);
        setIsSpeaking(false);
        
        // Try fallback for Danish
        if (voiceSettings.language === 'da' && event.error === 'synthesis-failed') {
          console.log('Danish synthesis failed, trying fallback...');
          const fallbackUtterance = new SpeechSynthesisUtterance(text);
          fallbackUtterance.lang = 'en-US';
          fallbackUtterance.rate = 0.9;
          fallbackUtterance.pitch = 1.0;
          synthRef.current?.speak(fallbackUtterance);
          return;
        }
        
        setError('Error during speech synthesis');
      };

      // Set language-specific settings
      switch (voiceSettings.language) {
        case 'da': {
          console.log('Setting up Danish voice...');
          utterance.lang = 'da-DK';
          
          // Try to find Danish voices
          const danishVoices = voices.filter(v => 
            v.lang.startsWith('da') || 
            v.name.toLowerCase().includes('danish')
          );
          console.log('Found Danish voices:', danishVoices);

          // If no Danish voices, try to find the best alternative
          if (danishVoices.length === 0) {
            console.log('No Danish voices found, selecting best alternative...');
            
            // Prefer female voices if that's the setting
            const preferredGender = voiceSettings.gender === 'female' ? 'Female' : 'Male';
            
            // Try to find a good quality voice (prefer UK English as it's closer to Danish accent)
            const fallbackVoice = 
              voices.find(v => v.name === `Google UK English ${preferredGender}`) ||
              voices.find(v => v.name.includes('UK English')) ||
              voices.find(v => v.name.includes('Google US English')) ||
              voices.find(v => v.name.includes('Microsoft Zira')) ||
              voices.find(v => v.lang === 'en-GB') ||
              voices.find(v => v.lang === 'en-US');

            if (fallbackVoice) {
              console.log('Selected fallback voice:', fallbackVoice.name);
              utterance.voice = fallbackVoice;
              // Adjust rate and pitch for better Danish-like pronunciation
              utterance.rate = 0.85;  // Slightly slower
              utterance.pitch = 1.1;  // Slightly higher pitch
            }
          } else {
            utterance.voice = danishVoices[0];
            utterance.rate = 0.9;
            utterance.pitch = 1.0;
          }

          if (!utterance.voice) {
            console.log('No suitable voice found, using default');
          }
          break;
        }
        
        case 'fa': {
          utterance.lang = 'fa-IR';
          utterance.voice = voices.find(v => v.name === 'Microsoft David - English (United States)') || 
                          voices.find(v => v.name.includes('Microsoft')) || 
                          voices[0];
          utterance.text = '\u200F' + text;
          utterance.rate = 0.75;
          utterance.pitch = 1.0;
          break;
        }
        
        default: {
          utterance.lang = 'en-US';
          const englishVoices = voices.filter(v => v.lang.startsWith('en'));
          utterance.voice = englishVoices[0] || voices[0];
          utterance.rate = 0.9;
          utterance.pitch = 1.0;
          break;
        }
      }

      // Log final configuration
      console.log('Final voice configuration:', {
        language: voiceSettings.language,
        utteranceLang: utterance.lang,
        selectedVoice: utterance.voice?.name,
        voiceLang: utterance.voice?.lang,
        rate: utterance.rate,
        text: text.slice(0, 50)
      });

      // Speak
      synthRef.current.speak(utterance);

    } catch (error) {
      console.error('Error in speakText:', error);
      setError('Error with text-to-speech. Please try again.');
      setIsSpeaking(false);
    }
  };

  const startListening = async () => {
    try {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
        setError(null);
      }
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setError('Could not start speech recognition. Please try again.');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleVoiceInput = () => {
    if (!isListening) {
      startListening();
    } else {
      stopListening();
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Add user message
    const newMessages = [...messages, { text: inputText, isUser: true }];
    setMessages(newMessages);

    try {
      // Get chatbot response
      const response = await generateResponse(inputText, voiceSettings);

      // Add chatbot response, handling both string and object responses
      const responseText = typeof response === 'string' ? response : response.text;
      setMessages([...newMessages, { text: responseText, isUser: false }]);

      // Speak the response
      speakText(responseText);

      // If there's a follow-up question, add it as a separate message
      if (typeof response === 'object' && response.followUp) {
        setTimeout(() => {
          setMessages(prev => [...prev, { text: response.followUp, isUser: false }]);
          // Speak the follow-up after a short delay
          setTimeout(() => speakText(response.followUp), 1000);
        }, 1000);
      }
    } catch (error) {
      console.error('Error getting response:', error);
      setMessages([...newMessages, { text: strings.errorProcessing, isUser: false }]);
      speakText(strings.errorProcessing);
    }
    setInputText('');
  };

  const handleQuestionSelect = (question: string) => {
    setInputText(question);
  };

  return (
    <Box sx={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      backgroundColor: '#f5f8fa'
    }}>
      {/* Voice Settings */}
      <Paper sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <VoiceSelector
          currentSettings={voiceSettings}
          onVoiceChange={setVoiceSettings}
        />
        <FormControlLabel
          control={
            <Switch
              checked={textToSpeechEnabled}
              onChange={(e) => {
                setTextToSpeechEnabled(e.target.checked);
                if (!e.target.checked && synthRef.current) {
                  synthRef.current.cancel();
                  setIsSpeaking(false);
                }
              }}
              icon={<VolumeOff />}
              checkedIcon={<VolumeUp />}
            />
          }
          label={textToSpeechEnabled ? strings.voiceResponseOn : strings.voiceResponseOff}
        />
      </Paper>

      {/* Category Selector */}
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <CategorySelector
          currentCategory={selectedCategory}
          onCategoryChange={(category) => {
            setSelectedCategory(category);
            setVoiceSettings(prev => ({ ...prev, category }));
          }}
          language={voiceSettings.language}
        />
      </Paper>

      {/* Question Selector */}
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <QuestionSelector
          category={selectedCategory}
          language={voiceSettings.language}
          onQuestionSelect={handleQuestionSelect}
        />
      </Paper>

      {/* Input Area */}
      <Paper sx={{
        p: 2,
        borderRadius: 2,
        display: 'flex',
        gap: 2,
        alignItems: 'center'
      }}>
        <TextField
          fullWidth
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={strings.writeMessage}
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }}
        />
        <IconButton
          onClick={handleVoiceInput}
          sx={{
            color: isListening ? '#e91e63' : '#757575',
            '&:hover': {
              color: '#e91e63'
            }
          }}
        >
          {isListening ? <Stop /> : <Mic />}
        </IconButton>
        <IconButton
          onClick={handleSendMessage}
          disabled={!inputText.trim()}
          sx={{
            backgroundColor: '#2196f3',
            color: 'white',
            '&:hover': {
              backgroundColor: '#1976d2'
            },
            '&.Mui-disabled': {
              backgroundColor: '#e0e0e0',
              color: '#9e9e9e'
            }
          }}
        >
          <Send />
        </IconButton>
      </Paper>

      {/* Chat Messages */}
      <Paper sx={{
        p: 2,
        borderRadius: 2,
        flex: 1,
        minHeight: '300px',
        maxHeight: '500px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        {messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              alignSelf: message.isUser ? 'flex-end' : 'flex-start',
              maxWidth: '80%'
            }}
          >
            {!message.isUser && (
              <IconButton
                size="small"
                onClick={() => speakText(message.text)}
                sx={{
                  color: isSpeaking ? '#e91e63' : '#757575',
                  '&:hover': {
                    color: '#e91e63'
                  },
                  visibility: textToSpeechEnabled ? 'visible' : 'hidden'
                }}
              >
                <VolumeUp fontSize="small" />
              </IconButton>
            )}
            <Box
              sx={{
                bgcolor: message.isUser ? '#2196f3' : '#f0f2f5',
                color: message.isUser ? 'white' : '#1a1a1a',
                p: 1.5,
                borderRadius: 2,
                ...(message.isUser ? {
                  borderBottomRightRadius: 0.5,
                  order: 2
                } : {
                  borderBottomLeftRadius: 0.5,
                  order: 1
                })
              }}
            >
              <Typography>{message.text}</Typography>
            </Box>
          </Box>
        ))}
      </Paper>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};
