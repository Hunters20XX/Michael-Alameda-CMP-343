// Advanced API utility with error handling, retry logic, and optimistic updates

const API_BASE_URL = '/api';

// HTTP status codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500
};

// Custom API Error class
class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Network status checker
const isOnline = () => navigator.onLine;

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2
};

// Sleep utility
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Calculate retry delay with exponential backoff
const getRetryDelay = (attempt) => {
  const delay = RETRY_CONFIG.baseDelay * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt);
  return Math.min(delay, RETRY_CONFIG.maxDelay);
};

// Core API request function with retry logic
const apiRequest = async (endpoint, options = {}, retryCount = 0) => {
  const url = `${API_BASE_URL}${endpoint}`;

  // Check network status
  if (!isOnline()) {
    throw new ApiError('No internet connection', 0);
  }

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    // Handle rate limiting with retry
    if (response.status === HTTP_STATUS.TOO_MANY_REQUESTS && retryCount < RETRY_CONFIG.maxRetries) {
      const retryAfter = response.headers.get('Retry-After');
      const delay = retryAfter ? parseInt(retryAfter) * 1000 : getRetryDelay(retryCount);

      console.log(`Rate limited. Retrying in ${delay}ms...`);
      await sleep(delay);

      return apiRequest(endpoint, options, retryCount + 1);
    }

    // Handle other retryable errors
    if (!response.ok && retryCount < RETRY_CONFIG.maxRetries &&
        [HTTP_STATUS.INTERNAL_SERVER_ERROR, 502, 503, 504].includes(response.status)) {

      const delay = getRetryDelay(retryCount);
      console.log(`Server error (${response.status}). Retrying in ${delay}ms...`);
      await sleep(delay);

      return apiRequest(endpoint, options, retryCount + 1);
    }

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }

      throw new ApiError(
        errorData.error || errorData.message || `HTTP ${response.status}`,
        response.status,
        errorData
      );
    }

    // Parse response
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return await response.text();

  } catch (error) {
    // If it's already an ApiError, re-throw it
    if (error instanceof ApiError) {
      throw error;
    }

    // Network or other errors - retry if we haven't exceeded max retries
    if (retryCount < RETRY_CONFIG.maxRetries) {
      const delay = getRetryDelay(retryCount);
      console.log(`Network error. Retrying in ${delay}ms...`);
      await sleep(delay);

      return apiRequest(endpoint, options, retryCount + 1);
    }

    // Max retries exceeded or non-retryable error
    throw new ApiError(error.message || 'Network error', 0);
  }
};

// High-level API methods
export const api = {
  // Posts API
  posts: {
    async getAll() {
      return apiRequest('/posts');
    },

    async getById(id) {
      return apiRequest(`/posts/${id}`);
    },

    async create(postData) {
      return apiRequest('/posts', {
        method: 'POST',
        body: JSON.stringify(postData)
      });
    },

    async update(id, postData) {
      return apiRequest(`/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(postData)
      });
    },

    async like(id) {
      return apiRequest(`/posts/${id}/like`, {
        method: 'PATCH'
      });
    },

    async delete(id) {
      return apiRequest(`/posts/${id}`, {
        method: 'DELETE'
      });
    },

    // Advanced operations
    async getPaginated(page = 1, limit = 10) {
      return apiRequest(`/posts/paginated?page=${page}&limit=${limit}`);
    },

    async search(query, page = 1, limit = 10) {
      return apiRequest(`/posts/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
    },

    async getStats() {
      return apiRequest('/posts/stats');
    },

    async bulkLike(postIds, increment = 1) {
      return apiRequest('/posts/bulk-like', {
        method: 'POST',
        body: JSON.stringify({ postIds, likeIncrement: increment })
      });
    }
  },

  // Contact API
  contact: {
    async send(messageData) {
      return apiRequest('/contact', {
        method: 'POST',
        body: JSON.stringify(messageData)
      });
    }
  },

  // System API
  system: {
    async health() {
      return apiRequest('/health');
    },

    async docs() {
      return apiRequest('/docs');
    },

    async dbStatus() {
      return apiRequest('/db/status');
    }
  }
};

// Optimistic update utilities
export const optimisticUpdates = {
  // Create optimistic update for likes
  createLikeUpdate(postId, currentLikes) {
    return {
      postId,
      previousLikes: currentLikes,
      newLikes: currentLikes + 1,
      rollback: (posts, setPosts) => {
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post.id === postId
              ? { ...post, likes: currentLikes }
              : post
          )
        );
      },
      apply: (posts, setPosts) => {
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post.id === postId
              ? { ...post, likes: currentLikes + 1 }
              : post
          )
        );
      }
    };
  },

  // Create optimistic update for new post
  createPostUpdate(postData) {
    const tempId = `temp-${Date.now()}`;
    const optimisticPost = {
      id: tempId,
      ...postData,
      date: new Date().toISOString(),
      likes: 0,
      _isOptimistic: true
    };

    return {
      tempId,
      postData,
      rollback: (posts, setPosts) => {
        setPosts(prevPosts => prevPosts.filter(post => post.id !== tempId));
      },
      apply: (posts, setPosts) => {
        setPosts(prevPosts => [optimisticPost, ...prevPosts]);
      },
      confirm: (realPost, posts, setPosts) => {
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post.id === tempId
              ? { ...realPost, _isOptimistic: false }
              : post
          )
        );
      }
    };
  }
};

// Error handling utilities
export const errorHandlers = {
  handleApiError: (error, context = '') => {
    console.error(`API Error${context ? ` (${context})` : ''}:`, error);

    if (error instanceof ApiError) {
      switch (error.status) {
        case HTTP_STATUS.BAD_REQUEST:
          return { type: 'validation', message: error.message };
        case HTTP_STATUS.NOT_FOUND:
          return { type: 'not_found', message: 'Resource not found' };
        case HTTP_STATUS.TOO_MANY_REQUESTS:
          return { type: 'rate_limited', message: 'Too many requests. Please try again later.' };
        case HTTP_STATUS.INTERNAL_SERVER_ERROR:
          return { type: 'server_error', message: 'Server error. Please try again.' };
        case 0:
          return { type: 'network', message: 'Network error. Check your connection.' };
        default:
          return { type: 'unknown', message: error.message };
      }
    }

    return { type: 'unknown', message: error.message || 'An unexpected error occurred' };
  },

  getUserFriendlyMessage: (errorType) => {
    const messages = {
      validation: 'Please check your input and try again.',
      not_found: 'The requested item was not found.',
      rate_limited: 'You\'re making requests too quickly. Please wait a moment.',
      server_error: 'Our servers are experiencing issues. Please try again later.',
      network: 'Please check your internet connection and try again.',
      unknown: 'Something went wrong. Please try again.'
    };

    return messages[errorType] || messages.unknown;
  }
};

export { ApiError, HTTP_STATUS };
