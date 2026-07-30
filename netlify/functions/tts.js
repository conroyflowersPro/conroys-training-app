/**
 * Netlify Function: tts (Functions v2)
 * Proxies to xAI TTS
 * v1.14.0
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

function jsonResponse(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
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

  const { text, voice_id, language } = body;
  if (!text) {
    return jsonResponse(400, { error: "text required" });
  }

  try {
    const res = await fetch("https://api.x.ai/v1/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey
      },
      body: JSON.stringify({
        text: String(text).slice(0, 14000),
        voice_id: voice_id || "eve",
        language: language || "auto"
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      return jsonResponse(res.status, { error: errText || "TTS failed" });
    }

    const arrayBuffer = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const contentType = res.headers.get("content-type") || "audio/mpeg";

    return new Response(base64, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": contentType,
        "Content-Transfer-Encoding": "base64"
      }
    });
  } catch (e) {
    return jsonResponse(500, { error: e.message || "Upstream error" });
  }
};
