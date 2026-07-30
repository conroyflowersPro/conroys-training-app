/**
 * Netlify Function: users
 * Shared employee accounts via Netlify Blobs
 */

const { getStore } = require("@netlify/blobs");

const ADMIN_PIN = "7890";
const STORE_NAME = "conroys-training";
const BLOB_KEY = "users";

const DEFAULT_USERS = [
  { username: "admin",     password: "admin7890", name: "Admin" },
  { username: "employee1", password: "conroy1",   name: "Employee 1" },
  { username: "employee2", password: "conroy2",   name: "Employee 2" },
  { username: "employee3", password: "conroy3",   name: "Employee 3" },
  { username: "employee4", password: "conroy4",   name: "Employee 4" },
  { username: "employee5", password: "conroy5",   name: "Employee 5" }
];

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json"
};

function ok(body) {
  return { statusCode: 200, headers: cors, body: JSON.stringify(body) };
}
function err(status, message) {
  return { statusCode: status, headers: cors, body: JSON.stringify({ error: message }) };
}

function getBlobStore() {
  try {
    return getStore({ name: STORE_NAME });
  } catch (e1) {
    return getStore(STORE_NAME);
  }
}

async function loadUsers(store) {
  try {
    const data = await store.get(BLOB_KEY, { type: "json" });
    if (Array.isArray(data) && data.length > 0) return data;
  } catch (e) {}
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

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: cors, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return err(405, "Method not allowed");
  }

  let body = {};
  try {
    body = JSON.parse(event.body || "{}");
  } catch (e) {
    return err(400, "Invalid JSON");
  }

  const action = String(body.action || "").toLowerCase();

  let store;
  try {
    store = getBlobStore();
  } catch (e) {
    console.error("getStore failed:", e);
    return err(500, "Blobs not available: " + (e.message || e));
  }

  try {
    if (action === "login") {
      const username = String(body.username || "").trim().toLowerCase();
      const password = String(body.password || "");
      if (!username || !password) return err(400, "username and password required");

      const users = await loadUsers(store);
      const user = users.find(u => u.username.toLowerCase() === username && u.password === password);
      if (!user) return err(401, "Invalid username or password");
      return ok({ ok: true, name: user.name, username: user.username });
    }

    if (body.adminPin !== ADMIN_PIN) {
      return err(403, "Invalid Admin PIN");
    }

    if (action === "list") {
      const users = await loadUsers(store);
      return ok({ ok: true, users });
    }

    if (action === "add") {
      const username = String(body.username || "").trim().toLowerCase();
      const password = String(body.password || "").trim();
      const name = String(body.name || "").trim();
      if (!username || !password || !name) return err(400, "username, password, name required");

      const users = await loadUsers(store);
      if (users.some(u => u.username.toLowerCase() === username)) {
        return err(409, "Username already exists");
      }
      users.push({ username, password, name });
      await saveUsers(store, users);
      return ok({ ok: true, users });
    }

    if (action === "updatepassword") {
      const username = String(body.username || "").trim().toLowerCase();
      const password = String(body.password || "").trim();
      if (!username || !password) return err(400, "username and password required");

      const users = await loadUsers(store);
      const idx = users.findIndex(u => u.username.toLowerCase() === username);
      if (idx === -1) return err(404, "User not found");
      users[idx].password = password;
      await saveUsers(store, users);
      return ok({ ok: true, users });
    }

    if (action === "delete") {
      const username = String(body.username || "").trim().toLowerCase();
      if (!username) return err(400, "username required");
      if (username === "admin") return err(400, "Cannot delete admin account");

      let users = await loadUsers(store);
      users = users.filter(u => u.username.toLowerCase() !== username);
      await saveUsers(store, users);
      return ok({ ok: true, users });
    }

    if (action === "reset") {
      await saveUsers(store, DEFAULT_USERS);
      return ok({ ok: true, users: DEFAULT_USERS });
    }

    return err(400, "Unknown action: " + action);
  } catch (e) {
    console.error("users handler error:", e);
    return err(500, e.message || "Server error");
  }
};
