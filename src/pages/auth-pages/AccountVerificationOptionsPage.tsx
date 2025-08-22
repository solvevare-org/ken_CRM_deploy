import { SignUpForm } from "@/components/form-components/SignUpForm";

export function AccountVerificationOptionsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-black mb-6 text-center">
          Create Your Account
        </h2>
        <SignUpForm />
      </div>
    </div>
  );
}
