import { useApp } from '../../../context/AppContext';
import { useAuth } from '../../../context/AuthContext';
import { AlertCircle, Clock, Plus } from 'lucide-react';
import { format, parseISO, isBefore } from 'date-fns';
import { TASK_STATUS, mockUsers } from '../../../data/mockData';
import { PRIORITY_CONFIG, STATUS_CONFIG, getAvatarColor } from '../components/TaskCard';

const COLUMNS = [
  { id: 'assigned',       label: 'Assigned',    color: '#64748B', accent: '#F1F5F9' },
  { id: 'working',        label: 'In Progress', color: '#2563EB', accent: '#EFF6FF' },
  { id: 'submitted',      label: 'Submitted',   color: '#7C3AED', accent: '#F5F3FF' },
  { id: 'changes_needed', label: 'Revision',    color: '#EA580C', accent: '#FFF7ED' },
  { id: 'approved',       label: 'Approved',    color: '#059669', accent: '#ECFDF5' },
];

export default function TaskKanbanView({ tasks, onOpenTask }) {
  const { projects } = useApp();
  const now = new Date();

  return (
    <div style={{ display: 'flex', gap: 16, overflowX: 'auto', height: '100%', alignItems: 'flex-start', paddingBottom: 16 }}>
      {COLUMNS.map(col => {
        const colTasks = tasks.filter(t =>
          t.status === col.id ||
          (col.id === 'approved' && t.status === 'completed')
        );
        const completedInCol = colTasks.filter(t => t.progress >= 100).length;
        const completionPct = colTasks.length > 0 ? Math.round((completedInCol / colTasks.length) * 100) : 0;

        return (
          <div key={col.id} style={{ minWidth: 300, width: 300, display: 'flex', flexDirection: 'column', gap: 0, maxHeight: '100%' }}>
            {/* Column header */}
            <div style={{ background: 'var(--bg-card)', borderRadius: '14px 14px 0 0', padding: '14px 16px', borderBottom: '2px solid ' + col.color, border: '1px solid var(--border)', borderBottom: '3px solid ' + col.color }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: col.color }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{col.label}</span>
                </div>
                <span style={{ background: col.accent, color: col.color, fontSize: 12, fontWeight: 800, borderRadius: 99, padding: '2px 10px' }}>
                  {colTasks.length}
                </span>
              </div>
              {/* Completion bar */}
              <div style={{ height: 3, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: col.color, width: `${completionPct}%`, borderRadius: 99, transition: 'width 0.4s ease', opacity: 0.6 }} />
              </div>
            </div>

            {/* Tasks */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, padding: '10px 0', background: 'transparent' }}>
              {colTasks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 16px', color: 'var(--text-muted)', fontSize: 12, background: 'var(--bg-card)', borderRadius: '0 0 12px 12px', border: '1px solid var(--border)', borderTop: 'none' }}>
                  No tasks here
                </div>
              ) : (
                colTasks.map(task => {
                  const project = projects?.find(p => p.id === task.project);
                  const assignee = mockUsers.find(u => u.id === task.assignedTo);
                  const pr = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
                  const isOverdue = task.deadline && isBefore(parseISO(task.deadline), now) && !['completed', 'approved'].includes(task.status);
                  const checksDone = task.checklist?.filter(c => c.done).length || 0;
                  const checksTotal = task.checklist?.length || 0;
                  const pct = checksTotal > 0 ? Math.round((checksDone / checksTotal) * 100) : (task.progress || 0);

                  return (
                    <div
                      key={task.id}
                      onClick={() => onOpenTask(task)}
                      style={{
                        background: 'var(--bg-card)', borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
                        border: isOverdue ? '1px solid #FECACA' : '1px solid var(--border)',
                        boxShadow: 'var(--shadow-xs)', transition: 'all 0.18s cubic-bezier(0.4,0,0.2,1)'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-xs)'; }}
                    >
                      {/* Priority top bar */}
                      <div style={{ height: 3, background: pr.color }} />
                      <div style={{ padding: '12px 14px 14px' }}>
                        {/* Project + priority */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          {project ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                              <div style={{ width: 6, height: 6, borderRadius: '50%', background: project.color }} />
                              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{project.name}</span>
                            </div>
                          ) : <div />}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            {isOverdue && <AlertCircle size={12} color="#DC2626" />}
                            <span style={{ fontSize: 10, fontWeight: 700, color: pr.color }}>{pr.label}</span>
                          </div>
                        </div>

                        {/* Title */}
                        <p style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {task.title}
                        </p>

                        {/* Progress */}
                        <div style={{ marginBottom: 10 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{checksTotal > 0 ? `${checksDone}/${checksTotal} tasks` : 'Progress'}</span>
                            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)' }}>{pct}%</span>
                          </div>
                          <div style={{ height: 4, background: 'var(--border)', borderRadius: 99 }}>
                            <div style={{ height: '100%', background: col.color, borderRadius: 99, width: `${pct}%`, transition: 'width 0.3s' }} />
                          </div>
                        </div>

                        {/* Footer */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          {assignee && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                              <div style={{ width: 22, height: 22, borderRadius: '50%', background: getAvatarColor(assignee.name), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700 }}>
                                {assignee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </div>
                              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{assignee.name.split(' ')[0]}</span>
                            </div>
                          )}
                          {task.deadline && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: isOverdue ? '#DC2626' : 'var(--text-muted)' }}>
                              <Clock size={11} />
                              {format(parseISO(task.deadline), 'MMM d')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
