import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    notificationStatus: null,
    notificationMessage: null,
    notificationTitle: null,
    notificationVisible: false,
  },
  reducers: {
    setNotification(state, action) {
      console.log("Notification received: ", action.payload);
      console.log(action.payload);
      state.notificationMessage = action.payload.message;
      state.notificationStatus = action.payload.status;
      state.notificationTitle = action.payload.title;
      state.notificationVisible = action.payload.isVisible;
    },
    resetNotification(state) {
      state.notificationMessage = null;
      state.notificationStatus = null;
      state.notificationTitle = null;
      state.notificationVisible = false;
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice;
