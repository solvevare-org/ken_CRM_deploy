import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api, { handleApiError } from "@/utils/api"; // Adjust path as needed
import { ApiResponse, AuthState, LoginData, User } from "@/types/authTypes";
import type { SignUpSchemaType } from "@/schema/signupSchema";
import { toast } from "react-toastify";

// Payload for signup includes the form fields plus optional user_type
type SignUpPayload = SignUpSchemaType & { user_type?: string | null };

const BASE_URL = "api/auth";

// Signup
export const signup = createAsyncThunk<
  ApiResponse,
  SignUpPayload,
  { rejectValue: string }
>("auth/signup", async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post<ApiResponse>(`${BASE_URL}/signup`, payload);
    return response.data;
  } catch (error) {
    console.log(error);
    const errorMessage = handleApiError(error);
    return rejectWithValue(errorMessage);
  }
});

// Login
export const login = createAsyncThunk<
  ApiResponse<{
    workspace?: any;
    type?: string;
    token: string;
    user_type: string;
    user: User;
  }>,
  LoginData,
  { rejectValue: string }
>("auth/login", async (loginData, { rejectWithValue }) => {
  try {
    const response = await api.post<
      ApiResponse<{ token: string; user_type: string; user: User }>
    >(`/api/auth/login`, loginData);
    toast.success(response.data.message || "Login successful");
    console.log("login response", response);
    return response.data;
  } catch (error) {
    console.log("login error", error);
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
    toast.error(errorMessage);
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

// logout
export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  `${BASE_URL}/logout`,
  async (_, { rejectWithValue }) => {
    try {
      // Call logout endpoint if you have one
      await api.post(`${BASE_URL}/logout`);
    } catch (error) {
      console.log(error);
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  signupSuccess: false,
  user_type: null,
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

    // Set token manually (useful for hydrating from cookie/localStorage on app start)
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
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
        if (action.payload?.data?.type !== "Unverified Login") {
          state.isAuthenticated = true;
          state.token = action.payload.data?.token || null;
          state.user_type = action.payload.data?.user_type || null;
          state.user = action.payload.data?.user || null;
          state.error = null;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user_type = null;
        state.user = null;
        state.error = action.payload || "Login failed";
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
        state.user_type = null;
        state.user = null;
        state.error = null;
        // Token/cookie is managed by backend; frontend shouldn't remove cookies.
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        // Still log out locally even if server request fails
        state.isAuthenticated = false;
        state.token = null;
        state.user_type = null;
        state.user = null;
        state.error = action.payload || "Logout failed";
      });
  },
});

// Export actions
export const { clearError, clearSignupSuccess, setUser, setToken, resetAuth } =
  authSlice.actions;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectUserType = (state: { auth: AuthState }) =>
  state.auth.user_type;
export const selectUserToken = (state: { auth: AuthState }) => state.auth.token;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) =>
  state.auth.isLoading;
export const selectError = (state: { auth: AuthState }) => state.auth.error;
export const selectSignupSuccess = (state: { auth: AuthState }) =>
  state.auth.signupSuccess;

// Export reducer
export default authSlice.reducer;
