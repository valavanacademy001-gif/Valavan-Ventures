import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { ROLES, EMPLOYEE_STATUS } from '../../data/mockData';
import { Search, Plus, Mail, Phone, MapPin, Building2, Star, X, Loader2, List, LayoutGrid, Filter, ArrowUpDown, Trash2 } from 'lucide-react';
import AddEmployeeModal from './AddEmployeeModal';
import EmployeeDetailsDrawer from './EmployeeDetailsDrawer';

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

function EmployeeCard({ emp, onClick, onDelete, isAdmin }) {
  const color = getColor(emp.name);
  const role = ROLE_BADGE[emp.role] || ROLE_BADGE.employee;
  const status = STATUS_BADGE[emp.status] || STATUS_BADGE.active;

  return (
    <div className="card" style={{ cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column' }} onClick={() => onClick(emp)}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
      {/* Header gradient */}
      <div style={{ height: 56, background: `linear-gradient(135deg, ${color}22 0%, ${color}11 100%)`, borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', position: 'relative' }}>
        <div className="avatar avatar-lg" style={{ background: color, position: 'absolute', bottom: -24, left: 20, border: '3px solid var(--bg-card)', boxShadow: 'var(--shadow-sm)' }}>
          {getInitials(emp.name)}
        </div>
      </div>
      <div style={{ padding: '32px 20px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{emp.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className={`badge ${status.cls}`}>{status.label}</span>
            {isAdmin && (
              <button 
                className="icon-btn" 
                style={{ color: 'var(--danger)', padding: 4, height: 24, width: 24 }} 
                onClick={(e) => { e.stopPropagation(); onDelete(emp.id); }}
                title="Remove Employee"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>{emp.designation}</div>
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Building2 size={13} color="var(--text-muted)" />
            <span style={{ fontSize: 12.5, color: 'var(--text-secondary)', fontWeight: 500 }}>{emp.department}</span>
          </div>
          {emp.email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              <Mail size={13} color="var(--text-muted)" />
              <span style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{emp.email}</span>
            </div>
          )}
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 'auto' }}>
          <div style={{ background: 'var(--bg-hover)', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--primary)' }}>{emp.attendancePercent}%</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>ATTENDANCE</div>
          </div>
          <div style={{ background: 'var(--bg-hover)', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#059669' }}>{emp.performanceScore}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>PERFORMANCE</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmployeeTable({ employees, onClick, onDelete, isAdmin }) {
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table className="table" style={{ minWidth: 1000 }}>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Employee ID</th>
              <th>Role</th>
              <th>Department</th>
              <th>Status</th>
              <th>Joined</th>
              <th style={{ textAlign: 'center' }}>Perf.</th>
              <th style={{ textAlign: 'center' }}>Attd.</th>
              {isAdmin && <th style={{ textAlign: 'center' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => {
              const color = getColor(emp.name);
              const role = ROLE_BADGE[emp.role] || ROLE_BADGE.employee;
              const status = STATUS_BADGE[emp.status] || STATUS_BADGE.active;

              return (
                <tr key={emp.id} onClick={() => onClick(emp)} style={{ cursor: 'pointer' }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="avatar" style={{ width: 32, height: 32, background: color, fontSize: 13, fontWeight: 600 }}>
                        {getInitials(emp.name)}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{emp.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{emp.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>{emp.employeeId}</span></td>
                  <td><span className={`badge ${role.cls}`}>{role.label}</span></td>
                  <td>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{emp.department}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{emp.designation}</div>
                  </td>
                  <td><span className={`badge ${status.cls}`}>{status.label}</span></td>
                  <td><span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{emp.joinDate ? new Date(emp.joinDate).toLocaleDateString() : 'N/A'}</span></td>
                  <td align="center"><span style={{ fontWeight: 600, color: '#059669' }}>{emp.performanceScore}</span></td>
                  <td align="center"><span style={{ fontWeight: 600, color: 'var(--primary)' }}>{emp.attendancePercent}%</span></td>
                  {isAdmin && (
                    <td align="center" onClick={(e) => e.stopPropagation()}>
                      <button 
                        className="icon-btn" 
                        style={{ color: 'var(--danger)', margin: '0 auto' }} 
                        onClick={() => onDelete(emp.id)}
                        title="Remove Employee"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Employees() {
  const { employees, deleteEmployee } = useApp();
  const { currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  
  const [view, setView] = useState('card');
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const isAdmin = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR].includes(currentUser?.role);
  const departments = ['all', ...new Set(employees.map(e => e.department).filter(Boolean))];

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this employee?")) {
      deleteEmployee(id);
    }
  };

  // Filtering
  let filtered = employees.filter(e => {
    if (search && !e.name.toLowerCase().includes(search.toLowerCase()) && !e.designation?.toLowerCase().includes(search.toLowerCase()) && !e.department?.toLowerCase().includes(search.toLowerCase()) && !e.employeeId?.toLowerCase().includes(search.toLowerCase())) return false;
    if (dept !== 'all' && e.department !== dept) return false;
    if (roleFilter !== 'all' && e.role !== roleFilter) return false;
    if (statusFilter !== 'all' && e.status !== statusFilter) return false;
    return true;
  });

  // Sorting
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'newest': return new Date(b.joinDate || 0) - new Date(a.joinDate || 0);
      case 'oldest': return new Date(a.joinDate || 0) - new Date(b.joinDate || 0);
      case 'performance': return (b.performanceScore || 0) - (a.performanceScore || 0);
      case 'name':
      default: return a.name.localeCompare(b.name);
    }
  });

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Employees</h1>
          <p>{employees.length} team members across all departments</p>
        </div>
        <div className="page-header-actions">
          {isAdmin && (
            <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
              <Plus size={15} /> Add Employee
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="card" style={{ padding: 16, marginBottom: 24, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="input" style={{ paddingLeft: 36, width: '100%', background: 'var(--bg)' }} placeholder="Search name, ID, or designation..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <select className="input select" style={{ width: 150, background: 'var(--bg)' }} value={dept} onChange={e => setDept(e.target.value)}>
            {departments.map(d => <option key={d} value={d}>{d === 'all' ? 'All Departments' : d}</option>)}
          </select>

          <select className="input select" style={{ width: 140, background: 'var(--bg)' }} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
            <option value="all">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="hr">HR</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
          </select>

          <select className="input select" style={{ width: 140, background: 'var(--bg)' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="on_leave">On Leave</option>
            <option value="suspended">Suspended</option>
            <option value="resigned">Resigned</option>
            <option value="notice_period">Notice Period</option>
          </select>

          <div style={{ width: 1, height: 32, background: 'var(--border)' }}></div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ArrowUpDown size={14} color="var(--text-muted)" />
            <select className="input select" style={{ width: 140, background: 'var(--bg)' }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="name">Name (A-Z)</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="performance">Highest Perf.</option>
            </select>
          </div>

          <div style={{ width: 1, height: 32, background: 'var(--border)' }}></div>

          <div style={{ display: 'flex', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', padding: 2 }}>
            <button className="icon-btn" style={{ border: 'none', background: view === 'card' ? 'var(--bg-hover)' : 'transparent', color: view === 'card' ? 'var(--text-primary)' : 'var(--text-muted)' }} onClick={() => setView('card')}>
              <LayoutGrid size={16} />
            </button>
            <button className="icon-btn" style={{ border: 'none', background: view === 'table' ? 'var(--bg-hover)' : 'transparent', color: view === 'table' ? 'var(--text-primary)' : 'var(--text-muted)' }} onClick={() => setView('table')}>
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><Filter size={32} color="var(--text-muted)" /></div>
          <h3>No employees found</h3>
          <p>Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          {view === 'card' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 16 }}>
              {filtered.map(emp => <EmployeeCard key={emp.id} emp={emp} onClick={setSelected} onDelete={handleDelete} isAdmin={isAdmin} />)}
            </div>
          ) : (
            <EmployeeTable employees={filtered} onClick={setSelected} onDelete={handleDelete} isAdmin={isAdmin} />
          )}
        </>
      )}

      {selected && <EmployeeDetailsDrawer emp={selected} onClose={() => setSelected(null)} />}
      {showAdd && <AddEmployeeModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
