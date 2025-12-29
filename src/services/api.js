// src/services/api.js
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "https://godcares.pythonanywhere.com").replace(/\/$/, "");

const ACCESS_KEY = "gc365_access";
const REFRESH_KEY = "gc365_refresh";

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function normalizeApiError(payload, fallback = "Request failed") {
  if (!payload) return fallback;
  if (typeof payload === "string") return payload;
  if (payload.detail) return payload.detail;

  const k = Object.keys(payload)[0];
  if (k) {
    const v = payload[k];
    if (Array.isArray(v) && v[0]) return String(v[0]);
    if (typeof v === "string") return v;
  }
  return fallback;
}

function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY);
}
function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}
function setTokens(access, refresh) {
  if (access) localStorage.setItem(ACCESS_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
}
function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

function buildQuery(path, params = {}) {
  const sp = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    if (Array.isArray(v)) v.forEach((x) => sp.append(k, x));
    else sp.append(k, String(v));
  });
  const qs = sp.toString();
  return qs ? `${path}?${qs}` : path;
}

async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error("No refresh token");

  const res = await fetch(`${API_BASE_URL}/api/v1/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  const text = await res.text();
  const payload = safeJsonParse(text);

  if (!res.ok) {
    throw new Error(normalizeApiError(payload, "Session expired. Please login again."));
  }

  const access = payload?.access;
  if (!access) throw new Error("Invalid refresh response");
  setTokens(access, refresh);
  return access;
}

async function request(
  path,
  { method = "GET", body, auth = false, retryOn401 = true, headers: extraHeaders = {} } = {}
) {
  const headers = { "Content-Type": "application/json", ...extraHeaders };
  let access = getAccessToken();

  if (auth && access) {
    headers.Authorization = `Bearer ${access}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // If unauthorized, try refresh once (only if auth=true)
  if (auth && res.status === 401 && retryOn401) {
    try {
      access = await refreshAccessToken();
    } catch {
      clearTokens();
      throw new Error("Session expired. Please login again.");
    }

    const retryHeaders = { ...headers, Authorization: `Bearer ${access}` };
    const res2 = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: retryHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    const text2 = await res2.text();
    const payload2 = safeJsonParse(text2);

    if (!res2.ok) throw new Error(normalizeApiError(payload2, "Request failed"));
    return payload2 ?? {};
  }

  const text = await res.text();
  const payload = safeJsonParse(text);

  if (!res.ok) throw new Error(normalizeApiError(payload, "Request failed"));
  return payload ?? {};
}

const api = {
  // token helpers
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
  refreshAccessToken,

  // =========================
  // AUTH (OpenAPI)
  // =========================
  async register(payload) {
    // POST /api/v1/auth/register/
    return request("/api/v1/auth/register/", { method: "POST", body: payload, auth: false });
  },

  async login(identifier, password) {
    // POST /api/v1/auth/login/
    const data = await request("/api/v1/auth/login/", {
      method: "POST",
      body: { identifier, password },
      auth: false,
    });
    api.setTokens(data.access, data.refresh);
    return data;
  },

  async logout() {
    // POST /api/v1/auth/logout/ (jwtAuth)
    const refresh = getRefreshToken();
    if (!refresh) return { detail: "Already logged out." };

    const data = await request("/api/v1/auth/logout/", {
      method: "POST",
      body: { refresh },
      auth: true,
      retryOn401: false,
    });

    api.clearTokens();
    return data;
  },

  async resendVerification(email) {
    // POST /api/v1/auth/resend-verification/
    return request("/api/v1/auth/resend-verification/", {
      method: "POST",
      body: { email },
      auth: false,
    });
  },

  async verifyEmail(token) {
    // POST /api/v1/auth/verify-email/
    return request("/api/v1/auth/verify-email/", {
      method: "POST",
      body: { token },
      auth: false,
    });
  },

  async getMe() {
    // GET /api/v1/auth/me/ (jwtAuth)
    return request("/api/v1/auth/me/", { method: "GET", auth: true });
  },

  async updateMe(payload) {
    // PUT /api/v1/auth/me/
    return request("/api/v1/auth/me/", { method: "PUT", body: payload, auth: true });
  },

  async patchMe(payload) {
    // PATCH /api/v1/auth/me/
    return request("/api/v1/auth/me/", { method: "PATCH", body: payload, auth: true });
  },

  async changePassword(current_password, new_password) {
    // POST /api/v1/auth/change-password/
    return request("/api/v1/auth/change-password/", {
      method: "POST",
      body: { current_password, new_password },
      auth: true,
    });
  },

  async changeEmail(new_email, password) {
    // POST /api/v1/auth/change-email/
    return request("/api/v1/auth/change-email/", {
      method: "POST",
      body: { new_email, password },
      auth: true,
    });
  },

  async confirmEmailChange(token) {
    // POST /api/v1/auth/confirm-email-change/
    return request("/api/v1/auth/confirm-email-change/", {
      method: "POST",
      body: { token },
      auth: false,
    });
  },

  async passwordReset(email) {
    // POST /api/v1/auth/password/reset/
    return request("/api/v1/auth/password/reset/", {
      method: "POST",
      body: { email },
      auth: false,
    });
  },

  async passwordResetConfirm(uid, token, new_password) {
    // POST /api/v1/auth/password/reset/confirm/
    return request("/api/v1/auth/password/reset/confirm/", {
      method: "POST",
      body: { uid, token, new_password },
      auth: false,
    });
  },

  // =========================
  // SHOP (OpenAPI)
  // =========================
  async getShopCategories() {
    return request("/api/v1/shop/categories/", { method: "GET", auth: false });
  },

  async getShopProducts(params = {}) {
    const path = buildQuery("/api/v1/shop/products/", params);
    return request(path, { method: "GET", auth: false });
  },

  async getShopProduct(id) {
    return request(`/api/v1/shop/products/${id}/`, { method: "GET", auth: false });
  },

  async createShopOrder(payload) {
    // POST /api/v1/shop/orders/ (public)
    return request("/api/v1/shop/orders/", { method: "POST", body: payload, auth: false });
  },

  async getMyOrders() {
    // GET /api/v1/shop/orders/my/ (jwtAuth)
    return request("/api/v1/shop/orders/my/", { method: "GET", auth: true });
  },

  // (admin optional helpers)
  async getShopOrdersAdmin() {
    // GET /api/v1/shop/orders/ (jwtAuth)
    return request("/api/v1/shop/orders/", { method: "GET", auth: true });
  },

  async getShopOrderAdmin(id) {
    // GET /api/v1/shop/orders/{id}/ (jwtAuth)
    return request(`/api/v1/shop/orders/${id}/`, { method: "GET", auth: true });
  },

  // =========================
  // MEDIA (OpenAPI) - security optional (jwtAuth or {})
  // =========================
  async getMediaCategories() {
    const authIfToken = Boolean(getAccessToken());
    return request("/api/v1/media/categories/", { method: "GET", auth: authIfToken });
  },

  async getMediaCategory(id) {
    const authIfToken = Boolean(getAccessToken());
    return request(`/api/v1/media/categories/${id}/`, { method: "GET", auth: authIfToken });
  },

  async getMediaItems(params = {}) {
    const authIfToken = Boolean(getAccessToken());
    const path = buildQuery("/api/v1/media/items/", params);
    return request(path, { method: "GET", auth: authIfToken });
  },

  async getMediaItem(id) {
    const authIfToken = Boolean(getAccessToken());
    return request(`/api/v1/media/items/${id}/`, { method: "GET", auth: authIfToken });
  },

  // =========================
  // NEWS (OpenAPI) - security optional (jwtAuth or {})
  // =========================
  async getNewsCategories() {
    const authIfToken = Boolean(getAccessToken());
    return request("/api/v1/news/categories/", { method: "GET", auth: authIfToken });
  },

  async getNewsCategory(id) {
    const authIfToken = Boolean(getAccessToken());
    return request(`/api/v1/news/categories/${id}/`, { method: "GET", auth: authIfToken });
  },

  async getNewsPosts(params = {}) {
    const authIfToken = Boolean(getAccessToken());
    const path = buildQuery("/api/v1/news/posts/", params);
    return request(path, { method: "GET", auth: authIfToken });
  },

  async getNewsPost(slug) {
    const authIfToken = Boolean(getAccessToken());
    return request(`/api/v1/news/posts/${slug}/`, { method: "GET", auth: authIfToken });
  },

  // =========================
  // PRAYERS (OpenAPI)  <<< muhimu: plural "prayers"
  // =========================
  async submitPrayerRequest(payload) {
    // POST /api/v1/prayers/requests/ (security: jwtAuth OR {})
    // Ukikuwa una token, tuma nayo (optional) ili future backend iweze ku-link user.
    const authIfToken = Boolean(getAccessToken());
    return request("/api/v1/prayers/requests/", { method: "POST", body: payload, auth: authIfToken });
  },

  // admin endpoints
  async getPrayerRequestsAdmin() {
    // GET /api/v1/prayers/requests/ (jwtAuth)
    return request("/api/v1/prayers/requests/", { method: "GET", auth: true });
  },

  async getPrayerRequestAdmin(id) {
    // GET /api/v1/prayers/requests/{id}/ (jwtAuth)
    return request(`/api/v1/prayers/requests/${id}/`, { method: "GET", auth: true });
  },

  async updatePrayerRequestStatusAdmin(id, status) {
    // PATCH /api/v1/prayers/requests/{id}/ (jwtAuth)
    return request(`/api/v1/prayers/requests/${id}/`, {
      method: "PATCH",
      body: { status },
      auth: true,
    });
  },

  async deletePrayerRequestAdmin(id) {
    // DELETE /api/v1/prayers/requests/{id}/ (jwtAuth)
    return request(`/api/v1/prayers/requests/${id}/`, { method: "DELETE", auth: true });
  },

  // =========================
  // EVENTS / LESSONS / SEASONS (OpenAPI) - security optional (jwtAuth or {})
  // =========================
  async getEvents() {
    const authIfToken = Boolean(getAccessToken());
    return request("/events/", { method: "GET", auth: authIfToken });
  },

  async getEvent(slug) {
    const authIfToken = Boolean(getAccessToken());
    return request(`/events/${slug}/`, { method: "GET", auth: authIfToken });
  },

  async getLessons() {
    const authIfToken = Boolean(getAccessToken());
    return request("/lessons/", { method: "GET", auth: authIfToken });
  },

  async getLesson(slug) {
    const authIfToken = Boolean(getAccessToken());
    return request(`/lessons/${slug}/`, { method: "GET", auth: authIfToken });
  },

  async getSeasons() {
    const authIfToken = Boolean(getAccessToken());
    return request("/seasons/", { method: "GET", auth: authIfToken });
  },

  async getSeason(slug) {
    const authIfToken = Boolean(getAccessToken());
    return request(`/seasons/${slug}/`, { method: "GET", auth: authIfToken });
  },

  // =========================
  // MANAGE (admin) - jwtAuth
  // =========================
  async manageListEvents() {
    return request("/manage/events/", { method: "GET", auth: true });
  },
  async manageCreateEvent(payload) {
    return request("/manage/events/", { method: "POST", body: payload, auth: true });
  },
  async manageGetEvent(public_id) {
    return request(`/manage/events/${public_id}/`, { method: "GET", auth: true });
  },
  async managePutEvent(public_id, payload) {
    return request(`/manage/events/${public_id}/`, { method: "PUT", body: payload, auth: true });
  },
  async managePatchEvent(public_id, payload) {
    return request(`/manage/events/${public_id}/`, { method: "PATCH", body: payload, auth: true });
  },
  async manageDeleteEvent(public_id) {
    return request(`/manage/events/${public_id}/`, { method: "DELETE", auth: true });
  },

  async manageListLessons() {
    return request("/manage/lessons/", { method: "GET", auth: true });
  },
  async manageCreateLesson(payload) {
    return request("/manage/lessons/", { method: "POST", body: payload, auth: true });
  },
  async manageGetLesson(public_id) {
    return request(`/manage/lessons/${public_id}/`, { method: "GET", auth: true });
  },
  async managePutLesson(public_id, payload) {
    return request(`/manage/lessons/${public_id}/`, { method: "PUT", body: payload, auth: true });
  },
  async managePatchLesson(public_id, payload) {
    return request(`/manage/lessons/${public_id}/`, { method: "PATCH", body: payload, auth: true });
  },
  async manageDeleteLesson(public_id) {
    return request(`/manage/lessons/${public_id}/`, { method: "DELETE", auth: true });
  },
};

export default api;
