import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "../styles/components/CauseQuiz.css";

const getApiBaseUrl = () => {
  if (
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost"
  ) {
    return window.location.origin;
  }

  return "http://localhost:3001";
};

const API_BASE_URL = getApiBaseUrl();

const CauseQuiz = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi I'm Ezra, and welcome to Match Israel! I'm here to help you find a great cause to support. Would you like to hear about the different types of non-profits we work with? Or perhaps you'd like to start by telling my what you're most passionate about and we can try and “Match” you with a great non-profit!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState(null);
  const [assistantId, setAssistantId] = useState(null);
  const chatContainerRef = useRef(null);
  const currentMessageRef = useRef("");

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/.netlify/functions/chat-initialize`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to initialize chat");
        }

        const data = await response.json();
        setAssistantId(data.assistantId);
        setThreadId(data.threadId);
      } catch (err) {
        console.error("Failed to initialize chat:", err);
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages.push({
            role: "assistant",
            content:
              "I'm having trouble connecting right now. Please try refreshing the page.",
          });
          return newMessages;
        });
      }
    };

    initializeChat();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const messageText = input.trim();
    if (!messageText || isLoading || !threadId || !assistantId) return;

    const userMessage = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    currentMessageRef.current = "";

    try {
      // Send message to backend API
      const response = await fetch(
        `${API_BASE_URL}/.netlify/functions/chat-message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            threadId,
            assistantId,
            message: messageText,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            "I'm having trouble connecting. Please try again."
        );
      }

      // Handle non-streaming JSON response
      const data = await response.json();

      // Update messages with assistant response (including error messages from backend)
      setMessages((prev) => {
        const newMessages = [...prev];
        // Remove any temporary loading message if it exists
        const loadingIdx = newMessages.findIndex(
          (m) => m.role === "assistant" && m.streaming
        );
        if (loadingIdx !== -1) {
          newMessages.splice(loadingIdx, 1);
        }
        // Add assistant's response (even if it's an error message, display it)
        newMessages.push({
          role: "assistant",
          content:
            data.content || "I'm sorry, I couldn't process that request.",
        });
        return newMessages;
      });
    } catch (error) {
      // Add user-friendly error message to messages array
      let errorMessage =
        "I'm sorry, but I'm having trouble processing your request right now. Please try again or rephrase your question.";

      // Provide more specific error messages for network issues
      if (
        error.message?.includes("fetch") ||
        error.message?.includes("network")
      ) {
        errorMessage =
          "I'm having trouble connecting to the server. Please check your internet connection and try again.";
      } else if (error.message?.includes("timeout")) {
        errorMessage =
          "Your request is taking longer than expected. Please try again with a shorter question.";
      } else if (error.message) {
        // Use the error message from the backend if available
        errorMessage = error.message;
      }

      setMessages((prev) => {
        const newMessages = [...prev];
        // Remove any temporary loading message if it exists
        const loadingIdx = newMessages.findIndex(
          (m) => m.role === "assistant" && m.streaming
        );
        if (loadingIdx !== -1) {
          newMessages.splice(loadingIdx, 1);
        }
        newMessages.push({
          role: "assistant",
          content: errorMessage,
        });
        return newMessages;
      });
    } finally {
      setIsLoading(false);
      currentMessageRef.current = "";
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <section className="cause-quiz" id="cause-quiz">
      <h2 className="quiz-title">Find Your Perfect Cause</h2>
      <div className="quiz-container">
        <div className="chat-container" ref={chatContainerRef}>
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              {message.role === "assistant" && (
                <div className="assistant-name">Ezra</div>
              )}
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="chat-input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="chat-input"
            disabled={isLoading || !threadId || !assistantId}
          />
          <button
            type="submit"
            className="send-button"
            disabled={isLoading || !threadId || !assistantId}
          >
            {isLoading ? "..." : "Send"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default CauseQuiz;
