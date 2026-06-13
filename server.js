const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const port = Number(process.argv[2] || 8000);
const groqApiKey = process.env.GROQ_API_KEY || "";
const groqModel = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function sendJson(response, status, payload) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        request.destroy();
        reject(new Error("Request body is too large."));
      }
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

async function handleChat(request, response) {
  if (!groqApiKey) {
    sendJson(response, 500, { error: "Groq API key is not configured on the server." });
    return;
  }

  try {
    const body = JSON.parse(await readBody(request) || "{}");
    const messages = Array.isArray(body.messages) ? body.messages.slice(-8) : [];
    const context = body.context || {};

    const systemPrompt = [
      "You are A_D Tutor, a concise nursing CBT study assistant.",
      "Help the student prepare for NMCN/council, NCLEX-style, OSCE, pharmacology, medical-surgical, maternity, pediatric, and nursing fundamentals exams.",
      "Explain why the correct answer is correct, why common distractors are wrong, and give memory cues.",
      "Do not invent an official answer if the provided question context is unclear; say what is unclear and teach the concept.",
      "Keep answers focused, supportive, and exam-oriented.",
      `Loaded CBT questions: ${context.questionCount || "unknown"}.`,
      context.activeQuestion ? `Current CBT item: ${JSON.stringify(context.activeQuestion).slice(0, 4000)}` : ""
    ].filter(Boolean).join("\n");

    // Build messages array for Groq (OpenAI-compatible format)
    const groqMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content || "").slice(0, 2000)
      }))
    ];

    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: groqModel,
          messages: groqMessages,
          temperature: 0.35,
          max_tokens: 900
        })
      }
    );

    const data = await groqResponse.json();

    if (!groqResponse.ok) {
      sendJson(response, groqResponse.status, { error: data.error?.message || "Groq request failed." });
      return;
    }

    const text = data.choices?.[0]?.message?.content?.trim();
    sendJson(response, 200, { reply: text || "I could not generate a response for that. Try asking it another way." });

  } catch (error) {
    sendJson(response, 500, { error: error.message || "Chat request failed." });
  }
}

const server = http.createServer((request, response) => {
  // Allow CORS for production
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    response.writeHead(204);
    response.end();
    return;
  }

  const url = new URL(request.url, `http://${request.headers.host}`);

  if (url.pathname === "/api/chat" && request.method === "POST") {
    handleChat(request, response);
    return;
  }

  const requestPath = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const target = path.normalize(path.join(root, requestPath));

  if (!target.startsWith(root)) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Forbidden");
    return;
  }

  fs.readFile(target, (error, bytes) => {
    if (error) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    const type = contentTypes[path.extname(target).toLowerCase()] || "application/octet-stream";
    response.writeHead(200, { "Content-Type": type });
    response.end(bytes);
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Serving ${root} at http://localhost:${port}/`);
  console.log("Press Ctrl+C to stop.");
});
