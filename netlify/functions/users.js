/**
 * Netlify Function: users (Functions v2)
 * Shared employee accounts via Netlify Blobs
 * v1.16.2 – requires @netlify/blobs in package.json
 */

import { getStore } from "@netlify/blobs";

const ADMIN_PIN = "7890";
const STORE_NAME = "conroys-training";
const BLOB_KEY = "users";

const DEFAULT_USERS = [
  { username: "admin",     password: "ADMIN7890", name: "Admin" },
  { username: "employee1", password: "Trainee01",   name: "Employee 1" },
  { username: "employee2", password: "Trainee02",   name: "Employee 2" },
  { username: "employee3", password: "Trainee03",   name: "Employee 3" },
  { username: "employee4", password: "Trainee04",   name: "Employee 4" },
  { username: "employee5", password: "Trainee05",   name: "Employee 5" }
];

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

async function loadUsers(store) {
  try {
    const data = await store.get(BLOB_KEY, { type: "json" });
    if (Array.isArray(data) && data.length > 0) return data;
  } catch (e) {
    console.error("loadUsers get failed", e);
  }
  try {
    await store.setJSON(BLOB_KEY, DEFAULT_USERS);
  } catch (e) {
    console.error("seed failed", e);
  }
  return JSON.parse(JSON.stringify(DEFAULT_USERS));
}

async function saveUsers(store, list) {
  await store.setJSON(BLOB_KEY, list);
}

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("", { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  let body = {};
  try {
    body = await req.json();
  } catch (e) {
    return jsonResponse(400, { error: "Invalid JSON" });
  }

  const action = String(body.action || "").toLowerCase();

  let store;
  try {
    store = getStore({ name: STORE_NAME });
  } catch (e) {
    console.error("getStore failed:", e);
    return jsonResponse(500, { error: "Blobs not available: " + (e.message || String(e)) });
  }

  try {
    if (action === "login") {
      const username = String(body.username || "").trim().toLowerCase();
      const password = String(body.password || "");
      if (!username || !password) {
        return jsonResponse(400, { error: "username and password required" });
      }
      const users = await loadUsers(store);
      const user = users.find(
        (u) => (u.username || "").toLowerCase() === username && u.password === password
      );
      if (!user) {
        return jsonResponse(401, { ok: false, error: "Invalid username or password" });
      }
      return jsonResponse(200, { ok: true, name: user.name, username: user.username });
    }

    if (body.adminPin !== ADMIN_PIN) {
      return jsonResponse(403, { error: "Invalid Admin PIN" });
    }

    if (action === "list") {
      const users = await loadUsers(store);
      return jsonResponse(200, { ok: true, users });
    }

    if (action === "add") {
      const username = String(body.username || "").trim().toLowerCase();
      const password = String(body.password || "").trim();
      const name = String(body.name || "").trim();
      if (!username || !password || !name) {
        return jsonResponse(400, { error: "username, password, name required" });
      }
      const users = await loadUsers(store);
      if (users.some((u) => (u.username || "").toLowerCase() === username)) {
        return jsonResponse(409, { error: "Username already exists" });
      }
      users.push({ username, password, name });
      await saveUsers(store, users);
      return jsonResponse(200, { ok: true, users });
    }

    if (action === "updatepassword") {
      const username = String(body.username || "").trim().toLowerCase();
      const password = String(body.password || "").trim();
      if (!username || !password) {
        return jsonResponse(400, { error: "username and password required" });
      }
      const users = await loadUsers(store);
      const idx = users.findIndex((u) => (u.username || "").toLowerCase() === username);
      if (idx === -1) return jsonResponse(404, { error: "User not found" });
      users[idx].password = password;
      await saveUsers(store, users);
      return jsonResponse(200, { ok: true, users });
    }

    if (action === "delete") {
      const username = String(body.username || "").trim().toLowerCase();
      if (!username) return jsonResponse(400, { error: "username required" });
      if (username === "admin") {
        return jsonResponse(400, { error: "Cannot delete admin account" });
      }
      let users = await loadUsers(store);
      users = users.filter((u) => (u.username || "").toLowerCase() !== username);
      await saveUsers(store, users);
      return jsonResponse(200, { ok: true, users });
    }

    if (action === "reset") {
      await saveUsers(store, DEFAULT_USERS);
      return jsonResponse(200, { ok: true, users: DEFAULT_USERS });
    }

    return jsonResponse(400, { error: "Unknown action: " + action });
  } catch (e) {
    console.error("users handler error:", e);
    return jsonResponse(500, { error: e.message || "Server error" });
  }
};
