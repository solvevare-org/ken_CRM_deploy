import React, { useState } from "react";
import {
  Home,
  Building2,
  Briefcase,
  Users,
  BarChart3,
  Calendar,
  FileText,
  Target,
  CheckSquare,
  UserPlus,
  User,
  X,
  Settings,
  MessageSquare,
  Send,
  Bell,
  MessageCircle,
  UserCheck,
  LogOut,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { CRM_BASE_DOMAIN } from "@/config";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "workspaces", label: "Workspaces", icon: Briefcase },
  { id: "properties", label: "Properties", icon: Building2 },
  { id: "clients", label: "Clients", icon: Users },
  { id: "leads", label: "Leads", icon: UserPlus },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "messaging", label: "Messages", icon: MessageCircle },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "marketing", label: "Campaigns", icon: Target },
  { id: "calendar", label: "Calendar", icon: Calendar },
  {
    id: "followup-management",
    label: "Follow-up Management",
    icon: MessageSquare,
    children: [
      { id: "followup", label: "Follow-up", icon: Send },
      {
        id: "followup-templating",
        label: "Follow-up Templating",
        icon: FileText,
      },
    ],
  },
  {
    id: "leadform-management",
    label: "Lead Form Management",
    icon: User,
    children: [
      { id: "leadform", label: "Lead Form", icon: FileText },
      {
        id: "leadform-templating",
        label: "Lead Form Templating",
        icon: Settings,
      },
    ],
  },
];

const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  setActiveSection,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const { state } = useAppContext();
  const isAdmin = state.user?.role === "admin";
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  const handleMenuItemClick = (sectionId: string) => {
    // Navigate to workspace page when Workspaces clicked
    if (sectionId === "workspaces") {
      const protocol = window.location.protocol;
      // For dev helpers like lvh.me or localhost, include the current dev port.
      // For production domains (e.g. crm.vire-s.com) we should not append the dev port.
      const baseDomain = String(CRM_BASE_DOMAIN);
      const includePort =
        baseDomain === "lvh.me" || baseDomain.includes("localhost");
      const port = includePort ? window.location.port || "5173" : "";
      const host = `${CRM_BASE_DOMAIN}${port ? `:${port}` : ""}`;
      const targetUrl = `${protocol}//${host}/workspace`;
      // Perform full navigation to the workspace host
      window.location.assign(targetUrl);
      return;
    }

    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  // Filter menu items based on admin status
  const getFilteredMenuItems = () => {
    const items = [...menuItems];

    // Add Realtors tab only for admin users
    if (isAdmin) {
      // Insert after 'clients' (index 2)
      items.splice(3, 0, {
        id: "realtors",
        label: "Realtors",
        icon: UserCheck,
      });
    }

    return items;
  };

  const handleLogout = () => {
    // dispatch logout then redirect to base domain (dev: lvh.me:5173, prod: crm.vire-s.com)
    dispatch(logout());
    setShowSettingsMenu(false);
    setIsMobileMenuOpen(false);
    const protocol = window.location.protocol;
    const baseDomain = String(CRM_BASE_DOMAIN);
    const includePort =
      baseDomain === "lvh.me" || baseDomain.includes("localhost");
    const port = includePort ? window.location.port || "5173" : "";
    const host = `${baseDomain}${port ? `:${port}` : ""}`;
    const targetUrl = `${protocol}//${host}`;
    window.location.assign(targetUrl);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:translate-x-0 transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-center h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">RealtyPro</span>
          </div>
          {/* Mobile close button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden absolute right-4 top-4 p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        {/* Navigation (scrollable) */}
        <nav
          className="mt-8 px-4 space-y-2 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 180px)" }}
        >
          {getFilteredMenuItems().map((item) => {
            if (item.children) {
              const ParentIcon = item.icon;
              return (
                <div key={item.id} className="">
                  <div className="flex items-center space-x-3 px-4 py-3 font-semibold text-gray-700">
                    <ParentIcon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  <div className="ml-8 space-y-1">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      return (
                        <button
                          key={child.id}
                          onClick={() => handleMenuItemClick(child.id)}
                          className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors ${
                            activeSection === child.id
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          <ChildIcon className="w-4 h-4 flex-shrink-0" />
                          <span className="font-normal">{child.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            } else {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuItemClick(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeSection === item.id
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  aria-label={item.label}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            }
          })}
        </nav>
        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-gray-500">Real Estate Agent</p>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowSettingsMenu((s) => !s)}
                className="p-1 rounded-md hover:bg-gray-100"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
              </button>

              {showSettingsMenu && (
                <div className="absolute right-0 bottom-10 w-40 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  <button
                    onClick={() => handleLogout()}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
