import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Bell, CheckSquare, Calendar, DollarSign, Megaphone, AlertCircle, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const TYPE_CONFIG = {
  task_assigned: { icon: CheckSquare, color: '#2563EB', bg: '#EFF6FF', label: 'Task' },
  task_approved: { icon: CheckSquare, color: '#059669', bg: '#ECFDF5', label: 'Task' },
  task_rejected: { icon: AlertCircle, color: '#DC2626', bg: '#FEF2F2', label: 'Task' },
  task_submitted: { icon: CheckSquare, color: '#7C3AED', bg: '#F5F3FF', label: 'Task' },
  changes_needed: { icon: AlertCircle, color: '#D97706', bg: '#FFFBEB', label: 'Task' },
  leave_approved: { icon: Calendar, color: '#059669', bg: '#ECFDF5', label: 'Leave' },
  leave_rejected: { icon: Calendar, color: '#DC2626', bg: '#FEF2F2', label: 'Leave' },
  leave_request: { icon: Calendar, color: '#D97706', bg: '#FFFBEB', label: 'Leave' },
  payslip: { icon: DollarSign, color: '#2563EB', bg: '#EFF6FF', label: 'Payslip' },
  announcement: { icon: Megaphone, color: '#7C3AED', bg: '#F5F3FF', label: 'Announcement' },
};

export default function Notifications() {
  const { notifications, markNotificationRead, markAllRead } = useApp();
  const { currentUser } = useAuth();

  const myNotifs = notifications.filter(n => n.userId === currentUser?.id);
  const unread = myNotifs.filter(n => !n.read).length;

  const grouped = myNotifs.reduce((acc, n) => {
    const date = n.createdAt.split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(n);
    return acc;
  }, {});

  const formatGroupDate = (dateStr) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (dateStr === today) return 'Today';
    if (dateStr === yesterday) return 'Yesterday';
    return new Date(dateStr).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Notifications</h1>
          <p>{unread} unread notification{unread !== 1 ? 's' : ''}</p>
        </div>
        <div className="page-header-actions">
          {unread > 0 && (
            <button className="btn btn-secondary" onClick={() => markAllRead(currentUser.id)}>
              <Check size={14} /> Mark all as read
            </button>
          )}
        </div>
      </div>

      {myNotifs.length === 0 ? (
        <div className="empty-state card" style={{ padding: '80px' }}>
          <div className="empty-icon"><Bell size={36} color="var(--text-muted)" /></div>
          <h3>No notifications yet</h3>
          <p>You're all caught up! Notifications will appear here when something needs your attention.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {Object.entries(grouped)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([date, notifs]) => (
              <div key={date}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                  {formatGroupDate(date)}
                </div>
                <div className="card" style={{ overflow: 'hidden' }}>
                  {notifs.map((notif, i) => {
                    const { icon: Icon, color, bg, label } = TYPE_CONFIG[notif.type] || { icon: Bell, color: '#2563EB', bg: '#EFF6FF', label: 'General' };
                    return (
                      <div
                        key={notif.id}
                        style={{
                          display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 20px',
                          borderBottom: i < notifs.length - 1 ? '1px solid var(--border)' : 'none',
                          background: !notif.read ? 'var(--primary-light)' : 'transparent',
                          cursor: 'pointer', transition: 'background 0.2s',
                        }}
                        onClick={() => markNotificationRead(notif.id)}
                        onMouseEnter={e => !notif.read ? null : e.currentTarget.style.background = 'var(--bg-hover)'}
                        onMouseLeave={e => !notif.read ? null : e.currentTarget.style.background = ''}
                      >
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon size={18} color={color} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                                <span style={{ fontSize: 14, fontWeight: !notif.read ? 700 : 600, color: 'var(--text-primary)' }}>{notif.title}</span>
                                <span className="badge badge-gray" style={{ fontSize: 10 }}>{label}</span>
                              </div>
                              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{notif.message}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                              <span style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                              </span>
                              {!notif.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
