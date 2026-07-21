import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { mockUsers, TASK_STATUS, ROLES } from '../../data/mockData';
import { format, parseISO } from 'date-fns';
import { Check, X, Search, Briefcase, Calendar as CalendarIcon, Clock, Filter, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ApprovalCenter() {
  const { tasks, leaves, approveTask, requestChanges, approveLeave, rejectLeave } = useApp();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' | 'leaves'
  const [search, setSearch] = useState('');

  if (![ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR, ROLES.MANAGER].includes(currentUser?.role)) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>You do not have permission to view the Approval Center.</p>
      </div>
    );
  }

  const pendingTasks = tasks.filter(t => t.status === TASK_STATUS.IN_REVIEW);
  const pendingLeaves = leaves.filter(l => l.status === 'pending');

  const filteredTasks = pendingTasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
  const filteredLeaves = pendingLeaves.filter(l => {
    const user = mockUsers.find(u => u.id === l.userId);
    return user?.name.toLowerCase().includes(search.toLowerCase()) || l.type.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Approval Center</h1>
          <p>Review and manage pending requests</p>
        </div>
        <div className="page-header-right">
          <div className="search-bar">
            <Search size={18} />
            <input 
              type="text" 
              placeholder={`Search ${activeTab}...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
        <div className="card" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: '#EFF6FF', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase size={24} />
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>{pendingTasks.length}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Tasks In Review</div>
          </div>
        </div>
        <div className="card" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CalendarIcon size={24} />
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>{pendingLeaves.length}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Pending Leave Requests</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', padding: '0 24px' }}>
          <button 
            className={`tab-button ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
            style={{ padding: '16px 24px', background: 'transparent', border: 'none', borderBottom: activeTab === 'tasks' ? '2px solid var(--primary-color)' : '2px solid transparent', color: activeTab === 'tasks' ? 'var(--primary-color)' : 'var(--text-muted)', fontWeight: 600, cursor: 'pointer' }}
          >
            Tasks ({pendingTasks.length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'leaves' ? 'active' : ''}`}
            onClick={() => setActiveTab('leaves')}
            style={{ padding: '16px 24px', background: 'transparent', border: 'none', borderBottom: activeTab === 'leaves' ? '2px solid var(--primary-color)' : '2px solid transparent', color: activeTab === 'leaves' ? 'var(--primary-color)' : 'var(--text-muted)', fontWeight: 600, cursor: 'pointer' }}
          >
            Leaves ({pendingLeaves.length})
          </button>
        </div>

        <div style={{ padding: 24 }}>
          {activeTab === 'tasks' ? (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Task Details</th>
                    <th>Assignee</th>
                    <th>Project</th>
                    <th>Submitted</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map(task => {
                    const assignee = mockUsers.find(u => u.id === task.assigneeId);
                    return (
                      <tr key={task.id}>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{task.title}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{task.taskCode}</div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div className="avatar avatar-sm" style={{ background: 'var(--primary-color)' }}>
                              {assignee?.name.charAt(0)}
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 500 }}>{assignee?.name}</span>
                          </div>
                        </td>
                        <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{task.project}</td>
                        <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                          {format(parseISO(task.createdAt), 'MMM d, yyyy')}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                            <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => navigate('/tasks')}>
                              <ExternalLink size={14} style={{ marginRight: 4 }} /> View
                            </button>
                            <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => approveTask(task.id)}>
                              <Check size={14} style={{ marginRight: 4 }} /> Approve
                            </button>
                            <button className="btn" style={{ padding: '6px 12px', fontSize: 12, background: '#FEE2E2', color: '#DC2626' }} onClick={() => requestChanges(task.id)}>
                              <X size={14} style={{ marginRight: 4 }} /> Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredTasks.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>
                        No pending tasks found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Leave Type</th>
                    <th>Duration</th>
                    <th>Reason</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeaves.map(leave => {
                    const employee = mockUsers.find(u => u.id === leave.userId);
                    return (
                      <tr key={leave.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div className="avatar avatar-sm" style={{ background: 'var(--primary-color)' }}>
                              {employee?.name.charAt(0)}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{employee?.name}</div>
                              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{employee?.employeeId}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge" style={{ background: '#F1F5F9', color: '#475569', textTransform: 'capitalize' }}>
                            {leave.type}
                          </span>
                        </td>
                        <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                          <div style={{ fontWeight: 500 }}>
                            {format(parseISO(leave.startDate), 'MMM d')} - {format(parseISO(leave.endDate), 'MMM d')}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{leave.duration} days</div>
                        </td>
                        <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                          {leave.reason}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                            <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => approveLeave(leave.id)}>
                              <Check size={14} style={{ marginRight: 4 }} /> Approve
                            </button>
                            <button className="btn" style={{ padding: '6px 12px', fontSize: 12, background: '#FEE2E2', color: '#DC2626' }} onClick={() => rejectLeave(leave.id)}>
                              <X size={14} style={{ marginRight: 4 }} /> Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredLeaves.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>
                        No pending leave requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
