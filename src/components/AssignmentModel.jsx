import React, { useState, useEffect } from 'react';
import { X, Save, Plus } from 'lucide-react';

const AssignmentModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    dueDate: '',
    priority: 'Medium',
    description: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        subject: initialData.subject,
        dueDate: initialData.dueDate.slice(0, 16), // Format for datetime-local
        priority: initialData.priority,
        description: initialData.description || ''
      });
    } else {
      setFormData({
        title: '',
        subject: '',
        dueDate: '',
        priority: 'Medium',
        description: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.dueDate) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="glass rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-white/20 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center px-8 py-6 border-b border-white/10 bg-white/5 flex-shrink-0">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              {initialData ? 'Edit Task' : 'Add New Task'}
            </h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Configure your mission</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl transition-all hover:bg-white/10">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] ml-1">Title</label>
            <input 
              required
              type="text" 
              className="glass-input w-full px-5 py-3.5 rounded-2xl outline-none transition-all font-semibold placeholder:text-slate-600"
              placeholder="Thesis Research Phase 1"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] ml-1">Subject</label>
              <input 
                required
                type="text" 
                className="glass-input w-full px-5 py-3.5 rounded-2xl outline-none transition-all font-semibold placeholder:text-slate-600"
                placeholder="Psychology"
                value={formData.subject}
                onChange={e => setFormData({...formData, subject: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] ml-1">Priority</label>
              <select 
                className="glass-input w-full px-5 py-3.5 rounded-2xl outline-none transition-all font-semibold appearance-none"
                value={formData.priority}
                onChange={e => setFormData({...formData, priority: e.target.value})}
              >
                <option value="High" className="bg-slate-900">High</option>
                <option value="Medium" className="bg-slate-900">Medium</option>
                <option value="Low" className="bg-slate-900">Low</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] ml-1">Due Date</label>
            <input 
              required
              type="datetime-local" 
              className="glass-input w-full px-5 py-3.5 rounded-2xl outline-none transition-all font-semibold [color-scheme:dark]"
              value={formData.dueDate}
              onChange={e => setFormData({...formData, dueDate: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] ml-1">Description (Optional)</label>
            <textarea 
              rows={3}
              className="glass-input w-full px-5 py-3.5 rounded-2xl outline-none transition-all font-semibold placeholder:text-slate-600 resize-none"
              placeholder="Notes or specific requirements..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2.5 active:scale-[0.98] mt-2"
          >
            {initialData ? (
              <>Update Assignment <Save size={18} /></>
            ) : (
              <>Create Assignment <Plus size={18} /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssignmentModal;