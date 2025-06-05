import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "../styles/components/CauseQuiz.css";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OAI_KEY,
  dangerouslyAllowBrowser: true,
});

const cleanResponse = (text) => {
  // remove footnotes
  return text.replace(/【[^】]*】/g, "");
};

const CauseQuiz = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi I'm Ezra! I'm here to help you find your perfect cause to support. Do you have any types of nonprofits you'd like to hear about?",
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
        const assistant = await openai.beta.assistants.retrieve(
          process.env.REACT_APP_ASSISTANT_ID
        );
        setAssistantId(assistant.id);

        const thread = await openai.beta.threads.create();
        setThreadId(thread.id);
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
    if (!input.trim() || isLoading || !threadId || !assistantId) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    currentMessageRef.current = "";

    try {
      // Add message to existing thread
      await openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: input,
      });

      // Run the assistant
      const run = await openai.beta.threads.runs.create(threadId, {
        assistant_id: assistantId,
        stream: true,
      });

      // Create a temporary message for streaming
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Checking..." },
      ]);

      // Handle the stream
      for await (const chunk of run) {
        if (chunk.event === "thread.message.delta") {
          const content = chunk.data.delta.content?.[0]?.text?.value || "";
          if (content) {
            currentMessageRef.current += content;
            setMessages((prev) => {
              const newMessages = [...prev];
              const lastMessage = newMessages[newMessages.length - 1];
              lastMessage.content = cleanResponse(currentMessageRef.current);
              return newMessages;
            });
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
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
    <section className="cause-quiz">
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
