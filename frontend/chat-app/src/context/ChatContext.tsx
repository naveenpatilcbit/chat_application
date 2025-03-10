import { createContext, useContext, useState, ReactNode } from "react";
import { Message } from "@models/Message";

interface ChatContextType {
  messagesList: Message[];
  setMessagesList: React.Dispatch<React.SetStateAction<Message[]>>;
  addMessage: (text: string) => void;
}
export const ChatContext = createContext<ChatContextType | undefined>(
  undefined
);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messagesList, setMessagesList] = useState<Message[]>([]);

  const addMessage = (text: string) => {
    const newMessage: Message = {
      id: 546,
      message: text,
      sender: "user",
    };
    setMessagesList((prev) => [...prev, newMessage]);
  };

  return (
    <ChatContext.Provider value={{ messagesList, setMessagesList, addMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within a ChatProvider");
  return context;
};
