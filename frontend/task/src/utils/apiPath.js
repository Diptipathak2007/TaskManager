export const API_BASE_URL = 'http://localhost:8000/api';

export const API_PATHS = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    GET_PROFILE: "/auth/profile",
  },
  USERS: {
    GET_ALL_USERS: "/users",
    GET_USER_BY_ID: (userId) => `/users/${userId}`,
    UPDATE_USER: (userId) => `/users/${userId}`,
    DELETE_USER: (userId) => `/users/${userId}`,
    CREATE_USER: "/users",
  },
  TASKS: {
    GET_ALL_TASKS: "/tasks",
    GET_TASK_BY_ID: (taskId) => `/tasks/${taskId}`,
    CREATE_TASK: "/tasks",
    UPDATE_TASK: (taskId) => `/tasks/${taskId}`,
    DELETE_TASK: (taskId) => `/tasks/${taskId}`,
    GET_DASHBOARD_DATA: "/tasks/dashboard-data",
    GET_USER_DASHBOARD_DATA: (userId) => `/tasks/user/${userId}/dashboard-data`,
    UPDATE_TASK_STATUS: (taskId) => `/tasks/${taskId}/status`,
    UPDATE_TODO_CHECKLIST: (taskId) => `/tasks/${taskId}/todo`,
  },
  REPORTS: {
    EXPORT_TASKS: "/reports/export-tasks",
    EXPORT_USERS: "/reports/export-users",
  },
  IMAGE: {
    UPLOAD_IMAGE: "/auth/upload-image",
  },
};