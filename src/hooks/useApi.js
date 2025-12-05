// src/hooks/useApi.js
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Ramani ya "friendly keys" kwenda kwenye endpoints halisi za backend
const endpointMap = {
  // Homepage: habari zilizochaguliwa
  'featured-posts': ({ today }) => ({
    url: '/v1/content/posts/',
    params: {
      featured: true,
      status: 'published',
      ordering: '-published_at',
      page: 1,
    },
  }),

  // Homepage: matukio yajayo
  'upcoming-events': ({ today }) => ({
    url: '/v1/content/events/',
    params: {
      date_from: today,
      ordering: 'start_date',
      page: 1,
    },
  }),

  // Notifications simple: user activities
  'user-activities': () => ({
    url: '/v1/core/api/user-activities/',
    params: {
      ordering: '-created_at',
      page: 1,
    },
  }),
};

export function useApi(keyOrConfig, options = {}) {
  const { accessToken, API_BASE_URL: authBaseUrl } = useAuth();

  // Backend route ibaki kupitia Vite:
  // - dev: '/api' (proxy kwenye vite.config.js)
  // - prod: unaweza kuweka VITE_API_URL = 'https://domain.com/api'
  const BASE_URL = authBaseUrl || import.meta.env.VITE_API_URL || '/api';

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!options.manual);
  const [error, setError] = useState(null);

  const {
    params = {},
    method = 'GET',
    body = null,
    skip = false,
  } = options;

  const doFetch = async (signal) => {
    if (!keyOrConfig || skip) return;

    setLoading(true);
    setError(null);

    try {
      let url = '';
      let finalParams = { ...params };
      const today = new Date().toISOString().slice(0, 10);

      if (typeof keyOrConfig === 'string') {
        const def = endpointMap[keyOrConfig];

        if (def) {
          const conf = def({ today });
          const base = conf.baseUrl || BASE_URL;
          url = `${base}${conf.url}`;
          finalParams = { ...conf.params, ...finalParams };
        } else if (keyOrConfig.startsWith('http')) {
          url = keyOrConfig;
        } else if (keyOrConfig.startsWith('/api/')) {
          // tayari ina /api, acha ipite direct kwenye Vite proxy
          url = keyOrConfig;
        } else {
          // mfano '/v1/posts/' au '/posts/'
          url = `${BASE_URL}${keyOrConfig}`;
        }
      } else {
        // keyOrConfig = { url, baseUrl?, params? }
        const base = keyOrConfig.baseUrl || BASE_URL;
        url = `${base}${keyOrConfig.url}`;
        finalParams = { ...(keyOrConfig.params || {}), ...finalParams };
      }

      const search = new URLSearchParams();
      Object.entries(finalParams).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return;
        if (Array.isArray(value)) {
          value.forEach((v) => search.append(key, v));
        } else {
          search.append(key, value);
        }
      });

      const urlWithParams = search.toString()
        ? `${url}?${search.toString()}`
        : url;

      const res = await fetch(urlWithParams, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: body ? JSON.stringify(body) : null,
        signal,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'API error');
      }

      const json = await res.json();
      setData(json);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.manual || skip) return;
    const controller = new AbortController();
    doFetch(controller.signal);

    return () => controller.abort();
  }, [
    typeof keyOrConfig === 'string'
      ? keyOrConfig
      : JSON.stringify(keyOrConfig || {}),
    JSON.stringify(params),
    method,
    body ? JSON.stringify(body) : null,
    accessToken,
    skip,
    BASE_URL,
  ]);

  const refetch = () => doFetch();

  return { data, loading, error, refetch };
}

export default useApi;
