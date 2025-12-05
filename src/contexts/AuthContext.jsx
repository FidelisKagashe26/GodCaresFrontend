import { createContext, useContext, useState } from 'react';

const API_BASE_URL = 'http://127.0.0.1:8000'; // badilisha ukihost kwenye server

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('gc365_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem('gc365_access') || null
  );
  const [refreshToken, setRefreshToken] = useState(
    () => localStorage.getItem('gc365_refresh') || null
  );
  const [authLoading, setAuthLoading] = useState(false);

  const isAuthenticated = !!accessToken;

  const persistAuth = (nextUser, access, refresh) => {
    setUser(nextUser || null);
    setAccessToken(access || null);
    setRefreshToken(refresh || null);

    if (nextUser) {
      localStorage.setItem('gc365_user', JSON.stringify(nextUser));
    } else {
      localStorage.removeItem('gc365_user');
    }

    if (access) localStorage.setItem('gc365_access', access);
    else localStorage.removeItem('gc365_access');

    if (refresh) localStorage.setItem('gc365_refresh', refresh);
    else localStorage.removeItem('gc365_refresh');
  };

  // LOGIN
  const login = async (identifier, password) => {
    setAuthLoading(true);
    try {
      // Hapa tunatumia SimpleJWT default: username + password
      // Kama backend yako inatumia 'email', badili hapa field.
      const tokenRes = await fetch(`${API_BASE_URL}/api/v1/auth/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: identifier,
          password,
        }),
      });

      if (!tokenRes.ok) {
        let detail = 'Imeshindikana kuingia. Tafadhali hakiki taarifa zako.';
        try {
          const err = await tokenRes.json();
          if (err?.detail) detail = err.detail;
        } catch (e) {
          // ignore
        }
        throw new Error(detail);
      }

      const tokenData = await tokenRes.json();
      const access = tokenData.access;
      const refresh = tokenData.refresh;

      // Fetch profile ya user aliye-login
      let profile = null;
      try {
        // Jaribu endpoint ya kwanza
        let profileRes = await fetch(
          `${API_BASE_URL}/api/v1/core/api/user-profiles/me/`,
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );

        // Kama 404 au 405, jaribu alternative
        if (!profileRes.ok) {
          profileRes = await fetch(
            `${API_BASE_URL}/api/v1/core/api/user/profile/me/`,
            {
              headers: {
                Authorization: `Bearer ${access}`,
              },
            }
          );
        }

        if (profileRes.ok) {
          profile = await profileRes.json();
        }
      } catch (e) {
        console.error('Error loading user profile', e);
      }

      persistAuth(profile, access, refresh);
      return { user: profile, access, refresh };
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    persistAuth(null, null, null);
  };

  // Update profile (tunajaribu /me/ PUT, kisha fallback kwa /{id}/ PATCH kama inashindikana)
  const updateProfile = async (profileData) => {
    if (!accessToken || !user) {
      throw new Error('User haja-login.');
    }

    // Kwanza jaribu /me/ na PUT
    let res = await fetch(
      `${API_BASE_URL}/api/v1/core/api/user-profiles/me/`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(profileData),
      }
    );

    // Kama method haipo /me/ (405/404), tumia /{id}/ na PATCH
    if ((res.status === 405 || res.status === 404) && user.id) {
      res = await fetch(
        `${API_BASE_URL}/api/v1/core/api/user-profiles/${user.id}/`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(profileData),
        }
      );
    }

    if (!res.ok) {
      throw new Error('Imeshindikana kuhifadhi taarifa za profaili.');
    }

    const updated = await res.json();
    persistAuth(updated, accessToken, refreshToken);
    return updated;
  };

  const value = {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    authLoading,
    login,
    logout,
    updateProfile,
    API_BASE_URL,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth lazima itumike ndani ya <AuthProvider>');
  }
  return ctx;
}
