import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { ROLES, mockUsers } from '../../data/mockData';
import { format, parseISO, differenceInCalendarDays } from 'date-fns';
import { Plus, X, Check, Calendar, Loader2, Clock } from 'lucide-react';

const LEAVE_TYPES = ['sick', 'casual', 'earned', 'comp_off', 'loss_of_pay', 'emergency'];
const LEAVE_COLORS = {
  sick: { bg: '#FEF2F2', color: '#DC2626', label: 'Sick Leave' },
  casual: { bg: '#EFF6FF', color: '#2563EB', label: 'Casual Leave' },
  earned: { bg: '#ECFDF5', color: '#059669', label: 'Earned Leave' },
  comp_off: { bg: '#F5F3FF', color: '#7C3AED', label: 'Comp Off' },
  loss_of_pay: { bg: '#FEF2F2', color: '#DC2626', label: 'Loss of Pay' },
  emergency: { bg: '#FFFBEB', color: '#D97706', label: 'Emergency Leave' },
};

const STATUS_BADGE = {
  pending: { cls: 'badge-warning', label: 'Pending' },
  approved: { cls: 'badge-success', label: 'Approved' },
  rejected: { cls: 'badge-danger', label: 'Rejected' },
};

function ApplyLeaveModal({ onClose }) {
  const { applyLeave } = useApp();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ type: 'casual', fromDate: '', toDate: '', reason: '' });

  const days = form.fromDate && form.toDate
    ? Math.max(1, differenceInCalendarDays(parseISO(form.toDate), parseISO(form.fromDate)) + 1)
    : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    applyLeave({ ...form, userId: currentUser.id, days });
    setLoading(false);
    onClose();
  };

  return (
    <div className="modal-overlay animate-fadeIn" onClick={onClose}>
      <div className="modal modal-md animate-scaleIn" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Apply for Leave</div>
            <div className="modal-subtitle">Submit your leave request for approval</div>
          </div>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Leave Type *</label>
              <select className="input select" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                {LEAVE_TYPES.map(t => <option key={t} value={t}>{LEAVE_COLORS[t]?.label || t}</option>)}
              </select>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">From Date *</label>
                <input className="input" type="date" value={form.fromDate} onChange={e => setForm(f => ({ ...f, fromDate: e.target.value }))} required min={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="form-group">
                <label className="form-label">To Date *</label>
                <input className="input" type="date" value={form.toDate} onChange={e => setForm(f => ({ ...f, toDate: e.target.value }))} required min={form.fromDate || new Date().toISOString().split('T')[0]} />
              </div>
            </div>
            {days > 0 && (
              <div style={{ background: 'var(--primary-light)', border: '1px solid var(--primary-mid)', borderRadius: 8, padding: '10px 14px', fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>
                📅 {days} working day{days > 1 ? 's' : ''}
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Reason *</label>
              <textarea className="input" placeholder="Please provide a brief reason..." value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} required rows={3} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Leaves() {
  const { leaves, approveLeave, rejectLeave } = useApp();
  const { currentUser } = useAuth();
  const [showApply, setShowApply] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const isAdmin = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR, ROLES.MANAGER].includes(currentUser?.role);
  const myLeaves = isAdmin ? leaves : leaves.filter(l => l.userId === currentUser?.id);
  const pendingLeaves = leaves.filter(l => l.status === 'pending');

  const filtered = activeTab === 'pending' ? myLeaves.filter(l => l.status === 'pending')
    : activeTab === 'approved' ? myLeaves.filter(l => l.status === 'approved')
    : myLeaves;

  // Calculate Leave balance dynamically
  const balance = {};
  if (currentUser?.leaveBalance) {
    Object.keys(currentUser.leaveBalance).forEach(type => {
      const remaining = currentUser.leaveBalance[type];
      const used = myLeaves.filter(l => l.type === type && l.status === 'approved').reduce((sum, l) => sum + l.days, 0);
      const total = remaining + used;
      if (total > 0 || type === 'loss_of_pay') {
        balance[type] = { total: type === 'loss_of_pay' ? used : total, used, remaining };
      }
    });
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Leave Management</h1>
          <p>{isAdmin ? `${pendingLeaves.length} pending approvals` : 'Manage your leave requests'}</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setShowApply(true)}>
            <Plus size={15} /> Apply Leave
          </button>
        </div>
      </div>

      {/* Leave Balance */}
      {!isAdmin && Object.keys(balance).length > 0 && (
        <div className="stat-grid stat-grid-3 mb-6">
          {Object.entries(balance).map(([type, data]) => {
            const isLop = type === 'loss_of_pay';
            return (
              <div key={type} className="card" style={{ padding: '18px 22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'capitalize', marginBottom: 2 }}>
                      {type.replace('_', ' ')} Leave
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {isLop ? `${data.used} days taken` : `${data.used} used of ${data.total}`}
                    </div>
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: isLop ? 'var(--danger)' : 'var(--primary)' }}>
                    {isLop ? data.used : data.remaining}
                  </div>
                </div>
                {!isLop && (
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${data.total ? (data.used / data.total) * 100 : 0}%`, background: '#D97706' }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tabs */}
      <div style={{ marginBottom: 20 }}>
        <div className="tabs">
          {['all', 'pending', 'approved'].map(tab => (
            <div key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)} style={{ textTransform: 'capitalize' }}>
              {tab}
              {tab === 'pending' && pendingLeaves.length > 0 && <span className="sidebar-badge">{pendingLeaves.length}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Leave Table */}
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Applied</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map(leave => {
                const user = mockUsers.find(u => u.id === leave.userId);
                const lt = LEAVE_COLORS[leave.type] || LEAVE_COLORS.casual;
                const sb = STATUS_BADGE[leave.status] || STATUS_BADGE.pending;
                return (
                  <tr key={leave.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="avatar avatar-sm" style={{ background: '#2563EB' }}>
                          {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?'}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: 13.5 }}>{user?.name || leave.userId}</span>
                      </div>
                    </td>
                    <td><span className="badge" style={{ background: lt.bg, color: lt.color }}>{lt.label}</span></td>
                    <td style={{ fontSize: 13 }}>{format(parseISO(leave.fromDate), 'MMM d, yyyy')}</td>
                    <td style={{ fontSize: 13 }}>{format(parseISO(leave.toDate), 'MMM d, yyyy')}</td>
                    <td><span style={{ fontWeight: 700 }}>{leave.days}d</span></td>
                    <td style={{ fontSize: 13, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{leave.reason}</td>
                    <td><span className={`badge ${sb.cls}`}>{sb.label}</span></td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{format(new Date(leave.appliedAt), 'MMM d')}</td>
                    {isAdmin && (
                      <td>
                        {leave.status === 'pending' && (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className="btn btn-success btn-sm" onClick={() => approveLeave(leave.id, currentUser.id)}>
                              <Check size={13} /> Approve
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => rejectLeave(leave.id)}>
                              <X size={13} />
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 9 : 8}>
                    <div className="empty-state" style={{ padding: '30px' }}>
                      <div className="empty-icon"><Calendar size={28} color="var(--text-muted)" /></div>
                      <p>No leave requests found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showApply && <ApplyLeaveModal onClose={() => setShowApply(false)} />}
    </div>
  );
}
