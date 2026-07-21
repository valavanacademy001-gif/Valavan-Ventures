import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { format, parseISO } from 'date-fns';
import { Check, CheckCircle2, MessageSquare, Briefcase, Calendar as CalendarIcon, FileText, Settings, Trash2 } from 'lucide-react';

export default function NotificationCenter() {
  const { notifications, markNotificationRead, markAllRead } = useApp();
  const { currentUser } = useAuth();
  
  const [filter, setFilter] = useState('all');

  const myNotifications = notifications.filter(n => n.userId === currentUser?.id);
  
  const filteredNotifications = myNotifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'tasks') return n.type.includes('task') || n.type === 'changes_needed';
    if (filter === 'hr') return n.type.includes('leave') || n.type === 'payslip';
    if (filter === 'announcements') return n.type === 'announcement';
    return true;
  });

  const unreadCount = myNotifications.filter(n => !n.read).length;

  const getIcon = (type) => {
    if (type.includes('task') || type === 'changes_needed') return <Briefcase size={16} color="#3B82F6" />;
    if (type.includes('leave')) return <CalendarIcon size={16} color="#10B981" />;
    if (type === 'payslip') return <FileText size={16} color="#F59E0B" />;
    if (type === 'announcement') return <MessageSquare size={16} color="#7C3AED" />;
    return <CheckCircle2 size={16} color="var(--text-muted)" />;
  };

  return (
    <div>
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div className="page-header-left">
          <h1>Notifications</h1>
          <p>You have {unreadCount} unread messages</p>
        </div>
        <div className="page-header-right">
          <button className="btn btn-outline" onClick={() => markAllRead(currentUser?.id)} disabled={unreadCount === 0}>
            <Check size={16} /> Mark all as read
          </button>
          <button className="btn btn-outline">
            <Settings size={16} /> Settings
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[
          { id: 'all', label: 'All' },
          { id: 'unread', label: 'Unread' },
          { id: 'tasks', label: 'Tasks' },
          { id: 'hr', label: 'HR & Leaves' },
          { id: 'announcements', label: 'Announcements' }
        ].map(f => (
          <button
            key={f.id}
            className={`btn ${filter === f.id ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: 20, padding: '6px 16px', fontSize: 13, border: filter === f.id ? 'none' : '1px solid var(--border-color)' }}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {filteredNotifications.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filteredNotifications.map((notif, idx) => (
              <div 
                key={notif.id}
                style={{ 
                  padding: '20px 24px',
                  display: 'flex',
                  gap: 16,
                  alignItems: 'flex-start',
                  borderBottom: idx === filteredNotifications.length - 1 ? 'none' : '1px solid var(--border-color)',
                  background: notif.read ? 'white' : '#F8FAFC',
                  transition: 'background 0.2s',
                  position: 'relative'
                }}
              >
                {!notif.read && (
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: 'var(--primary-color)' }} />
                )}
                
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'white', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {getIcon(notif.type)}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <h4 style={{ margin: 0, fontSize: 15, fontWeight: notif.read ? 600 : 700, color: 'var(--text-primary)' }}>
                      {notif.title}
                    </h4>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {format(parseISO(notif.createdAt), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 12px 0', fontSize: 14, color: 'var(--text-secondary)' }}>
                    {notif.message}
                  </p>
                  <div style={{ display: 'flex', gap: 12 }}>
                    {notif.link && (
                      <a href={notif.link} style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary-color)', textDecoration: 'none' }}>
                        View Details
                      </a>
                    )}
                    {!notif.read && (
                      <button onClick={() => markNotificationRead(notif.id)} style={{ background: 'transparent', border: 'none', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', cursor: 'pointer' }}>
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: 64, textAlign: 'center', color: 'var(--text-muted)' }}>
            <CheckCircle2 size={48} style={{ opacity: 0.2, margin: '0 auto 16px' }} />
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>All caught up!</h3>
            <p style={{ margin: 0 }}>You don't have any notifications right now.</p>
          </div>
        )}
      </div>
    </div>
  );
}
