import React, { useEffect, useState } from "react";
import StatsCards from "./StatsCards";
import RecentActivity from "./RecentActivity";
import PropertyChart from "./PropertyChart";
import QuickActions from "./QuickActions";
import TopProperties from "./TopProperties";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getCurrentUser } from "@/store/slices/authSlice";
import { selectUser } from "@/store/slices/authSlice";

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (user) {
      if (mounted) setInitialLoading(false);
      return () => {
        mounted = false;
      };
    }

    (dispatch(getCurrentUser()) as any)
      .catch(() => {
        // errors recorded in auth slice
      })
      .finally(() => {
        if (mounted) setInitialLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [dispatch, user]);

  // Show a centered loader only while this page is performing its
  // initial user fetch. Do not use the global isLoading for this
  // UI because it can be toggled by other background auth actions.
  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-lg text-gray-600">Loading...</span>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-sm lg:text-base text-gray-600 mt-1">
            Welcome back, {user?.first_name}! Here's your business overview.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
        {/* Left Column - Charts */}
        <div className="xl:col-span-2 space-y-4 lg:space-y-6">
          <PropertyChart />
          <RecentActivity />
        </div>

        {/* Right Column - Sidebar Content */}
        <div className="space-y-4 lg:space-y-6">
          <QuickActions />
          <TopProperties />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
