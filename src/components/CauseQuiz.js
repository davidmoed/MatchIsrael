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
      // Create a temporary message for streaming
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Checking...", streaming: true },
      ]);

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
        throw new Error("Failed to send message");
      }

      // Handle Server-Sent Events stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.done) {
                streamDone = true;
                break;
              }
              if (data.error) {
                throw new Error(data.error);
              }
              if (data.content) {
                currentMessageRef.current += data.content;
                // In your streaming update loop
                setMessages((prev) => {
                  const newMessages = [...prev];
                  // Find the assistant message with 'streaming: true'
                  const idx = newMessages.findIndex(
                    (m) => m.role === "assistant" && m.streaming
                  );
                  if (idx !== -1) {
                    newMessages[idx] = {
                      ...newMessages[idx],
                      content: currentMessageRef.current,
                      streaming: true,
                    };
                  }
                  return newMessages;
                });
              }
            } catch (e) {
              // Skip invalid JSON or handle errors
              if (
                e instanceof Error &&
                e.message !== "Unexpected end of JSON input"
              ) {
                throw e;
              }
            }
          }
        }
      }
    } catch (error) {
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages.push({
          role: "assistant",
          content:
            "I encountered an error while processing your request. Please try again or rephrase your question.",
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
