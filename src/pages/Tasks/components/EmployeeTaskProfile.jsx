import { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { useAuth } from '../../../context/AuthContext';
import { X, CheckSquare, Clock, AlertCircle, Flame, TrendingUp, User } from 'lucide-react';
import { format, parseISO, isBefore, differenceInDays } from 'date-fns';
import { TASK_STATUS, mockUsers } from '../../../data/mockData';
import { STATUS_CONFIG, PRIORITY_CONFIG, getAvatarColor } from './TaskCard';

const COLORS = ['#2563EB', '#7C3AED', '#059669', '#D97706', '#DC2626', '#0EA5E9'];

export default function EmployeeTaskProfile({ userId, onClose, onOpenTask }) {
  const { tasks, projects } = useApp();
  const [activeTab, setActiveTab] = useState('active');

  const user = mockUsers.find(u => u.id === userId);
  const userTasks = tasks.filter(t => t.assignedTo === userId);

  const today = new Date().toISOString().split('T')[0];
  const activeTasks = userTasks.filter(t => !['completed', 'approved', 'archived'].includes(t.status));
  const completedTasks = userTasks.filter(t => ['completed', 'approved'].includes(t.status));
  const reviewTasks = userTasks.filter(t => ['submitted', 'under_review'].includes(t.status));
  const overdueTasks = activeTasks.filter(t => t.deadline && isBefore(parseISO(t.deadline), new Date()) && t.deadline !== today);

  const productivity = userTasks.length > 0 ? Math.round((completedTasks.length / userTasks.length) * 100) : 0;

  const tabTasks = activeTab === 'active' ? activeTasks
    : activeTab === 'review' ? reviewTasks
    : activeTab === 'completed' ? completedTasks
    : overdueTasks;

  const tabs = [
    { id: 'active', label: 'Active', count: activeTasks.length },
    { id: 'review', label: 'In Review', count: reviewTasks.length },
    { id: 'overdue', label: 'Overdue', count: overdueTasks.length, alert: overdueTasks.length > 0 },
    { id: 'completed', label: 'Completed', count: completedTasks.length },
  ];

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }} />
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 560, background: 'var(--bg-card)', zIndex: 1000, display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 32px rgba(0,0,0,0.12)' }}>
        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: getAvatarColor(user?.name), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700 }}>
                {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{user?.name}</h2>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>{user?.designation} · {user?.department}</p>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
              <X size={20} />
            </button>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {[
              { label: 'Active', value: activeTasks.length, color: '#2563EB' },
              { label: 'Review', value: reviewTasks.length, color: '#7C3AED' },
              { label: 'Overdue', value: overdueTasks.length, color: '#DC2626' },
              { label: 'Done', value: completedTasks.length, color: '#059669' },
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--bg)', borderRadius: 10, padding: '10px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Productivity bar */}
          <div style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                <TrendingUp size={12} /> Productivity
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: productivity >= 70 ? '#059669' : productivity >= 40 ? '#D97706' : '#DC2626' }}>{productivity}%</span>
            </div>
            <div style={{ height: 6, background: 'var(--border)', borderRadius: 99 }}>
              <div style={{ height: '100%', borderRadius: 99, background: productivity >= 70 ? '#059669' : productivity >= 40 ? '#D97706' : '#DC2626', width: `${productivity}%`, transition: 'width 0.5s ease' }} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 24px' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '14px 16px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
                display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              {tab.label}
              <span style={{ background: tab.alert ? '#FEF2F2' : 'var(--bg)', color: tab.alert ? '#DC2626' : 'var(--text-muted)', borderRadius: 99, padding: '1px 7px', fontSize: 11, fontWeight: 700 }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Task list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {tabTasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <CheckSquare size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
              <p>No {activeTab} tasks</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {tabTasks.map(task => {
                const project = projects.find(p => p.id === task.project);
                const st = STATUS_CONFIG[task.status] || STATUS_CONFIG.assigned;
                const pr = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
                const isOver = task.deadline && isBefore(parseISO(task.deadline), new Date());
                const daysLeft = task.deadline ? differenceInDays(parseISO(task.deadline), new Date()) : null;

                return (
                  <div
                    key={task.id}
                    onClick={() => onOpenTask(task)}
                    style={{ background: 'var(--bg)', borderRadius: 12, padding: '14px 16px', cursor: 'pointer', border: '1px solid var(--border)', transition: 'all 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 3, height: 36, borderRadius: 99, background: pr.color }} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{task.title}</div>
                          {project && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{project.name}</div>}
                        </div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: st.color, background: st.bg, padding: '3px 8px', borderRadius: 6, whiteSpace: 'nowrap', alignSelf: 'flex-start' }}>
                        {st.label}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingLeft: 11 }}>
                      <div style={{ flex: 1, height: 4, background: 'var(--border)', borderRadius: 99 }}>
                        <div style={{ height: '100%', background: '#2563EB', borderRadius: 99, width: `${task.progress || 0}%` }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>{task.progress || 0}%</span>
                      {task.deadline && (
                        <span style={{ fontSize: 11, color: isOver ? '#DC2626' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Clock size={11} />
                          {isOver ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? 'Today' : `${daysLeft}d`}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
