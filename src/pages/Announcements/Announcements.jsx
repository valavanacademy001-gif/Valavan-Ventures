import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { mockUsers, ROLES } from '../../data/mockData';
import { format, parseISO, isPast } from 'date-fns';
import { Bell, Search, Plus, Pin, AlertCircle, FileText, Download, Calendar } from 'lucide-react';
import CreateAnnouncementModal from './CreateAnnouncementModal';

export default function Announcements() {
  const { announcements, deleteAnnouncement } = useApp();
  const { currentUser } = useAuth();
  const isAdmin = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR].includes(currentUser?.role);
  
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showCreate, setShowCreate] = useState(false);

  const categories = ['All', ...new Set(announcements.map(a => a.category).filter(Boolean))];

  const filteredAnnouncements = announcements
    .filter(a => (categoryFilter === 'All' || a.category === categoryFilter))
    .filter(a => a.title.toLowerCase().includes(search.toLowerCase()) || a.content.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.postedAt) - new Date(a.postedAt);
    });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      default: return '#3B82F6';
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Notice Board</h1>
          <p>Company-wide announcements and updates</p>
        </div>
        <div className="page-header-right">
          <div className="search-bar">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search announcements..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {isAdmin && (
            <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
              <Plus size={18} /> Create Announcement
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', paddingBottom: 8 }}>
        {categories.map(cat => (
          <button
            key={cat}
            className={`btn ${categoryFilter === cat ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: 20, padding: '6px 16px', fontSize: 13, border: categoryFilter === cat ? 'none' : '1px solid var(--border-color)' }}
            onClick={() => setCategoryFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gap: 24 }}>
        {filteredAnnouncements.map(ann => {
          const author = mockUsers.find(u => u.id === ann.postedBy);
          const isExpired = ann.expiryDate && isPast(parseISO(ann.expiryDate));
          
          return (
            <div key={ann.id} className="card" style={{ padding: 0, overflow: 'hidden', opacity: isExpired ? 0.6 : 1, position: 'relative' }}>
              {ann.pinned && (
                <div style={{ position: 'absolute', top: 16, right: 16, color: '#F59E0B' }}>
                  <Pin size={20} fill="#F59E0B" />
                </div>
              )}
              
              <div style={{ padding: '24px 32px' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
                  <span className="badge" style={{ background: `${getPriorityColor(ann.priority)}15`, color: getPriorityColor(ann.priority), fontWeight: 600 }}>
                    {ann.priority.toUpperCase()} PRIORITY
                  </span>
                  {ann.category && (
                    <span className="badge" style={{ background: '#F1F5F9', color: '#475569' }}>
                      {ann.category}
                    </span>
                  )}
                  {isExpired && (
                    <span className="badge" style={{ background: '#FEE2E2', color: '#DC2626' }}>
                      EXPIRED
                    </span>
                  )}
                </div>

                <h2 style={{ margin: '0 0 16px 0', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', paddingRight: 40 }}>
                  {ann.title}
                </h2>
                
                <p style={{ margin: '0 0 24px 0', fontSize: 15, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                  {ann.content}
                </p>

                {ann.attachments?.length > 0 && (
                  <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
                    {ann.attachments.map((att, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', background: '#F8FAFC', borderRadius: 8, border: '1px solid var(--border-color)' }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FileText size={16} color="var(--text-muted)" />
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{att.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{att.size}</div>
                        </div>
                        <button className="btn-icon" style={{ marginLeft: 8 }}><Download size={16} /></button>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: 16, marginTop: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="avatar avatar-sm" style={{ background: 'var(--primary-color)' }}>
                      {author?.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{author?.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{author?.designation}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Calendar size={14} /> Posted {format(parseISO(ann.postedAt), 'MMM d, yyyy')}
                    </div>
                    {isAdmin && (
                      <button onClick={() => deleteAnnouncement(ann.id)} style={{ color: '#EF4444', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filteredAnnouncements.length === 0 && (
          <div className="card" style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
            <Bell size={48} style={{ opacity: 0.2, margin: '0 auto 16px' }} />
            <h3>No announcements found</h3>
            <p>Try adjusting your search or category filters.</p>
          </div>
        )}
      </div>

      {showCreate && <CreateAnnouncementModal onClose={() => setShowCreate(false)} />}

      <style>{`
        .btn-icon {
          background: transparent;
          border: none;
          color: var(--text-muted);
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-icon:hover {
          background: #E2E8F0;
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
}
