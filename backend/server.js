import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

// ─── Configuration ────────────────────────────────────────────────────────────
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Groq Client Initialization ──────────────────────────────────────────────
// NOTE: Swap API key by updating GROQ_API_KEY in .env file
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ─── Model Configuration ─────────────────────────────────────────────────────
const MODEL_CONFIG = {
  model: process.env.GROQ_MODEL || "llama3-70b-8192",
  temperature: parseFloat(process.env.TEMPERATURE) || 0.8,
  max_tokens: parseInt(process.env.MAX_TOKENS) || 1024,
  top_p: 1,
};

const KRYZEN_SYSTEM_PROMPT = `
You are KRYZEN AI — precise, efficient, and slightly dark.

- Speak with confidence and clarity
- Keep responses short and structured
- Use markdown formatting
- Write clean, optimized code when asked
- Occasional dark metaphors (blades, shadows, void)
- Never rude or harmful

Be sharp. No unnecessary words.
`;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "10mb" }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: "Too many requests. The void demands patience." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

// ─── Request Validation ───────────────────────────────────────────────────────
const validateChatRequest = (req, res, next) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({
      error: "Invalid request: messages array is required.",
    });
  }

  if (messages.length === 0) {
    return res.status(400).json({
      error: "Invalid request: messages array cannot be empty.",
    });
  }

  if (messages.length > 50) {
    return res.status(400).json({
      error: "Context limit exceeded: maximum 50 messages allowed.",
    });
  }

  const validRoles = ["user", "assistant"];
  for (const msg of messages) {
    if (!validRoles.includes(msg.role) || typeof msg.content !== "string") {
      return res.status(400).json({
        error: "Invalid message format: role must be user or assistant.",
      });
    }
    if (msg.content.length > 10000) {
      return res.status(400).json({
        error: "Message too long: maximum 10,000 characters per message.",
      });
    }
  }

  next();
};

// ─── Routes ───────────────────────────────────────────────────────────────────

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "operational",
    model: MODEL_CONFIG.model,
    timestamp: new Date().toISOString(),
    message: "KRYZEN AI is awake and hungry.",
  });
});

// Streaming chat endpoint
app.post("/api/chat/stream", validateChatRequest, async (req, res) => {
  const { messages } = req.body;

  // Set headers for SSE (Server-Sent Events)
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no"); // Disable Nginx buffering

  // Send initial connection confirmation
  res.write(`data: ${JSON.stringify({ type: "connected" })}\n\n`);

  try {
    const formattedMessages = [
      { role: "system", content: KRYZEN_SYSTEM_PROMPT },
      ...messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    const stream = await groq.chat.completions.create({
      ...MODEL_CONFIG,
      messages: formattedMessages,
      stream: true,
    });

    let fullContent = "";

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content || "";
      const finishReason = chunk.choices[0]?.finish_reason;

      if (delta) {
        fullContent += delta;
        res.write(
          `data: ${JSON.stringify({
            type: "chunk",
            content: delta,
          })}\n\n`
        );
      }

      if (finishReason === "stop") {
        res.write(
          `data: ${JSON.stringify({
            type: "done",
            totalLength: fullContent.length,
          })}\n\n`
        );
      }
    }

    res.end();
  } catch (error) {
    console.error("[KRYZEN] Stream error:", error);

    // Send error through SSE before closing
    if (!res.headersSent) {
      res.status(500);
    }

    res.write(
      `data: ${JSON.stringify({
        type: "error",
        message:
          error.message || "KRYZEN encountered an error in the void.",
        code: error.status || 500,
      })}\n\n`
    );

    res.end();
  }
});

// Non-streaming fallback endpoint
app.post("/api/chat", validateChatRequest, async (req, res) => {
  const { messages } = req.body;

  try {
    const formattedMessages = [
      { role: "system", content: KRYZEN_SYSTEM_PROMPT },
      ...messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    const completion = await groq.chat.completions.create({
      ...MODEL_CONFIG,
      messages: formattedMessages,
      stream: false,
    });

    const responseContent = completion.choices[0]?.message?.content || "";

    res.json({
      success: true,
      message: {
        role: "assistant",
        content: responseContent,
      },
      usage: completion.usage,
    });
  } catch (error) {
    console.error("[KRYZEN] Chat error:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message || "KRYZEN encountered an anomaly.",
    });
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found. You have wandered into the void.",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("[KRYZEN] Unhandled error:", err);
  res.status(500).json({
    error: "An unexpected error occurred in the darkness.",
  });
});

// ─── Server Start ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║          KRYZEN AI - ONLINE           ║
║  Server: http://localhost:${PORT}        ║
║  Model:  ${MODEL_CONFIG.model}  ║
║  Status: OPERATIONAL                  ║
╚═══════════════════════════════════════╝
  `);
});

export default app;