import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";

// Slices
import signupReducer from "./slices/signupSlice";
import leadFormLinkReducer from "./slices/leadFormLinkSlice";
import realtorReducer from "./slices/realtorSlice";
import authReducer from "./slices/authSlice"; // Adjust path as needed
import otherAuthReducer from "./slices/otherAuthSlice";
import workspaceReducer from "./slices/workspaceSlice";
import { setAuthTokenGetter } from "@/utils/api";

// Persist configuration for auth slice
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["token", "user", "isAuthenticated", "user_type"], // Only persist these fields
};

const realtorPersistConfig = {
  key: "realtor",
  storage,
  whitelist: ["leadCount", "clientCount", "propertyCount"], // Only persist the dashboard counts fields
};

// Create persisted reducer
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedRealtorReducer = persistReducer(
  realtorPersistConfig,
  realtorReducer
);

const store = configureStore({
  reducer: {
    signup: signupReducer,
    leadFormLink: leadFormLinkReducer,
    auth: persistedAuthReducer,
    otherAuth: otherAuthReducer,
    realtor: persistedRealtorReducer,
    workspace: workspaceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
  devTools: import.meta.env.DEV,
});

// Provide token getter to API layer to avoid circular imports
setAuthTokenGetter(() => store.getState().auth?.token ?? undefined);

export const persistor = persistStore(store);
export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
