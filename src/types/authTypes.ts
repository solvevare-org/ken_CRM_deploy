// Types
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  user_type: "Realtor" | "Organization" | "Client";
  user_ref?: string;
  payment_verification?: boolean;
  last_login?: string;
}

export interface SignupData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  user_type: "Realtor" | "Organization" | "Client";
  user_ref?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signupSuccess: boolean;
  // client signup / link verification state
  clientSignupLoading?: boolean;
  clientSignupError?: string | null;
  clientSignupSuccess?: boolean;
  verifyLinkLoading?: boolean;
  verifyLinkError?: string | null;
  verifyLinkData?: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}
