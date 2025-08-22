import { configureStore } from "@reduxjs/toolkit";
import signupReducer from "./slices/signupSlice";
import leadFormLinkReducer from "./slices/leadFormLinkSlice";
import realtorReducer from "./slices/realtorSlice";
import authReducer from "./slices/authSlice"; // Adjust path as needed
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Persist configuration for auth slice
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["token", "user", "isAuthenticated", "user_type"], // Only persist these fields
};

// Create persisted reducer
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

const store = configureStore({
  reducer: {
    signup: signupReducer,
    leadFormLink: leadFormLinkReducer,
    auth: persistedAuthReducer,
    realtor: realtorReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
  devTools: import.meta.env.DEV,
});

export const persistor = persistStore(store);
export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
