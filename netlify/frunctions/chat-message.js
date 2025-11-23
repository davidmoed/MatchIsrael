const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OAI_KEY,
});

const { TextEncoder } = require("util");
const encoder = new TextEncoder();
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

    const stream = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
      stream: true,
    });

    const bodyStream = new ReadableStream({
      async start(controller) {
        const iterator = stream.iterator();

        async function pushChunk() {
          try {
            const { value: chunk, done } = await iterator.next();
            if (done) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
              );
              controller.close();
              return;
            }
            if (chunk.event === "thread.message.delta") {
              const content = chunk.data.delta.content?.[0]?.text?.value || "";
              if (content) {
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({
                      content: cleanResponse(content),
                    })}\n\n`
                  )
                );
              }
            }
            pushChunk();
          } catch (err) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ error: err.message })}\n\n`
              )
            );
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
            );
            controller.close();
          }
        }
        pushChunk();
      },
    });

    return new Response(bodyStream, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
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
