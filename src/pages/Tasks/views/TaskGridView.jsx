import { useApp } from '../../../context/AppContext';
import { useAuth } from '../../../context/AuthContext';
import { TASK_STATUS, PRIORITY } from '../../../data/mockData';
import { format, parseISO, isBefore } from 'date-fns';
import { CheckSquare, MessageSquare, Paperclip, AlertCircle, Clock } from 'lucide-react';

const STATUS_COLORS = {
  [TASK_STATUS.ASSIGNED]: { bg: '#F8FAFC', color: '#64748B' },
  [TASK_STATUS.WORKING]: { bg: '#EFF6FF', color: '#3B82F6' },
  [TASK_STATUS.SUBMITTED]: { bg: '#F5F3FF', color: '#8B5CF6' },
  [TASK_STATUS.UNDER_REVIEW]: { bg: '#FFFBEB', color: '#F59E0B' },
  [TASK_STATUS.APPROVED]: { bg: '#ECFDF5', color: '#10B981' },
  [TASK_STATUS.COMPLETED]: { bg: '#ECFDF5', color: '#059669' },
  [TASK_STATUS.REJECTED]: { bg: '#FEF2F2', color: '#DC2626' },
  [TASK_STATUS.CHANGES_NEEDED]: { bg: '#FEF2F2', color: '#EF4444' },
};

const PRIORITY_COLORS = { critical: '#DC2626', high: '#F97316', medium: '#F59E0B', low: '#22C55E' };

export default function TaskGridView({ tasks, onOpenTask }) {
  const { employees, projects } = useApp();
  const todayStr = new Date().toISOString().split('T')[0];
  const now = new Date(todayStr);

  if (tasks.length === 0) {
    return <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>No tasks found matching your filters.</div>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 350px), 1fr))', gap: 24 }}>
      {tasks.map(task => {
        const project = projects.find(p => p.id === task.project);
        const assignee = employees.find(e => e.id === task.assignedTo);
        const isOverdue = task.deadline && isBefore(parseISO(task.deadline), now) && task.status !== TASK_STATUS.COMPLETED && task.status !== TASK_STATUS.APPROVED;
        
        const completedChecks = task.checklist ? task.checklist.filter(c => c.done).length : 0;
        const totalChecks = task.checklist ? task.checklist.length : 0;
        const checkProgress = totalChecks > 0 ? (completedChecks / totalChecks) * 100 : 0;

        return (
          <div key={task.id} 
               onClick={() => onOpenTask(task)}
               style={{ 
                 background: 'white', 
                 borderRadius: 16, 
                 padding: 24, 
                 border: isOverdue ? '1px solid #FECACA' : '1px solid var(--border-color)',
                 boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                 cursor: 'pointer',
                 transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                 display: 'flex', flexDirection: 'column'
               }}
               onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'; }}
               onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)'; }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span className="badge" style={{ background: STATUS_COLORS[task.status]?.bg, color: STATUS_COLORS[task.status]?.color }}>
                {task.status.replace('_', ' ')}
              </span>
              <span className="badge" style={{ border: `1px solid ${PRIORITY_COLORS[task.priority]}`, color: PRIORITY_COLORS[task.priority], background: 'transparent' }}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 8px 0', color: 'var(--text-primary)' }}>
              {isOverdue && <AlertCircle size={16} color="#DC2626" style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />}
              {task.title}
            </h3>
            
            <div style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24, flex: 1 }}>
              {task.description?.substring(0, 80)}{task.description?.length > 80 ? '...' : ''}
            </div>

            {totalChecks > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                  <span>Checklist Progress</span>
                  <span>{completedChecks}/{totalChecks}</span>
                </div>
                <div style={{ height: 6, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'var(--primary-color)', width: `${checkProgress}%` }} />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {assignee ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600 }}>
                      {assignee.name.charAt(0)}
                    </div>
                  </div>
                ) : <div style={{ width: 32, height: 32, borderRadius: '50%', border: '1px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>?</div>}
                
                <div style={{ display: 'flex', gap: 12, color: 'var(--text-muted)' }}>
                  {task.comments?.length > 0 && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
                      <MessageSquare size={14} /> {task.comments.length}
                    </span>
                  )}
                  {task.attachments?.length > 0 && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
                      <Paperclip size={14} /> {task.attachments.length}
                    </span>
                  )}
                </div>
              </div>

              {task.deadline && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: isOverdue ? '#DC2626' : 'var(--text-muted)' }}>
                  <Clock size={14} />
                  {format(parseISO(task.deadline), 'MMM d')}
                </div>
              )}
            </div>

          </div>
        );
      })}
    </div>
  );
}
