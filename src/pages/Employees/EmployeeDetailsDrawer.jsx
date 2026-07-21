import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { ROLES, EMPLOYEE_STATUS } from '../../data/mockData';
import { X, Mail, Phone, MapPin, Building2, Calendar, Edit2, FileText, CheckCircle2, Clock, Briefcase } from 'lucide-react';

const COLORS = ['#2563EB', '#7C3AED', '#059669', '#D97706', '#DC2626', '#0EA5E9', '#EC4899', '#F97316'];
const getColor = (name) => COLORS[name?.charCodeAt(0) % COLORS.length] || COLORS[0];
const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';

const ROLE_BADGE = {
  super_admin: { cls: 'badge-danger', label: 'Super Admin' },
  admin: { cls: 'badge-primary', label: 'Admin' },
  hr: { cls: 'badge-purple', label: 'HR' },
  manager: { cls: 'badge-warning', label: 'Manager' },
  employee: { cls: 'badge-success', label: 'Employee' },
};

const STATUS_BADGE = {
  active: { cls: 'badge-success', label: 'Active' },
  inactive: { cls: 'badge-danger', label: 'Inactive' },
  on_leave: { cls: 'badge-warning', label: 'On Leave' },
  suspended: { cls: 'badge-danger', label: 'Suspended' },
  resigned: { cls: 'badge-purple', label: 'Resigned' },
  notice_period: { cls: 'badge-warning', label: 'Notice Period' },
};

export default function EmployeeDetailsDrawer({ emp, onClose }) {
  const { tasks, leaves, payslips, employees } = useApp();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const color = getColor(emp.name);
  const role = ROLE_BADGE[emp.role] || ROLE_BADGE.employee;
  const status = STATUS_BADGE[emp.status] || STATUS_BADGE.active;

  const empTasks = tasks.filter(t => t.assignedTo === emp.id);
  const completedTasks = empTasks.filter(t => t.status === 'completed').length;
  const pendingTasks = empTasks.filter(t => !['completed', 'approved'].includes(t.status)).length;

  const manager = employees.find(e => e.id === emp.reportingManager);

  const isAdmin = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR].includes(currentUser?.role);
  const isSelf = currentUser?.id === emp.id;
  const canEdit = isAdmin || isSelf;

  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'leaves', label: 'Leaves' },
    { id: 'payslips', label: 'Payslips' },
    { id: 'documents', label: 'Documents' },
  ];

  return (
    <div className="modal-overlay animate-fadeIn" onClick={onClose} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'stretch' }}>
      <div className="drawer animate-slideInRight" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 700, background: 'var(--bg)', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        
        {/* Header Hero */}
        <div style={{ padding: '32px 32px 20px', background: `linear-gradient(to bottom, ${color}15, var(--bg))`, position: 'relative', flexShrink: 0 }}>
          <button className="icon-btn" onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'var(--bg-card)' }}>
            <X size={18} />
          </button>
          
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end' }}>
            <div className="avatar" style={{ width: 100, height: 100, background: color, border: '4px solid var(--bg-card)', fontSize: 36, fontWeight: 800, boxShadow: 'var(--shadow-sm)' }}>
              {getInitials(emp.name)}
            </div>
            <div style={{ paddingBottom: 6, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>{emp.name}</h2>
                <span className={`badge ${status.cls}`}>{status.label}</span>
              </div>
              <div style={{ fontSize: 15, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{emp.employeeId}</span>
                <span>•</span>
                <span>{emp.designation}</span>
                <span>•</span>
                <span>{emp.department}</span>
              </div>
            </div>
            {canEdit && (
              <button className="btn btn-secondary" style={{ paddingBottom: 6 }}>
                <Edit2 size={15} /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 24, borderBottom: '1px solid var(--border)', padding: '0 32px', flexShrink: 0 }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 0',
                background: 'none',
                border: 'none',
                borderBottom: `2px solid ${activeTab === tab.id ? 'var(--primary)' : 'transparent'}`,
                color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: activeTab === tab.id ? 600 : 500,
                fontSize: 14,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div style={{ padding: 32, overflowY: 'auto', flex: 1 }}>
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              {/* Stats Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                {[
                  { label: 'Attendance', value: `${emp.attendancePercent}%`, color: '#059669', icon: Clock },
                  { label: 'Performance', value: emp.performanceScore, color: '#2563EB', icon: CheckCircle2 },
                  { label: 'Completed Tasks', value: completedTasks, color: '#7C3AED', icon: FileText },
                  { label: 'Pending Tasks', value: pendingTasks, color: '#D97706', icon: FileText },
                ].map((s, i) => (
                  <div key={i} className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: `${s.color}15`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <s.icon size={16} />
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Info Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div className="card">
                  <div className="card-header"><h3 className="card-title">Personal Information</h3></div>
                  <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <InfoRow icon={Mail} label="Email" value={emp.email} />
                    <InfoRow icon={Phone} label="Phone" value={emp.phone} />
                    <InfoRow icon={MapPin} label="Location" value={emp.location} />
                    <InfoRow icon={MapPin} label="Address" value={emp.address} />
                    <InfoRow icon={Phone} label="Emergency Contact" value={emp.emergencyContact} />
                    <InfoRow icon={CheckCircle2} label="Blood Group" value={emp.bloodGroup} />
                  </div>
                </div>

                <div className="card">
                  <div className="card-header"><h3 className="card-title">Employment Details</h3></div>
                  <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <InfoRow icon={Briefcase} label="Employee ID" value={emp.employeeId} />
                    <InfoRow icon={Building2} label="Department" value={emp.department} />
                    <InfoRow icon={CheckCircle2} label="Role" value={role.label} />
                    <InfoRow icon={Clock} label="Employment Type" value={emp.employmentType} />
                    <InfoRow icon={Calendar} label="Joining Date" value={emp.joinDate ? new Date(emp.joinDate).toLocaleDateString() : 'N/A'} />
                    <InfoRow icon={Briefcase} label="Reporting Manager" value={manager ? manager.name : 'None'} />
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'documents' && (
            <div className="card">
              <div className="card-header"><h3 className="card-title">Documents</h3></div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {emp.documents?.length > 0 ? emp.documents.map((doc, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, background: 'var(--bg-hover)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <FileText size={20} color="var(--primary)" />
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{doc.name}</span>
                    </div>
                    <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }}>View</button>
                  </div>
                )) : (
                  <div className="empty-state" style={{ padding: 40 }}>
                    <FileText size={32} color="var(--text-muted)" />
                    <h3 style={{ marginTop: 12 }}>No documents found</h3>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Placeholders for other tabs to keep the UI clean for now */}
          {['tasks', 'attendance', 'leaves', 'payslips'].includes(activeTab) && (
            <div className="empty-state" style={{ padding: 60, marginTop: 40 }}>
              <h3 style={{ marginBottom: 8 }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
              <p style={{ color: 'var(--text-muted)' }}>Detailed view for {activeTab} will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
      <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: -2 }}>
        <Icon size={14} color="var(--text-secondary)" />
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginTop: 2 }}>{value || 'N/A'}</div>
      </div>
    </div>
  );
}
