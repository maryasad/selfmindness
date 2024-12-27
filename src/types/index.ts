export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface MoodEntry {
  id: string;
  userId: string;
  mood: 'happy' | 'sad' | 'neutral' | 'anxious' | 'excited' | 'tired';
  intensity: number;
  note: string;
  timestamp: Date;
}

export interface DailyRoutine {
  id: string;
  userId: string;
  activity: string;
  duration: number;
  state: 'focused' | 'tired' | 'energetic' | 'relaxed';
  timestamp: Date;
}

export interface ChatMessage {
  id: string;
  userId: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface Consultant {
  id: string;
  name: string;
  specialization: string;
  availability: string[];
  rating: number;
}

// Response interface for chatbot
export interface Response {
  text: string;
  followUp?: string;
}

// Language type
export type Language = 'en' | 'fa' | 'da';

// Voice preference type
export type VoiceGender = 'male' | 'female';

// Counseling category type
export type CounselingCategory = 
  | 'general'           // General emotional support
  | 'anxiety'           // Anxiety and stress management
  | 'depression'        // Depression and mood
  | 'relationships'     // Relationship issues
  | 'career'           // Career guidance
  | 'grief'            // Grief and loss
  | 'trauma'           // Trauma and PTSD
  | 'self-esteem'      // Self-esteem and confidence
  | 'mindfulness';      // Mindfulness and meditation

// Extended voice settings with specialization
export interface VoiceSettings {
  gender: VoiceGender;
  language: Language;
  category: CounselingCategory;
}

// Counselor profile interface
export interface CounselorProfile {
  id: string;
  name: string;
  gender: VoiceGender;
  languages: Language[];
  specializations: CounselingCategory[];
  experience: number; // years of experience
  description: Record<Language, string>; // Multilingual descriptions
  avatarUrl?: string;
}

// Conversation context interface
export interface ConversationContext {
  lastTopic: string;
  emotionalState: string;
  suggestedExercises: string[];
  completedExercises: string[];
  goals: string[];
  values: string[];
}

// Therapeutic context interface
export interface TherapeuticContext {
  currentPhase: 'assessment' | 'intervention' | 'maintenance';
  sessionNumber: number;
  primaryConcern: string;
  treatmentGoals: string[];
  interventionsUsed: string[];
  progressMarkers: {
    date: string;
    metric: string;
    value: number;
  }[];
  homeworkAssigned: {
    date: string;
    task: string;
    completed: boolean;
  }[];
  copingStrategies: {
    strategy: string;
    effectiveness: number;
    frequency: number;
  }[];
}
