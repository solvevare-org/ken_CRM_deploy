
import React, { useState, useEffect } from 'react';

type TemplateType = 'Email' | 'SMS';
interface Template {
  id: string;
  type: TemplateType;
  title: string;
  body: string;
  category: string;
  style: string;
}

const categories = ['Initial Contact', 'Post-Meeting', 'Reminder', 'Custom'];

const defaultTemplates: Template[] = [
  { id: 'default-email', type: 'Email', title: 'Default Email', body: 'Hello {{ClientName}}, this is a follow-up email.', category: categories[0], style: '' },
  { id: 'default-sms', type: 'SMS', title: 'Default SMS', body: 'Hi {{ClientName}}, just checking in!', category: categories[0], style: '' },
  { id: 'default-email-2', type: 'Email', title: 'Meeting Reminder', body: 'Dear {{ClientName}}, this is a reminder for our meeting at {{PropertyAddress}}.', category: categories[2], style: '' },
  { id: 'default-sms-2', type: 'SMS', title: 'Appointment Confirmation', body: 'Hi {{ClientName}}, your appointment at {{PropertyAddress}} is confirmed.', category: categories[2], style: '' },
  { id: 'default-email-3', type: 'Email', title: 'Custom Offer', body: 'Hello {{ClientName}}, we have a special offer for you on {{PropertyAddress}}.', category: categories[3], style: '' },
];

function FollowupTemplating() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [form, setForm] = useState<Template>({ id: '', type: 'Email', title: '', body: '', category: categories[0], style: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setTemplates([
      ...defaultTemplates,
      { id: 'user-email-1', type: 'Email', title: 'Post-Meeting Follow-up', body: 'Hi {{ClientName}}, it was great meeting you. Let me know if you have questions about {{PropertyAddress}}.', category: categories[1], style: '' },
      { id: 'user-sms-1', type: 'SMS', title: 'Quick Reminder', body: 'Don’t forget our call tomorrow, {{ClientName}}!', category: categories[2], style: '' },
      { id: 'user-email-2', type: 'Email', title: 'Thank You Note', body: 'Thank you {{ClientName}} for your time today. Looking forward to helping you with {{PropertyAddress}}.', category: categories[1], style: '' },
      { id: 'user-sms-2', type: 'SMS', title: 'Custom SMS', body: 'Hi {{ClientName}}, let me know if you need more info on {{PropertyAddress}}.', category: categories[3], style: '' },
    ]);
  }, []);

  const handleSelect = (template: Template) => {
    setSelectedTemplate(template);
    setForm(template);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
    setSelectedTemplate(null);
    setIsEditing(false);
    setForm({ id: '', type: 'Email', title: '', body: '', category: categories[0], style: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!form.body.trim()) return alert('Body cannot be empty');
    if (!form.title.trim()) return alert('Title cannot be empty');
    if (isEditing && selectedTemplate) {
      setTemplates(templates.map(t => t.id === selectedTemplate.id ? { ...form, id: t.id } : t));
    } else {
      setTemplates([...templates, { ...form, id: Date.now().toString() }]);
    }
    setIsEditing(false);
    setSelectedTemplate(null);
    setForm({ id: '', type: 'Email', title: '', body: '', category: categories[0], style: '' });
  };

  const preview = form.body.replace(/\{\{ClientName\}\}/g, 'John Doe').replace(/\{\{PropertyAddress\}\}/g, '123 Main St');

  // Modal state for preview
  const [showPreview, setShowPreview] = useState(false);

  // Section headers for clarity
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-gradient-to-br from-blue-50 via-white to-purple-50 py-4 px-2">
      <div className="max-w-4xl w-full mx-auto">
        <h2 className="text-4xl font-extrabold mb-4 text-blue-700 text-center tracking-tight drop-shadow">Follow-up Templating</h2>
        <div className="flex flex-row gap-4 mb-2 items-start justify-center">
          {/* Default Templates */}
          <div className="flex-1 min-w-[300px]">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Default Templates</h3>
            {defaultTemplates.map(t => (
              <div key={t.id} className="bg-white shadow rounded-xl p-4 mb-3 border border-gray-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-gray-800 text-lg">{t.title}</span>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${t.type === 'Email' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-green-50 text-green-700 border-green-200'}`}>{t.type}</span>
                </div>
                <div className="text-sm text-gray-700 mb-1 font-mono">{t.body}</div>
                <div className="text-xs text-gray-500">Category: {t.category}</div>
                <button className="mt-2 text-blue-500 font-medium hover:underline" onClick={() => { setForm(t); setShowPreview(true); }}>Preview</button>
              </div>
            ))}
          </div>
          {/* User Templates */}
          <div className="flex-1 min-w-[300px] flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 self-start">Your Templates</h3>
            {templates.filter(t => !t.id.startsWith('default-')).length === 0 && (
              <div className="text-gray-400 italic mb-2 self-start">No custom templates yet.</div>
            )}
            <div className="w-full">
              {templates.filter(t => !t.id.startsWith('default-')).map(t => (
                <div key={t.id} className="bg-white shadow rounded-xl p-4 mb-3 border border-gray-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-gray-800 text-lg">{t.title}</span>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${t.type === 'Email' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-green-50 text-green-700 border-green-200'}`}>{t.type}</span>
                  </div>
                  <div className="text-sm text-gray-700 mb-1 font-mono">{t.body}</div>
                  <div className="text-xs text-gray-500 mb-2">Category: {t.category}</div>
                  <div className="flex gap-2">
                    <button className="text-blue-500 font-medium hover:underline" onClick={() => handleSelect(t)}>Edit</button>
                    <button className="text-red-500 font-medium hover:underline" onClick={() => handleDelete(t.id)}>Delete</button>
                    <button className="text-blue-500 font-medium hover:underline" onClick={() => { setForm(t); setShowPreview(true); }}>Preview</button>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-2 bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition-all font-semibold self-start" onClick={() => { setIsEditing(true); setSelectedTemplate(null); setForm({ id: '', type: 'Email', title: '', body: '', category: categories[0], style: '' }); }}>Create New Template</button>
          </div>
        </div>
        <div className="flex flex-row gap-4 items-start justify-center">
          {/* Template Form */}
          <div className="flex-1 min-w-[300px]">
            {isEditing && (
              <div className="bg-white/90 border-l-4 border-yellow-400 rounded-2xl shadow-xl p-4">
                <h3 className="font-semibold mb-3 text-yellow-700 text-lg">{isEditing ? 'Edit Template' : 'Create New Template'}</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select name="type" value={form.type} onChange={handleChange} className="border-2 border-yellow-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all">
                      <option value="Email">Email</option>
                      <option value="SMS">SMS</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input name="title" value={form.title} onChange={handleChange} placeholder="Template Title" className="border-2 border-yellow-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Body</label>
                    <textarea name="body" value={form.body} onChange={handleChange} placeholder="Body (use {{ClientName}}, {{PropertyAddress}})" className="border-2 border-yellow-200 rounded-lg px-3 py-2 w-full h-20 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select name="category" value={form.category} onChange={handleChange} className="border-2 border-yellow-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all">
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Custom Styles (JSON)</label>
                    <input name="style" value={form.style} onChange={handleChange} placeholder="Custom CSS styles (optional, JSON format)" className="border-2 border-yellow-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all" />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition-all font-semibold" onClick={handleSave}>{isEditing ? 'Save Changes' : 'Create Template'}</button>
                    <button className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all font-semibold" onClick={() => { setIsEditing(false); setSelectedTemplate(null); setForm({ id: '', type: 'Email', title: '', body: '', category: categories[0], style: '' }); }}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative animate-fadeIn">
              <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold" onClick={() => setShowPreview(false)}>&times;</button>
              <h3 className="font-semibold mb-4 text-blue-700 text-lg">Preview</h3>
              <div className="border-2 border-blue-200 rounded-xl p-4 bg-blue-50" style={form.style ? JSON.parse(form.style) : {}}>
                <div className="font-mono text-base text-gray-800 whitespace-pre-line">{preview}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowupTemplating;
