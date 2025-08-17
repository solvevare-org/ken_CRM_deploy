import React, { useState } from 'react';
import { Search, Plus, FileText, Download, Eye, Trash2, Upload } from 'lucide-react';

const Documents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const documents = [
    {
      id: '1',
      name: 'Purchase Agreement - 123 Main Street',
      type: 'contract',
      propertyId: '1',
      clientId: '1',
      url: '#',
      uploadedAt: new Date('2024-01-20'),
      uploadedBy: 'Sarah Johnson',
      size: 2.4
    },
    {
      id: '2',
      name: 'Property Disclosure - Oak Avenue',
      type: 'disclosure',
      propertyId: '2',
      clientId: '3',
      url: '#',
      uploadedAt: new Date('2024-01-18'),
      uploadedBy: 'Sarah Johnson',
      size: 1.8
    },
    {
      id: '3',
      name: 'Home Inspection Report - Waterfront Villa',
      type: 'inspection',
      propertyId: '3',
      clientId: '4',
      url: '#',
      uploadedAt: new Date('2024-01-22'),
      uploadedBy: 'Inspector John',
      size: 5.2
    },
    {
      id: '4',
      name: 'Appraisal Report - Downtown Condo',
      type: 'appraisal',
      propertyId: '1',
      clientId: '1',
      url: '#',
      uploadedAt: new Date('2024-01-19'),
      uploadedBy: 'Appraiser Mike',
      size: 3.1
    },
    {
      id: '5',
      name: 'Listing Agreement - Pine Street',
      type: 'listing',
      propertyId: '4',
      clientId: '2',
      url: '#',
      uploadedAt: new Date('2024-01-15'),
      uploadedBy: 'Sarah Johnson',
      size: 1.5
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'contract':
        return 'bg-blue-100 text-blue-800';
      case 'listing':
        return 'bg-emerald-100 text-emerald-800';
      case 'disclosure':
        return 'bg-yellow-100 text-yellow-800';
      case 'inspection':
        return 'bg-purple-100 text-purple-800';
      case 'appraisal':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const formatFileSize = (sizeInMB: number) => {
    return `${sizeInMB.toFixed(1)} MB`;
  };

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-sm lg:text-base text-gray-600 mt-1">Manage contracts, listings, and legal documents</p>
        </div>
        <button className="mt-4 sm:mt-0 inline-flex items-center px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base">
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
            <p className="text-sm text-gray-600">Total Documents</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {documents.filter(d => d.type === 'contract').length}
            </p>
            <p className="text-sm text-gray-600">Contracts</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-600">
              {documents.filter(d => d.type === 'listing').length}
            </p>
            <p className="text-sm text-gray-600">Listings</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {documents.filter(d => d.type === 'inspection').length}
            </p>
            <p className="text-sm text-gray-600">Inspections</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              {documents.filter(d => d.type === 'appraisal').length}
            </p>
            <p className="text-sm text-gray-600">Appraisals</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 lg:px-4 py-2 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="contract">Contracts</option>
            <option value="listing">Listings</option>
            <option value="disclosure">Disclosures</option>
            <option value="inspection">Inspections</option>
            <option value="appraisal">Appraisals</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploaded
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploaded By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.map((document) => (
                <tr key={document.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="w-8 h-8 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{document.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(document.type)}`}>
                      {document.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatFileSize(document.size)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {document.uploadedAt.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {document.uploadedBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-900">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
          <p className="text-gray-600">Try adjusting your search filters or upload a new document.</p>
        </div>
      )}
    </div>
  );
};

export default Documents;