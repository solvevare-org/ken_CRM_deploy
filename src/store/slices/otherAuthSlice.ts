import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api, { handleApiError } from "@/utils/api";
import { ApiResponse } from "@/types/authTypes";
import { toast } from "react-toastify";

const BASE_URL = "api/auth";

// Verify signup (email code)
export const verifySignup = createAsyncThunk<
  ApiResponse,
  { email: string | null; code: string },
  { rejectValue: string }
>("otherAuth/verifySignup", async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post<ApiResponse>(
      `${BASE_URL}/verify-signup`,
      payload
    );
    toast.success(response.data.message || "Verification successful");
    return response.data;
  } catch (error) {
    console.log(error);
    const msg = handleApiError(error);
    return rejectWithValue(msg);
  }
});

// Request a new verification code for an in-progress signup
export const requestVerificationCode = createAsyncThunk<
  ApiResponse,
  { email: string | null },
  { rejectValue: string }
>("otherAuth/requestVerificationCode", async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post<ApiResponse>(
      `${BASE_URL}/request-verification-code`,
      payload
    );
    toast.success(response.data.message || "Verification code sent");
    return response.data;
  } catch (error) {
    console.log(error);
    const msg = handleApiError(error);
    return rejectWithValue(msg);
  }
});

// Lead signup (public) - realtorId in URL
export const leadSignup = createAsyncThunk<
  ApiResponse,
  { realtorId: string; payload: Record<string, any> },
  { rejectValue: string }
>("otherAuth/leadSignup", async (data, { rejectWithValue }) => {
  try {
    const response = await api.post<ApiResponse>(
      `${BASE_URL}/lead-signup/${data.realtorId}`,
      data.payload
    );
    return response.data;
  } catch (error) {
    const msg = handleApiError(error);
    return rejectWithValue(msg);
  }
});

// Forgot password
export const forgotPassword = createAsyncThunk<
  ApiResponse,
  { email: string },
  { rejectValue: string }
>("otherAuth/forgotPassword", async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post<ApiResponse>(
      `${BASE_URL}/forgot-password`,
      payload
    );
    return response.data;
  } catch (error) {
    const msg = handleApiError(error);
    return rejectWithValue(msg);
  }
});

// Verify forgot password code
export const verifyForgetPassword = createAsyncThunk<
  ApiResponse,
  { email: string; code: string },
  { rejectValue: string }
>("otherAuth/verifyForgetPassword", async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post<ApiResponse>(
      `${BASE_URL}/verify-forgot-password`,
      payload
    );
    return response.data;
  } catch (error) {
    const msg = handleApiError(error);
    return rejectWithValue(msg);
  }
});

// Reset password
export const resetPassword = createAsyncThunk<
  ApiResponse,
  { email: string; newPassword: string; confirmPassword: string },
  { rejectValue: string }
>("otherAuth/resetPassword", async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post<ApiResponse>(
      `${BASE_URL}/reset-password`,
      payload
    );
    return response.data;
  } catch (error) {
    const msg = handleApiError(error);
    return rejectWithValue(msg);
  }
});

// Account setup (requires auth)
export const setupAccount = createAsyncThunk<
  ApiResponse,
  any,
  { rejectValue: string }
>("otherAuth/setupAccount", async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post<ApiResponse>(
      `${BASE_URL}/account-setup`,
      payload
    );
    return response.data;
  } catch (error) {
    const msg = handleApiError(error);
    return rejectWithValue(msg);
  }
});

// Get current user (requires auth)
export const getCurrentUser = createAsyncThunk<
  ApiResponse<{ auth: any }>,
  void,
  { rejectValue: string }
>("otherAuth/getCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<ApiResponse<{ auth: any }>>(
      `${BASE_URL}/current-user`
    );
    return response.data;
  } catch (error) {
    const msg = handleApiError(error);
    return rejectWithValue(msg);
  }
});

// Check if user exists by email
export const checkUserExists = createAsyncThunk<
  ApiResponse<{ exists: boolean }>,
  { email: string },
  { rejectValue: string }
>("otherAuth/checkUserExists", async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post<ApiResponse<{ exists: boolean }>>(
      `${BASE_URL}/check-user-email-exists`,
      payload
    );
    return response.data;
  } catch (error) {
    const msg = handleApiError(error);
    return rejectWithValue(msg);
  }
});

// Check if user exists by email
export const checkout = createAsyncThunk<
  ApiResponse,
  { user_id: string | null; user_type: string | null },
  { rejectValue: string }
>("otherAuth/checkout", async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post<ApiResponse>(
      `${BASE_URL}/checkout`,
      payload
    );
    return response.data;
  } catch (error) {
    const msg = handleApiError(error);
    return rejectWithValue(msg);
  }
});

// Slice state
interface OtherAuthState {
  user_id: string | null;
  user_type: string | null;
  email: string | null;
  verificationMethod: "email" | "sms" | null;
  isLoading: boolean;
  error: string | null;
  currentUser: any | null;
  forgotPasswordSuccess: boolean;
  resetPasswordSuccess: boolean;
}

const initialState: OtherAuthState = {
  user_id: null,
  user_type: null,
  email: null,
  verificationMethod: null,
  isLoading: false,
  error: null,
  currentUser: null,
  forgotPasswordSuccess: false,
  resetPasswordSuccess: false,
};

const otherAuthSlice = createSlice({
  name: "otherAuth",
  initialState,
  reducers: {
    // Set email
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setVerificationMethod: (
      state,
      action: PayloadAction<"email" | "sms" | null>
    ) => {
      state.verificationMethod = action.payload;
    },

    setUserType: (state, action: PayloadAction<string>) => {
      state.user_type = action.payload;
    },

    clearSignupData: (state) => {
      state.email = null;
      state.verificationMethod = null;
      state.user_type = null;
    },

    clearCheckout: (state) => {
      state.user_id = null;
      state.user_type = null;
    },

    clearOtherAuthError(state) {
      state.error = null;
    },
    clearForgotResetFlags(state) {
      state.forgotPasswordSuccess = false;
      state.resetPasswordSuccess = false;
    },
  },
  extraReducers: (builder) => {
    // verifySignup
    builder
      .addCase(verifySignup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifySignup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.user_id = action.payload?.data?.user;
        state.user_type = action.payload.data.user_type;
      })
      .addCase(verifySignup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Verification failed";
      });

    // requestVerificationCode
    builder
      .addCase(requestVerificationCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(requestVerificationCode.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(requestVerificationCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Request code failed";
      });

    // leadSignup
    builder
      .addCase(leadSignup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(leadSignup.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(leadSignup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Lead signup failed";
      });

    // forgotPassword
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.forgotPasswordSuccess = false;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.forgotPasswordSuccess = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.forgotPasswordSuccess = false;
        state.error = action.payload || "Forgot password failed";
      });

    // verifyForgetPassword
    builder
      .addCase(verifyForgetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyForgetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(verifyForgetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Verify reset failed";
      });

    // resetPassword
    builder
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.resetPasswordSuccess = false;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.resetPasswordSuccess = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.resetPasswordSuccess = false;
        state.error = action.payload || "Reset password failed";
      });

    // setupAccount
    builder
      .addCase(setupAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(setupAccount.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(setupAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Account setup failed";
      });

    // getCurrentUser
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload.data?.auth || null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.currentUser = null;
        state.error = action.payload || "Get current user failed";
      });

    // checkUserExists
    builder
      .addCase(checkUserExists.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkUserExists.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(checkUserExists.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Check user failed";
      });

    // checkUserExists
    builder
      .addCase(checkout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkout.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(checkout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Check user failed";
      });
  },
});

export const {
  setEmail,
  setVerificationMethod,
  clearSignupData,
  setUserType,
  clearOtherAuthError,
  clearForgotResetFlags,
} = otherAuthSlice.actions;

export const selectOtherAuth = (state: { otherAuth: OtherAuthState }) =>
  state.otherAuth;
export const selectCurrentUser = (state: { otherAuth: OtherAuthState }) =>
  state.otherAuth.currentUser;

export default otherAuthSlice.reducer;
