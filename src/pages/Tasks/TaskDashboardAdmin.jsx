import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { CheckSquare, Clock, AlertTriangle, TrendingUp, Eye, Flame, Zap, CheckCircle2, Users } from 'lucide-react';
import { isBefore, parseISO, isToday, startOfWeek, isAfter } from 'date-fns';
import { TASK_STATUS, PRIORITY } from '../../data/mockData';
import EmployeeTaskProfile from './components/EmployeeTaskProfile';
import { getAvatarColor } from './components/TaskCard';

const COLORS = ['#2563EB', '#7C3AED', '#059669', '#D97706', '#DC2626'];

function CircleProgress({ value, size = 56, stroke = 5, color = '#2563EB' }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
    </svg>
  );
}

export default function TaskDashboardAdmin({ onSwitchView, onOpenTask, onSelectKPI }) {
  const { tasks, projects, employees } = useApp();
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const today = new Date().toISOString().split('T')[0];
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });

  // Top stats
  const total = tasks.length;
  const assignedToday = tasks.filter(t => t.createdAt && t.createdAt.startsWith(today)).length;
  const pendingReview = tasks.filter(t => ['submitted', 'under_review'].includes(t.status)).length;
  const completedToday = tasks.filter(t => ['completed', 'approved'].includes(t.status) && t.createdAt?.startsWith(today)).length;
  const overdue = tasks.filter(t => !['completed', 'approved'].includes(t.status) && t.deadline && isBefore(parseISO(t.deadline), now)).length;
  const highPriority = tasks.filter(t => ['critical', 'high'].includes(t.priority) && !['completed', 'approved'].includes(t.status)).length;

  const topStats = [
    { label: 'Total Tasks', value: total, icon: CheckSquare, color: '#2563EB', bg: '#EFF6FF', type: 'total' },
    { label: 'Assigned Today', value: assignedToday, icon: Zap, color: '#7C3AED', bg: '#F5F3FF', type: 'assignedToday' },
    { label: 'Pending Review', value: pendingReview, icon: Eye, color: '#D97706', bg: '#FFFBEB', alert: pendingReview > 0, type: 'pending' },
    { label: 'Completed Today', value: completedToday, icon: CheckCircle2, color: '#059669', bg: '#ECFDF5', type: 'completedToday' },
    { label: 'Overdue', value: overdue, icon: AlertTriangle, color: '#DC2626', bg: '#FEF2F2', alert: overdue > 0, type: 'overdue' },
    { label: 'High Priority', value: highPriority, icon: Flame, color: '#EA580C', bg: '#FFF7ED', type: 'highPriority' },
  ];

  // Employee workload — use live employees from context, not static mockUsers
  const workloadEmployees = (employees || []).filter(u => ['employee', 'manager', 'hr'].includes(u.role));

  const getWorkload = (userId) => {
    const ut = tasks.filter(t => t.assignedTo === userId);
    const active = ut.filter(t => !['completed', 'approved'].includes(t.status)).length;
    const review = ut.filter(t => ['submitted', 'under_review'].includes(t.status)).length;
    const overdueU = ut.filter(t => !['completed', 'approved'].includes(t.status) && t.deadline && isBefore(parseISO(t.deadline), now)).length;
    const done = ut.filter(t => ['completed', 'approved'].includes(t.status)).length;
    const productivity = ut.length > 0 ? Math.round((done / ut.length) * 100) : 100;
    return { active, review, overdueU, done, productivity, total: ut.length };
  };

  const recentActivity = tasks
    .filter(t => t.timeline?.length > 0)
    .flatMap(t => t.timeline?.slice(-1).map(ev => ({ ...ev, taskTitle: t.title, taskId: t.id })) || [])
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 8);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Top stats */}
      <div className="grid-responsive-6" style={{ gap: 14 }}>
        {topStats.map(s => (
          <div
            key={s.label}
            onClick={() => onSelectKPI?.({ type: s.type, label: s.label })}
            style={{
              background: 'var(--bg-card)', borderRadius: 14, padding: '18px 20px',
              boxShadow: 'var(--shadow-sm)', border: s.alert ? '1px solid ' + s.color + '40' : '1px solid var(--border)',
              position: 'relative', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
          >
            {s.alert && <div style={{ position: 'absolute', top: 8, right: 8, width: 7, height: 7, background: s.color, borderRadius: '50%' }} />}
            <div style={{ width: 38, height: 38, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <s.icon size={18} color={s.color} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 5, fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Employee Workload + Recent Activity */}
      <div className="grid-sidebar-layout" style={{ gap: 20 }}>
        {/* Workload grid */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 16, boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Team Workload</h3>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>Click an employee to view their task profile</p>
            </div>
            <button onClick={() => onSwitchView('table')} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: 'var(--text-secondary)' }}>
              View All Tasks
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))', gap: 14, padding: 20 }}>
            {workloadEmployees.map(emp => {
              const w = getWorkload(emp.id);
              const prodColor = w.productivity >= 70 ? '#059669' : w.productivity >= 40 ? '#D97706' : '#DC2626';
              return (
                <div
                  key={emp.id}
                  onClick={() => setSelectedEmployee(emp.id)}
                  style={{ background: 'var(--bg)', borderRadius: 14, padding: '16px', cursor: 'pointer', border: '1px solid var(--border)', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: 14 }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = '#2563EB40'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 38, height: 38, borderRadius: '50%', background: getAvatarColor(emp.name), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
                        {emp.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{emp.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{emp.department}</div>
                      </div>
                    </div>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CircleProgress value={w.productivity} size={44} stroke={4} color={prodColor} />
                      <span style={{ position: 'absolute', fontSize: 10, fontWeight: 800, color: prodColor }}>{w.productivity}%</span>
                    </div>
                  </div>
                  <div className="grid-responsive-3" style={{ gap: 8 }}>
                    {[
                      { label: 'Active', val: w.active, color: '#2563EB' },
                      { label: 'Review', val: w.review, color: '#7C3AED' },
                      { label: 'Overdue', val: w.overdueU, color: w.overdueU > 0 ? '#DC2626' : 'var(--text-muted)' },
                    ].map(m => (
                      <div key={m.label} style={{ textAlign: 'center', background: 'var(--bg-card)', borderRadius: 8, padding: '6px 4px' }}>
                        <div style={{ fontSize: 16, fontWeight: 800, color: m.color }}>{m.val}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{m.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 16, boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Recent Activity</h3>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recentActivity.map((ev, i) => {
                const actor = (employees || []).find(u => u.id === ev.userId);
                const actionLabels = {
                  created: 'created', assigned: 'assigned', started: 'started work on',
                  submitted: 'submitted', approved: 'approved', rejected: 'rejected',
                  changes_requested: 'requested changes on', completed: 'completed', commented: 'commented on'
                };
                return (
                  <div key={i} style={{ display: 'flex', gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: getAvatarColor(actor?.name), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>
                      {actor?.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                        <b>{actor?.name?.split(' ')[0]}</b>{' '}
                        <span style={{ color: 'var(--text-muted)' }}>{actionLabels[ev.action] || ev.action}</span>{' '}
                        <b>"{ev.taskTitle}"</b>
                      </p>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        {new Date(ev.timestamp).toLocaleDateString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Quick view buttons */}
      <div style={{ display: 'flex', gap: 12 }}>
        {[
          { label: '📋 Kanban Board', view: 'kanban' },
          { label: '📊 List View', view: 'table' },
          { label: '📁 By Project', view: 'project' },
        ].map(b => (
          <button key={b.view} onClick={() => onSwitchView(b.view)}
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--text-primary)', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            {b.label}
          </button>
        ))}
      </div>

      {selectedEmployee && (
        <EmployeeTaskProfile
          userId={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          onOpenTask={onOpenTask}
        />
      )}
    </div>
  );
}
