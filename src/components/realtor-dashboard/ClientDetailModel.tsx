"use client";

// components/ClientDetailsModal.tsx
import type { Client } from "@/pages/Clients";
import type React from "react";
import {
  X,
  User,
  Phone,
  DollarSign,
  MapPin,
  Home,
  Calendar,
} from "lucide-react";

interface ClientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
}

const ClientDetailsModal: React.FC<ClientDetailsModalProps> = ({
  isOpen,
  onClose,
  client,
}) => {
  if (!isOpen || !client) return null;

  if (client) {
    console.log(client);
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Client Details
              </h2>
              <p className="text-sm text-gray-500">
                Complete profile information
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <User className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="text-base font-semibold text-gray-900">
                  {client.user.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <Phone className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Preferred Contact
                </p>
                <p className="text-base font-semibold text-gray-900">
                  {client.preferred_contact_method || "Not specified"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-600">
                  Budget Range
                </p>
                <p className="text-base font-semibold text-gray-900">
                  {client.budget_range?.min && client.budget_range?.max
                    ? `$${client.budget_range.min.toLocaleString()} - $${client.budget_range.max.toLocaleString()}`
                    : "Not specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Preferences
            </h3>

            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
              <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-600">
                  Preferred Locations
                </p>
                <div className="mt-1">
                  {client.preferred_locations &&
                  client.preferred_locations.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {client.preferred_locations.map((location, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                        >
                          {location}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-base text-gray-500">Not specified</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
              <Home className="w-5 h-5 text-purple-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-purple-600">
                  Property Types
                </p>
                <div className="mt-1">
                  {client.property_type_interest &&
                  client.property_type_interest.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {client.property_type_interest.map((type, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-base text-gray-500">Not specified</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl">
              <Calendar className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-orange-600">Birthday</p>
                <p className="text-base font-semibold text-gray-900">
                  {client.birthday
                    ? client.birthday.toLocaleDateString()
                    : "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailsModal;
