const API_URL = import.meta.env.VITE_API_URL;

function getToken() {
  return localStorage.getItem("token");
}

function formatError(data) {
  if (!data || !data.detail) return null;
  if (typeof data.detail === "string") return data.detail;
  return data.detail.map((item) => item.msg).join(", ");
}

async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error("Cannot reach the server. Is the backend running?");
  }

  if (response.status === 204) return null;

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(formatError(data) || "Request failed");
    error.status = response.status;
    throw error;
  }
  return data;
}

function jsonRequest(path, method, payload) {
  return request(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function register(email, password) {
  return jsonRequest("/auth/register", "POST", { email, password });
}

export async function login(email, password) {
  const body = new URLSearchParams({ username: email, password });
  const data = await request("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  localStorage.setItem("token", data.access_token);
}

export function logout() {
  localStorage.removeItem("token");
}

export function isLoggedIn() {
  return Boolean(getToken());
}

export function listTasks() {
  return request("/tasks");
}

export function createTask(title, description) {
  return jsonRequest("/tasks", "POST", { title, description });
}

export function updateTask(id, changes) {
  return jsonRequest(`/tasks/${id}`, "PATCH", changes);
}

export function deleteTask(id) {
  return request(`/tasks/${id}`, { method: "DELETE" });
}