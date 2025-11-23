const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OAI_KEY,
});

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
      headers: { "Content-Type": "application/json" },
    };
  }

  try {
    const assistantId = process.env.REACT_APP_ASSISTANT_ID;

    const assistant = await openai.beta.assistants.retrieve(assistantId);
    const thread = await openai.beta.threads.create();

    return {
      statusCode: 200,
      body: JSON.stringify({
        assistantId: assistant.id,
        threadId: thread.id,
      }),
      headers: { "Content-Type": "application/json" },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to initialize chat",
        message: error.message,
      }),
      headers: { "Content-Type": "application/json" },
    };
  }
};
