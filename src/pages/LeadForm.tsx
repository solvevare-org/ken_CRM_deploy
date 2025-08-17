import React, { useState } from 'react';
import { Plus, Trash2, Eye, Link2, QrCode } from 'lucide-react';

const fieldTypes = [
  { type: 'text', label: 'Text' },
  { type: 'email', label: 'Email' },
  { type: 'number', label: 'Number' },
  { type: 'dropdown', label: 'Dropdown' },
  { type: 'checkbox', label: 'Checkbox' },
  { type: 'date', label: 'Date' },
];

type LeadField = {
  id: string;
  type: string;
  label: string;
  placeholder: string;
  required: boolean;
  options?: string[];
  validation: string;
};

const defaultTemplate: LeadField[] = [
  { id: 'name', type: 'text', label: 'Name', placeholder: 'Enter name', required: true, validation: '' },
  { id: 'email', type: 'email', label: 'Email', placeholder: 'Enter email', required: true, validation: 'email' },
  { id: 'phone', type: 'number', label: 'Phone', placeholder: 'Enter phone', required: false, validation: '' },
];

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

const LeadForm: React.FC = () => {
  const [fields, setFields] = useState<LeadField[]>([...defaultTemplate]);
  const [showPreview, setShowPreview] = useState(false);
  const [formName, setFormName] = useState('New Lead Form');
  const [shareLink, setShareLink] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [startType, setStartType] = useState<'scratch' | 'template'>('template');

  // Add field
  const addField = (type: string) => {
    setFields([...fields, {
      id: generateId(),
      type,
      label: `${fieldTypes.find(f => f.type === type)?.label || 'Field'} ${fields.length + 1}`,
      placeholder: '',
      required: false,
      ...(type === 'dropdown' ? { options: ['Option 1', 'Option 2'] } : {}),
      validation: '',
    }]);
  };

  // Remove field
  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  // Update field
  const updateField = (id: string, key: string, value: any) => {
    setFields(fields.map(f => f.id === id ? { ...f, [key]: value } : f));
  };

  // Reorder fields
  const moveField = (from: number, to: number) => {
    if (to < 0 || to >= fields.length) return;
    const updated = [...fields];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setFields(updated);
  };

  // Save form
  const saveForm = () => {
    setShareLink('https://realtypro.com/leadform/' + generateId());
    setQrCodeUrl('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + encodeURIComponent(shareLink));
    alert('Form saved!');
  };

  // Start from scratch or template
  const handleStartType = (type: 'scratch' | 'template') => {
    setStartType(type);
    setFields(type === 'template' ? [...defaultTemplate] : []);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-2">
      <div className="max-w-2xl w-full">
        <h2 className="text-3xl font-bold mb-6 text-blue-700 text-center">Lead Form Builder</h2>
        {/* Start type */}
        <div className="flex justify-center gap-4 mb-6">
          <button className={`px-4 py-2 rounded-lg font-semibold shadow ${startType === 'scratch' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`} onClick={() => handleStartType('scratch')}>Start from Scratch</button>
          <button className={`px-4 py-2 rounded-lg font-semibold shadow ${startType === 'template' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`} onClick={() => handleStartType('template')}>Use Template</button>
        </div>
        {/* Form name */}
        <input className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 mb-4" value={formName} onChange={e => setFormName(e.target.value)} placeholder="Form Name" />
        {/* Fields */}
        <div className="space-y-4 mb-6">
          {fields.map((field, idx) => (
            <div key={field.id} className="bg-white rounded-xl shadow p-4 border-l-4 border-blue-400 flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <span className="font-semibold text-blue-700">{field.label}</span>
                <select value={field.type} onChange={e => updateField(field.id, 'type', e.target.value)} className="border rounded px-2 py-1">
                  {fieldTypes.map(ft => <option key={ft.type} value={ft.type}>{ft.label}</option>)}
                </select>
                <button className="text-red-600 ml-auto" onClick={() => removeField(field.id)}><Trash2 size={18} /></button>
                <button className="text-gray-400" disabled={idx === 0} onClick={() => moveField(idx, idx - 1)}>&uarr;</button>
                <button className="text-gray-400" disabled={idx === fields.length - 1} onClick={() => moveField(idx, idx + 1)}>&darr;</button>
              </div>
              <input className="border rounded px-2 py-1" value={field.label} onChange={e => updateField(field.id, 'label', e.target.value)} placeholder="Label" />
              <input className="border rounded px-2 py-1" value={field.placeholder} onChange={e => updateField(field.id, 'placeholder', e.target.value)} placeholder="Placeholder" />
              <div className="flex gap-4 items-center">
                <label className="flex items-center gap-1"><input type="checkbox" checked={field.required} onChange={e => updateField(field.id, 'required', e.target.checked)} /> Required</label>
                {field.type === 'dropdown' && (
                  <input className="border rounded px-2 py-1" value={field.options?.join(', ') || ''} onChange={e => updateField(field.id, 'options', e.target.value.split(','))} placeholder="Dropdown options (comma separated)" />
                )}
                <input className="border rounded px-2 py-1" value={field.validation} onChange={e => updateField(field.id, 'validation', e.target.value)} placeholder="Validation (e.g. email)" />
              </div>
            </div>
          ))}
        </div>
        {/* Add field */}
        <div className="flex gap-2 mb-6">
          {fieldTypes.map(ft => (
            <button key={ft.type} className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg font-semibold flex items-center gap-1" onClick={() => addField(ft.type)}><Plus size={16} /> {ft.label}</button>
          ))}
        </div>
        {/* Preview & Save */}
        <div className="flex gap-4 mb-6 justify-center">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2" onClick={() => setShowPreview(true)}><Eye size={18} /> Preview</button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold" onClick={saveForm}>Save Form</button>
        </div>
        {/* Share options */}
        {shareLink && (
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-green-400 mb-6 flex flex-col items-center">
            <div className="flex gap-2 items-center mb-2">
              <Link2 size={20} className="text-green-600" />
              <span className="font-semibold">Shareable Link:</span>
              <a href={shareLink} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{shareLink}</a>
            </div>
            <div className="flex gap-2 items-center">
              <QrCode size={20} className="text-green-600" />
              <span className="font-semibold">QR Code:</span>
              {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" className="ml-2" />}
            </div>
          </div>
        )}
        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative animate-fadeIn">
              <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold" onClick={() => setShowPreview(false)}>&times;</button>
              <h3 className="font-semibold mb-4 text-blue-700 text-lg">Form Preview</h3>
              <form className="space-y-4">
                {fields.map(field => (
                  <div key={field.id} className="flex flex-col gap-1">
                    <label className="font-medium text-gray-700">{field.label}{field.required && <span className="text-red-500">*</span>}</label>
                    {field.type === 'text' && <input className="border rounded px-2 py-1" placeholder={field.placeholder} />}
                    {field.type === 'email' && <input type="email" className="border rounded px-2 py-1" placeholder={field.placeholder} />}
                    {field.type === 'number' && <input type="number" className="border rounded px-2 py-1" placeholder={field.placeholder} />}
                    {field.type === 'dropdown' && <select className="border rounded px-2 py-1">{field.options?.map((opt, i) => <option key={i}>{opt}</option>)}</select>}
                    {field.type === 'checkbox' && <input type="checkbox" className="w-5 h-5" />}
                    {field.type === 'date' && <input type="date" className="border rounded px-2 py-1" />}
                  </div>
                ))}
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold">Submit</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadForm;
