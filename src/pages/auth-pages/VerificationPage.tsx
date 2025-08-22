import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Shield, Mail } from "lucide-react";
import { clearSignupData } from "@/store/slices/authSlice";
import {
  requestVerificationCode,
  verifySignup,
} from "@/store/slices/otherAuthSlice";

export function VerificationPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { email, verificationMethod } = useAppSelector((state) => state.auth);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Verify the verification code
      console.log(email, code, verificationMethod);
      const response = await dispatch(verifySignup({ email, code })).unwrap();

      if (response.success) {
        // Clear signup data after successful verification
        dispatch(clearSignupData());

        // Navigate to payment page
        navigate("/payment");
      } else {
        setError(
          response.message || "Invalid verification code. Please try again."
        );
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = () => {
    // Simulate resending verification code
    dispatch(requestVerificationCode({ email }));
    alert("Verification code sent to your account!");
  };

  // Redirect if no signup data is available. Use effect to avoid dispatch/navigation during render.
  const missingSignupData = !email && !verificationMethod;
  useEffect(() => {
    console.log("Missing Signup Data:", missingSignupData);
    if (missingSignupData) {
      dispatch(clearSignupData());
      // clear auth email (authSlice.setEmail expects a string)
      navigate("/signup-options");
    }
  }, [missingSignupData, dispatch, navigate]);

  if (missingSignupData) return null;

  return (
    <PageLayout
      title="Verify Your Account"
      subtitle={`We've sent a verification code to your ${verificationMethod}`}
      showBackButton
      onBack={() => navigate("/account-verification-options")}
    >
      <div className="space-y-8 text-black">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-black">
            Enter the 5-digit verification code we sent to your{" "}
            {verificationMethod} to secure your account
          </p>
        </div>

        {error && (
          <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          <Input
            label="Verification Code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter 5-digit code"
            maxLength={5}
            className="text-center text-2xl font-mono tracking-widest"
            required
          />
          <Button
            type="submit"
            className="w-full"
            loading={loading}
            disabled={code.length !== 5 || loading}
            size="lg"
          >
            Verify Account
          </Button>
        </form>
        <div className="text-center">
          <p className="text-black mb-2">Didn't receive the code?</p>
          <button
            onClick={handleResendCode}
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors flex items-center space-x-2 mx-auto"
          >
            <Mail className="w-4 h-4" />
            <span>Resend Code</span>
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
