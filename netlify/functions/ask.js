/**
 * Netlify Function: ask (Functions v2)
 * Proxies to xAI chat completions for Grok answers
 * v5.1.0 — Collections RAG enabled
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

  try {
    const payload = {
      model: "grok-4.5",
      messages,
      temperature: temperature ?? 0.3,
      max_tokens: max_tokens ?? 800,
      tools: [
        {
          type: "file_search",
          vector_store_ids: [COLLECTION_ID]
        }
      ]
    };

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: corsHeaders
    });
  } catch (e) {
    return jsonResponse(500, { error: e.message || "Upstream error" });
  }
};
