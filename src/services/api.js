// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    // Clean up endpoint by removing undefined parameters from query string
    let cleanEndpoint = endpoint;
    if (cleanEndpoint.includes('undefined')) {
      cleanEndpoint = cleanEndpoint.replace(/[?&]([^=]+)=undefined/g, '');
      cleanEndpoint = cleanEndpoint.replace(/[?&]$/, '').replace(/[?]&/, '?');
    }

    const url = `${this.baseURL}${cleanEndpoint}`;

    // Auto-attach JWT access token if available
    const token = localStorage.getItem('access');

    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let message = `HTTP error! status: ${response.status}`;
        try {
          const body = await response.json();
          if (body && body.detail) {
            message = body.detail;
          }
        } catch (e) {
          // ignore JSON parse error
        }
        throw new Error(message);
      }

      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // ========= AUTH (JWT) =========

  async login(credentials) {
    // => /api/v1/auth/token/
    return this.request('/v1/auth/token/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async refreshToken(refreshToken) {
    return this.request('/v1/auth/token/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
    });
  }

  async verifyToken(token) {
    return this.request('/v1/auth/token/verify/', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  // ========= USER / PROFILE =========

  async registerUser(data) {
    // badilisha path hii ikibidi mfano: '/v1/users/register/'
    return this.request('/v1/auth/register/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProfile() {
    // badilisha path hii kulingana na backend yako
    return this.request('/v1/users/me/');
  }

  async updateProfile(data) {
    return this.request('/v1/users/me/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async changePassword(data) {
    // kawaida: { old_password, new_password }
    return this.request('/v1/auth/password/change/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getNotifications(params = {}) {
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    const queryString = new URLSearchParams(cleanParams).toString();
    // => /api/v1/notifications/
    return this.request(`/v1/notifications/${queryString ? `?${queryString}` : ''}`);
  }

  // ========= CATEGORIES =========
  async getCategories() {
    return this.request('/v1/categories/');
  }

  async getCategory(slug) {
    return this.request(`/v1/categories/${slug}/`);
  }

  // ========= POSTS =========
  async getPosts(params = {}) {
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    const queryString = new URLSearchParams(cleanParams).toString();
    return this.request(`/v1/posts/${queryString ? `?${queryString}` : ''}`);
  }

  async getPost(slug) {
    return this.request(`/v1/posts/${slug}/`);
  }

  async getFeaturedPosts() {
    return this.request('/v1/posts/featured/');
  }

  // ========= SEASONS =========
  async getSeasons() {
    return this.request('/v1/seasons/');
  }

  async getSeason(slug) {
    return this.request(`/v1/seasons/${slug}/`);
  }

  // ========= SERIES =========
  async getSeries(params = {}) {
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    const queryString = new URLSearchParams(cleanParams).toString();
    return this.request(`/v1/series/${queryString ? `?${queryString}` : ''}`);
  }

  async getSeriesDetail(slug) {
    return this.request(`/v1/series/${slug}/`);
  }

  // ========= LESSONS =========
  async getLessons(params = {}) {
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    const queryString = new URLSearchParams(cleanParams).toString();
    return this.request(`/v1/lessons/${queryString ? `?${queryString}` : ''}`);
  }

  async getLesson(slug) {
    return this.request(`/v1/lessons/${slug}/`);
  }

  // ========= EVENTS =========
  async getEvents(params = {}) {
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    const queryString = new URLSearchParams(cleanParams).toString();
    // Hii inalingana na public events API yako: /api/v1/events/
    return this.request(`/v1/events/${queryString ? `?${queryString}` : ''}`);
  }

  async getEvent(slug) {
    return this.request(`/v1/events/${slug}/`);
  }

  async getUpcomingEvents() {
    return this.request('/v1/events/upcoming/');
  }

  async getFeaturedEvents() {
    return this.request('/v1/events/featured/');
  }

  // ========= MEDIA =========
  async getMediaItems(params = {}) {
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    const queryString = new URLSearchParams(cleanParams).toString();
    return this.request(`/v1/media/${queryString ? `?${queryString}` : ''}`);
  }

  async getMediaItem(id) {
    return this.request(`/v1/media/${id}/`);
  }

  // ========= PRAYER REQUESTS =========
  async submitPrayerRequest(data) {
    return this.request('/v1/prayer-requests/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export default new ApiService();
