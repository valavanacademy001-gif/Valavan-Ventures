import { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { X, FileText, Image as ImageIcon, Calendar, Tag, AlertCircle } from 'lucide-react';

export default function CreateAnnouncementModal({ onClose }) {
  const { createAnnouncement } = useApp();
  const { currentUser } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'medium',
    category: 'Company Updates',
    pinned: false,
    expiryDate: ''
  });
  
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);

  const categories = ['Company Updates', 'HR', 'Holiday', 'Meeting', 'Event', 'Training', 'Emergency'];

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const newAttachments = files.map(f => ({ name: f.name, size: (f.size / 1024 / 1024).toFixed(2) + 'MB', type: f.type, raw: f }));
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeAttachment = (idx) => setAttachments(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;
    
    createAnnouncement({
      ...formData,
      postedBy: currentUser.id,
      attachments
    });
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)' }}>
      <div style={{ width: '100%', maxWidth: 700, background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', animation: 'scaleIn 0.2s ease' }}>
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Post Announcement</h2>
          <button className="btn btn-outline" style={{ padding: 8, border: 'none' }} onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 32, maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
          <div className="grid-responsive-2" style={{ gap: 24, marginBottom: 24 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>
                <FileText size={14} /> Title *
              </label>
              <input name="title" required value={formData.title} onChange={handleChange} className="input" placeholder="Announcement Title" style={{ width: '100%', padding: 12 }} />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>
                <FileText size={14} /> Content *
              </label>
              <textarea name="content" required value={formData.content} onChange={handleChange} className="input" placeholder="Detailed message..." style={{ width: '100%', padding: 12, minHeight: 120, resize: 'vertical' }} />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>
                <Tag size={14} /> Category
              </label>
              <select name="category" value={formData.category} onChange={handleChange} className="input select" style={{ width: '100%', padding: 12 }}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>
                <AlertCircle size={14} /> Priority
              </label>
              <select name="priority" value={formData.priority} onChange={handleChange} className="input select" style={{ width: '100%', padding: 12 }}>
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>
                <Calendar size={14} /> Expiry Date (Optional)
              </label>
              <input name="expiryDate" type="date" value={formData.expiryDate} onChange={handleChange} className="input" style={{ width: '100%', padding: 12 }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}>
                <input name="pinned" type="checkbox" checked={formData.pinned} onChange={handleChange} style={{ width: 18, height: 18 }} />
                Pin to top of Notice Board
              </label>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 24, marginTop: 24 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12 }}>
              Attachments
            </label>
            
            <input type="file" multiple ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
            <button type="button" className="btn btn-outline" onClick={() => fileInputRef.current?.click()} style={{ marginBottom: 16 }}>
              <ImageIcon size={16} style={{ marginRight: 8 }} /> Upload Files
            </button>
            
            {attachments.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {attachments.map((att, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#F8FAFC', padding: '12px 16px', borderRadius: 8 }}>
                    <FileText size={16} color="var(--text-muted)" />
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{att.name} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({att.size})</span></span>
                    <button type="button" onClick={() => removeAttachment(idx)} style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer' }}>
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32 }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={!formData.title || !formData.content}>Publish Announcement</button>
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
