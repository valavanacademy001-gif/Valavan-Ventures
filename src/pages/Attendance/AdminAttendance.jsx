import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { format, parseISO } from 'date-fns';
import { Download, Upload, Search, Calendar, Filter, Edit, Clock, CalendarIcon } from 'lucide-react';
import AttendanceImport from './components/AttendanceImport';
import { mockUsers, ROLES } from '../../data/mockData';
import AttendanceDetailsDrawer from './AttendanceDetailsDrawer';

const formatMins = (mins) => {
  if (!mins) return '0h 0m';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
};

export default function AdminAttendance() {
  const { attendance, employees, updateAttendance } = useApp();
  const [showImport, setShowImport] = useState(false);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const activeEmployees = employees.filter(e => ['active', 'wfh', 'on_leave', 'half_day'].includes(e.status));

  const filteredAttendance = useMemo(() => {
    // Build a unified list: one row per active employee for the selected date
    return activeEmployees
      .filter(emp => emp.name.toLowerCase().includes(search.toLowerCase()))
      .map(emp => {
        const record = attendance.find(a => a.date === dateFilter && a.userId === emp.id);
        return record
          ? { ...record, user: emp }
          : { id: null, userId: emp.id, date: dateFilter, user: emp, status: 'absent', checkIn: '', checkOut: '', workedMins: 0, lateMinutes: 0 };
      });
  }, [attendance, dateFilter, search, employees, activeEmployees]);

  const stats = useMemo(() => {
    const records = attendance.filter(a => a.date === dateFilter);
    return {
      present: records.filter(a => ['early', 'on_time', 'present', 'late', 'half_day', 'wfh'].includes(a.status)).length,
      late: records.filter(a => a.status === 'late').length,
      absent: records.filter(a => a.status === 'absent').length,
      leave: records.filter(a => ['sick', 'casual', 'earned', 'leave'].includes(a.status)).length,
      holiday: records.filter(a => a.status === 'sunday_holiday' || a.status === 'holiday').length
    };
  }, [attendance, dateFilter]);

  const handleStatusChange = (id, newStatus) => {
    updateAttendance(id, { status: newStatus });
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Admin Attendance</h1>
          <p>Manage and import biometric attendance</p>
        </div>
        <div className="page-header-actions">
          <div className="search-bar">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search employee..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-secondary">
            <Download size={15} /> Export
          </button>
          <button className="btn btn-primary" onClick={() => setShowImport(true)}>
            <Upload size={15} /> Import Biometric
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-grid stat-grid-5 mb-6">
        <div className="stat-card" style={{ '--stat-color': '#059669' }}>
          <div className="stat-icon" style={{ background: '#ECFDF5' }}>
            <CalendarIcon size={20} color="#059669" />
          </div>
          <div className="stat-body">
            <div className="stat-label">Present</div>
            <div className="stat-value">{stats.present}</div>
          </div>
        </div>
        <div className="stat-card" style={{ '--stat-color': '#D97706' }}>
          <div className="stat-icon" style={{ background: '#FFFBEB' }}>
            <Clock size={20} color="#D97706" />
          </div>
          <div className="stat-body">
            <div className="stat-label">Late</div>
            <div className="stat-value">{stats.late}</div>
          </div>
        </div>
        <div className="stat-card" style={{ '--stat-color': '#DC2626' }}>
          <div className="stat-icon" style={{ background: '#FEF2F2' }}>
            <Calendar size={20} color="#DC2626" />
          </div>
          <div className="stat-body">
            <div className="stat-label">Absent</div>
            <div className="stat-value">{stats.absent}</div>
          </div>
        </div>
        <div className="stat-card" style={{ '--stat-color': '#7C3AED' }}>
          <div className="stat-icon" style={{ background: '#F5F3FF' }}>
            <Filter size={20} color="#7C3AED" />
          </div>
          <div className="stat-body">
            <div className="stat-label">On Leave</div>
            <div className="stat-value">{stats.leave}</div>
          </div>
        </div>
        <div className="stat-card" style={{ '--stat-color': '#64748B' }}>
          <div className="stat-icon" style={{ background: '#F1F5F9' }}>
            <CalendarIcon size={20} color="#64748B" />
          </div>
          <div className="stat-body">
            <div className="stat-label">Holiday</div>
            <div className="stat-value">{stats.holiday}</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="card-header" style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
          <div className="card-title">Attendance Records</div>
          <div>
            <input 
              type="date" 
              className="input" 
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              style={{ width: 'auto' }}
            />
          </div>
        </div>
        
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>IN Time</th>
                <th>OUT Time</th>
                <th>Work Hours</th>
                <th>Late (Mins)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.map(record => (
                <tr key={record.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar avatar-sm" style={{ background: 'var(--primary-color)' }}>
                        {record.user?.name?.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{record.user?.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{record.user?.employeeId}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{record.checkIn || '--:--'}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{record.checkOut || '--:--'}</div>
                  </td>
                  <td>{formatMins(record.workedMins)}</td>
                  <td>
                    {record.lateMinutes > 0 ? (
                      <span style={{ color: 'var(--danger)', fontWeight: 600 }}>{record.lateMinutes}</span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>-</span>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${record.status === 'present' || record.status === 'early' || record.status === 'on_time' ? 'badge-success' : record.status === 'late' || record.status === 'half_day' ? 'badge-warning' : 'badge-danger'}`} style={{ textTransform: 'capitalize' }}>
                      {record.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <button className="icon-btn" onClick={() => setSelectedRecord(record)}>
                      <Edit size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredAttendance.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
                    No attendance records found for this date.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showImport && (
        <AttendanceImport onClose={() => setShowImport(false)} />
      )}

      {selectedRecord && (
        <AttendanceDetailsDrawer 
          isAdmin={true}
          data={{ user: selectedRecord.user, record: selectedRecord }} 
          onClose={() => setSelectedRecord(null)} 
        />
      )}
    </div>
  );
}
