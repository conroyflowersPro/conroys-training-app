/**
 * Netlify Function: stt (Functions v2)
 * Proxies to xAI Speech-to-Text
 * v1.14.0
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json"
};

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

  try {
    let body = {};
    try {
      body = await req.json();
    } catch (e) {
      return jsonResponse(400, { error: "Invalid JSON" });
    }

    if (!body.audio) {
      return jsonResponse(400, { error: "audio base64 required" });
    }

    const audioBuffer = Buffer.from(body.audio, "base64");
    const contentType = body.contentType || "audio/webm";

    const form = new FormData();
    const blob = new Blob([audioBuffer], { type: contentType });
    form.append("file", blob, "speech.webm");
    form.append("model", "grok-stt");

    const res = await fetch("https://api.x.ai/v1/stt", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + apiKey
      },
      body: form
    });

    const textBody = await res.text();
    let data;
    try {
      data = JSON.parse(textBody);
    } catch (_) {
      data = { raw: textBody };
    }

    if (!res.ok) {
      return jsonResponse(res.status, { error: data.error || data.raw || textBody });
    }

    const transcript = data.text || data.transcript || data.result || "";
    return jsonResponse(200, {
      text: transcript,
      language: data.language || null,
      raw: data
    });
  } catch (e) {
    return jsonResponse(500, { error: e.message || "STT failed" });
  }
};
