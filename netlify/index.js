const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI client (server-side only)
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OAI_KEY,
});

// Helper function to clean response text
const cleanResponse = (text) => {
  return text.replace(/【[^】]*】/g, "");
};

// Initialize chat - get assistant and create thread
app.post("/api/chat/initialize", (req, res) => {
  const assistantId = process.env.REACT_APP_ASSISTANT_ID;

  openai.beta.assistants
    .retrieve(assistantId)
    .then((assistant) => {
      return openai.beta.threads.create().then((thread) => {
        return { assistant, thread };
      });
    })
    .then(({ assistant, thread }) => {
      res.json({
        assistantId: assistant.id,
        threadId: thread.id,
      });
    })
    .catch((error) => {
      console.error("Failed to initialize chat:", error);
      res.status(500).json({
        error: "Failed to initialize chat",
        message: error.message,
      });
    });
});

// Helper function to process stream using promises
const processStream = (stream, res) => {
  const run = stream.iterator();

  const processChunk = () => {
    run
      .next()
      .then(({ value: chunk, done }) => {
        if (done) {
          res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
          res.end();
          return;
        }

        if (chunk.event === "thread.message.delta") {
          const content = chunk.data.delta.content?.[0]?.text?.value || "";
          if (content) {
            const cleanedContent = cleanResponse(content);
            res.write(
              `data: ${JSON.stringify({ content: cleanedContent })}\n\n`
            );
          }
        }

        // Continue processing next chunk
        processChunk();
      })
      .catch((streamError) => {
        console.error("Error during streaming:", streamError);
        res.write(
          `data: ${JSON.stringify({ error: streamError.message })}\n\n`
        );
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
      });
  };

  processChunk();
};

// Send message and stream response
app.post("/api/chat/message", (req, res) => {
  const { threadId, assistantId, message } = req.body;

  if (!threadId || !assistantId || !message) {
    return res.status(400).json({
      error: "Missing required fields: threadId, assistantId, message",
    });
  }

  // Set up Server-Sent Events for streaming
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no"); // Disable buffering in nginx

  // Add message to thread
  openai.beta.threads.messages
    .create(threadId, {
      role: "user",
      content: message,
    })
    .then(() => {
      // Create run with streaming
      return openai.beta.threads.runs.create(threadId, {
        assistant_id: assistantId,
        stream: true,
      });
    })
    .then((stream) => {
      // Stream the response
      processStream(stream, res);
    })
    .catch((error) => {
      console.error("Error processing message:", error);
      if (!res.headersSent) {
        res.status(500).json({
          error: "Error processing message",
          message: error.message,
        });
      } else {
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
      }
    });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
