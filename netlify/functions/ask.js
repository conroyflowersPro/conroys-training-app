/**
 * Netlify Function: ask (Functions v2)
 * v5.1.2 — True RAG via xAI Responses API + file_search (Collections)
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
      ]
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
      usage: data.usage || {}
    };

    return new Response(JSON.stringify(normalized), {
      status: 200,
      headers: corsHeaders
    });
  } catch (e) {
    return jsonResponse(500, { error: e.message || "Upstream error" });
  }
};
