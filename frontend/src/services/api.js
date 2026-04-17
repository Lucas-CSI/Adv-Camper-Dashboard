const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

function getToken() {
  return localStorage.getItem("token");
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return;
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(err.message || "Request failed");
  }

  if (res.status === 204) return null;
  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(data) }),
};

// ── Modules ───────────────────────────────────────────────────────────────────
export const modulesApi = {
  getAll: () => request("/modules"),
  getById: (id) => request(`/modules/${id}`),
  getBySlug: (slug) => request(`sdsassssssssssssssss/modules/slug/${slug}`),
  isCompleted: (id) => request(`/modules/${id}/completed`),
  create: (data) =>
    request("/modules", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    request(`/modules/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => request(`/modules/${id}`, { method: "DELETE" }),
};

// ── Progress ──────────────────────────────────────────────────────────────────
export const progressApi = {
  getAll: () => request("/progress"),
  getCompleted: () => request("/progress/completed"),
  getForLesson: (lessonId) => request(`/progress/lessons/${lessonId}`),
  startLesson: (lessonId) =>
    request(`/progress/lessons/${lessonId}/start`, { method: "POST" }),
  isModuleCompleted: (moduleId) =>
    request(`/progress/modules/${moduleId}/completed`),
};

// ── Questions & Answers ───────────────────────────────────────────────────────
export const answersApi = {
  submit: (questionId, answerGiven) =>
    request(`/questions/${questionId}/answer`, {
      method: "POST",
      body: JSON.stringify({ questionId, answerGiven }),
    }),
};
