/**
 * Netlify Function: ask (Functions v2)
 * v5.3.1 — RAG via Responses API + file_search; return manual_snippets
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json"
};

const COLLECTION_ID = "collection_eb291187-da4e-4c56-9d98-60459781dd38";

function jsonResponse(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders
  });
}

function extractTextFromResponses(data) {
  if (!data) return "";
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }
  if (Array.isArray(data.output)) {
    const texts = [];
    for (const item of data.output) {
      if (item.type === "message" && Array.isArray(item.content)) {
        for (const c of item.content) {
          if (c.type === "output_text" && c.text) texts.push(c.text);
          else if (typeof c.text === "string") texts.push(c.text);
        }
      } else if (item.type === "output_text" && item.text) {
        texts.push(item.text);
      }
    }
    if (texts.length) return texts.join("\n").trim();
  }
  if (data.choices && data.choices[0] && data.choices[0].message) {
    return (data.choices[0].message.content || "").trim();
  }
  return "";
}

function extractManualSnippets(data) {
  const out = [];
  if (!data || !Array.isArray(data.output)) return out;
  for (const item of data.output) {
    if (item.type === "file_search_call" || item.type === "file_search") {
      const results = item.results || (item.file_search_call && item.file_search_call.results) || [];
      for (const r of results) {
        const text = r.text || r.content || r.snippet || "";
        if (text && String(text).trim()) out.push(String(text).trim().slice(0, 600));
      }
    }
    if (Array.isArray(item.content)) {
      for (const c of item.content) {
        if (c.type === "file_search_call" && Array.isArray(c.results)) {
          for (const r of c.results) {
            const text = r.text || r.content || "";
            if (text && String(text).trim()) out.push(String(text).trim().slice(0, 600));
          }
        }
      }
    }
  }
  if (!out.length && Array.isArray(data.citations)) {
    for (const c of data.citations) {
      if (typeof c === "string" && c.trim()) out.push(c.trim().slice(0, 400));
      else if (c && (c.text || c.content)) out.push(String(c.text || c.content).trim().slice(0, 400));
    }
  }
  const seen = new Set();
  const unique = [];
  for (const s of out) {
    const key = s.slice(0, 80);
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(s);
    if (unique.length >= 3) break;
  }
  return unique;
}

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("", { status: 204, headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    return jsonResponse(500, { error: "Server API key not configured" });
  }
  let body = {};
  try {
    body = await req.json();
  } catch (e) {
    return jsonResponse(400, { error: "Invalid JSON" });
  }
  const { messages, temperature, max_tokens } = body;
  if (!messages || !Array.isArray(messages)) {
    return jsonResponse(400, { error: "messages required" });
  }
  const input = messages.map((m) => {
    const role = m.role === "assistant" ? "assistant" : m.role === "system" ? "system" : "user";
    return {
      role,
      content: typeof m.content === "string" ? m.content : JSON.stringify(m.content)
    };
  });
  try {
    const payload = {
      model: "grok-4.5",
      input,
      temperature: temperature ?? 0.3,
      max_output_tokens: max_tokens ?? 800,
      tools: [
        {
          type: "file_search",
          vector_store_ids: [COLLECTION_ID],
          max_num_results: 8
        }
      ],
      include: ["file_search_call.results"]
    };
    const res = await fetch("https://api.x.ai/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey
      },
      body: JSON.stringify(payload)
    });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseErr) {
      return jsonResponse(502, {
        error: "Upstream returned non-JSON",
        detail: text.slice(0, 300)
      });
    }
    if (!res.ok) {
      return jsonResponse(res.status, {
        error: data.error || data.message || "Upstream error",
        detail: data
      });
    }
    const answer = extractTextFromResponses(data);
    const manual_snippets = extractManualSnippets(data);
    const normalized = {
      id: data.id || "resp_" + Date.now(),
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model: "grok-4.5",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: answer || "(no content)"
          },
          finish_reason: "stop"
        }
      ],
      usage: data.usage || {},
      manual_snippets
    };
    return new Response(JSON.stringify(normalized), {
      status: 200,
      headers: corsHeaders
    });
  } catch (e) {
    return jsonResponse(500, { error: e.message || "Upstream error" });
  }
};
