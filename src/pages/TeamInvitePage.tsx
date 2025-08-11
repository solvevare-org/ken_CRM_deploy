import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Upload, Mail, Settings, FileText, Users, Headphones } from 'lucide-react';

export function TeamInvitePage() {
  const [emails, setEmails] = useState('');
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');
  const navigate = useNavigate();

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      setUploadError('');
    } else {
      setUploadError('Please select a valid CSV file');
    }
  };

  const handleCSVSubmit = () => {
    if (!csvFile) return;
    setShowCSVModal(false);
    navigate('/payment');
  };

  const handleManualSubmit = () => {
    if (!emails.trim()) return;
    setShowManualModal(false);
    navigate('/payment');
  };

  const handleCustomMigration = () => {
    // Show contact support flow
    alert('Our support team will contact you within 24 hours to discuss your custom migration needs.');
    navigate('/workspace-name-setup');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Invite Your Team
          </h1>
          <p className="text-lg text-gray-600">
            Choose how you want to add team members to your organization
          </p>
        </div>

        {/* Invite Options */}
        <div className="grid gap-6 mb-8">
          {/* CSV Upload Option */}
          <div className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-blue-500 transition-all duration-200 hover:shadow-lg">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Invite through CSV</h3>
                <p className="text-gray-600 mb-2">Suitable for big organizations</p>
                <p className="text-sm text-gray-500 mb-4">Upload a CSV file with email addresses to invite multiple team members at once</p>
                <Button 
                  variant="primary"
                  onClick={() => setShowCSVModal(true)}
                  className="flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Upload CSV File</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Manual Invite Option */}
          <div className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-green-500 transition-all duration-200 hover:shadow-lg">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Invite manually by typing email</h3>
                <p className="text-gray-600 mb-2">Suitable for small organizations</p>
                <p className="text-sm text-gray-500 mb-4">Enter email addresses manually to send individual invitations</p>
                <Button 
                  variant="secondary"
                  onClick={() => setShowManualModal(true)}
                  className="flex items-center space-x-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Add Emails Manually</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Custom Migration Option */}
          <div className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-purple-500 transition-all duration-200 hover:shadow-lg">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Custom migration service by CRM</h3>
                <p className="text-gray-600 mb-2">Suitable for big organizations</p>
                <p className="text-sm text-gray-500 mb-4">Get personalized migration assistance from our expert team</p>
                <Button 
                  variant="outline"
                  onClick={handleCustomMigration}
                  className="flex items-center space-x-2"
                >
                  <Headphones className="w-4 h-4" />
                  <span>Contact Support</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => navigate('/signup-options')}
            className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
          >
            ← Back to Account Type
          </button>
        </div>
      </div>

      {/* CSV Upload Modal */}
      <Modal
        isOpen={showCSVModal}
        onClose={() => setShowCSVModal(false)}
        title="Upload CSV File"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Select a CSV file containing email addresses to invite team members.</p>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload" className="cursor-pointer">
              <span className="text-blue-600 hover:text-blue-800 font-medium">Click to upload</span>
              <span className="text-gray-500"> or drag and drop</span>
            </label>
            <p className="text-xs text-gray-500 mt-1">CSV files only</p>
          </div>
          {uploadError && (
            <p className="text-red-600 text-sm">{uploadError}</p>
          )}
          {csvFile && (
            <p className="text-green-600 text-sm">✓ File selected: {csvFile.name}</p>
          )}
          <div className="flex space-x-3">
            <Button onClick={() => setShowCSVModal(false)} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleCSVSubmit}
              disabled={!csvFile}
              className="flex-1"
            >
              Continue to Payment
            </Button>
          </div>
        </div>
      </Modal>

      {/* Manual Email Modal */}
      <Modal
        isOpen={showManualModal}
        onClose={() => setShowManualModal(false)}
        title="Add Team Members"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Enter email addresses separated by commas to invite team members.</p>
          <Input
            label="Email Addresses"
            placeholder="john@example.com, jane@example.com, team@example.com"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            className="min-h-[100px]"
            type="textarea"
          />
          <div className="flex space-x-3">
            <Button onClick={() => setShowManualModal(false)} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleManualSubmit}
              disabled={!emails.trim()}
              className="flex-1"
            >
              Continue to Payment
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}