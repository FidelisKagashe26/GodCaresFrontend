import { useState, useEffect } from 'react';
import apiService from '../services/api';

export function useApi(endpoint, params = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Filter out undefined values from params
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let result;
        switch (endpoint) {
          case 'posts':
            result = await apiService.getPosts(cleanParams);
            break;
          case 'featured-posts':
            result = await apiService.getFeaturedPosts();
            break;
          case 'seasons':
            result = await apiService.getSeasons();
            break;
          case 'lessons':
            result = await apiService.getLessons(cleanParams);
            break;
          case 'events':
            result = await apiService.getEvents(cleanParams);
            break;
          case 'upcoming-events':
            result = await apiService.getUpcomingEvents();
            break;
          case 'featured-events':
            result = await apiService.getFeaturedEvents();
            break;
          case 'media':
            result = await apiService.getMediaItems(cleanParams);
            break;
          case 'categories':
            result = await apiService.getCategories();
            break;
          default:
            throw new Error(`Unknown endpoint: ${endpoint}`);
        }
        
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, JSON.stringify(cleanParams)]);

  return { data, loading, error, refetch: () => fetchData() };
}

export function useApiDetail(endpoint, id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let result;
        switch (endpoint) {
          case 'post':
            result = await apiService.getPost(id);
            break;
          case 'lesson':
            result = await apiService.getLesson(id);
            break;
          case 'event':
            result = await apiService.getEvent(id);
            break;
          case 'season':
            result = await apiService.getSeason(id);
            break;
          case 'media':
            result = await apiService.getMediaItem(id);
            break;
          default:
            throw new Error(`Unknown detail endpoint: ${endpoint}`);
        }
        
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, id]);

  return { data, loading, error };
}