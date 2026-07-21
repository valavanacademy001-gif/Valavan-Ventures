import { useApp } from '../../../context/AppContext';
import { TASK_STATUS } from '../../../data/mockData';
import { format, parseISO, isBefore, isToday, isTomorrow, isPast } from 'date-fns';
import { Clock, CheckCircle } from 'lucide-react';

export default function TaskTimelineView({ tasks, onOpenTask }) {
  const { employees } = useApp();
  
  if (tasks.length === 0) {
    return <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>No tasks found matching your filters.</div>;
  }

  // Sort tasks by deadline
  const sortedTasks = [...tasks].sort((a, b) => {
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;
    return new Date(a.deadline) - new Date(b.deadline);
  });

  const getTimelineGroup = (dateStr) => {
    if (!dateStr) return 'No Deadline';
    const date = parseISO(dateStr);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isPast(date)) return 'Overdue';
    return format(date, 'MMMM yyyy');
  };

  const groupedTasks = sortedTasks.reduce((acc, task) => {
    const group = getTimelineGroup(task.deadline);
    if (!acc[group]) acc[group] = [];
    acc[group].push(task);
    return acc;
  }, {});

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 0' }}>
      {Object.entries(groupedTasks).map(([group, groupTasks]) => (
        <div key={group} style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: group === 'Overdue' ? '#DC2626' : 'var(--text-primary)' }}>
              {group}
            </h3>
            <div style={{ height: 1, background: 'var(--border-color)', flex: 1 }} />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}>
            <div style={{ position: 'absolute', left: 23, top: 24, bottom: 24, width: 2, background: 'var(--border-color)' }} />
            
            {groupTasks.map(task => {
              const assignee = employees.find(e => e.id === task.assignedTo);
              const isCompleted = task.status === TASK_STATUS.COMPLETED || task.status === TASK_STATUS.APPROVED;
              
              return (
                <div key={task.id} 
                     onClick={() => onOpenTask(task)}
                     style={{ display: 'flex', gap: 24, padding: '16px 0', cursor: 'pointer', group: 'timeline-item' }}
                     onMouseEnter={e => e.currentTarget.querySelector('.card').style.transform = 'translateX(4px)'}
                     onMouseLeave={e => e.currentTarget.querySelector('.card').style.transform = 'translateX(0)'}>
                  
                  <div style={{ position: 'relative', width: 48, display: 'flex', justifyContent: 'center', zIndex: 1 }}>
                    <div style={{ 
                      width: 32, height: 32, borderRadius: '50%', 
                      background: isCompleted ? '#10B981' : 'white', 
                      border: `2px solid ${isCompleted ? '#10B981' : 'var(--primary-color)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: isCompleted ? 'white' : 'var(--primary-color)',
                      marginTop: 16
                    }}>
                      {isCompleted ? <CheckCircle size={16} /> : <Clock size={16} />}
                    </div>
                  </div>
                  
                  <div className="card" style={{ flex: 1, padding: 20, borderRadius: 12, transition: 'transform 0.2s ease', border: group === 'Overdue' && !isCompleted ? '1px solid #FECACA' : '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{task.title}</h4>
                      <span className="badge" style={{ background: '#F8FAFC', color: 'var(--text-muted)' }}>{task.status.replace('_', ' ')}</span>
                    </div>
                    
                    <p style={{ margin: '0 0 16px 0', fontSize: 14, color: 'var(--text-muted)' }}>
                      {task.description?.substring(0, 100)}{task.description?.length > 100 ? '...' : ''}
                    </p>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {assignee && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-primary)' }}>
                          <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                            {assignee.name.charAt(0)}
                          </div>
                          {assignee.name}
                        </div>
                      )}
                      {task.deadline && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: group === 'Overdue' && !isCompleted ? '#DC2626' : 'var(--text-muted)', marginLeft: 'auto' }}>
                          <Clock size={14} />
                          {format(parseISO(task.deadline), 'MMM d, yyyy')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
