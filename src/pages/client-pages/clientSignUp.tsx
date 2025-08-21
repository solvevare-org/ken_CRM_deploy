import React from "react";
import ClientSignUpForm from "@/components/client-components/clientSignUpForm";

const ClientSignUp: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Create Your Account
            </h1>
            <p className="text-gray-600">Join our real estate platform</p>
          </div>
          <ClientSignUpForm />
        </div>
      </div>
    </div>
  );
};

export default ClientSignUp;
