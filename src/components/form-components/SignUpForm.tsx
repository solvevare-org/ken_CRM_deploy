import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema, type SignUpSchemaType } from "@/schema/signupSchema";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, Smartphone } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setEmail,
  signup,
  setVerificationMethod,
  setUserType,
} from "@/store/slices/authSlice";
import { useNavigate } from "react-router-dom";

export const SignUpForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user_type } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      password: "",
      confirmPassword: "",
      email: "",
      phone: "",
      method: undefined,
    },
  });

  const method = watch("method");

  // get auth UI state from redux
  const {
    isLoading: loading,
    signupSuccess: success,
    error,
  } = useAppSelector((state) => state.auth);

  const onSubmit = async (data: SignUpSchemaType) => {
    console.log(data);
    const result = await dispatch(
      signup({ ...data, user_type: user_type })
    ).unwrap();
    if (result.success) {
      dispatch(setUserType(""));
      if (data.method === "email") {
        if (data.email) {
          dispatch(setEmail(data.email));
          dispatch(setVerificationMethod("email"));
        }
      }
      // Optionally handle post-signup success actions here
      navigate("/verification");
    }
  };

  const verificationMethod = method === "email" ? "email" : "phone";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="First Name"
        {...register("first_name")}
        placeholder="Enter your first name"
        className="text-black"
      />
      {errors.first_name && (
        <p className="text-red-600 text-sm">{errors.first_name.message}</p>
      )}

      <Input
        label="Last Name"
        {...register("last_name")}
        placeholder="Enter your last name"
        className="text-black"
      />
      {errors.last_name && (
        <p className="text-red-600 text-sm">{errors.last_name.message}</p>
      )}

      <Input
        label="Password"
        type="password"
        {...register("password")}
        placeholder="Create a password"
        className="text-black"
      />
      {errors.password && (
        <p className="text-red-600 text-sm">{errors.password.message}</p>
      )}

      <Input
        label="Confirm Password"
        type="password"
        {...register("confirmPassword")}
        placeholder="Confirm your password"
        className="text-black"
      />
      {errors.confirmPassword && (
        <p className="text-red-600 text-sm">{errors.confirmPassword.message}</p>
      )}

      <h3 className="text-lg font-semibold text-black mt-4 mb-2 text-center">
        Choose Verification Method
      </h3>
      <div className="flex items-center justify-center gap-6 mb-6">
        <button
          type="button"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
            method === "email"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-gray-100"
          } text-black font-medium focus:outline-none`}
          onClick={() => setValue("method", "email")}
        >
          <Mail className="w-5 h-5" /> Email
        </button>
        <button
          type="button"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
            method === "phone"
              ? "border-green-500 bg-green-50"
              : "border-gray-300 bg-gray-100"
          } text-black font-medium focus:outline-none`}
          onClick={() => setValue("method", "phone")}
        >
          <Smartphone className="w-5 h-5" /> Phone Number
        </button>
      </div>
      {errors.method && (
        <p className="text-red-600 text-sm text-center">
          {errors.method.message}
        </p>
      )}

      {method === "email" && (
        <Input
          label="Email Address"
          type="email"
          {...register("email")}
          placeholder="Enter your email"
          className="text-black"
        />
      )}
      {method === "phone" && (
        <Input
          label="Phone Number"
          type="tel"
          {...register("phone")}
          placeholder="Enter your phone number"
          className="text-black"
        />
      )}
      {(errors.email || errors.phone) && (
        <p className="text-red-600 text-sm text-center">
          {errors.email?.message || errors.phone?.message}
        </p>
      )}

      {success && (
        <div className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-lg">
          ✓ Account created successfully! Check your {verificationMethod} for
          verification code. Redirecting...
        </div>
      )}
      {error && <div className="text-red-600 text-sm text-center">{error}</div>}

      <Button
        type="submit"
        className="w-full"
        size="lg"
        loading={loading}
        disabled={loading}
      >
        {loading ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
};
