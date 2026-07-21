import { format, parseISO, differenceInDays, isToday, isTomorrow, isBefore } from 'date-fns';
import { Clock, MessageSquare, Paperclip, CheckSquare, AlertCircle, User, Calendar } from 'lucide-react';

const PRIORITY_CONFIG = {
  critical: { color: '#DC2626', bg: '#FEF2F2', label: 'Critical' },
  high:     { color: '#EA580C', bg: '#FFF7ED', label: 'High' },
  medium:   { color: '#2563EB', bg: '#EFF6FF', label: 'Medium' },
  low:      { color: '#64748B', bg: '#F8FAFC', label: 'Low' },
};

const STATUS_CONFIG = {
  assigned:       { color: '#64748B', bg: '#F1F5F9', label: 'Assigned' },
  working:        { color: '#2563EB', bg: '#EFF6FF', label: 'In Progress' },
  submitted:      { color: '#7C3AED', bg: '#F5F3FF', label: 'Submitted' },
  under_review:   { color: '#D97706', bg: '#FFFBEB', label: 'In Review' },
  changes_needed: { color: '#EA580C', bg: '#FFF7ED', label: 'Revision' },
  rejected:       { color: '#DC2626', bg: '#FEF2F2', label: 'Rejected' },
  approved:       { color: '#059669', bg: '#ECFDF5', label: 'Approved' },
  completed:      { color: '#059669', bg: '#ECFDF5', label: 'Completed' },
};

function getDeadlineDisplay(deadline) {
  if (!deadline) return null;
  const d = parseISO(deadline);
  const now = new Date();
  const days = differenceInDays(d, now);
  if (isBefore(d, now)) return { label: `${Math.abs(days)}d overdue`, color: '#DC2626', urgent: true };
  if (isToday(d)) return { label: 'Due today', color: '#EA580C', urgent: true };
  if (isTomorrow(d)) return { label: 'Due tomorrow', color: '#D97706', urgent: true };
  if (days <= 3) return { label: `${days}d left`, color: '#D97706', urgent: false };
  return { label: format(d, 'MMM d'), color: 'var(--text-muted)', urgent: false };
}

const COLORS = ['#2563EB', '#7C3AED', '#059669', '#D97706', '#DC2626', '#0EA5E9'];
const getAvatarColor = (name) => COLORS[(name?.charCodeAt(0) || 0) % COLORS.length];

export default function TaskCard({ task, project, assignee, assigner, onClick }) {
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const status = STATUS_CONFIG[task.status] || STATUS_CONFIG.assigned;
  const deadline = getDeadlineDisplay(task.deadline);
  const isOverdue = deadline?.urgent && task.status !== 'completed' && task.status !== 'approved';
  const checksDone = task.checklist?.filter(c => c.done).length || 0;
  const checksTotal = task.checklist?.length || 0;
  const checkPct = checksTotal > 0 ? Math.round((checksDone / checksTotal) * 100) : (task.progress || 0);

  return (
    <div
      onClick={() => onClick(task)}
      style={{
        background: 'var(--bg-card)',
        borderRadius: 14,
        padding: '0',
        boxShadow: 'var(--shadow-sm)',
        cursor: 'pointer',
        border: isOverdue ? '1px solid #FECACA' : '1px solid var(--border)',
        transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
    >
      {/* Priority bar */}
      <div style={{ height: 3, background: priority.color, borderRadius: '14px 14px 0 0' }} />

      <div style={{ padding: '16px 18px 18px' }}>
        {/* Top row: project + priority */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          {project ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: project.color || '#2563EB' }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {project.name}
              </span>
            </div>
          ) : <div />}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {isOverdue && <AlertCircle size={14} color="#DC2626" />}
            <span style={{ fontSize: 11, fontWeight: 700, color: priority.color, background: priority.bg, padding: '2px 8px', borderRadius: 6 }}>
              {priority.label}
            </span>
          </div>
        </div>

        {/* Task title */}
        <h4 style={{ margin: '0 0 6px 0', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {task.title}
        </h4>

        {/* Status badge */}
        <div style={{ marginBottom: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: status.color, background: status.bg, padding: '3px 8px', borderRadius: 6 }}>
            {status.label}
          </span>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Progress</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)' }}>{checkPct}%</span>
          </div>
          <div style={{ height: 5, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: checkPct >= 100 ? '#059669' : '#2563EB', width: `${checkPct}%`, borderRadius: 99, transition: 'width 0.4s ease' }} />
          </div>
        </div>

        {/* Deadline + assigned by */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          {deadline ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Calendar size={12} color={deadline.color} />
              <span style={{ fontSize: 12, fontWeight: 600, color: deadline.color }}>{deadline.label}</span>
            </div>
          ) : <div />}
          {assigner && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <User size={12} color="var(--text-muted)" />
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{assigner.name?.split(' ')[0]}</span>
            </div>
          )}
        </div>

        {/* Bottom row: assignee + meta */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {assignee && (
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: getAvatarColor(assignee.name), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>
                {assignee.name?.split(' ').map(n => n[0]).join('').slice(0,2)}
              </div>
            )}
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>{assignee?.name?.split(' ')[0]}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {checksTotal > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: 'var(--text-muted)' }}>
                <CheckSquare size={12} /> {checksDone}/{checksTotal}
              </div>
            )}
            {task.comments?.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: 'var(--text-muted)' }}>
                <MessageSquare size={12} /> {task.comments.length}
              </div>
            )}
            {task.attachments?.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: 'var(--text-muted)' }}>
                <Paperclip size={12} /> {task.attachments.length}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { PRIORITY_CONFIG, STATUS_CONFIG, getDeadlineDisplay, getAvatarColor };
