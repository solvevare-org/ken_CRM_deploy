import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api, { handleApiError } from "@/utils/api"; // Adjust path as needed
import {
  ApiResponse,
  AuthState,
  LoginData,
  SignupData,
  User,
} from "@/types/authTypes";

const BASE_URL = "api/auth";

// Async thunks
export const signup = createAsyncThunk<
  ApiResponse,
  SignupData,
  { rejectValue: string }
>("auth/signup", async (signupData, { rejectWithValue }) => {
  try {
    const response = await api.post<ApiResponse>(
      `${BASE_URL}/signup`,
      signupData
    );
    return response.data;
  } catch (error) {
    const errorMessage = handleApiError(error);
    return rejectWithValue(errorMessage);
  }
});

export const login = createAsyncThunk<
  ApiResponse<{ token: string; user?: User }>,
  LoginData,
  { rejectValue: string }
>("auth/login", async (loginData, { rejectWithValue }) => {
  try {
    const response = await api.post<
      ApiResponse<{ token: string; user?: User }>
    >(`${BASE_URL}/login`, loginData);

    // Store token in localStorage if login is successful
    if (response.data.data?.token) {
      localStorage.setItem("accessToken", response.data.data.token);
    }

    return response.data;
  } catch (error) {
    const errorMessage = handleApiError(error);
    return rejectWithValue(errorMessage);
  }
});

// Verify client signup link
export const verifyClientSignupLink = createAsyncThunk<
  ApiResponse<{ linkData?: any }>,
  string,
  { rejectValue: string }
>("auth/verifyClientSignupLink", async (link, { rejectWithValue }) => {
  try {
    const response = await api.get<ApiResponse<{ linkData?: any }>>(
      `${BASE_URL}/client-signup/check/${link}`
    );
    return response.data;
  } catch (error) {
    console.log("error verifying client signup ", error);
    const errorMessage = handleApiError(error);
    return rejectWithValue(errorMessage);
  }
});

// Client signup (multipart/form-data)
export const clientSignup = createAsyncThunk<
  ApiResponse,
  { link: string; formData: FormData },
  { rejectValue: string }
>("auth/clientSignup", async (payload, { rejectWithValue }) => {
  try {
    const { link, formData } = payload;
    const response = await api.post<ApiResponse>(
      `${BASE_URL}/client-signup/${link}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    console.log("client signup", response);
    return response.data;
  } catch (error) {
    console.log("Error during client signup", error);
    const errorMessage = handleApiError(error);
    return rejectWithValue(errorMessage);
  }
});

// Additional thunk for logout
export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  `${BASE_URL}/logout`,
  async (_, { rejectWithValue }) => {
    try {
      // Call logout endpoint if you have one
      // await api.post('/logout');

      // Remove token from localStorage
      localStorage.removeItem("accessToken");
    } catch (error) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// Initial state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("accessToken"),
  isAuthenticated: !!localStorage.getItem("accessToken"),
  isLoading: false,
  error: null,
  signupSuccess: false,
  // client signup / link verification state
  clientSignupLoading: false,
  clientSignupError: null,
  clientSignupSuccess: false,
  verifyLinkLoading: false,
  verifyLinkError: null,
  verifyLinkData: null,
};

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Clear signup success state
    clearSignupSuccess: (state) => {
      state.signupSuccess = false;
    },

    // Set user manually (useful for token-based auth persistence)
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    // Reset auth state
    resetAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.signupSuccess = false;
      localStorage.removeItem("accessToken");
    },
  },
  extraReducers: (builder) => {
    // Signup cases
    builder
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.signupSuccess = false;
      })
      .addCase(signup.fulfilled, (state) => {
        state.isLoading = false;
        state.signupSuccess = true;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Signup failed";
        state.signupSuccess = false;
      });

    // Verify client signup link cases
    builder
      .addCase(verifyClientSignupLink.pending, (state) => {
        state.verifyLinkLoading = true;
        state.verifyLinkError = null;
        state.verifyLinkData = null;
      })
      .addCase(verifyClientSignupLink.fulfilled, (state, action) => {
        state.verifyLinkLoading = false;
        state.verifyLinkData = action.payload.data?.linkData || null;
        state.verifyLinkError = null;
      })
      .addCase(verifyClientSignupLink.rejected, (state, action) => {
        state.verifyLinkLoading = false;
        state.verifyLinkError = action.payload || "Link verification failed";
      });

    // Client signup cases
    builder
      .addCase(clientSignup.pending, (state) => {
        state.clientSignupLoading = true;
        state.clientSignupError = null;
        state.clientSignupSuccess = false;
      })
      .addCase(clientSignup.fulfilled, (state) => {
        state.clientSignupLoading = false;
        state.clientSignupSuccess = true;
        state.clientSignupError = null;
      })
      .addCase(clientSignup.rejected, (state, action) => {
        state.clientSignupLoading = false;
        state.clientSignupError = action.payload || "Client signup failed";
        state.clientSignupSuccess = false;
      });

    // Login cases
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.data?.token || null;
        state.user = action.payload.data?.user || null;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.error = action.payload || "Login failed";
        localStorage.removeItem("accessToken");
      });

    // Logout cases
    builder
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        // Still log out locally even if server request fails
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.error = action.payload || "Logout failed";
      });
  },
});

// Export actions
export const { clearError, clearSignupSuccess, setUser, resetAuth } =
  authSlice.actions;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) =>
  state.auth.isLoading;
export const selectError = (state: { auth: AuthState }) => state.auth.error;
export const selectSignupSuccess = (state: { auth: AuthState }) =>
  state.auth.signupSuccess;

// Export reducer
export default authSlice.reducer;
