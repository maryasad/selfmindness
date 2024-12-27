import { createContext, useContext, ReactNode, useState } from 'react';
import { Message } from '../types';

interface ChatContextType {
  messages: Message[];
  addMessage: (text: string, sender: Message['sender']) => void;
  removeLastMessage: () => void;
  isTyping: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const addMessage = (text: string, sender: Message['sender']) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const removeLastMessage = () => {
    setMessages((prev) => prev.slice(0, -1));
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage, removeLastMessage, isTyping }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
