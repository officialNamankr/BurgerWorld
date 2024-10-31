import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    user: null,
    role: null,
  },
  reducers: {
    login(state, action) {
      console.log(action.payload);
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.role = action.payload.role;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.role = null;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice;
