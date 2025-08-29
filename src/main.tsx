import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "@/store/store.ts";
import { setAuthTokenGetter } from "@/utils/api";
import App from "./App.tsx";
import "./index.css";

// Set up auth token getter for API calls
setAuthTokenGetter(() => {
  try {
    const state = store.getState();
    const token = state.auth?.token || undefined;
    
    // Also try to get from localStorage as fallback during rehydration
    if (!token && typeof window !== 'undefined') {
      // First try cookie (backend sets as 'accessToken')
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'accessToken') {
          console.log("🍪 Using accessToken cookie:", value?.substring(0, 20) + "...");
          return value;
        }
      }
      
      // Then try localStorage
      const persistedAuth = localStorage.getItem('persist:auth');
      if (persistedAuth) {
        const parsedAuth = JSON.parse(persistedAuth);
        const persistedToken = parsedAuth.token ? JSON.parse(parsedAuth.token) : null;
        console.log("📦 Using persisted token:", persistedToken?.substring(0, 20) + "...");
        return persistedToken;
      }
    }
    
    console.log("🔍 Auth state:", state.auth);
    console.log("🎯 Token being sent:", token?.substring(0, 20) + "...");
    return token;
  } catch (error) {
    console.error("❌ Error getting auth token:", error);
    return undefined;
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
);
