const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

function getToken() {
  return localStorage.getItem("token");
}

export async function request(path, options = {}) {
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

export const authApi = {
  register: (data) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(data) }),
};

export const modulesApi = {
  getAll: () => request("/modules"),
  getById: (id) => request(`/modules/${id}`),
  getBySlug: (slug) => request(`/modules/slug/${slug}`),
  isCompleted: (id) => request(`/modules/${id}/completed`),
  create: (data) =>
    request("/modules", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    request(`/modules/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => request(`/modules/${id}`, { method: "DELETE" }),
};

export const lessonsApi = {
  getById: (id) => request(`/lessons/${id}`),
  getByModule: (moduleId) => request(`/lessons/module/${moduleId}`),
  create: (data) =>
    request("/lessons", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    request(`/lessons/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => request(`/lessons/${id}`, { method: "DELETE" }),
};


export const questionsApi = {
  getByLesson: (lessonId) => request(`/questions/lesson/${lessonId}`),
  create: (data) =>
    request("/questions", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    request(`/questions/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => request(`/questions/${id}`, { method: "DELETE" }),
};


export const progressApi = {
  getAll: () => request("/progress"),
  getCompleted: () => request("/progress/completed"),
  getForLesson: (lessonId) => request(`/progress/lessons/${lessonId}`),
  startLesson: (lessonId) =>
    request(`/progress/lessons/${lessonId}/start`, { method: "POST" }),
  isModuleCompleted: (moduleId) =>
    request(`/progress/modules/${moduleId}/completed`),
};


export const answersApi = {
  submit: (questionId, answerGiven) =>
    request(`/questions/${questionId}/answer`, {
      method: "POST",
      body: JSON.stringify({ questionId, answerGiven }),
    }),
};