import React, { useEffect } from "react";
import { Building2, Users, TrendingUp } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  dashboardCounts,
  selectDashboardCounts,
} from "@/store/slices/realtorSlice";

const StatsCards: React.FC = () => {
  const dispatch = useAppDispatch();
  const { leadCount, clientCount, propertyCount } = useAppSelector(
    selectDashboardCounts
  );

  useEffect(() => {
    // Fetch dashboard counts on mount if not yet loaded
    dispatch(dashboardCounts());
    if (leadCount === 0 && clientCount === 0 && propertyCount === 0) {
    }
  }, [dispatch, leadCount, clientCount, propertyCount]);

  const stats = [
    {
      title: "Active Listings",
      value: Number(propertyCount || 0),
      change: "+3",
      changeType: "positive",
      icon: Building2,
      period: "Current",
    },
    {
      title: "Total Clients",
      value: Number(clientCount || 0),
      change: "+7",
      changeType: "positive",
      icon: Users,
      period: "Active",
    },
    {
      title: "Total Leads",
      value: Number(leadCount || 0),
      change: "+23%",
      changeType: "positive",
      icon: TrendingUp,
      period: "This year",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
                <div className="flex items-center mt-2 space-x-2">
                  <span
                    className={`text-sm font-medium ${
                      stat.changeType === "positive"
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-xs lg:text-sm text-gray-500">
                    {stat.period}
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
