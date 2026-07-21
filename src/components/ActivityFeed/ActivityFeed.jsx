import { useApp } from '../../context/AppContext';
import { mockUsers } from '../../data/mockData';
import { format, parseISO } from 'date-fns';
import { Clock, Briefcase, Calendar, CheckCircle, Bell } from 'lucide-react';

export default function ActivityFeed({ limit }) {
  const { activityFeed } = useApp();
  
  const displayFeed = limit ? activityFeed.slice(0, limit) : activityFeed;

  const getIcon = (type) => {
    switch (type) {
      case 'task': return <Briefcase size={14} color="#3B82F6" />;
      case 'leave': return <Calendar size={14} color="#10B981" />;
      case 'attendance': return <CheckCircle size={14} color="#7C3AED" />;
      default: return <Bell size={14} color="#F59E0B" />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div style={{ position: 'absolute', left: 24, top: 12, bottom: 12, width: 2, background: 'var(--border-color)' }} />
      
      {displayFeed.map((activity, idx) => {
        const user = mockUsers.find(u => u.id === activity.userId);
        
        return (
          <div key={activity.id} style={{ display: 'flex', gap: 16, padding: '12px 0', position: 'relative', zIndex: 1 }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{ width: 48, display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'white', border: '2px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', fontWeight: 600, fontSize: 13, zIndex: 2 }}>
                  {user?.name.charAt(0) || '?'}
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: -4, right: 4, width: 20, height: 20, borderRadius: '50%', background: 'white', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                {getIcon(activity.type)}
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, color: 'var(--text-primary)' }}>
                <span style={{ fontWeight: 600 }}>{user?.name || 'System'}</span> {activity.action}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                <Clock size={12} /> {format(parseISO(activity.timestamp), 'MMM d, h:mm a')}
              </div>
            </div>
          </div>
        );
      })}
      
      {displayFeed.length === 0 && (
        <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
          No recent activity.
        </div>
      )}
    </div>
  );
}
