import { useApp } from '../../context/AppContext';
import { mockUsers } from '../../data/mockData';
import { LogIn, Clock, CalendarCheck } from 'lucide-react';

export default function AttendanceTimeline() {
  const { timeline } = useApp();
  
  // Sort newest first
  const sortedTimeline = [...timeline].sort((a, b) => b.time.localeCompare(a.time));

  return (
    <div className="card" style={{ maxWidth: 600, margin: '0 auto' }}>
      <div className="card-header">
        <div className="card-title">Live Check-in Timeline</div>
      </div>
      <div className="card-body">
        {sortedTimeline.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
            <Clock size={40} style={{ opacity: 0.2, margin: '0 auto 16px' }} />
            <div>No activity today</div>
          </div>
        ) : (
          <div style={{ position: 'relative', paddingLeft: 24 }}>
            {/* Timeline Line */}
            <div style={{ position: 'absolute', top: 12, bottom: 12, left: 7, width: 2, background: 'var(--border)', borderRadius: 2 }} />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {sortedTimeline.map((item, index) => {
                const user = mockUsers.find(u => u.id === item.userId);
                if (!user) return null;
                
                return (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, position: 'relative' }}>
                    {/* Timeline Node */}
                    <div style={{ position: 'absolute', left: -24, top: 4, width: 16, height: 16, borderRadius: '50%', background: 'var(--card-bg)', border: '2px solid #059669', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669' }} />
                    </div>

                    <div style={{ display: 'flex', gap: 12, flex: 1, padding: 12, background: 'var(--bg-hover)', borderRadius: 12 }}>
                      <div className="avatar" style={{ background: '#2563EB', color: 'white' }}>
                        {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</span>
                          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>{item.time}</span>
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                          {item.action === 'Checked In' ? <LogIn size={13} color="#059669" /> : <CalendarCheck size={13} color="#2563EB" />}
                          {item.action}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
