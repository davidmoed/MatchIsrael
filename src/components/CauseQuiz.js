import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "../styles/components/causeQuiz.css";
import OpenAI from "openai";

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
  const chatContainerRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Get the assistant
      const assistant = await openai.beta.assistants.retrieve(
        process.env.REACT_APP_ASSISTANT_ID
      );

      // Create a thread
      const thread = await openai.beta.threads.create();

      // Add message to thread
      await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: input,
      });

      // Run the assistant
      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistant.id,
      });

      // Poll for completion
      let runStatus = run.status;
      while (runStatus === "queued" || runStatus === "in_progress") {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const statusResponse = await openai.beta.threads.runs.retrieve(
          thread.id,
          run.id
        );
        runStatus = statusResponse.status;
      }

      // Get the assistant's response
      const messagesResponse = await openai.beta.threads.messages.list(
        thread.id
      );
      const assistantMessage = {
        role: "assistant",
        content: messagesResponse.data[0].content[0].text.value,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
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
        </div>
        <form onSubmit={handleSubmit} className="chat-input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="chat-input"
            disabled={isLoading}
          />
          <button type="submit" className="send-button" disabled={isLoading}>
            {isLoading ? "..." : "Send"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default CauseQuiz;
