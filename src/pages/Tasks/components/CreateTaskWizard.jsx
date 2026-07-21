import { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { useAuth } from '../../../context/AuthContext';
import { X, Plus, Trash2, Calendar, FileText, User, Flag, Briefcase } from 'lucide-react';
import { PRIORITY } from '../../../data/mockData';

export default function CreateTaskWizard({ onClose }) {
  const { employees, projects, addTask } = useApp();
  const { currentUser } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: '',
    assignedTo: '',
    deadline: '',
    priority: PRIORITY.MEDIUM,
  });
  
  const [checklist, setChecklist] = useState([]);
  const [newItem, setNewItem] = useState('');

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAddChecklist = () => {
    if (newItem.trim()) {
      setChecklist(prev => [...prev, { text: newItem.trim(), done: false }]);
      setNewItem('');
    }
  };

  const handleRemoveChecklist = (idx) => {
    setChecklist(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.assignedTo) return;
    
    addTask({
      ...formData,
      checklist
    }, currentUser.id);
    
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)' }}>
      <div style={{ width: '100%', maxWidth: 700, background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', animation: 'scaleIn 0.2s ease' }}>
        
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Create New Task</h2>
          <button className="btn btn-outline" style={{ padding: 8, border: 'none' }} onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 32, maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>
                <FileText size={14} /> Task Title *
              </label>
              <input name="title" required value={formData.title} onChange={handleChange} className="input" placeholder="e.g. Implement Authentication" style={{ width: '100%', padding: 12 }} />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>
                <FileText size={14} /> Description
              </label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="input" placeholder="Detailed description of the task..." style={{ width: '100%', padding: 12, minHeight: 100, resize: 'vertical' }} />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>
                <Briefcase size={14} /> Project
              </label>
              <select name="project" value={formData.project} onChange={handleChange} className="input select" style={{ width: '100%', padding: 12 }}>
                <option value="">Select Project</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>
                <User size={14} /> Assign To *
              </label>
              <select name="assignedTo" required value={formData.assignedTo} onChange={handleChange} className="input select" style={{ width: '100%', padding: 12 }}>
                <option value="">Select Employee</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>
                <Calendar size={14} /> Deadline
              </label>
              <input name="deadline" type="date" value={formData.deadline} onChange={handleChange} className="input" style={{ width: '100%', padding: 12 }} />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>
                <Flag size={14} /> Priority
              </label>
              <select name="priority" value={formData.priority} onChange={handleChange} className="input select" style={{ width: '100%', padding: 12 }}>
                {Object.values(PRIORITY).map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 24, marginTop: 24 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12 }}>
              Checklist (Optional)
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              {checklist.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#F8FAFC', padding: '12px 16px', borderRadius: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary-color)' }} />
                  <span style={{ flex: 1, fontSize: 14 }}>{item.text}</span>
                  <button type="button" onClick={() => handleRemoveChecklist(idx)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <input className="input" style={{ flex: 1, padding: 12 }} placeholder="Add a checklist item..." value={newItem} onChange={e => setNewItem(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddChecklist(); } }} />
              <button type="button" className="btn btn-outline" onClick={handleAddChecklist}><Plus size={16} /> Add</button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32 }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={!formData.title || !formData.assignedTo}>Create Task</button>
          </div>
        </form>

      </div>
      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
