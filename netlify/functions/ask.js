/**
 * Netlify Function: ask (Functions v2)
 * v5.3.4 — RAG via Responses API + file_search; return manual_snippets
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

const COLLECTION_ID = "collection_eb291187-da4e-4c56-9d98-60459781dd38";

function jsonResponse(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

function extractText(data) {
  if (!data) return "";
  if (typeof data.output_text === "string" && data.output_text.trim()) return data.output_text.trim();
  const out = data.output || data.choices || [];
  let text = "";
  if (Array.isArray(out)) {
    for (const item of out) {
      if (!item) continue;
      if (item.type === "message" && item.content) {
        const parts = Array.isArray(item.content) ? item.content : [item.content];
        for (const p of parts) {
          if (typeof p === "string") text += p;
          else if (p && (p.text || p.value)) text += (p.text || p.value);
          else if (p && p.type === "output_text" && p.text) text += p.text;
        }
      }
      if (item.content && typeof item.content === "string") text += item.content;
      if (item.message && item.message.content) {
        const c = item.message.content;
        if (typeof c === "string") text += c;
      }
    }
  }
  if (!text && data.choices && data.choices[0] && data.choices[0].message) {
    text = data.choices[0].message.content || "";
  }
  return (text || "").trim();
}

function extractManualSnippets(data) {
  const snippets = [];
  try {
    const out = data.output || [];
    for (const item of out) {
      if (!item) continue;
      if (item.type === "file_search_call" || item.type === "file_search") {
        const results = item.results || (item.file_search_call && item.file_search_call.results) || [];
        for (const r of results) {
          const t = (r.text || r.content || r.snippet || "").trim();
          if (t) snippets.push(t.slice(0, 500));
        }
      }
      if (item.content && Array.isArray(item.content)) {
        for (const c of item.content) {
          if (c.type === "file_search_call" && Array.isArray(c.results)) {
            for (const r of c.results) {
              const t = (r.text || r.content || "").trim();
              if (t) snippets.push(t.slice(0, 500));
            }
          }
        }
      }
    }
  } catch (e) {}
  return snippets.slice(0, 6);
}

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("", { status: 204, headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }
  const apiKey = process.env.XAI_API_KEY || process.env.xai_api_key || "";
  if (!apiKey) {
    return jsonResponse(500, { error: "XAI_API_KEY not configured on server" });
  }
  let body;
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
      temperature: temperature ?? 0.2,
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
    } catch (e) {
      return jsonResponse(500, { error: "Invalid JSON from xAI: " + text.slice(0, 200) });
    }
    if (!res.ok) {
      return jsonResponse(res.status, { error: data.error || data.message || text.slice(0, 300) });
    }
    const content = extractText(data);
    const manual_snippets = extractManualSnippets(data);
    return jsonResponse(200, {
      choices: [{ message: { role: "assistant", content: content || "No answer." } }],
      manual_snippets
    });
  } catch (e) {
    return jsonResponse(500, { error: e.message || String(e) });
  }
};
