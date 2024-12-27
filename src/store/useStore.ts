import { create } from 'zustand';
import { User, MoodEntry, DailyRoutine } from '../types';

interface Store {
  user: User | null;
  moodEntries: MoodEntry[];
  dailyRoutines: DailyRoutine[];
  setUser: (user: User | null) => void;
  addMoodEntry: (entry: MoodEntry) => void;
  addDailyRoutine: (routine: DailyRoutine) => void;
}

export const useStore = create<Store>((set) => ({
  user: null,
  moodEntries: [],
  dailyRoutines: [],
  
  setUser: (user) => set({ user }),
  
  addMoodEntry: (entry) =>
    set((state) => ({
      moodEntries: [...state.moodEntries, entry],
    })),
    
  addDailyRoutine: (routine) =>
    set((state) => ({
      dailyRoutines: [...state.dailyRoutines, routine],
    })),
}));
