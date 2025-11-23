const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OAI_KEY,
});

const cleanResponse = (text) => text.replace(/【[^】]*】/g, "");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
      headers: { "Content-Type": "application/json" },
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON" }),
      headers: { "Content-Type": "application/json" },
    };
  }

  const { threadId, assistantId, message } = body;

  if (!threadId || !assistantId || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Missing required fields: threadId, assistantId, message",
      }),
      headers: { "Content-Type": "application/json" },
    };
  }

  try {
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: message,
    });

    // Create run without streaming
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });

    // Wait for run to complete using OpenAI's recommended polling pattern
    let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    while (
      runStatus.status === "queued" ||
      runStatus.status === "in_progress" ||
      runStatus.status === "requires_action"
    ) {
      runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    }

    if (runStatus.status === "failed") {
      throw new Error(runStatus.last_error?.message || "Run failed");
    }

    if (runStatus.status === "cancelled") {
      throw new Error("Run was cancelled");
    }

    // Retrieve the assistant's response - get the latest assistant message
    const messages = await openai.beta.threads.messages.list(threadId, {
      order: "desc",
    });

    const assistantMessage = messages.data.find(
      (msg) => msg.role === "assistant" && msg.run_id === run.id
    );
    const content =
      assistantMessage?.content[0]?.type === "text"
        ? assistantMessage.content[0].text.value
        : "";

    // Return complete response
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: cleanResponse(content),
        done: true,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Error processing message",
        message: error.message,
      }),
    };
  }
};
