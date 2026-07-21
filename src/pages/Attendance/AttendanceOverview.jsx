import { useApp } from '../../context/AppContext';
import { Users, UserCheck, UserX, Clock, UserMinus, Calendar, Sun, Clock8, Percent } from 'lucide-react';
import { mockUsers } from '../../data/mockData';

export default function AttendanceOverview() {
  const { attendance } = useApp();
  const today = new Date().toISOString().split('T')[0];
  const todayRecords = attendance.filter(a => a.date === today);

  const stats = {
    present: todayRecords.filter(a => ['early', 'on_time', 'present'].includes(a.status)).length,
    absent: mockUsers.length - todayRecords.length + todayRecords.filter(a => a.status === 'absent').length,
    late: todayRecords.filter(a => a.status === 'late').length,
    onLeave: todayRecords.filter(a => a.status === 'on_leave' || a.status === 'leave').length,
    halfDay: todayRecords.filter(a => a.status === 'half_day').length,
    wfh: todayRecords.filter(a => a.status === 'wfh').length,
  };

  const attendancePercent = Math.round(((stats.present + stats.wfh + stats.halfDay + stats.late) / mockUsers.length) * 100) || 0;

  // Calculate average check-in
  let totalMins = 0;
  let checkInCount = 0;
  todayRecords.forEach(a => {
    if (a.checkIn) {
      const [h, m] = a.checkIn.split(':').map(Number);
      totalMins += h * 60 + m;
      checkInCount++;
    }
  });
  const avgCheckIn = checkInCount > 0 ? 
    `${String(Math.floor(totalMins / checkInCount / 60)).padStart(2, '0')}:${String(Math.floor((totalMins / checkInCount) % 60)).padStart(2, '0')}` 
    : '—';

  // Calculate avg hours
  const totalHours = todayRecords.reduce((s, a) => s + (a.workingHours || 0), 0);
  const avgHours = checkInCount > 0 ? (totalHours / checkInCount).toFixed(1) : '—';

  const STAT_CARDS = [
    { label: 'Present Today', value: stats.present, icon: UserCheck, color: '#059669', bg: '#ECFDF5' },
    { label: 'Absent Today', value: stats.absent, icon: UserX, color: '#DC2626', bg: '#FEF2F2' },
    { label: 'Late Today', value: stats.late, icon: Clock, color: '#D97706', bg: '#FFFBEB' },
    { label: 'On Leave', value: stats.onLeave, icon: UserMinus, color: '#7C3AED', bg: '#F5F3FF' },
    { label: 'Half Day', value: stats.halfDay, icon: Sun, color: '#EA580C', bg: '#FFEDD5' },
    { label: 'Work From Home', value: stats.wfh, icon: Calendar, color: '#2563EB', bg: '#EFF6FF' },
    { label: 'Avg Check-in', value: avgCheckIn, icon: Clock8, color: '#475569', bg: '#F1F5F9' },
    { label: 'Avg Working Hours', value: avgHours !== '—' ? `${avgHours}h` : '—', icon: Clock8, color: '#475569', bg: '#F1F5F9' },
    { label: 'Attendance %', value: `${attendancePercent}%`, icon: Percent, color: '#0891B2', bg: '#ECFEFF' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))', gap: 16 }}>
      {STAT_CARDS.map(s => (
        <div key={s.label} className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <s.icon size={24} color={s.color} />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>{s.value}</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
