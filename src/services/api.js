const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    // Clean up endpoint by removing undefined parameters
    let cleanEndpoint = endpoint;
    if (cleanEndpoint.includes('undefined')) {
      // Remove parameters with undefined values
      cleanEndpoint = cleanEndpoint.replace(/[?&]([^=]+)=undefined/g, '');
      // Clean up any remaining malformed query strings
      cleanEndpoint = cleanEndpoint.replace(/[?&]$/, '').replace(/[?]&/, '?');
    }
    
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Categories
  async getCategories() {
    return this.request('/categories/');
  }

  async getCategory(slug) {
    return this.request(`/categories/${slug}/`);
  }

  // Posts
  async getPosts(params = {}) {
    // Filter out undefined values
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    const queryString = new URLSearchParams(cleanParams).toString();
    return this.request(`/posts/${queryString ? `?${queryString}` : ''}`);
  }

  async getPost(slug) {
    return this.request(`/posts/${slug}/`);
  }

  async getFeaturedPosts() {
    return this.request('/posts/featured/');
  }

  // Seasons
  async getSeasons() {
    return this.request('/seasons/');
  }

  async getSeason(slug) {
    return this.request(`/seasons/${slug}/`);
  }

  // Series
  async getSeries(params = {}) {
    // Filter out undefined values
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    const queryString = new URLSearchParams(cleanParams).toString();
    return this.request(`/series/${queryString ? `?${queryString}` : ''}`);
  }

  async getSeriesDetail(slug) {
    return this.request(`/series/${slug}/`);
  }

  // Lessons
  async getLessons(params = {}) {
    // Filter out undefined values
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    const queryString = new URLSearchParams(cleanParams).toString();
    return this.request(`/lessons/${queryString ? `?${queryString}` : ''}`);
  }

  async getLesson(slug) {
    return this.request(`/lessons/${slug}/`);
  }

  // Events
  async getEvents(params = {}) {
    // Filter out undefined values
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    const queryString = new URLSearchParams(cleanParams).toString();
    return this.request(`/events/${queryString ? `?${queryString}` : ''}`);
  }

  async getEvent(slug) {
    return this.request(`/events/${slug}/`);
  }

  async getUpcomingEvents() {
    return this.request('/events/upcoming/');
  }

  async getFeaturedEvents() {
    return this.request('/events/featured/');
  }

  // Media
  async getMediaItems(params = {}) {
    // Filter out undefined values
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    const queryString = new URLSearchParams(cleanParams).toString();
    return this.request(`/media/${queryString ? `?${queryString}` : ''}`);
  }

  async getMediaItem(id) {
    return this.request(`/media/${id}/`);
  }

  // Prayer Requests
  async submitPrayerRequest(data) {
    return this.request('/prayer-requests/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export default new ApiService();