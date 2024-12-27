import { VoiceSettings } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// System prompt to define the assistant's role and capabilities
const getSystemPrompt = (voiceSettings: VoiceSettings) => {
  const gender = voiceSettings.gender === 'female' ? 
    'a compassionate female therapist' : 
    'an understanding male therapist';
  
  const language = voiceSettings.language === 'en' ? 'English' : 'Persian';
  
  return `You are ${gender} with expertise in ${voiceSettings.category}. 
    Respond in ${language} with empathy and professional insight.
    Keep responses concise (2-3 sentences) and natural.
    Focus on active listening and asking thoughtful questions.
    If user shows signs of crisis, provide crisis resources.
    
    Style Guide:
    - Be warm and supportive
    - Use natural conversational language
    - Ask open-ended questions
    - Reflect user's emotions
    - Maintain professional boundaries
    - Avoid giving direct advice
    - Focus on emotional support
    
    Crisis Keywords: suicide, self-harm, abuse, emergency
    If these appear, include crisis hotline information.`;
};

// Conversation history management
interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

let conversationHistory: Message[] = [];

// Function to manage conversation history length
const updateConversationHistory = (newMessage: Message) => {
  // Keep last 10 messages to maintain context while managing token usage
  if (conversationHistory.length > 10) {
    conversationHistory = conversationHistory.slice(-10);
  }
  conversationHistory.push(newMessage);
};

// Main function to generate responses using GPT
export const generateGPTResponse = async (
  userMessage: string,
  voiceSettings: VoiceSettings
) => {
  try {
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        voiceSettings
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response');
    }

    const data = await response.json();
    return {
      text: data.response,
      followUp: null
    };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
