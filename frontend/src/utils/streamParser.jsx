// ─── Stream Parser Utilities ───────────────────────────────────────────────────
// Modular utilities for parsing SSE streams from different backends

/**
 * Parse a single SSE data line
 * @param {string} line - Raw SSE line
 * @returns {object|null} Parsed data or null
 */
export const parseSSELine = (line) => {
  if (!line.startsWith("data: ")) return null;
  const jsonStr = line.slice(6).trim();
  if (!jsonStr || jsonStr === "[DONE]") return null;

  try {
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
};

/**
 * Parse a complete SSE buffer into individual events
 * @param {string} buffer - Raw SSE buffer
 * @returns {{ events: Array, remainder: string }}
 */
export const parseSSEBuffer = (buffer) => {
  const lines = buffer.split("\n");
  const remainder = lines.pop() || "";
  const events = [];

  for (const line of lines) {
    const parsed = parseSSELine(line.trim());
    if (parsed) events.push(parsed);
  }

  return { events, remainder };
};

/**
 * Create a readable stream reader with parsed SSE events
 * @param {ReadableStream} body - Response body stream
 * @param {function} onEvent - Callback for each event
 * @param {AbortSignal} signal - Abort signal
 */
export const consumeSSEStream = async (body, onEvent, signal) => {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done || signal?.aborted) break;

      buffer += decoder.decode(value, { stream: true });
      const { events, remainder } = parseSSEBuffer(buffer);
      buffer = remainder;

      for (const event of events) {
        await onEvent(event);
      }
    }
  } finally {
    reader.releaseLock();
  }
};

/**
 * Format messages for API consumption
 * @param {Array} messages - Raw message array
 * @param {number} maxHistory - Maximum history to include
 * @returns {Array} Formatted messages
 */
export const formatMessages = (messages, maxHistory = 20) => {
  return messages
    .slice(-maxHistory)
    .filter((msg) => msg.role && msg.content)
    .map(({ role, content }) => ({ role, content: content.trim() }));
};