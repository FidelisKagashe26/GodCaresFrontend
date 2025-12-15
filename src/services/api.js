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

async function request(path, { method = "GET", body, auth = false, retryOn401 = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  let access = getAccessToken();

  if (auth) {
    if (access) headers.Authorization = `Bearer ${access}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // If unauthorized, try refresh once
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

  // AUTH (OpenAPI)
  async login(identifier, password) {
    const data = await request("/api/v1/auth/login/", {
      method: "POST",
      body: { identifier, password }, // <-- OpenAPI: Login schema
      auth: false,
    });
    // OpenAPI response: {access, refresh, user}
    api.setTokens(data.access, data.refresh);
    return data;
  },

  async logout() {
    const refresh = getRefreshToken();
    if (!refresh) return { detail: "Already logged out." };

    // OpenAPI: /logout/ requires jwtAuth + body {refresh}
    const data = await request("/api/v1/auth/logout/", {
      method: "POST",
      body: { refresh },
      auth: true,
      retryOn401: false, // if access expired, just clear locally
    });

    api.clearTokens();
    return data;
  },

  async resendVerification(email) {
    // OpenAPI: /resend-verification/ {email}
    return request("/api/v1/auth/resend-verification/", {
      method: "POST",
      body: { email },
      auth: false,
    });
  },

  async verifyEmail(token) {
    // OpenAPI: /verify-email/ {token}
    return request("/api/v1/auth/verify-email/", {
      method: "POST",
      body: { token },
      auth: false,
    });
  },

  // ACCOUNT (OpenAPI)
  async getMe() {
    return request("/api/v1/auth/me/", { method: "GET", auth: true });
  },

  async patchMe(payload) {
    // OpenAPI ProfileUpdate fields: username, first_name, last_name, phone, location
    return request("/api/v1/auth/me/", { method: "PATCH", body: payload, auth: true });
  },

  async changePassword(current_password, new_password) {
    // OpenAPI: /change-password/ {current_password, new_password}
    return request("/api/v1/auth/change-password/", {
      method: "POST",
      body: { current_password, new_password },
      auth: true,
    });
  },

  async changeEmail(new_email, password) {
    // OpenAPI: /change-email/ {new_email, password}
    return request("/api/v1/auth/change-email/", {
      method: "POST",
      body: { new_email, password },
      auth: true,
    });
  },

  async confirmEmailChange(token) {
    // OpenAPI: /confirm-email-change/ {token}
    return request("/api/v1/auth/confirm-email-change/", {
      method: "POST",
      body: { token },
      auth: false,
    });
  },

  // PASSWORD RESET (OpenAPI)
  async passwordReset(email) {
    return request("/api/v1/auth/password/reset/", {
      method: "POST",
      body: { email },
      auth: false,
    });
  },

  async passwordResetConfirm(uid, token, new_password) {
    return request("/api/v1/auth/password/reset/confirm/", {
      method: "POST",
      body: { uid, token, new_password },
      auth: false,
    });
  },
};

export default api;
