import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Phone,
  Mail,
  User,
  Calendar,
  Users,
  UserPlus,
  TrendingUp,
  Star,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { GenerateFormLinkRequest } from "../types/leadFormLinkTypes";
import { generateFormLink } from "../store/slices/leadFormLinkSlice";
import { fetchRealtorLeads, selectLeads } from "../store/slices/realtorSlice";
import { UrlModal } from "../components/UrlModel";
// import { Lead } from "../types/leadTypes";

const Leads: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [linkData] = useState<GenerateFormLinkRequest>({
    formId: "689a3c955abd6e0c5659f594",
    tag: "Twitter",
  });

  const dispatch = useAppDispatch();
  const leads = useAppSelector(selectLeads);

  useEffect(() => {
    if (!leads || leads.length === 0) {
      dispatch(fetchRealtorLeads());
    }
  }, [leads, dispatch]);

  const filteredLeads = leads.filter((lead) => {
    const searchString = Object.values(lead.submittedData || {})
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || lead.tag.toLowerCase() === statusFilter;
    const matchesSource =
      sourceFilter === "all" ||
      (lead.capture_tag || "").toLowerCase() === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  const generateLeadFormLink = async () => {
    const res = await dispatch(generateFormLink(linkData)).unwrap();
    console.log(res, "res");
    setUrl(res.shareableUrl);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-sm lg:text-base text-gray-600 mt-1">
            Manage and track potential clients
          </p>
        </div>
        <button
          onClick={generateLeadFormLink}
          className="mt-4 sm:mt-0 inline-flex items-center px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Lead
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">127</p>
            </div>
            <User className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New This Week</p>
              <p className="text-2xl font-bold text-gray-900">23</p>
            </div>
            <Star className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Conversion Rate
              </p>
              <p className="text-2xl font-bold text-gray-900">18%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Follow-ups Due
              </p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <Calendar className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 lg:px-4 py-2 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="nurturing">Nurturing</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 lg:px-4 py-2 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Sources</option>
            <option value="website">Website</option>
            <option value="referral">Referral</option>
            <option value="social">Social Media</option>
            <option value="advertising">Advertising</option>
            <option value="walk-in">Walk-in</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Leads Table or Empty State */}
      {leads.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-10 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-50">
            <UserPlus className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            No leads available
          </h3>
          <p className="text-sm text-gray-500 max-w-sm">
            You haven’t added any leads yet. Start by creating a new lead to
            track and manage your potential clients.
          </p>
          <button
            onClick={generateLeadFormLink}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Lead
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Lead Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50">
                    {/* Submitted Data */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 space-y-1">
                        {Object.entries(lead.submittedData || {}).map(
                          ([key, value]) => (
                            <div key={key}>
                              <span className="font-medium capitalize">
                                {key}:
                              </span>{" "}
                              <span>{String(value)}</span>
                            </div>
                          )
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full border bg-gray-100 text-gray-800">
                        {lead.tag}
                      </span>
                    </td>

                    {/* Source */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-50 text-gray-700">
                        {lead.capture_tag || "Other"}
                      </span>
                    </td>

                    {/* Created At */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Phone className="w-4 h-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900">
                        <Calendar className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <UrlModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        url={url}
        title="Share This Link"
        description="Copy this URL to share with others"
      />
    </div>
  );
};

export default Leads;
