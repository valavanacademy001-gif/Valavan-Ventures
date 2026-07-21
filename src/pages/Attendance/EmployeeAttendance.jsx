import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, CalendarIcon } from 'lucide-react';
import AttendanceDetailsDrawer from './AttendanceDetailsDrawer';

const STATUS_COLORS = {
  early: { bg: '#ECFDF5', text: '#059669', label: 'Early' },
  on_time: { bg: '#EFF6FF', text: '#2563EB', label: 'On Time' },
  late: { bg: '#FFFBEB', text: '#D97706', label: 'Late' },
  absent: { bg: '#FEF2F2', text: '#DC2626', label: 'Absent' },
  leave: { bg: '#F5F3FF', text: '#7C3AED', label: 'Leave' },
  sick: { bg: '#F5F3FF', text: '#7C3AED', label: 'Sick' },
  casual: { bg: '#F5F3FF', text: '#7C3AED', label: 'Casual' },
  earned: { bg: '#F5F3FF', text: '#7C3AED', label: 'Earned' },
  half_day: { bg: '#FFEDD5', text: '#EA580C', label: 'Half Day' },
  wfh: { bg: '#EFF6FF', text: '#2563EB', label: 'WFH' },
  holiday: { bg: '#F1F5F9', text: '#475569', label: 'Holiday' },
  sunday_holiday: { bg: '#F1F5F9', text: '#475569', label: 'Weekly Off' },
};

const formatMins = (mins) => {
  if (!mins) return '0h 0m';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
};

export default function EmployeeAttendance() {
  const { attendance, holidays } = useApp();
  const { currentUser } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDayRecord, setSelectedDayRecord] = useState(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startPad = monthStart.getDay();
  const allCells = [...Array(startPad).fill(null), ...days];

  const getMyAttendance = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const record = attendance.find(a => a.userId === currentUser?.id && a.date === dateStr);
    
    // Check holidays if no explicit record found
    if (!record) {
      const holiday = holidays.find(h => {
        if (h.date === dateStr) return true;
        // check recurring
        if (h.recurring && h.date.substring(5) === dateStr.substring(5)) return true;
        return false;
      });
      if (holiday) {
        return { date: dateStr, status: 'holiday', remarks: holiday.name };
      }
      
      // If Sunday and no record, mark as sunday_holiday
      if (date.getDay() === 0) {
          return { date: dateStr, status: 'sunday_holiday', remarks: 'Weekly Off' };
      }
    }
    
    return record;
  };

  const myMonthRecords = useMemo(() => {
    return attendance.filter(a => a.userId === currentUser?.id && a.date.startsWith(format(currentMonth, 'yyyy-MM')));
  }, [attendance, currentUser, currentMonth]);
  
  const stats = useMemo(() => {
    let presentCount = 0;
    let lateCount = 0;
    let absentCount = 0;
    let totalWorkingHours = 0;
    
    // Evaluate every day up to today (or end of month if in past)
    const today = new Date();
    const limitDate = currentMonth.getMonth() === today.getMonth() && currentMonth.getFullYear() === today.getFullYear() 
        ? today : monthEnd;

    days.forEach(day => {
        if (day > limitDate) return;
        const record = getMyAttendance(day);
        if (!record || record.status === 'absent') absentCount++;
        else if (['early', 'on_time', 'wfh', 'half_day'].includes(record.status)) presentCount++;
        else if (record.status === 'late') { presentCount++; lateCount++; }
        
        if (record && record.workedMins) totalWorkingHours += record.workedMins;
    });

    return { presentCount, lateCount, absentCount, totalWorkingHours: formatMins(totalWorkingHours) };
  }, [days, currentMonth, monthEnd, getMyAttendance]);

  const handleDayClick = (day) => {
    const record = getMyAttendance(day);
    setSelectedDayRecord({
      user: currentUser,
      record: record || { date: format(day, 'yyyy-MM-dd'), status: 'absent', checkIn: null, checkOut: null, workingHours: 0 }
    });
  };

  return (
    <div>
      <div className="page-header" style={{ marginBottom: 32 }}>
        <div className="page-header-left">
          <h1>My Attendance</h1>
          <p>View your monthly attendance records</p>
        </div>
      </div>

      <div className="grid-3 mb-6">
        <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CalendarIcon size={20} color="var(--primary)" />
                </div>
                <div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Present Days</div>
                    <div style={{ fontSize: 24, fontWeight: 700 }}>{stats.presentCount}</div>
                </div>
            </div>
        </div>
        <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Clock size={20} color="#D97706" />
                </div>
                <div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Late Marks</div>
                    <div style={{ fontSize: 24, fontWeight: 700 }}>{stats.lateCount}</div>
                </div>
            </div>
        </div>
        <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Clock size={20} color="#475569" />
                </div>
                <div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Work Hours</div>
                    <div style={{ fontSize: 24, fontWeight: 700 }}>{stats.totalWorkingHours}h</div>
                </div>
            </div>
        </div>
      </div>

      {/* Calendar View */}
      <div className="card" style={{ padding: 0 }}>
        <div className="card-header" style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="card-title">Attendance Calendar</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button className="icon-btn" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}><ChevronLeft size={20} /></button>
            <span style={{ fontWeight: 600, fontSize: 15, minWidth: 140, textAlign: 'center' }}>{format(currentMonth, 'MMMM yyyy')}</span>
            <button className="icon-btn" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}><ChevronRight size={20} /></button>
          </div>
        </div>

        <div className="calendar-scroll-wrapper" style={{ paddingBottom: 24 }}>
          <div className="calendar-scroll-inner">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginBottom: 8 }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', padding: '10px 0' }}>{d}</div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
            {allCells.map((day, idx) => {
              if (!day) return <div key={`empty-${idx}`} className="calendar-cell empty" />;
              
              const record = getMyAttendance(day);
              let statusObj = null;
              
              if (record) {
                statusObj = STATUS_COLORS[record.status] || STATUS_COLORS.absent;
              } else if (day > new Date()) {
                // Future date
                statusObj = null;
              } else {
                statusObj = STATUS_COLORS.absent;
              }

              return (
                <div 
                  key={day.toISOString()} 
                  className={`calendar-cell ${isSameMonth(day, currentMonth) ? '' : 'other-month'}`}
                  onClick={() => handleDayClick(day)}
                  style={{
                    padding: 12, border: '1px solid var(--border)', borderRadius: 12, minHeight: 90,
                    cursor: 'pointer', transition: 'all 0.2s', background: statusObj ? statusObj.bg : 'var(--bg-card)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-muted)' }}>{format(day, 'MMM d')}</span>
                    {statusObj && (
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 12, background: 'rgba(255,255,255,0.5)', color: statusObj.text, border: `1px solid ${statusObj.text}40` }}>
                        {statusObj.label}
                      </span>
                    )}
                  </div>
                  
                  {record?.checkIn ? (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: '8px 0' }}>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>IN</div>
                          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>{record.checkIn}</div>
                        </div>
                        <div style={{ width: 1, height: 24, background: 'var(--border)' }} />
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>OUT</div>
                          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>{record.checkOut || '--:--'}</div>
                        </div>
                      </div>
                      
                      <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                          Worked: {formatMins(record.workedMins)}
                        </div>
                        {record.lateMinutes > 0 && (
                          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--danger)' }}>
                            Late by {record.lateMinutes}m
                          </div>
                        )}
                        {record.overtimeMins > 0 && (
                          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--primary)' }}>
                            Overtime: {formatMins(record.overtimeMins)}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: statusObj ? statusObj.text : 'var(--text-muted)' }}>
                        {statusObj ? statusObj.label : 'No Data'}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        </div>
      </div>

      {selectedDayRecord && (
        <AttendanceDetailsDrawer 
          isOpen={!!selectedDayRecord} 
          onClose={() => setSelectedDayRecord(null)}
          data={selectedDayRecord}
        />
      )}
    </div>
  );
}
