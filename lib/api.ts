// API Configuration for Seat Predictor Admin Panel

const API_BASE_URL = "http://127.0.0.1:8000/api";

// API Endpoints
export const API_ENDPOINTS = {
  // Dashboard Analytics
  DASHBOARD_STATS: `${API_BASE_URL}/admin/dashboard/stats/`,
  DASHBOARD_COMPREHENSIVE: `${API_BASE_URL}/admin/dashboard/comprehensive/`,
  DASHBOARD_RANK_BANDS: `${API_BASE_URL}/admin/dashboard/rank-bands/`,
  DASHBOARD_STATES: `${API_BASE_URL}/admin/dashboard/states/`,
  DASHBOARD_SPECIALIZATIONS: `${API_BASE_URL}/admin/dashboard/specializations/`,
  DASHBOARD_CATEGORIES: `${API_BASE_URL}/admin/dashboard/categories/`,
  DASHBOARD_COURSES: `${API_BASE_URL}/admin/dashboard/courses/`,

  // Data Upload
  UPLOAD_ENHANCED: `${API_BASE_URL}/admin/upload/enhanced/`,
  UPLOAD_HISTORY: `${API_BASE_URL}/admin/upload/history/`,
  ERROR_REPORT: `${API_BASE_URL}/admin/upload/error-reports/`,

  // User Searches
  USER_SEARCHES_ENHANCED: `${API_BASE_URL}/admin/user-searches/enhanced/`,
  USER_SEARCHES_ANALYTICS: `${API_BASE_URL}/admin/user-searches/analytics/`,
  USER_SEARCHES_EXPORT: `${API_BASE_URL}/admin/user-searches/export-csv/`,
  USER_SEARCHES_INSIGHTS: `${API_BASE_URL}/admin/user-searches/insights/`,

  // System Settings
  SYSTEM_SETTINGS: `${API_BASE_URL}/admin/settings/`,
  SET_ACTIVE_YEAR: `${API_BASE_URL}/admin/settings/set-active-year/`,
  UPDATE_SETTINGS: `${API_BASE_URL}/admin/settings/update/`,
  DATA_HEALTH: `${API_BASE_URL}/admin/settings/data-health/`,
  SYSTEM_STATUS: `${API_BASE_URL}/admin/settings/system-status/`,

  // Authentication
  ADMIN_LOGIN: `${API_BASE_URL}/admin/login/`,
  ADMIN_REGISTER: `${API_BASE_URL}/admin/register/`,
  ADMIN_REFRESH: `${API_BASE_URL}/admin/refresh/`,
};

// API Helper Functions
export class ApiClient {
  private static token: string | null = null;

  static setToken(token: string) {
    this.token = token;
  }

  static getHeaders(includeAuth: boolean = true) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (includeAuth && this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }

  static async get(url: string, includeAuth: boolean = true) {
    const response = await fetch(url, {
      method: "GET",
      headers: this.getHeaders(includeAuth),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  static async post(url: string, data: any, includeAuth: boolean = true) {
    const response = await fetch(url, {
      method: "POST",
      headers: this.getHeaders(includeAuth),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  }

  static async postFormData(
    url: string,
    formData: FormData,
    includeAuth: boolean = true
  ) {
    const headers: Record<string, string> = {};

    if (includeAuth && this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  }

  static async downloadFile(
    url: string,
    filename: string,
    includeAuth: boolean = true
  ) {
    const headers: Record<string, string> = {};

    if (includeAuth && this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }
}

// Dashboard API Functions
export const dashboardApi = {
  getStats: (days: number = 30) =>
    ApiClient.get(`${API_ENDPOINTS.DASHBOARD_STATS}?days=${days}`),

  getComprehensive: () => ApiClient.get(API_ENDPOINTS.DASHBOARD_COMPREHENSIVE),

  getRankBands: (days: number = 30) =>
    ApiClient.get(`${API_ENDPOINTS.DASHBOARD_RANK_BANDS}?days=${days}`),

  getStates: (days: number = 30) =>
    ApiClient.get(`${API_ENDPOINTS.DASHBOARD_STATES}?days=${days}`),

  getSpecializations: (days: number = 30) =>
    ApiClient.get(`${API_ENDPOINTS.DASHBOARD_SPECIALIZATIONS}?days=${days}`),

  getCategories: (days: number = 30) =>
    ApiClient.get(`${API_ENDPOINTS.DASHBOARD_CATEGORIES}?days=${days}`),

  getCourses: (days: number = 30) =>
    ApiClient.get(`${API_ENDPOINTS.DASHBOARD_COURSES}?days=${days}`),
};

// Upload API Functions
export const uploadApi = {
  uploadFile: async (file: File, exam?: string, year?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    if (exam) formData.append("exam", exam);
    if (year) formData.append("year", year);
    const response = await fetch("http://localhost:8000/api/upload-excel/", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Upload failed");
    }

    return response.json();
  },

  getHistory: async () => {
    // For now mock history (you can later connect to your backend if you expose an endpoint for history)
    return {
      upload_history: [],
    };
  },
};

// User Searches API Functions
export const userSearchesApi = {
  getEnhanced: (
    params: {
      page?: number;
      page_size?: number;
      search?: string;
      exam_filter?: string;
      category_filter?: string;
      state_filter?: string;
      results_filter?: string;
      date_from?: string;
      date_to?: string;
      sort_by?: string;
    } = {}
  ) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        searchParams.append(key, value.toString());
      }
    });
    return ApiClient.get(
      `${API_ENDPOINTS.USER_SEARCHES_ENHANCED}?${searchParams.toString()}`
    );
  },

  getAnalytics: (days: number = 30) =>
    ApiClient.get(`${API_ENDPOINTS.USER_SEARCHES_ANALYTICS}?days=${days}`),

  exportCsv: (filters: Record<string, any>) =>
    ApiClient.post(API_ENDPOINTS.USER_SEARCHES_EXPORT, { filters }),

  getInsights: (days: number = 30) =>
    ApiClient.get(`${API_ENDPOINTS.USER_SEARCHES_INSIGHTS}?days=${days}`),
};

// Settings API Functions
export const settingsApi = {
  getSettings: () => ApiClient.get(API_ENDPOINTS.SYSTEM_SETTINGS),

  setActiveYear: (examType: string, year: number) =>
    ApiClient.post(API_ENDPOINTS.SET_ACTIVE_YEAR, {
      exam_type: examType,
      year,
    }),

  updateSettings: (settings: {
    data_source_priority?: string;
    automatic_backup?: boolean;
    email_notifications?: boolean;
  }) => ApiClient.post(API_ENDPOINTS.UPDATE_SETTINGS, settings),

  getDataHealth: () => ApiClient.get(API_ENDPOINTS.DATA_HEALTH),

  getSystemStatus: () => ApiClient.get(API_ENDPOINTS.SYSTEM_STATUS),
};

// Authentication API Functions
export const authApi = {
  login: (username: string, password: string) =>
    ApiClient.post(API_ENDPOINTS.ADMIN_LOGIN, { username, password }, false),

  register: (userData: {
    username: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
  }) => ApiClient.post(API_ENDPOINTS.ADMIN_REGISTER, userData, false),

  refresh: (refreshToken: string) =>
    ApiClient.post(
      API_ENDPOINTS.ADMIN_REFRESH,
      { refresh: refreshToken },
      false
    ),
};

// Error handling utility
export const handleApiError = (error: any): string => {
  if (error.message) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unexpected error occurred";
};

// Response type definitions
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  status: number;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    page_size: number;
    has_next: boolean;
    has_previous: boolean;
  };
  summary?: {
    total_searches: number;
    has_results: number;
    zero_results: number;
    success_rate: number;
  };
}
