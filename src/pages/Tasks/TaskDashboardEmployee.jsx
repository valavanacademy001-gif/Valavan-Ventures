import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { CheckSquare, Clock, AlertTriangle, RotateCcw, Calendar, ChevronRight, Star, ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react';
import { isBefore, parseISO, isToday, differenceInDays, startOfWeek, isAfter, endOfWeek } from 'date-fns';
import { TASK_STATUS } from '../../data/mockData';
import TaskCard from './components/TaskCard';

const STATUS_CONFIG = {
  assigned:       { color: '#64748B', bg: '#F1F5F9', label: 'Assigned' },
  working:        { color: '#2563EB', bg: '#EFF6FF', label: 'In Progress' },
  submitted:      { color: '#7C3AED', bg: '#F5F3FF', label: 'Submitted' },
  under_review:   { color: '#D97706', bg: '#FFFBEB', label: 'In Review' },
  changes_needed: { color: '#EA580C', bg: '#FFF7ED', label: 'Revision Needed' },
  approved:       { color: '#059669', bg: '#ECFDF5', label: 'Approved' },
  completed:      { color: '#059669', bg: '#ECFDF5', label: 'Completed' },
};

export default function TaskDashboardEmployee({ onSwitchView, onOpenTask, onSelectKPI }) {
  const { tasks, projects, employees } = useApp();
  const { currentUser } = useAuth();
  const [historyOpen, setHistoryOpen] = useState(false);

  const myTasks = tasks.filter(t => t.assignedTo === currentUser?.id);
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });

  const activeTasks = myTasks.filter(t => !['completed', 'approved'].includes(t.status));
  const dueToday = activeTasks.filter(t => t.deadline && isToday(parseISO(t.deadline)));
  const overdue = activeTasks.filter(t => t.deadline && isBefore(parseISO(t.deadline), new Date(today)));
  const inReview = myTasks.filter(t => ['submitted', 'under_review'].includes(t.status));
  const revisions = myTasks.filter(t => t.status === 'changes_needed');
  const completedThisWeek = myTasks.filter(t =>
    ['completed', 'approved'].includes(t.status) &&
    t.createdAt && isAfter(new Date(t.createdAt), weekStart)
  );
  const completedAll = myTasks.filter(t => ['completed', 'approved'].includes(t.status));

  const topCards = [
    { label: 'Active Tasks', value: activeTasks.length, icon: CheckSquare, color: '#2563EB', bg: '#EFF6FF', filter: 'active' },
    { label: 'Due Today', value: dueToday.length, icon: Calendar, color: '#D97706', bg: '#FFFBEB', alert: dueToday.length > 0, filter: 'dueToday' },
    { label: 'Overdue', value: overdue.length, icon: AlertTriangle, color: '#DC2626', bg: '#FEF2F2', alert: overdue.length > 0, filter: 'overdue' },
    { label: 'In Review', value: inReview.length, icon: Clock, color: '#7C3AED', bg: '#F5F3FF', filter: 'review' },
    { label: 'Revision Needed', value: revisions.length, icon: RotateCcw, color: '#EA580C', bg: '#FFF7ED', alert: revisions.length > 0, filter: 'revision' },
    { label: 'Done This Week', value: completedThisWeek.length, icon: CheckCircle2, color: '#059669', bg: '#ECFDF5', filter: 'history' },
  ];

  const [activeFilter, setActiveFilter] = useState('active');

  const filteredTasks = {
    active: activeTasks.filter(t => !['submitted', 'under_review', 'changes_needed'].includes(t.status)),
    dueToday: dueToday,
    overdue: overdue,
    review: inReview,
    revision: revisions,
    history: completedAll,
  }[activeFilter] || activeTasks;

  const getUser = (id) => (employees || []).find(u => u.id === id);

  const productivity = myTasks.length > 0 ? Math.round((completedAll.length / myTasks.length) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Welcome bar */}
      <div style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #3B82F6 100%)', borderRadius: 18, padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: 'white' }}>
            My Tasks — {activeTasks.length} active
          </h2>
          <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
            {overdue.length > 0 ? `⚠️ ${overdue.length} overdue — focus on them first` : dueToday.length > 0 ? `📅 ${dueToday.length} task${dueToday.length > 1 ? 's' : ''} due today` : '✅ You\'re on track! No overdue tasks.'}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 36, fontWeight: 900, color: 'white', lineHeight: 1 }}>{productivity}%</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 3 }}>
              <TrendingUp size={11} /> Productivity
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid-responsive-6" style={{ gap: 12 }}>
        {topCards.map(c => (
          <div
            key={c.filter}
            onClick={() => onSelectKPI?.({ type: c.filter, label: c.label })}
            style={{
              background: 'var(--bg-card)',
              borderRadius: 14, padding: '16px 18px', cursor: 'pointer',
              border: c.alert ? `1px solid ${c.color}40` : '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.2s', position: 'relative', overflow: 'hidden'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
          >
            {c.alert && (
              <div style={{ position: 'absolute', top: 8, right: 8, width: 7, height: 7, background: c.color, borderRadius: '50%' }} />
            )}
            <div style={{ width: 36, height: 36, borderRadius: 10, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <c.icon size={17} color={c.color} />
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{c.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, fontWeight: 500 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="grid-sidebar-layout-sm" style={{ gap: 20 }}>
        {/* Task cards */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 16, boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
                {{
                  active: 'My Active Tasks',
                  dueToday: 'Due Today',
                  overdue: 'Overdue Tasks',
                  review: 'Submitted for Review',
                  revision: 'Needs Revision',
                  history: 'Completed Tasks',
                }[activeFilter] || 'My Tasks'}
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>{filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}</p>
            </div>
            <button onClick={() => onSwitchView('kanban')} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: 'var(--text-secondary)' }}>
              View Kanban <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 16 }}>
            {filteredTasks.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={48} style={{ marginBottom: 12, opacity: 0.3 }} />
                <p style={{ margin: 0, fontSize: 14 }}>No tasks in this category</p>
                {activeFilter === 'active' && <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>🎉 You're all caught up!</p>}
              </div>
            ) : (
              filteredTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  project={projects?.find(p => p.id === task.project)}
                  assignee={getUser(task.assignedTo)}
                  assigner={getUser(task.assignedBy)}
                  onClick={onOpenTask}
                />
              ))
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Needs attention */}
          {(overdue.length > 0 || revisions.length > 0) && (
            <div style={{ background: 'var(--bg-card)', borderRadius: 14, border: '1px solid #FECACA', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid #FECACA' }}>
                <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#DC2626', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <AlertTriangle size={14} /> Needs Attention
                </h4>
              </div>
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {overdue.slice(0, 3).map(t => (
                  <div key={t.id} onClick={() => onOpenTask(t)} style={{ padding: '8px 10px', background: '#FEF2F2', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>
                    <div style={{ fontWeight: 600, color: '#DC2626', marginBottom: 2 }}>{t.title}</div>
                    <div style={{ color: '#EF4444' }}>Overdue since {t.deadline}</div>
                  </div>
                ))}
                {revisions.slice(0, 3).map(t => (
                  <div key={t.id} onClick={() => onOpenTask(t)} style={{ padding: '8px 10px', background: '#FFF7ED', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>
                    <div style={{ fontWeight: 600, color: '#EA580C', marginBottom: 2 }}>{t.title}</div>
                    <div style={{ color: '#F97316' }}>Revision requested</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status summary */}
          <div style={{ background: 'var(--bg-card)', borderRadius: 14, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
              <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>Task Status</h4>
            </div>
            <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                const count = myTasks.filter(t => t.status === key).length;
                if (count === 0) return null;
                return (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.color }} />
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{cfg.label}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: cfg.color, background: cfg.bg, padding: '2px 8px', borderRadius: 6 }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* View shortcuts */}
          <div style={{ background: 'var(--bg-card)', borderRadius: 14, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { label: '🗂 Kanban Board', view: 'kanban' },
                { label: '📋 List View', view: 'table' },
              ].map(b => (
                <button key={b.view} onClick={() => onSwitchView(b.view)}
                  style={{ background: 'var(--bg)', border: 'none', borderRadius: 8, padding: '10px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--text-primary)', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {b.label} <ChevronRight size={14} color="var(--text-muted)" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
