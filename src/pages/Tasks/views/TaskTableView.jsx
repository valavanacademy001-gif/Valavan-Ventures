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

export default function TaskTableView({ tasks, onOpenTask }) {
  const { employees, projects } = useApp();
  const todayStr = new Date().toISOString().split('T')[0];
  const now = new Date(todayStr);

  if (tasks.length === 0) {
    return <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>No tasks found matching your filters.</div>;
  }

  return (
    <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border-color)', overflow: 'hidden' }}>
      <table className="table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead style={{ background: '#F8FAFC', borderBottom: '1px solid var(--border-color)' }}>
          <tr>
            <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-muted)', fontSize: 13 }}>Task Name</th>
            <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-muted)', fontSize: 13 }}>Project</th>
            <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-muted)', fontSize: 13 }}>Status</th>
            <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-muted)', fontSize: 13 }}>Priority</th>
            <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-muted)', fontSize: 13 }}>Assignee</th>
            <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-muted)', fontSize: 13 }}>Due Date</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => {
            const project = projects.find(p => p.id === task.project);
            const assignee = employees.find(e => e.id === task.assignedTo);
            const isOverdue = task.deadline && isBefore(parseISO(task.deadline), now) && task.status !== TASK_STATUS.COMPLETED && task.status !== TASK_STATUS.APPROVED;
            
            return (
              <tr key={task.id} 
                  onClick={() => onOpenTask(task)}
                  style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer', transition: 'background 0.2s ease' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {isOverdue && <AlertCircle size={14} color="#DC2626" />}
                    {task.title}
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                    {task.checklist?.length > 0 && (
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CheckSquare size={12} /> {task.checklist.filter(c=>c.done).length}/{task.checklist.length}
                      </span>
                    )}
                    {task.comments?.length > 0 && (
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MessageSquare size={12} /> {task.comments.length}
                      </span>
                    )}
                  </div>
                </td>
                
                <td style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: 14 }}>
                  {project?.name || 'No Project'}
                </td>
                
                <td style={{ padding: '16px 24px' }}>
                  <span className="badge" style={{ background: STATUS_COLORS[task.status]?.bg, color: STATUS_COLORS[task.status]?.color }}>
                    {task.status.replace('_', ' ')}
                  </span>
                </td>
                
                <td style={{ padding: '16px 24px' }}>
                  <span className="badge" style={{ border: `1px solid ${PRIORITY_COLORS[task.priority]}`, color: PRIORITY_COLORS[task.priority], background: 'transparent' }}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                </td>
                
                <td style={{ padding: '16px 24px' }}>
                  {assignee ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600 }}>
                        {assignee.name.charAt(0)}
                      </div>
                      <span style={{ fontSize: 14 }}>{assignee.name}</span>
                    </div>
                  ) : <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Unassigned</span>}
                </td>
                
                <td style={{ padding: '16px 24px' }}>
                  {task.deadline ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: isOverdue ? '#DC2626' : 'var(--text-muted)', fontSize: 14 }}>
                      <Clock size={14} />
                      {format(parseISO(task.deadline), 'MMM d, yyyy')}
                    </div>
                  ) : <span style={{ color: 'var(--text-muted)' }}>-</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
