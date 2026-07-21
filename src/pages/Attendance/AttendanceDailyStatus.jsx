import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mockUsers } from '../../data/mockData';
import { Search, Filter, MoreVertical, Edit2 } from 'lucide-react';
import AttendanceDetailsDrawer from './AttendanceDetailsDrawer';

const STATUS_BADGE = {
  early: { cls: 'badge-success', label: 'Early' },
  on_time: { cls: 'badge-success', label: 'On Time' },
  present: { cls: 'badge-success', label: 'Present' },
  late: { cls: 'badge-warning', label: 'Late' },
  absent: { cls: 'badge-danger', label: 'Absent' },
  leave: { cls: 'badge-purple', label: 'Leave' },
  on_leave: { cls: 'badge-purple', label: 'Leave' },
  half_day: { cls: 'badge-warning', label: 'Half Day' },
  wfh: { cls: 'badge-primary', label: 'Work From Home' },
  holiday: { cls: 'badge-secondary', label: 'Holiday' },
};

export default function AttendanceDailyStatus() {
  const { attendance } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  // Map users to their today's record
  const data = mockUsers.map(user => {
    const record = attendance.find(a => a.userId === user.id && a.date === today) || {
      status: 'absent',
      checkIn: null,
      checkOut: null,
      workingHours: 0,
      userId: user.id,
      date: today,
    };
    return { user, record };
  });

  const filteredData = data.filter(({ user, record }) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept ? user.department === filterDept : true;
    const matchesStatus = filterStatus ? record.status === filterStatus : true;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const uniqueDepts = [...new Set(mockUsers.map(u => u.department))];

  return (
    <div className="card">
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div className="card-title">Today's Status</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div className="search-box" style={{ width: 240 }}>
            <Search size={16} />
            <input type="text" placeholder="Search employee..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="search-box" style={{ width: 180 }}>
            <Filter size={16} />
            <select value={filterDept} onChange={e => setFilterDept(e.target.value)} style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', fontSize: 13, color: 'var(--text-primary)' }}>
              <option value="">All Departments</option>
              {uniqueDepts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="search-box" style={{ width: 160 }}>
            <Filter size={16} />
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', fontSize: 13, color: 'var(--text-primary)' }}>
              <option value="">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="half_day">Half Day</option>
              <option value="wfh">Work From Home</option>
              <option value="on_leave">Leave</option>
            </select>
          </div>
        </div>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Profile</th>
              <th>Department / Role</th>
              <th>Status</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Working Hours</th>
              <th style={{ width: 60 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(({ user, record }) => {
              const status = STATUS_BADGE[record.status] || STATUS_BADGE.absent;
              return (
                <tr key={user.id} className="table-row-hover">
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="avatar" style={{ background: '#2563EB', color: 'white', fontSize: 13, width: 36, height: 36 }}>
                        {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user.employeeId}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{user.department}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user.designation}</div>
                  </td>
                  <td>
                    <span className={`badge ${status.cls}`}>{status.label}</span>
                  </td>
                  <td>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{record.checkIn || '—'}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{record.checkOut || '—'}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: 14, fontWeight: 700, color: record.workingHours >= 8 ? '#059669' : (record.workingHours > 0 ? '#D97706' : 'var(--text-muted)') }}>
                      {record.workingHours > 0 ? `${record.workingHours.toFixed(2)}h` : '—'}
                    </div>
                  </td>
                  <td>
                    <button className="icon-btn" onClick={() => setSelectedRecord({ user, record })}>
                      <Edit2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                  No records found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedRecord && (
        <AttendanceDetailsDrawer 
          data={selectedRecord} 
          onClose={() => setSelectedRecord(null)} 
          isAdmin={true} 
        />
      )}
    </div>
  );
}
