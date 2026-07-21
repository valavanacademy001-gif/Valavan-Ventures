import { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { useAuth } from '../../../context/AuthContext';
import { TASK_STATUS, ROLES } from '../../../data/mockData';
import { X, CheckCircle2, Clock, FileText, List, Activity, MessageSquare, Play, Lock, RotateCcw, ThumbsUp, AlertCircle, ChevronRight, Send } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useToast } from '../../../context/ToastContext';
import { STATUS_CONFIG, PRIORITY_CONFIG, getAvatarColor } from './TaskCard';

const ACTION_LABELS = {
  created: 'created this task',
  assigned: 'assigned this task',
  started: 'started working',
  submitted: 'submitted for review',
  approved: 'approved this task',
  rejected: 'rejected this task',
  changes_requested: 'requested changes',
  completed: 'marked as completed',
  commented: 'added a comment',
};

export default function TaskDetailsDrawer({ task: initialTask, onClose }) {
  const { tasks, employees, projects, updateTask, submitForReview, approveTask, rejectTask, requestChanges, addCommentToTask, logTaskTimeline } = useApp();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const task = tasks.find(t => t.id === initialTask?.id) || initialTask;

  const [activeTab, setActiveTab] = useState('info');
  const [commentText, setCommentText] = useState('');
  const [revisionNote, setRevisionNote] = useState('');
  const [showRevisionInput, setShowRevisionInput] = useState(false);
  const [progressValue, setProgressValue] = useState(task?.progress || 0);

  if (!task) return null;

  const project = projects?.find(p => p.id === task.project);
  const assignee = employees?.find(u => u.id === task.assignedTo);
  const assigner = employees?.find(u => u.id === task.assignedBy);
  const isAdmin = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.HR].includes(currentUser?.role);
  const isAssignee = currentUser?.id === task.assignedTo;

  const statusCfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.assigned;
  const priorityCfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

  // Is the task locked (submitted/under review)?
  const isLocked = ['submitted', 'under_review'].includes(task.status);
  const isCompleted = ['completed', 'approved'].includes(task.status);

  const checksDone = task.checklist?.filter(c => c.done).length || 0;
  const checksTotal = task.checklist?.length || 0;
  const overallProgress = checksTotal > 0 ? Math.round((checksDone / checksTotal) * 100) : (task.progress || 0);

  // Employee actions
  const handleStartTask = () => {
    updateTask(task.id, { status: 'working', startedAt: new Date().toISOString() });
    logTaskTimeline(task.id, 'started', currentUser.id);
    showToast('Task started! Good luck 💪', 'success');
  };

  const handleSubmitForReview = () => {
    submitForReview(task.id, currentUser.id, commentText);
    setCommentText('');
    showToast('Submitted for Admin review!', 'success');
  };

  const handleChecklistToggle = (index) => {
    if (isLocked || isCompleted) return;
    const newChecklist = [...task.checklist];
    newChecklist[index].done = !newChecklist[index].done;
    const done = newChecklist.filter(c => c.done).length;
    const pct = Math.round((done / newChecklist.length) * 100);
    updateTask(task.id, { checklist: newChecklist, progress: pct });
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    addCommentToTask(task.id, currentUser.id, commentText);
    setCommentText('');
    showToast('Comment added', 'success');
  };

  // Admin actions
  const handleApprove = () => {
    approveTask(task.id, currentUser.id);
    showToast('Task approved and marked as Completed! ✅', 'success');
    onClose();
  };

  const handleRequestRevision = () => {
    if (!revisionNote.trim()) {
      setShowRevisionInput(true);
      return;
    }
    requestChanges(task.id, currentUser.id, revisionNote);
    setShowRevisionInput(false);
    setRevisionNote('');
    showToast('Revision requested. Employee notified.', 'info');
    onClose();
  };

  const tabs = [
    { id: 'info',      icon: <FileText size={14}/>,      label: 'Overview' },
    { id: 'checklist', icon: <List size={14}/>,          label: `Checklist (${checksTotal})` },
    { id: 'comments',  icon: <MessageSquare size={14}/>, label: `Comments (${task.comments?.length || 0})` },
    { id: 'activity',  icon: <Activity size={14}/>,      label: 'Activity' },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', justifyContent: 'flex-end', background: 'rgba(0,0,0,0.35)' }} onClick={onClose}>
      <div
        style={{ width: 620, background: 'var(--bg-card)', display: 'flex', flexDirection: 'column', height: '100%', boxShadow: '-6px 0 28px rgba(0,0,0,0.12)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border)', background: 'var(--bg-hover)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                {/* Priority bar accent */}
                <div style={{ width: 4, height: 20, borderRadius: 99, background: priorityCfg.color, flexShrink: 0 }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: priorityCfg.color, background: priorityCfg.bg, padding: '3px 8px', borderRadius: 6 }}>
                  {priorityCfg.label}
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: statusCfg.color, background: statusCfg.bg, padding: '3px 8px', borderRadius: 6 }}>
                  {statusCfg.label}
                </span>
                {isLocked && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: '#7C3AED', background: '#F5F3FF', padding: '3px 8px', borderRadius: 6 }}>
                    <Lock size={10} /> Awaiting Review
                  </span>
                )}
                {isCompleted && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '3px 8px', borderRadius: 6 }}>
                    <CheckCircle2 size={10} /> Completed
                  </span>
                )}
              </div>
              <h2 style={{ fontSize: 19, fontWeight: 800, margin: 0, color: 'var(--text-primary)', lineHeight: 1.3 }}>{task.title}</h2>
              {project && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: project.color || '#2563EB' }} />
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{project.name}</span>
                </div>
              )}
            </div>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, marginLeft: 12 }}>
              <X size={20} />
            </button>
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{checksTotal > 0 ? `${checksDone}/${checksTotal} subtasks` : 'Progress'}</span>
              <span style={{ fontSize: 11, fontWeight: 700 }}>{overallProgress}%</span>
            </div>
            <div style={{ height: 6, background: 'var(--border)', borderRadius: 99 }}>
              <div style={{ height: '100%', background: isCompleted ? '#059669' : '#2563EB', borderRadius: 99, width: `${overallProgress}%`, transition: 'width 0.4s' }} />
            </div>
          </div>
        </div>

        {/* Locked notice for employee */}
        {isLocked && isAssignee && !isAdmin && (
          <div style={{ padding: '12px 28px', background: '#F5F3FF', borderBottom: '1px solid #DDD6FE', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Lock size={14} color="#7C3AED" />
            <span style={{ fontSize: 12, color: '#6D28D9', fontWeight: 600 }}>
              Task is locked — waiting for Admin to review your submission.
            </span>
          </div>
        )}

        {/* Revision notice for employee */}
        {task.status === 'changes_needed' && isAssignee && !isAdmin && (
          <div style={{ padding: '12px 28px', background: '#FFF7ED', borderBottom: '1px solid #FED7AA', display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={14} color="#EA580C" />
            <span style={{ fontSize: 12, color: '#C2410C', fontWeight: 600 }}>
              Admin requested changes — please review comments and resubmit.
            </span>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', padding: '0 28px', borderBottom: '1px solid var(--border)', gap: 4 }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '13px 12px',
                border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>

          {/* Overview tab */}
          {activeTab === 'info' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {task.description && (
                <div>
                  <h3 style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Description</h3>
                  <p style={{ lineHeight: 1.7, color: 'var(--text-primary)', margin: 0, fontSize: 14 }}>{task.description}</p>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, background: 'var(--bg)', padding: 18, borderRadius: 12, border: '1px solid var(--border)' }}>
                {[
                  { label: 'Assigned To', value: assignee?.name || '—', sub: assignee?.designation },
                  { label: 'Assigned By', value: assigner?.name || '—', sub: assigner?.designation },
                  { label: 'Deadline', value: task.deadline ? format(parseISO(task.deadline), 'MMM d, yyyy') : 'No deadline' },
                  { label: 'Estimated', value: task.estimatedHours ? `${task.estimatedHours}h` : '—' },
                ].map(item => (
                  <div key={item.label}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 5 }}>{item.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{item.value}</div>
                    {item.sub && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.sub}</div>}
                  </div>
                ))}
              </div>

              {task.tags?.length > 0 && (
                <div>
                  <h3 style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Tags</h3>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {task.tags.map(tag => (
                      <span key={tag} style={{ fontSize: 11, fontWeight: 600, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, padding: '3px 10px', color: 'var(--text-secondary)' }}>#{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Checklist tab */}
          {activeTab === 'checklist' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {checksTotal === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>No checklist items for this task.</div>
              ) : (
                task.checklist.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleChecklistToggle(idx)}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', background: 'var(--bg)', borderRadius: 10, border: '1px solid var(--border)', cursor: (isLocked || isCompleted) ? 'default' : 'pointer', transition: 'all 0.15s' }}
                  >
                    <div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${item.done ? '#059669' : 'var(--border)'}`, background: item.done ? '#059669' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {item.done && <CheckCircle2 size={13} color="white" />}
                    </div>
                    <span style={{ fontSize: 14, textDecoration: item.done ? 'line-through' : 'none', color: item.done ? 'var(--text-muted)' : 'var(--text-primary)' }}>{item.text}</span>
                  </div>
                ))
              )}
              <div style={{ paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)' }}>
                <span>{checksDone} of {checksTotal} completed</span>
                <span style={{ fontWeight: 700, color: overallProgress === 100 ? '#059669' : 'var(--text-primary)' }}>{overallProgress}%</span>
              </div>
            </div>
          )}

          {/* Comments tab */}
          {activeTab === 'comments' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, height: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {task.comments?.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)', fontSize: 13 }}>No comments yet. Start the discussion!</div>
                )}
                {task.comments?.map(c => {
                  const author = employees?.find(u => u.id === c.userId);
                  const isOwn = c.userId === currentUser?.id;
                  return (
                    <div key={c.id} style={{ display: 'flex', gap: 10, justifyContent: isOwn ? 'flex-end' : 'flex-start' }}>
                      {!isOwn && (
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: getAvatarColor(author?.name), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                          {author?.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                      )}
                      <div style={{ maxWidth: '75%' }}>
                        <div style={{ display: 'flex', justifyContent: isOwn ? 'flex-end' : 'flex-start', gap: 6, marginBottom: 4 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>{author?.name}</span>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{format(parseISO(c.timestamp), 'MMM d, h:mm a')}</span>
                        </div>
                        <div style={{ background: isOwn ? 'var(--primary)' : 'var(--bg)', color: isOwn ? 'white' : 'var(--text-primary)', padding: '10px 14px', borderRadius: 12, borderTopLeftRadius: isOwn ? 12 : 3, borderTopRightRadius: isOwn ? 3 : 12, fontSize: 14, lineHeight: 1.5, border: isOwn ? 'none' : '1px solid var(--border)' }}>
                          {c.text}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
                <input className="input" style={{ flex: 1 }} placeholder="Write a comment..." value={commentText} onChange={e => setCommentText(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleAddComment()} />
                <button className="btn btn-primary" onClick={handleAddComment} disabled={!commentText.trim()}>
                  <Send size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Activity tab */}
          {activeTab === 'activity' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}>
              <div style={{ position: 'absolute', left: 15, top: 0, bottom: 0, width: 2, background: 'var(--border)' }} />
              {task.timeline?.map((ev, i) => {
                const actor = employees?.find(u => u.id === ev.userId);
                return (
                  <div key={ev.id || i} style={{ display: 'flex', gap: 14, position: 'relative', zIndex: 1, paddingBottom: 20 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-card)', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Activity size={13} color="var(--primary)" />
                    </div>
                    <div style={{ paddingTop: 5 }}>
                      <p style={{ margin: '0 0 2px 0', fontSize: 13 }}>
                        <span style={{ fontWeight: 700 }}>{actor?.name || 'System'}</span>{' '}
                        <span style={{ color: 'var(--text-muted)' }}>{ACTION_LABELS[ev.action] || ev.action}</span>
                      </p>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        {ev.timestamp ? format(parseISO(ev.timestamp), 'MMM d, h:mm a') : '—'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div style={{ padding: '16px 28px', borderTop: '1px solid var(--border)', background: 'var(--bg-hover)' }}>

          {/* Admin review panel */}
          {isAdmin && isLocked && (
            <div>
              {showRevisionInput ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
                  <textarea
                    className="input"
                    rows={2}
                    placeholder="Describe what changes are needed..."
                    value={revisionNote}
                    onChange={e => setRevisionNote(e.target.value)}
                    style={{ resize: 'none' }}
                  />
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button className="btn btn-secondary" onClick={() => setShowRevisionInput(false)}>Cancel</button>
                    <button className="btn" style={{ background: '#EA580C', color: 'white' }} onClick={handleRequestRevision} disabled={!revisionNote.trim()}>
                      <RotateCcw size={14} /> Send for Revision
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <button className="btn" style={{ background: '#FFF7ED', color: '#EA580C', border: '1px solid #FED7AA' }} onClick={() => setShowRevisionInput(true)}>
                    <RotateCcw size={14} /> Revision Required
                  </button>
                  <button className="btn" style={{ background: '#059669', color: 'white', border: 'none' }} onClick={handleApprove}>
                    <ThumbsUp size={14} /> Approve & Complete
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Employee — Start task */}
          {isAssignee && !isAdmin && task.status === 'assigned' && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" onClick={handleStartTask}>
                <Play size={14} /> Start Task
              </button>
            </div>
          )}

          {/* Employee — Submit for review */}
          {isAssignee && !isAdmin && (task.status === 'working' || task.status === 'changes_needed') && (
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" onClick={handleSubmitForReview}>
                <Send size={14} /> Submit for Review
              </button>
            </div>
          )}

          {/* Employee — Locked state */}
          {isAssignee && !isAdmin && isLocked && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#7C3AED', fontWeight: 600, fontSize: 13 }}>
              <Lock size={15} /> Waiting for Admin approval...
            </div>
          )}

          {/* Completed state */}
          {isCompleted && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#059669', fontWeight: 700, fontSize: 14 }}>
              <CheckCircle2 size={18} /> Task Completed
            </div>
          )}

          {/* Admin viewing non-submitted task */}
          {isAdmin && !isLocked && !isCompleted && (
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Approve button will appear once employee submits for review.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
