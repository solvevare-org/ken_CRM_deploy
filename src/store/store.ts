import { configureStore } from "@reduxjs/toolkit";
import signupReducer from "./slices/signupSlice";
import leadFormLinkReducer from "./slices/leadFormLinkSlice";
import realtorReducer from "./slices/realtorSlice";
import authReducer from "./slices/authSlice"; // Adjust path as needed

export const store = configureStore({
  reducer: {
    signup: signupReducer,
    leadFormLink: leadFormLinkReducer,
    auth: authReducer,
    realtor: realtorReducer,
  },
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
