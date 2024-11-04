import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth-slice.js";
import cartSlice from "./cart-slice.js";
import uiSlice from "./ui-slice.js";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    cart: cartSlice.reducer,
    ui: uiSlice.reducer,
  },
});

export default store;
