import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "../styles/components/CauseQuiz.css";
import OpenAI from "openai";

// Configuration constants
const POLLING_INTERVAL = 1000; // 1 second
const MAX_RETRIES = 10;

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OAI_KEY,
  dangerouslyAllowBrowser: true,
});

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

  // Initialize assistant and thread on component mount
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
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "I'm having trouble connecting right now. Please try refreshing the page.",
          },
        ]);
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

    try {
      // Add message to existing thread
      await openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: input,
      });

      // Run the assistant
      const run = await openai.beta.threads.runs.create(threadId, {
        assistant_id: assistantId,
      });

      // Poll for completion
      let runStatus = run.status;
      let attempts = 0;

      while (
        (runStatus === "queued" || runStatus === "in_progress") &&
        attempts < MAX_RETRIES
      ) {
        await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL));
        const statusResponse = await openai.beta.threads.runs.retrieve(
          threadId,
          run.id
        );
        runStatus = statusResponse.status;
        attempts++;

        if (runStatus === "failed") {
          throw new Error("Assistant run failed");
        }
      }

      if (runStatus !== "completed") {
        throw new Error("Assistant response timed out");
      }

      // Get the assistant's response
      const messagesResponse = await openai.beta.threads.messages.list(
        threadId
      );
      const latestMessage = messagesResponse.data[0];

      if (!latestMessage?.content?.[0]?.text?.value) {
        throw new Error("Invalid response format from assistant");
      }

      const assistantMessage = {
        role: "assistant",
        content: latestMessage.content[0].text.value,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I encountered an error while processing your request. Please try again or rephrase your question.",
        },
      ]);
    } finally {
      setIsLoading(false);
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
          {isLoading && (
            <div className="message assistant">
              <div className="assistant-name">Ezra</div>
              <div className="loading-indicator">Checking...</div>
            </div>
          )}
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
