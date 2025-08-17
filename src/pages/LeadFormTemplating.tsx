import React, { useState } from 'react';
import { Plus, Trash2, Edit, Eye, Copy } from 'lucide-react';

type LeadField = {
  id: string;
  type: string;
  label: string;
  placeholder: string;
  required: boolean;
  options?: string[];
  validation: string;
};

type LeadFormTemplate = {
  id: string;
  name: string;
  fields: LeadField[];
};

const fieldTypes = [
  { type: 'text', label: 'Text' },
  { type: 'email', label: 'Email' },
  { type: 'number', label: 'Number' },
  { type: 'dropdown', label: 'Dropdown' },
  { type: 'checkbox', label: 'Checkbox' },
  { type: 'date', label: 'Date' },
];

const defaultTemplate: LeadFormTemplate = {
  id: 'default',
  name: 'Default Lead Form',
  fields: [
    { id: 'name', type: 'text', label: 'Name', placeholder: 'Enter name', required: true, validation: '' },
    { id: 'email', type: 'email', label: 'Email', placeholder: 'Enter email', required: true, validation: 'email' },
    { id: 'phone', type: 'number', label: 'Phone', placeholder: 'Enter phone', required: false, validation: '' },
  ],
};

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

const mockTemplates: LeadFormTemplate[] = [
  defaultTemplate,
  {
    id: 'template1',
    name: 'Open House RSVP',
    fields: [
      { id: 'name', type: 'text', label: 'Full Name', placeholder: 'Your name', required: true, validation: '' },
      { id: 'email', type: 'email', label: 'Email', placeholder: 'Your email', required: true, validation: 'email' },
      { id: 'attending', type: 'dropdown', label: 'Will Attend?', placeholder: '', required: true, options: ['Yes', 'No'], validation: '' },
    ],
  },
  {
    id: 'template2',
    name: 'Property Inquiry',
    fields: [
      { id: 'name', type: 'text', label: 'Name', placeholder: 'Name', required: true, validation: '' },
      { id: 'email', type: 'email', label: 'Email', placeholder: 'Email', required: true, validation: 'email' },
      { id: 'property', type: 'text', label: 'Property Address', placeholder: 'Address', required: false, validation: '' },
      { id: 'interest', type: 'dropdown', label: 'Interest Level', placeholder: '', required: false, options: ['High', 'Medium', 'Low'], validation: '' },
    ],
  },
];

const LeadFormTemplating: React.FC = () => {
  const [templates, setTemplates] = useState<LeadFormTemplate[]>(mockTemplates);
  const [activeTemplate, setActiveTemplate] = useState<LeadFormTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<LeadFormTemplate>({ id: '', name: '', fields: [] });
  const [showPreview, setShowPreview] = useState(false);

  // Create new template
  const startNewTemplate = (copyFrom?: LeadFormTemplate | null) => {
    if (copyFrom) {
      setForm({ ...copyFrom, id: generateId(), name: copyFrom.name + ' Copy' });
    } else {
      setForm({ id: generateId(), name: '', fields: [] });
    }
    setIsEditing(true);
    setActiveTemplate(null);
  };

  // Edit template
  const editTemplate = (template: LeadFormTemplate) => {
    setForm({ ...template });
    setIsEditing(true);
    setActiveTemplate(template);
  };

  // Delete template
  const deleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
    setActiveTemplate(null);
    setIsEditing(false);
    setForm({ id: '', name: '', fields: [] });
  };

  // Save template
  const saveTemplate = () => {
    if (!form.name.trim()) return alert('Template name required');
    if (form.fields.length === 0) return alert('Add at least one field');
    if (isEditing && activeTemplate) {
      setTemplates(templates.map(t => t.id === activeTemplate.id ? { ...form } : t));
    } else {
      setTemplates([...templates, { ...form }]);
    }
    setIsEditing(false);
    setActiveTemplate(null);
    setForm({ id: '', name: '', fields: [] });
  };

  // Add field
  const addField = (type: string) => {
    setForm({ ...form, fields: [...form.fields, {
      id: generateId(),
      type,
      label: `${fieldTypes.find(f => f.type === type)?.label || 'Field'} ${form.fields.length + 1}`,
      placeholder: '',
      required: false,
      ...(type === 'dropdown' ? { options: ['Option 1', 'Option 2'] } : {}),
      validation: '',
    }] });
  };

  // Remove field
  const removeField = (id: string) => {
    setForm({ ...form, fields: form.fields.filter(f => f.id !== id) });
  };

  // Update field
  const updateField = (id: string, key: string, value: any) => {
    setForm({ ...form, fields: form.fields.map(f => f.id === id ? { ...f, [key]: value } : f) });
  };

  // Reorder fields
  const moveField = (from: number, to: number) => {
    if (to < 0 || to >= form.fields.length) return;
    const updated = [...form.fields];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setForm({ ...form, fields: updated });
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-2">
      <div className="max-w-3xl w-full">
        <h2 className="text-3xl font-bold mb-6 text-blue-700 text-center">Lead Form Templating</h2>
        {/* Template list */}
        <div className="mb-8 flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-1 min-w-[260px]">
            <h3 className="text-lg font-semibold mb-3 text-blue-700">Templates</h3>
            {templates.map(t => (
              <div key={t.id} className="bg-white shadow rounded-lg p-4 mb-4 border-l-4 border-blue-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-blue-600">{t.name}</span>
                  <div className="flex gap-2">
                    <button className="text-blue-600" onClick={() => editTemplate(t)}><Edit size={16} /></button>
                    <button className="text-purple-600" onClick={() => startNewTemplate(t)}><Copy size={16} /></button>
                    <button className="text-green-600" onClick={() => { setForm(t); setShowPreview(true); }}><Eye size={16} /></button>
                    {t.id !== 'default' && <button className="text-red-600" onClick={() => deleteTemplate(t.id)}><Trash2 size={16} /></button>}
                  </div>
                </div>
                <div className="text-xs text-gray-500">Fields: {t.fields.length}</div>
              </div>
            ))}
            <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700" onClick={() => startNewTemplate()}>Create New Template</button>
          </div>
          {/* Edit/Create Form */}
          {isEditing && (
            <div className="flex-1 min-w-[320px] flex justify-center">
              <div className="bg-white border border-gray-200 rounded-lg shadow p-6 w-full max-w-md mx-auto">
                <h3 className="font-semibold mb-4 text-gray-800">{activeTemplate ? 'Edit Template' : 'Create New Template'}</h3>
                <input className="w-full border rounded px-2 py-1 mb-3" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Template Name" />
                <div className="space-y-4 mb-4">
                  {form.fields.map((field, idx) => (
                    <div key={field.id} className="bg-gray-50 rounded p-3 border-l-4 border-blue-200 flex flex-col gap-2">
                      <div className="flex gap-2 items-center">
                        <span className="font-semibold text-blue-700">{field.label}</span>
                        <select value={field.type} onChange={e => updateField(field.id, 'type', e.target.value)} className="border rounded px-2 py-1">
                          {fieldTypes.map(ft => <option key={ft.type} value={ft.type}>{ft.label}</option>)}
                        </select>
                        <button className="text-red-600 ml-auto" onClick={() => removeField(field.id)}><Trash2 size={16} /></button>
                        <button className="text-gray-400" disabled={idx === 0} onClick={() => moveField(idx, idx - 1)}>&uarr;</button>
                        <button className="text-gray-400" disabled={idx === form.fields.length - 1} onClick={() => moveField(idx, idx + 1)}>&darr;</button>
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
                <div className="flex flex-wrap gap-2 mb-4 justify-center">
                  {fieldTypes.map(ft => (
                    <button key={ft.type} className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg font-semibold flex items-center gap-1" onClick={() => addField(ft.type)}><Plus size={16} /> {ft.label}</button>
                  ))}
                </div>
                <div className="flex gap-2 justify-center">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded font-semibold" onClick={saveTemplate}>Save Template</button>
                  <button className="px-4 py-2 rounded border" onClick={() => { setIsEditing(false); setActiveTemplate(null); setForm({ id: '', name: '', fields: [] }); }}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative animate-fadeIn">
              <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold" onClick={() => setShowPreview(false)}>&times;</button>
              <h3 className="font-semibold mb-4 text-blue-700 text-lg">Form Preview</h3>
              <form className="space-y-4">
                {form.fields.map(field => (
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

export default LeadFormTemplating;
