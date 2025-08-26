import React, { useEffect } from "react";
import StatsCards from "./StatsCards";
import RecentActivity from "./RecentActivity";
import PropertyChart from "./PropertyChart";
import QuickActions from "./QuickActions";
import TopProperties from "./TopProperties";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getCurrentUser } from "@/store/slices/authSlice";
import { selectUser } from "@/store/slices/authSlice";
import api from "@/utils/api";

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      await api
        .get("/api/debug", { withCredentials: true })
        .then((r) => r.data)
        .then(console.log)
        .catch(console.error);
    };
    fetchData();
  }, []);

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
