import { createContext, useContext, useState } from "react";
import { submitQuery } from "../services/apiQuery";
import { v4 as uuidv4 } from "uuid";

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDefaultScreen, setShowDefaultScreen] = useState(true);
  const [threadId, setThreadId] = useState(null);

  const addUserMsg = (data) => {
    setMessages((prev) => {
      return [...prev, data];
    });
  };

  const askBot = async (q) => {
    try {
      setLoading(true);
      setShowDefaultScreen(false);
      const response = await submitQuery(q, threadId);
      setMessages((prev) => {
        return [...prev, { text: response.message, sender: "bot" }];
      });
    } catch (error) {
      console.log("error gettting bot response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        addUserMsg,
        loading,
        askBot,
        showDefaultScreen,
        setShowDefaultScreen,
        threadId,
        setThreadId,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
