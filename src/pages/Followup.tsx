import React, { useState } from 'react';

const contacts = [
  { id: '1', type: 'Client', name: 'Alice Smith', email: 'alice@example.com', phone: '1234567890' },
  { id: '2', type: 'Lead', name: 'Bob Johnson', email: 'bob@example.com', phone: '2345678901' },
  { id: '3', type: 'Client', name: 'Charlie Lee', email: 'charlie@example.com', phone: '3456789012' },
  { id: '4', type: 'Lead', name: 'Dana White', email: 'dana@example.com', phone: '4567890123' },
];

const templates = [
  { id: 'default-email', type: 'Email', title: 'Default Email', body: 'Hello {{ClientName}}, this is a follow-up email.' },
  { id: 'default-sms', type: 'SMS', title: 'Default SMS', body: 'Hi {{ClientName}}, just checking in!' },
];

const Followup: React.FC = () => {
  const [recipientType, setRecipientType] = useState<'Client' | 'Lead'>('Client');
  const [search, setSearch] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [messageType, setMessageType] = useState<'Email' | 'SMS'>('Email');
  const [useTemplate, setUseTemplate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customMessage, setCustomMessage] = useState('');
  const [schedule, setSchedule] = useState(false);
  const [dateTime, setDateTime] = useState('');
  const [preview, setPreview] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [analytics, setAnalytics] = useState({ sent: 0, failed: 0, open: 0, click: 0 });

  const filteredContacts = contacts.filter(c => c.type === recipientType && c.name.toLowerCase().includes(search.toLowerCase()));

  const handleRecipientSelect = (id: string) => {
    setSelectedRecipients(selectedRecipients.includes(id)
      ? selectedRecipients.filter(rid => rid !== id)
      : [...selectedRecipients, id]);
  };

  const handlePreview = () => {
    let msg = useTemplate
      ? templates.find(t => t.id === selectedTemplate)?.body || ''
      : customMessage;
    if (selectedRecipients.length > 0) {
      msg = msg.replace(/\{\{ClientName\}\}/g, contacts.find(c => c.id === selectedRecipients[0])?.name || '');
    }
    setPreview(msg);
  };

  const handleSend = () => {
    setStatus('sending');
    setTimeout(() => {
      setStatus('sent');
      setAnalytics({ sent: selectedRecipients.length, failed: 0, open: Math.floor(selectedRecipients.length * 0.7), click: Math.floor(selectedRecipients.length * 0.3) });
    }, 1500);
  };

  // Stepper progress indicator
  const steps = [
    'Recipient Type',
    'Select Recipients',
    'Message Type',
    'Compose',
    'Preview',
    'Send/Schedule',
    'Analytics',
  ];
  const currentStep = status === 'sent' ? 6 : schedule ? 5 : preview ? 4 : useTemplate || customMessage ? 3 : selectedRecipients.length ? 2 : 1;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10 px-2">
      <div className="max-w-2xl w-full">
        <h2 className="text-4xl font-extrabold mb-8 text-blue-700 text-center tracking-tight drop-shadow">Follow-up</h2>
        {/* Stepper */}
        <div className="flex justify-center items-center mb-8">
          {steps.map((step, idx) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm transition-all duration-300
                ${idx <= currentStep ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-400'}`}>{idx + 1}</div>
              {idx < steps.length - 1 && <div className={`w-10 h-1 mx-1 rounded ${idx < currentStep ? 'bg-blue-400' : 'bg-gray-200'}`}></div>}
            </div>
          ))}
        </div>
        <div className="space-y-4">
          {/* Step 1: Recipient Type */}
          <div className="bg-white/90 shadow-xl rounded-2xl p-4 border-l-4 border-blue-400">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Step 1: Select Recipient Type</h3>
            <select value={recipientType} onChange={e => setRecipientType(e.target.value as 'Client' | 'Lead')} className="border-2 border-blue-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all">
              <option value="Client">Client</option>
              <option value="Lead">Lead</option>
            </select>
          </div>
          {/* Step 2: Search & Select Recipients */}
          <div className="bg-white/90 shadow-xl rounded-2xl p-4 border-l-4 border-purple-400">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Step 2: Search & Select Recipients</h3>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Type to search..." className="border-2 border-purple-200 rounded-lg px-3 py-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all" />
            <div className="max-h-32 overflow-y-auto border rounded-lg p-2 bg-gray-50">
              {filteredContacts.map(c => (
                <label key={c.id} className="flex items-center mb-2 cursor-pointer hover:bg-purple-50 px-2 py-1 rounded-lg transition-all">
                  <input type="checkbox" checked={selectedRecipients.includes(c.id)} onChange={() => handleRecipientSelect(c.id)} className="accent-purple-600 w-4 h-4" />
                  <span className="ml-2 font-medium text-gray-700">{c.name} <span className="text-xs text-gray-500">({c.email || c.phone})</span></span>
                </label>
              ))}
            </div>
          </div>
          {/* Step 3: Message Type */}
          <div className="bg-white/90 shadow-xl rounded-2xl p-4 border-l-4 border-green-400">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Step 3: Choose Message Type</h3>
            <select value={messageType} onChange={e => setMessageType(e.target.value as 'Email' | 'SMS')} className="border-2 border-green-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400 transition-all">
              <option value="Email">Email</option>
              <option value="SMS">SMS</option>
            </select>
          </div>
          {/* Step 4: Compose Message */}
          <div className="bg-white/90 shadow-xl rounded-2xl p-4 border-l-4 border-yellow-400">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Step 4: Compose Message</h3>
            <div className="flex items-center mb-2">
              <input type="checkbox" checked={useTemplate} onChange={e => setUseTemplate(e.target.checked)} className="accent-yellow-500 w-4 h-4" />
              <span className="ml-2">Use Template</span>
            </div>
            {useTemplate ? (
              <select value={selectedTemplate} onChange={e => setSelectedTemplate(e.target.value)} className="border-2 border-yellow-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all">
                <option value="">Select Template</option>
                {templates.filter(t => t.type === messageType).map(t => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
            ) : (
              <textarea value={customMessage} onChange={e => setCustomMessage(e.target.value)} placeholder="Write your message..." className="border-2 border-yellow-200 rounded-lg px-3 py-2 w-full h-24 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all" />
            )}
          </div>
          {/* Step 5: Preview */}
          <div className="bg-white/90 shadow-xl rounded-2xl p-4 border-l-4 border-blue-400">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Step 5: Preview Message</h3>
            <button className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition-all font-semibold" onClick={handlePreview}>Preview</button>
            {preview && (
              <div className="mt-4 border-2 border-blue-200 rounded-xl p-4 bg-blue-50">
                <strong className="block mb-2 text-blue-700">Preview:</strong>
                <div className="text-gray-800 whitespace-pre-line font-mono text-base">{preview}</div>
              </div>
            )}
          </div>
          {/* Step 6: Send or Schedule */}
          <div className="bg-white/90 shadow-xl rounded-2xl p-4 border-l-4 border-green-400">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Step 6: Send or Schedule</h3>
            <div className="flex items-center mb-4">
              <input type="checkbox" checked={schedule} onChange={e => setSchedule(e.target.checked)} className="accent-green-500 w-4 h-4" />
              <span className="ml-2">Schedule for Later</span>
              {schedule && (
                <input type="datetime-local" value={dateTime} onChange={e => setDateTime(e.target.value)} className="border-2 border-green-200 rounded-lg px-3 py-2 ml-4 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all" />
              )}
            </div>
            <button className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 transition-all font-semibold" onClick={handleSend} disabled={status === 'sending' || selectedRecipients.length === 0 || (!customMessage && !selectedTemplate)}>
              {schedule ? 'Schedule' : 'Send Now'}
            </button>
            {status === 'sending' && <span className="ml-4 text-blue-600 animate-pulse">Sending...</span>}
            {status === 'sent' && <span className="ml-4 text-green-600 font-bold">Sent!</span>}
          </div>
          {/* Step 7: Analytics */}
          {status === 'sent' && (
            <div className="bg-white/90 shadow-xl rounded-2xl p-4 border-l-4 border-blue-400">
              <h3 className="font-semibold mb-2 text-blue-700">Delivery Analytics</h3>
              <div className="grid grid-cols-2 gap-4 text-gray-700">
                <div><span className="font-medium">Sent:</span> {analytics.sent}</div>
                <div><span className="font-medium">Failed:</span> {analytics.failed}</div>
                <div><span className="font-medium">Open Rate:</span> {analytics.open}</div>
                <div><span className="font-medium">Click Rate:</span> {analytics.click}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Followup;
