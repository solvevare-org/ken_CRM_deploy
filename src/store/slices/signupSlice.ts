import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SignupState {
  userType: 'Realtor' | 'Organization' | null;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  verificationMethod: 'email' | 'phone' | null;
  isVerified: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: SignupState = {
  userType: null,
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  phone: '',
  verificationMethod: null,
  isVerified: false,
  isLoading: false,
  error: null,
};

const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    setUserType: (state, action: PayloadAction<'Realtor' | 'Organization'>) => {
      state.userType = action.payload;
    },
    setSignupData: (state, action: PayloadAction<{
      email?: string;
      password?: string;
      firstName?: string;
      lastName?: string;
      phone?: string;
      verificationMethod?: 'email' | 'phone';
    }>) => {
      Object.assign(state, action.payload);
    },
    setVerificationMethod: (state, action: PayloadAction<'email' | 'phone'>) => {
      state.verificationMethod = action.payload;
    },
    setVerified: (state, action: PayloadAction<boolean>) => {
      state.isVerified = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearSignupData: (state) => {
      state.userType = null;
      state.email = '';
      state.password = '';
      state.firstName = '';
      state.lastName = '';
      state.phone = '';
      state.verificationMethod = null;
      state.isVerified = false;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setUserType,
  setSignupData,
  setVerificationMethod,
  setVerified,
  setLoading,
  setError,
  clearSignupData,
} = signupSlice.actions;

export default signupSlice.reducer;
