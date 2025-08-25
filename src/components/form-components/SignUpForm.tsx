import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema, type SignUpSchemaType } from "@/schema/signupSchema";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, Smartphone } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { signup, clearError } from "@/store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import {
  setEmail,
  setUserType,
  setVerificationMethod,
} from "@/store/slices/otherAuthSlice";

export const SignUpForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user_type } = useAppSelector((state) => state.otherAuth);
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

  // Removed the useEffect that was causing premature redirect
  // The verification page will handle redirects if needed

  const method = watch("method");

  // get auth UI state from redux
  const { isLoading: loading, error } = useAppSelector((state) => state.auth);

  // Clear any residual auth errors when this form mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch, error]);

  const onSubmit = async (data: SignUpSchemaType) => {
    // Check if user_type is available
    if (!user_type) {
      console.error("No user type selected");
      navigate("/signup-options");
      return;
    }

    console.log(data);
    const result = await dispatch(
      signup({ ...data, user_type: user_type })
    ).unwrap();

    if (result.success) {
      // Set email/phone and verification method based on chosen method
      if (data.method === "email") {
        if (data.email) {
          console.log("Setting email:", data.email);
          dispatch(setEmail(data.email));
          dispatch(setVerificationMethod("email"));
        }
      } else if (data.method === "phone") {
        if (data.phone) {
          console.log("Setting phone:", data.phone);
          dispatch(setEmail(data.phone)); // Using email field for phone too
          dispatch(setVerificationMethod("sms"));
        }
      }

      // Clear user type and navigate to verification page
      dispatch(setUserType(""));
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
