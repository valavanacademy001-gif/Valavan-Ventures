import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { mockUsers, mockProjects, PRIORITY } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';

export default function AssignTaskModal({ onClose }) {
  const { addTask } = useApp();
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    project: '',
    priority: PRIORITY.MEDIUM,
    deadline: '',
    assignedTo: '',
    description: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.assignedTo || !form.deadline) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    addTask({ ...form, assignedBy: currentUser.id });
    setLoading(false);
    showToast('Task assigned successfully!', 'success');
    onClose();
  };

  return (
    <div className="modal-overlay animate-fadeIn" onClick={onClose}>
      <div className="modal modal-md animate-scaleIn" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Assign New Task</div>
            <div className="modal-subtitle">Create and assign a task to a team member</div>
          </div>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Task Title *</label>
              <input className="input" placeholder="e.g., Implement login page" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Project</label>
                <select className="input select" value={form.project} onChange={e => setForm(f => ({ ...f, project: e.target.value }))}>
                  <option value="">Select project</option>
                  {mockProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Priority *</label>
                <select className="input select" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Assign To *</label>
                <select className="input select" value={form.assignedTo} onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))} required>
                  <option value="">Select employee</option>
                  {mockUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Deadline *</label>
                <input className="input" type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} required min={new Date().toISOString().split('T')[0]} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="input" placeholder="Describe what needs to be done..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? 'Assigning...' : 'Assign Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
