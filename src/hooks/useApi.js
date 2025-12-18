// src/hooks/useApi.js
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const DEFAULT_BASE = "https://godcares.pythonanywhere.com";

function stripTrailingSlash(url) {
  return String(url || "").replace(/\/$/, "");
}

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

// Ramani ya keys -> endpoints (PUBLIC core)
const endpointMap = {
  // CORE PUBLIC
  seasons: () => ({ url: "/seasons/" }),
  lessons: () => ({ url: "/lessons/" }),
  events: () => ({ url: "/events/" }),

  // Keep legacy keys (usizivunje kama unazitumia Home n.k)
  "featured-posts": ({ today }) => ({
    url: "/v1/content/posts/",
    params: {
      featured: true,
      status: "published",
      ordering: "-published_at",
      page: 1,
    },
  }),

  "upcoming-events": ({ today }) => ({
    url: "/v1/content/events/",
    params: {
      date_from: today,
      ordering: "start_date",
      page: 1,
    },
  }),

  "user-activities": () => ({
    url: "/v1/core/api/user-activities/",
    params: {
      ordering: "-created_at",
      page: 1,
    },
  }),
};

/**
 * useApi(keyOrConfig, optionsOrParams?)
 *
 * Inakubali patterns zote:
 *  - useApi("events")
 *  - useApi("lessons", { search: "..." })               // legacy: params direct
 *  - useApi("lessons", { params: { search: "..." } })
 *  - useApi("/lessons/slug-hapa/")                      // direct path
 *  - useApi({ url: "/events/slug/" , params: {...} })
 */
export function useApi(keyOrConfig, optionsOrParams = {}) {
  const { accessToken, API_BASE_URL: authBaseUrl } = useAuth() || {};

  const normalizedOptions = useMemo(() => {
    const o = optionsOrParams || {};
    const looksLikeOptions =
      Object.prototype.hasOwnProperty.call(o, "params") ||
      Object.prototype.hasOwnProperty.call(o, "method") ||
      Object.prototype.hasOwnProperty.call(o, "body") ||
      Object.prototype.hasOwnProperty.call(o, "skip") ||
      Object.prototype.hasOwnProperty.call(o, "manual") ||
      Object.prototype.hasOwnProperty.call(o, "auth");

    return looksLikeOptions ? o : { params: o };
  }, [optionsOrParams]);

  const {
    params = {},
    method = "GET",
    body = null,
    skip = false,
    manual = false,
    auth = false, // IMPORTANT: usitume Authorization kwa public endpoints bila kuhitaji
  } = normalizedOptions;

  // Base URL (online backend)
  const BASE_URL = useMemo(() => {
    const envBase =
      import.meta.env.VITE_API_BASE_URL ||
      import.meta.env.VITE_API_URL || // fallback kama ulitumia jina hili zamani
      authBaseUrl ||
      DEFAULT_BASE;

    return stripTrailingSlash(envBase);
  }, [authBaseUrl]);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!manual);
  const [error, setError] = useState(null);

  const abortRef = useRef(null);

  const buildUrl = (base, path, q = {}) => {
    const search = new URLSearchParams();
    Object.entries(q || {}).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") return;
      if (Array.isArray(v)) v.forEach((x) => search.append(k, x));
      else search.append(k, v);
    });

    const full = `${base}${path.startsWith("/") ? path : `/${path}`}`;
    return search.toString() ? `${full}?${search.toString()}` : full;
  };

  const resolveRequest = () => {
    const today = new Date().toISOString().slice(0, 10);

    // 1) object config
    if (keyOrConfig && typeof keyOrConfig === "object") {
      const base = stripTrailingSlash(keyOrConfig.baseUrl || BASE_URL);
      const urlPath = keyOrConfig.url || "/";
      const finalParams = { ...(keyOrConfig.params || {}), ...(params || {}) };
      return buildUrl(base, urlPath, finalParams);
    }

    // 2) string key
    if (typeof keyOrConfig === "string") {
      // direct absolute url
      if (keyOrConfig.startsWith("http")) return buildUrl("", keyOrConfig, params);

      const def = endpointMap[keyOrConfig];
      if (def) {
        const conf = def({ today });
        const base = stripTrailingSlash(conf.baseUrl || BASE_URL);
        const finalParams = { ...(conf.params || {}), ...(params || {}) };
        return buildUrl(base, conf.url, finalParams);
      }

      // direct path e.g. "/lessons/slug/"
      if (keyOrConfig.startsWith("/")) return buildUrl(BASE_URL, keyOrConfig, params);

      // fallback treat as path segment
      return buildUrl(BASE_URL, `/${keyOrConfig}`, params);
    }

    return null;
  };

  const doFetch = async (signal) => {
    if (!keyOrConfig || skip) return;

    setLoading(true);
    setError(null);

    const url = resolveRequest();
    if (!url) {
      setLoading(false);
      setError(new Error("Invalid request configuration"));
      return;
    }

    try {
      const headers = { "Content-Type": "application/json" };
      if (auth && accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }

      const res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal,
      });

      const text = await res.text();
      const payload = safeJsonParse(text);

      if (!res.ok) {
        throw new Error(normalizeApiError(payload, text || "API error"));
      }

      // allow empty body
      setData(payload ?? (text ? text : {}));
    } catch (err) {
      if (err?.name !== "AbortError") {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (manual || skip) return;

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    doFetch(controller.signal);

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    typeof keyOrConfig === "string" ? keyOrConfig : JSON.stringify(keyOrConfig || {}),
    JSON.stringify(params || {}),
    method,
    body ? JSON.stringify(body) : "",
    skip,
    manual,
    auth,
    accessToken,
    BASE_URL,
  ]);

  const refetch = () => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    return doFetch(controller.signal);
  };

  return { data, loading, error, refetch };
}

export default useApi;
