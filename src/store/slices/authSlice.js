import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
  notifications: [
    {
      id: 1,
      title: "Exam Result Ready",
      message: "Your React Assessment result is now available.",
      time: "2h ago",
      type: "success",
      read: false,
    },
    {
      id: 2,
      title: "Upcoming Assessment",
      message: "Node.js advanced test starts in 24 hours.",
      time: "5h ago",
      type: "info",
      read: false,
    },
    {
      id: 3,
      title: "System Update",
      message: "New security features have been enabled.",
      time: "1d ago",
      type: "warning",
      read: false,
    },
  ],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    markNotificationsRead: (state) => {
      state.notifications = state.notifications.map((n) => ({
        ...n,
        read: true,
      }));
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  updateUser,
  setNotifications,
  markNotificationsRead,
} = authSlice.actions;
export default authSlice.reducer;
