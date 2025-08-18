import { configureStore } from "@reduxjs/toolkit";
import signupReducer from "./slices/signupSlice";
import leadFormLinkReducer from "./slices/leadFormLinkSlice";
import realtorReducer from "./slices/realtorSlice";

export const store = configureStore({
  reducer: {
    signup: signupReducer,
    leadFormLink: leadFormLinkReducer,
    realtor: realtorReducer,
  },
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
