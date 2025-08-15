import { RootState } from './store';

// Signup selectors
export const selectSignupState = (state: RootState) => state.signup;
export const selectUserType = (state: RootState) => state.signup.userType;
export const selectSignupData = (state: RootState) => ({
  email: state.signup.email,
  password: state.signup.password,
  firstName: state.signup.firstName,
  lastName: state.signup.lastName,
  phone: state.signup.phone,
  verificationMethod: state.signup.verificationMethod,
});
export const selectIsVerified = (state: RootState) => state.signup.isVerified;
export const selectIsLoading = (state: RootState) => state.signup.isLoading;
export const selectError = (state: RootState) => state.signup.error;

// Helper selector to check if signup data is complete
export const selectIsSignupDataComplete = (state: RootState) => {
  const { userType, email, password, firstName, lastName, verificationMethod } = state.signup;
  return !!(userType && email && password && firstName && lastName && verificationMethod);
};
