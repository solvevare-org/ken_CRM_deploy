import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  verifyClientSignupLink,
  clientSignup,
  selectAuth,
} from "@/store/slices/authSlice";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  clientSignUpSchema,
  ClientSignUpSchema,
} from "@/schema/clientSignUpSchema";
import { Eye, EyeOff, Mail, Phone, X } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { setEmail, setVerificationMethod } from "@/store/slices/otherAuthSlice";

const PROPERTY_TYPES = [
  { value: "house", label: "House" },
  { value: "condo", label: "Condo" },
  { value: "townhouse", label: "Townhouse" },
  { value: "apartment", label: "Apartment" },
  { value: "commercial", label: "Commercial" },
];

const ClientSignUpForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    setError, // Add setError from useForm
    formState: { errors },
  } = useForm<ClientSignUpSchema>({
    resolver: zodResolver(clientSignUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      first_name: "",
      last_name: "",
      phone: "",
      birthday: "",
      preferred_contact_method: "email",
      budget_range: { min: "", max: "" },
      preferred_locations: [],
      property_type_interest: [],
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newLocation, setNewLocation] = useState("");
  // Remove setFieldError since we'll use setError from react-hook-form
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const auth = useSelector(selectAuth) as any;
  const {
    verifyLinkLoading,
    verifyLinkError,
    verifyLinkData,
    clientSignupLoading,
    clientSignupError,
  } = auth || {};

  const { link } = useParams<{ link: string }>();

  // Verify link on mount when link exists
  useEffect(() => {
    if (!link) return;
    dispatch(verifyClientSignupLink(link));
  }, [dispatch, link]);

  const onSubmit = async (data: ClientSignUpSchema) => {
    if (!link) return;

    const formData = new FormData();
    // Append simple fields
    formData.append("email", data.email || "");
    formData.append("password", data.password || "");
    formData.append("confirmPassword", data.confirmPassword || "");
    formData.append("first_name", data.first_name || "");
    formData.append("last_name", data.last_name || "");
    formData.append("phone", data.phone || "");
    formData.append("birthday", data.birthday || "");
    formData.append(
      "preferred_contact_method",
      data.preferred_contact_method || ""
    );

    // Append complex fields as JSON strings
    try {
      formData.append("budget_range", JSON.stringify(data.budget_range || {}));
      formData.append(
        "preferred_locations",
        JSON.stringify(data.preferred_locations || [])
      );
      formData.append(
        "property_type_interest",
        JSON.stringify(data.property_type_interest || [])
      );
    } catch (e) {
      console.error("Error serializing complex fields:", e);
    }

    console.log(data);

    try {
      const result = await dispatch(clientSignup({ link, formData })).unwrap();
      console.log("Client signup result:", result);

      if (result.success) {
        // Set email/phone and verification method based on chosen method
        if (data.preferred_contact_method === "email" && data.email) {
          dispatch(setEmail(data.email));
          dispatch(setVerificationMethod("email"));
        } else if (data.preferred_contact_method === "phone" && data.phone) {
          dispatch(setEmail(data.phone)); // Using email field for phone
          dispatch(setVerificationMethod("sms"));
        }
        navigate("/verification");
      }
    } catch (error: any) {
      // Handle field-specific errors from the server
      // 1) Thunk reject payload when using createAsyncThunk(rejectWithValue)
      if (error && typeof error === "object" && (error as any).errors) {
        const errs = (error as any).errors;
        if (Array.isArray(errs)) {
          errs.forEach((errObj: any) => {
            Object.entries(errObj).forEach(([field, message]) => {
              setError(field as keyof ClientSignUpSchema, {
                type: "server",
                message: String(message),
              });
            });
          });
          return;
        }
      }

      // 2) Axios error shape (if dispatch threw the original axios error)
      if (error?.response?.data?.errors) {
        const errs = error.response.data.errors;
        if (Array.isArray(errs)) {
          errs.forEach((errObj: any) => {
            Object.entries(errObj).forEach(([field, message]) => {
              setError(field as keyof ClientSignUpSchema, {
                type: "server",
                message: String(message),
              });
            });
          });
          return;
        }
      }

      // 3) Thunk reject when rejectWithValue returned a { message } object
      if (error && typeof error === "object" && (error as any).message) {
        // show a generic form-level error using setError on a known field (email) or console
        setError("email" as keyof ClientSignUpSchema, {
          type: "server",
          message: (error as any).message,
        });
        return;
      }

      // Fallback for other error shapes
      console.error("Signup error:", error);
    }
  };

  const addLocation = () => {
    const currentLocations = getValues("preferred_locations") || [];
    if (newLocation.trim() && !currentLocations.includes(newLocation.trim())) {
      setValue("preferred_locations", [
        ...currentLocations,
        newLocation.trim(),
      ]);
      setNewLocation("");
    }
  };

  const preferred_locations: string[] =
    useWatch({
      control,
      name: "preferred_locations",
      defaultValue: [],
    }) ?? [];

  const removeLocation = (location: string) => {
    const updated = preferred_locations.filter((loc) => loc !== location);
    setValue("preferred_locations", updated);
  };

  // UI states
  const noLinkProvided = !link;
  const linkVerified =
    !verifyLinkLoading && !verifyLinkError && !!verifyLinkData;

  // If no link provided, show invalid UI
  if (noLinkProvided) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-md">
        <h3 className="font-medium text-yellow-800">Invalid signup link</h3>
        <p className="text-sm text-yellow-700 mt-2">
          No signup link was provided. Please use the link from your invitation
          email.
        </p>
      </div>
    );
  }

  // While verifying
  if (verifyLinkLoading) {
    return (
      <div className="p-6 bg-white border border-gray-200 rounded-md">
        Verifying signup link...
      </div>
    );
  }

  // Verification failed
  if (!verifyLinkLoading && verifyLinkError) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-md">
        <h3 className="font-medium text-red-800">
          Invalid or expired signup link
        </h3>
        <p className="text-sm text-red-700 mt-2">{verifyLinkError}</p>
      </div>
    );
  }

  // Only render form when verified
  if (!linkVerified) {
    return <div className="p-6">Preparing form...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* First Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          First Name *
        </label>
        <input
          type="text"
          {...register("first_name")}
          placeholder="Enter your first name"
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.first_name ? "border-red-300 bg-red-50" : "border-gray-300"
          } focus:ring-2 focus:ring-blue-500`}
        />
        {errors.first_name && (
          <p className="mt-1 text-sm text-red-600">
            {errors.first_name.message}
          </p>
        )}
      </div>

      {/* Last Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Last Name *
        </label>
        <input
          type="text"
          {...register("last_name")}
          placeholder="Enter your last name"
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.last_name ? "border-red-300 bg-red-50" : "border-gray-300"
          } focus:ring-2 focus:ring-blue-500`}
        />
        {errors.last_name && (
          <p className="mt-1 text-sm text-red-600">
            {errors.last_name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email *
        </label>
        <div className="relative">
          <input
            type="email"
            {...register("email")}
            placeholder="you@example.com"
            className={`w-full px-4 py-3 pl-10 rounded-lg border ${
              errors.email ? "border-red-300 bg-red-50" : "border-gray-300"
            } focus:ring-2 focus:ring-blue-500`}
          />
          <Mail
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone
        </label>
        <div className="relative">
          <input
            type="tel"
            {...register("phone")}
            placeholder="(123) 456-7890"
            className={`w-full px-4 py-3 pl-10 rounded-lg border ${
              errors.phone ? "border-red-300 bg-red-50" : "border-gray-300"
            } focus:ring-2 focus:ring-blue-500`}
          />
          <Phone
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>

      {/* Birthday */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Birthday
        </label>
        <input
          type="date"
          {...register("birthday")}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.birthday ? "border-red-300 bg-red-50" : "border-gray-300"
          } focus:ring-2 focus:ring-blue-500`}
        />
        {errors.birthday && (
          <p className="mt-1 text-sm text-red-600">{errors.birthday.message}</p>
        )}
      </div>

      {/* Budget Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Budget Range
        </label>
        <div className="flex gap-3">
          <input
            type="number"
            {...register("budget_range.min")}
            placeholder="Min"
            className={`w-1/2 px-4 py-3 rounded-lg border ${
              errors.budget_range?.min
                ? "border-red-300 bg-red-50"
                : "border-gray-300"
            } focus:ring-2 focus:ring-blue-500`}
          />
          <input
            type="number"
            {...register("budget_range.max")}
            placeholder="Max"
            className={`w-1/2 px-4 py-3 rounded-lg border ${
              errors.budget_range?.max
                ? "border-red-300 bg-red-50"
                : "border-gray-300"
            } focus:ring-2 focus:ring-blue-500`}
          />
        </div>
        {errors.budget_range?.min && (
          <p className="mt-1 text-sm text-red-600">
            {errors.budget_range.min.message}
          </p>
        )}
        {errors.budget_range?.max && (
          <p className="mt-1 text-sm text-red-600">
            {errors.budget_range.max.message}
          </p>
        )}
      </div>

      {/* Preferred Contact Method */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Contact Method
        </label>
        <select
          {...register("preferred_contact_method")}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.preferred_contact_method
              ? "border-red-300 bg-red-50"
              : "border-gray-300"
          } focus:ring-2 focus:ring-blue-500`}
        >
          <option value="email">Email</option>
          <option value="phone">Phone</option>
        </select>
        {errors.preferred_contact_method && (
          <p className="mt-1 text-sm text-red-600">
            {errors.preferred_contact_method.message}
          </p>
        )}
      </div>

      {/* Property Type Interest */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Type Interest
        </label>
        <div className="grid grid-cols-2 gap-3">
          {PROPERTY_TYPES.map((type) => (
            <label
              key={type.value}
              className="flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50"
            >
              <input
                type="checkbox"
                value={type.value}
                {...register("property_type_interest")}
              />
              {type.label}
            </label>
          ))}
        </div>
        {errors.property_type_interest && (
          <p className="mt-1 text-sm text-red-600">
            {errors.property_type_interest.message}
          </p>
        )}
      </div>

      {/* Preferred Locations */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Locations
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            placeholder="Add a location"
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300"
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), addLocation())
            }
          />
          <button
            type="button"
            onClick={addLocation}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Add
          </button>
        </div>
        {preferred_locations.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {preferred_locations.map((location, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {location}
                <button
                  type="button"
                  onClick={() => removeLocation(location)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}
        {errors.preferred_locations && (
          <p className="mt-1 text-sm text-red-600">
            {errors.preferred_locations.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password *
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder="Create a password"
            className={`w-full px-4 py-3 pr-12 rounded-lg border ${
              errors.password ? "border-red-300 bg-red-50" : "border-gray-300"
            } focus:ring-2 focus:ring-blue-500`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password *
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword")}
            placeholder="Confirm your password"
            className={`w-full px-4 py-3 pr-12 rounded-lg border ${
              errors.confirmPassword
                ? "border-red-300 bg-red-50"
                : "border-gray-300"
            } focus:ring-2 focus:ring-blue-500`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-4 px-6 rounded-lg"
        disabled={clientSignupLoading}
      >
        {clientSignupLoading ? "Submitting..." : "Create Account"}
      </button>

      {/* Generic submission error */}
      {clientSignupError && !errors.email && !errors.password && (
        <div className="mt-3 border border-red-300 bg-red-50 p-3 text-center text-sm text-red-700">
          {clientSignupError}
        </div>
      )}
    </form>
  );
};

export default ClientSignUpForm;
