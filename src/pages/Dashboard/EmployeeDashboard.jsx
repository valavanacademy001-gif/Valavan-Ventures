import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { TASK_STATUS, mockProjects, PRIORITY } from '../../data/mockData';
import {
  Clock, CheckSquare, AlertTriangle, ChevronRight,
  TrendingUp, Bell, Calendar, ArrowRight, Play, Send, Loader2
} from 'lucide-react';
import { format, formatDistanceToNow, isPast, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const PRIORITY_BADGE = {
  critical: { cls: 'badge-danger', label: 'Critical' },
  high: { cls: 'badge-warning', label: 'High' },
  medium: { cls: 'badge-info', label: 'Medium' },
  low: { cls: 'badge-success', label: 'Low' },
};

const STATUS_BADGE = {
  assigned: { cls: 'badge-gray', label: 'Assigned' },
  working: { cls: 'badge-info', label: 'Working' },
  submitted: { cls: 'badge-purple', label: 'Submitted' },
  changes_needed: { cls: 'badge-warning', label: 'Changes Needed' },
  rejected: { cls: 'badge-danger', label: 'Rejected' },
};

function TaskRow({ task, onStartWorking, onSubmit }) {
  const isOverdue = task.deadline < new Date().toISOString().split('T')[0];
  const p = PRIORITY_BADGE[task.priority] || PRIORITY_BADGE.medium;
  const s = STATUS_BADGE[task.status] || STATUS_BADGE.assigned;
  const project = mockProjects.find(pr => pr.id === task.project);

  return (
    <div className="task-mobile-card">
      {/* Priority dot + title */}
      <div className="task-mobile-card-header">
        <div className={`priority-dot priority-${task.priority}`} style={{ marginTop: 5, flexShrink: 0 }} />
        <div className="task-mobile-card-title">{task.title}</div>
      </div>

      {/* Project + deadline */}
      <div style={{ fontSize: 12, color: 'var(--text-muted)', paddingLeft: 18 }}>
        {project?.name}
        {task.deadline && <> · Due {format(parseISO(task.deadline), 'MMM d')}</>}
        {isOverdue && <span style={{ color: 'var(--danger)', fontWeight: 700 }}> · Overdue!</span>}
      </div>

      {/* Badges + action button */}
      <div className="task-mobile-card-footer">
        <div className="task-mobile-card-meta">
          <span className={`badge ${p.cls}`}>{p.label}</span>
          <span className={`badge ${s.cls}`}>{s.label}</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {task.status === TASK_STATUS.ASSIGNED && (
            <button className="btn btn-secondary btn-sm" onClick={() => onStartWorking(task.id)}>
              <Play size={12} /> Start
            </button>
          )}
          {task.status === TASK_STATUS.WORKING && (
            <button className="btn btn-primary btn-sm" onClick={() => onSubmit(task.id)}>
              <Send size={12} /> Submit
            </button>
          )}
          {task.status === TASK_STATUS.CHANGES_NEEDED && (
            <button className="btn btn-sm" style={{ background: 'var(--warning)', color: 'white', border: 'none' }} onClick={() => onSubmit(task.id)}>
              Resubmit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


export default function EmployeeDashboard() {
  const { tasks, attendance, notifications, announcements, updateTask, submitForReview } = useApp();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];
  const myTasks = tasks.filter(t => t.assignedTo === currentUser?.id && t.status !== TASK_STATUS.COMPLETED);
  const todayAttendance = attendance.find(a => a.userId === currentUser?.id && a.date === today);
  const myNotifs = notifications.filter(n => n.userId === currentUser?.id && !n.read).slice(0, 3);

  const pendingTasks = myTasks.filter(t => [TASK_STATUS.ASSIGNED, TASK_STATUS.WORKING, TASK_STATUS.CHANGES_NEEDED, TASK_STATUS.REJECTED].includes(t.status));
  const reviewTasks = myTasks.filter(t => [TASK_STATUS.SUBMITTED, TASK_STATUS.UNDER_REVIEW].includes(t.status));
  const urgentTasks = pendingTasks.filter(t => t.priority === PRIORITY.CRITICAL || t.priority === PRIORITY.HIGH || t.deadline <= today);

  const workHours = todayAttendance?.workingHours || 0;
  
  // Calculate attendance % for current month
  const monthStartStr = new Date().toISOString().substring(0, 7); // yyyy-mm
  const myMonthAtt = attendance.filter(a => a.userId === currentUser?.id && a.date.startsWith(monthStartStr) && a.status !== 'sunday_holiday');
  const presentDays = myMonthAtt.filter(a => ['early', 'on_time', 'present', 'late', 'half_day', 'wfh'].includes(a.status)).length;
  const totalDays = myMonthAtt.length || 1; // prevent div by zero
  const attPercent = Math.round((presentDays / totalDays) * 100);

  const elBalance = currentUser?.leaveBalance?.earned || 0;
  
  // Calculate average arrival time
  const arrivals = myMonthAtt.filter(a => a.checkIn).map(a => {
    const [h, m] = a.checkIn.split(':').map(Number);
    return h * 60 + m;
  });
  const avgArrivalMins = arrivals.length ? Math.round(arrivals.reduce((a, b) => a + b, 0) / arrivals.length) : 0;
  const avgArrivalStr = avgArrivalMins ? `${String(Math.floor(avgArrivalMins / 60)).padStart(2, '0')}:${String(avgArrivalMins % 60).padStart(2, '0')}` : '-';

  const isLate = todayAttendance?.status === 'late';
  const arrived = !!todayAttendance?.checkIn;
  
  const formatMins = (mins) => {
    if (!mins) return '0h 0m';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  const handleStartWorking = (taskId) => {
    updateTask(taskId, { status: TASK_STATUS.WORKING, progress: 10 });
  };

  const handleSubmitForReview = (taskId) => {
    submitForReview(taskId, currentUser.id);
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>Good morning, {currentUser?.name?.split(' ')[0]} 👋</h1>
          <p>{format(new Date(), 'EEEE, MMMM d, yyyy')} · {pendingTasks.length} task{pendingTasks.length !== 1 ? 's' : ''} need your attention</p>
        </div>
      </div>

      {/* Attendance + Stats Row */}
      <div className="stat-grid stat-grid-4 mb-6">
        <div className="stat-card" style={{ '--stat-color': arrived ? (isLate ? 'var(--warning)' : 'var(--success)') : 'var(--text-muted)' }}>
          <div className="stat-icon" style={{ background: arrived ? (isLate ? '#FFFBEB' : '#ECFDF5') : 'var(--bg-hover)' }}>
            <Clock size={20} color={arrived ? (isLate ? '#D97706' : '#059669') : 'var(--text-muted)'} />
          </div>
          <div className="stat-body">
            <div className="stat-label">Today's Attendance</div>
            <div className="stat-value" style={{ fontSize: 16 }}>
              {todayAttendance?.checkIn ? `IN: ${todayAttendance.checkIn}` : 'Pending'}
            </div>
            {todayAttendance?.checkOut && (
              <div className="stat-change" style={{ fontSize: 13, color: 'var(--text-primary)', marginTop: 4 }}>
                OUT: {todayAttendance.checkOut}
              </div>
            )}
            {todayAttendance?.workedMins > 0 && (
              <div className="stat-change" style={{ marginTop: 4, fontWeight: 600 }}>
                Worked: {formatMins(todayAttendance.workedMins)}
              </div>
            )}
            {isLate && (
              <div className="stat-change" style={{ color: 'var(--danger)', marginTop: 4, fontWeight: 600 }}>
                Late: {todayAttendance.lateMinutes}m
              </div>
            )}
          </div>
        </div>

        <div className="stat-card" style={{ '--stat-color': 'var(--primary)' }}>
          <div className="stat-icon" style={{ background: 'var(--primary-light)' }}>
            <TrendingUp size={20} color="var(--primary)" />
          </div>
          <div className="stat-body">
            <div className="stat-label">Avg Arrival Time</div>
            <div className="stat-value">{avgArrivalStr}</div>
            <div className="stat-change">Monthly average</div>
          </div>
        </div>

        <div className="stat-card" style={{ '--stat-color': '#059669' }}>
          <div className="stat-icon" style={{ background: '#ECFDF5' }}>
            <Calendar size={20} color="#059669" />
          </div>
          <div className="stat-body">
            <div className="stat-label">Monthly Attendance</div>
            <div className="stat-value">{attPercent}%</div>
            <div className="stat-change">{presentDays} / {totalDays} days</div>
          </div>
        </div>

        <div className="stat-card" style={{ '--stat-color': '#059669' }}>
          <div className="stat-icon" style={{ background: '#ECFDF5' }}>
            <Calendar size={20} color="#059669" />
          </div>
          <div className="stat-body">
            <div className="stat-label">Earned Leave (EL)</div>
            <div className="stat-value">{elBalance}</div>
            <div className="stat-change">Available balance</div>
          </div>
        </div>

        <div className="stat-card" style={{ '--stat-color': '#D97706' }}>
          <div className="stat-icon" style={{ background: '#FFFBEB' }}>
            <AlertTriangle size={20} color="#D97706" />
          </div>
          <div className="stat-body">
            <div className="stat-label">Pending Tasks</div>
            <div className="stat-value">{pendingTasks.length}</div>
            <div className="stat-change">{urgentTasks.length} urgent</div>
          </div>
        </div>

        <div className="stat-card" style={{ '--stat-color': '#7C3AED' }}>
          <div className="stat-icon" style={{ background: '#F5F3FF' }}>
            <CheckSquare size={20} color="#7C3AED" />
          </div>
          <div className="stat-body">
            <div className="stat-label">Under Review</div>
            <div className="stat-value">{reviewTasks.length}</div>
            <div className="stat-change">Waiting for approval</div>
          </div>
        </div>
      </div>

      <div className="dashboard-main-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Today's Focus */}
          {urgentTasks.length > 0 && (
            <div className="card" style={{ border: '1px solid #FDE68A', background: 'linear-gradient(135deg, #FFFBEB 0%, #FFFFFF 100%)' }}>
              <div className="card-header" style={{ borderBottom: '1px solid #FDE68A' }}>
                <div>
                  <div className="card-title" style={{ color: '#92400E' }}>⚡ Focus Area</div>
                  <div className="card-subtitle">Tasks requiring immediate attention</div>
                </div>
              </div>
              {urgentTasks.slice(0, 3).map(task => (
                <TaskRow key={task.id} task={task} onStartWorking={handleStartWorking} onSubmit={handleSubmitForReview} />
              ))}
            </div>
          )}

          {/* All Pending Tasks */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">My Tasks</div>
                <div className="card-subtitle">{pendingTasks.length} active tasks</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/tasks')}>
                View all <ChevronRight size={14} />
              </button>
            </div>
            {pendingTasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"><CheckSquare size={28} color="var(--success)" /></div>
                <h3>All caught up! 🎉</h3>
                <p>You have no pending tasks right now.</p>
              </div>
            ) : (
              pendingTasks.map(task => (
                <TaskRow key={task.id} task={task} onStartWorking={handleStartWorking} onSubmit={handleSubmitForReview} />
              ))
            )}
          </div>

          {/* Tasks Under Review */}
          {reviewTasks.length > 0 && (
            <div className="card">
              <div className="card-header">
                <div className="card-title">Awaiting Review</div>
                <span className="badge badge-purple">{reviewTasks.length}</span>
              </div>
              {reviewTasks.map(task => (
                <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
                  <div className={`priority-dot priority-${task.priority}`} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>{task.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Submitted · waiting for admin approval</div>
                  </div>
                  <div className="progress-bar" style={{ width: 80 }}>
                    <div className="progress-fill" style={{ width: `${task.progress}%` }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', width: 32, textAlign: 'right' }}>{task.progress}%</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Notifications */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Notifications</div>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/notifications')}>
                View all
              </button>
            </div>
            <div className="card-body" style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {myNotifs.length === 0 ? (
                <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0' }}>All caught up!</p>
              ) : myNotifs.map(n => (
                <div key={n.id} style={{ padding: '10px 12px', background: 'var(--bg-hover)', borderRadius: 8, cursor: 'pointer' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{n.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{n.message}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Announcements */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Announcements</div>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/announcements')}>
                View all
              </button>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {announcements.slice(0, 2).map(ann => (
                <div key={ann.id} onClick={() => navigate('/announcements')} style={{ padding: '12px', background: 'var(--bg-hover)', borderRadius: 8, cursor: 'pointer' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{ann.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatDistanceToNow(new Date(ann.postedAt), { addSuffix: true })}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Upcoming Deadlines</div>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {pendingTasks
                .sort((a, b) => a.deadline.localeCompare(b.deadline))
                .slice(0, 4)
                .map(task => {
                  const isOverdue = task.deadline < today;
                  return (
                    <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: isOverdue ? 'var(--danger-bg)' : 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Calendar size={16} color={isOverdue ? 'var(--danger)' : 'var(--text-muted)'} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.title}</div>
                        <div style={{ fontSize: 12, color: isOverdue ? 'var(--danger)' : 'var(--text-muted)', fontWeight: isOverdue ? 600 : 400 }}>
                          {isOverdue ? '⚠ ' : ''}{format(parseISO(task.deadline), 'MMM d, yyyy')}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
