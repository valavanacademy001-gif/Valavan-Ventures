import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Bell, CheckSquare, Calendar, DollarSign, Megaphone, X, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const ICONS = {
  task_assigned: { icon: CheckSquare, color: '#2563EB', bg: '#EFF6FF' },
  task_approved: { icon: CheckSquare, color: '#059669', bg: '#ECFDF5' },
  task_rejected: { icon: AlertCircle, color: '#DC2626', bg: '#FEF2F2' },
  task_submitted: { icon: CheckSquare, color: '#7C3AED', bg: '#F5F3FF' },
  changes_needed: { icon: AlertCircle, color: '#D97706', bg: '#FFFBEB' },
  leave_approved: { icon: Calendar, color: '#059669', bg: '#ECFDF5' },
  leave_rejected: { icon: Calendar, color: '#DC2626', bg: '#FEF2F2' },
  leave_request: { icon: Calendar, color: '#D97706', bg: '#FFFBEB' },
  payslip: { icon: DollarSign, color: '#2563EB', bg: '#EFF6FF' },
  announcement: { icon: Megaphone, color: '#7C3AED', bg: '#F5F3FF' },
};

export default function NotificationPanel({ onClose }) {
  const { notifications, markNotificationRead, markAllRead } = useApp();
  const { currentUser } = useAuth();

  const myNotifs = notifications.filter(n => n.userId === currentUser?.id);
  const unread = myNotifs.filter(n => !n.read).length;

  return (
    <div className="notif-panel animate-slideDown">
      <div className="notif-panel-header">
        <div>
          <div style={{fontWeight:700,fontSize:14,color:'var(--text-primary)'}}>Notifications</div>
          {unread > 0 && <div style={{fontSize:12,color:'var(--text-muted)'}}>{unread} unread</div>}
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          {unread > 0 && (
            <button className="btn btn-ghost btn-sm" onClick={() => markAllRead(currentUser.id)}>Mark all read</button>
          )}
          <button className="icon-btn" onClick={onClose}><X size={14} /></button>
        </div>
      </div>

      <div className="notif-list">
        {myNotifs.length === 0 ? (
          <div className="empty-state" style={{padding:'32px 16px'}}>
            <div className="empty-icon"><Bell size={24} color="var(--text-muted)" /></div>
            <p>No notifications yet</p>
          </div>
        ) : (
          myNotifs.map(notif => {
            const { icon: Icon, color, bg } = ICONS[notif.type] || { icon: Bell, color: '#2563EB', bg: '#EFF6FF' };
            return (
              <div
                key={notif.id}
                className={`notif-item ${!notif.read ? 'unread' : ''}`}
                onClick={() => markNotificationRead(notif.id)}
              >
                <div className="notif-icon" style={{background:bg}}>
                  <Icon size={16} color={color} />
                </div>
                <div className="notif-content">
                  <div className="notif-title">{notif.title}</div>
                  <div className="notif-msg">{notif.message}</div>
                  <div className="notif-time">
                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                  </div>
                </div>
                {!notif.read && (
                  <div style={{width:8,height:8,borderRadius:'50%',background:'var(--primary)',flexShrink:0,marginTop:6}} />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
