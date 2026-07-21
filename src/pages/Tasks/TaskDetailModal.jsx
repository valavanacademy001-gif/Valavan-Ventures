import { useState } from 'react';
import { X, Calendar, User, Tag, CheckSquare, MessageSquare, Clock, Send, Check, RotateCcw, AlertCircle, ChevronRight, Paperclip } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { mockUsers, mockProjects, TASK_STATUS, ROLES } from '../../data/mockData';
import { format, parseISO } from 'date-fns';

const PRIORITY_BADGE = {
  critical: { cls: 'badge-danger', label: 'Critical' },
  high: { cls: 'badge-warning', label: 'High' },
  medium: { cls: 'badge-info', label: 'Medium' },
  low: { cls: 'badge-success', label: 'Low' },
};

const STATUS_LABELS = {
  assigned: 'Assigned',
  working: 'Working',
  submitted: 'Submitted for Review',
  under_review: 'Under Review',
  approved: 'Approved',
  completed: 'Completed',
  rejected: 'Rejected',
  changes_needed: 'Changes Needed',
};

export default function TaskDetailModal({ task, onClose, onUpdate }) {
  const { currentUser } = useAuth();
  const { submitForReview, approveTask, rejectTask, requestChanges } = useApp();
  const [comment, setComment] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  const [checklist, setChecklist] = useState(task.checklist || []);

  const assignee = mockUsers.find(u => u.id === task.assignedTo);
  const assigner = mockUsers.find(u => u.id === task.assignedBy);
  const project = mockProjects.find(p => p.id === task.project);
  const isAdmin = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER].includes(currentUser?.role);
  const isAssignee = task.assignedTo === currentUser?.id;

  const p = PRIORITY_BADGE[task.priority] || PRIORITY_BADGE.medium;
  const completedChecks = checklist.filter(c => c.done).length;
  const checklistProgress = checklist.length > 0 ? Math.round((completedChecks / checklist.length) * 100) : 0;

  const handleToggleCheck = (id) => {
    const updated = checklist.map(c => c.id === id ? { ...c, done: !c.done } : c);
    setChecklist(updated);
    onUpdate({ checklist: updated });
  };

  const handleAddComment = () => {
    if (!comment.trim()) return;
    const newComment = {
      id: `cm${Date.now()}`,
      userId: currentUser.id,
      text: comment.trim(),
      timestamp: new Date().toISOString(),
    };
    const updated = [...(task.comments || []), newComment];
    onUpdate({ comments: updated });
    setComment('');
  };

  const handleSubmit = () => {
    submitForReview(task.id, currentUser.id);
    onUpdate({ status: TASK_STATUS.SUBMITTED });
  };

  const handleApprove = () => {
    approveTask(task.id);
    onUpdate({ status: TASK_STATUS.COMPLETED, progress: 100 });
  };

  const handleReject = () => {
    const reason = window.prompt('Reason for rejection:');
    if (reason) {
      rejectTask(task.id, reason);
      onUpdate({ status: TASK_STATUS.REJECTED });
    }
  };

  const handleChanges = () => {
    const reason = window.prompt('What changes are needed?');
    if (reason) {
      requestChanges(task.id, reason);
      onUpdate({ status: TASK_STATUS.CHANGES_NEEDED });
    }
  };

  const statusColors = {
    assigned: '#94A3B8', working: '#3B82F6', submitted: '#8B5CF6',
    under_review: '#F59E0B', approved: '#10B981', completed: '#059669',
    rejected: '#DC2626', changes_needed: '#D97706',
  };

  return (
    <div className="modal-overlay animate-fadeIn" onClick={onClose}>
      <div className="modal modal-xl animate-scaleIn" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span className={`badge ${p.cls}`}>{p.label}</span>
              <span className="badge badge-gray" style={{ textTransform: 'capitalize' }}>
                <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: statusColors[task.status], marginRight: 4 }} />
                {STATUS_LABELS[task.status] || task.status}
              </span>
              {project && <span className="badge badge-primary">{project.name}</span>}
            </div>
            <div className="modal-title">{task.title}</div>
          </div>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="grid-sidebar-layout-sm" style={{ height: 'calc(90vh - 80px)', overflow: 'hidden' }}>
          {/* Left - Main content */}
          <div style={{ overflow: 'auto', borderRight: '1px solid var(--border)' }}>
            {/* Tabs */}
            <div style={{ padding: '0 24px', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--bg-card)', zIndex: 1 }}>
              <div className="tabs tabs-line" style={{ borderBottom: 'none' }}>
                {['details', 'checklist', 'comments', 'history'].map(tab => (
                  <div key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)} style={{ textTransform: 'capitalize' }}>
                    {tab}
                    {tab === 'comments' && task.comments?.length > 0 && (
                      <span className="sidebar-badge" style={{ marginLeft: 6, background: 'var(--primary)' }}>{task.comments.length}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: 24 }}>
              {/* Details Tab */}
              {activeTab === 'details' && (
                <div>
                  <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24 }}>
                    {task.description || 'No description provided.'}
                  </div>
                  {/* Progress */}
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Overall Progress</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>{task.progress}%</span>
                    </div>
                    <div className="progress-bar progress-bar-lg">
                      <div className="progress-fill" style={{ width: `${task.progress}%` }} />
                    </div>
                  </div>
                  {/* Tags */}
                  {task.tags?.length > 0 && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                      {task.tags.map(tag => <span key={tag} className="badge badge-gray"><Tag size={10} /> {tag}</span>)}
                    </div>
                  )}
                  {/* Attachments */}
                  {task.attachments?.length > 0 && (
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Attachments</div>
                      {task.attachments.map((att, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--bg-hover)', borderRadius: 8, marginBottom: 6 }}>
                          <Paperclip size={14} color="var(--text-muted)" />
                          <span style={{ fontSize: 13, color: 'var(--primary)' }}>{att}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Checklist Tab */}
              {activeTab === 'checklist' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{completedChecks}/{checklist.length} completed</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>{checklistProgress}%</span>
                  </div>
                  <div className="progress-bar" style={{ marginBottom: 20 }}>
                    <div className="progress-fill" style={{ width: `${checklistProgress}%` }} />
                  </div>
                  {checklist.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                      onClick={() => isAssignee && handleToggleCheck(item.id)}>
                      <div style={{
                        width: 20, height: 20, borderRadius: 6, border: `2px solid ${item.done ? 'var(--primary)' : 'var(--border)'}`,
                        background: item.done ? 'var(--primary)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s'
                      }}>
                        {item.done && <Check size={11} color="white" strokeWidth={3} />}
                      </div>
                      <span style={{ fontSize: 13.5, color: item.done ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: item.done ? 'line-through' : 'none' }}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                  {checklist.length === 0 && (
                    <div className="empty-state" style={{ padding: '30px' }}>
                      <p>No checklist items</p>
                    </div>
                  )}
                </div>
              )}

              {/* Comments Tab */}
              {activeTab === 'comments' && (
                <div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
                    {(task.comments || []).map(c => {
                      const user = mockUsers.find(u => u.id === c.userId);
                      return (
                        <div key={c.id} style={{ display: 'flex', gap: 12 }}>
                          <div className="avatar avatar-sm" style={{ background: '#2563EB', flexShrink: 0 }}>
                            {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?'}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                              <span style={{ fontSize: 13, fontWeight: 700 }}>{user?.name}</span>
                              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{format(new Date(c.timestamp), 'MMM d, h:mm a')}</span>
                            </div>
                            <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', background: 'var(--bg-hover)', padding: '10px 14px', borderRadius: '0 10px 10px 10px', lineHeight: 1.5 }}>
                              {c.text}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {(task.comments || []).length === 0 && (
                      <div className="empty-state" style={{ padding: '20px' }}>
                        <p>No comments yet</p>
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <div className="avatar avatar-sm" style={{ background: '#2563EB', flexShrink: 0 }}>
                      {currentUser?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?'}
                    </div>
                    <div style={{ flex: 1, display: 'flex', gap: 8 }}>
                      <textarea
                        className="input"
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        style={{ resize: 'none', height: 80 }}
                        onKeyDown={e => e.key === 'Enter' && e.ctrlKey && handleAddComment()}
                      />
                      <button className="btn btn-primary btn-icon" onClick={handleAddComment}>
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* History Tab */}
              {activeTab === 'history' && (
                <div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Task created {format(new Date(task.createdAt), 'MMMM d, yyyy')}</div>
                  {task.revisionHistory?.length > 0 ? task.revisionHistory.map((rev, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)' }}>v{rev.version}</span>
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{rev.note}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{format(new Date(rev.date), 'MMM d, h:mm a')}</div>
                      </div>
                    </div>
                  )) : (
                    <div className="empty-state" style={{ padding: '20px' }}>
                      <p>No revision history</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right - Metadata */}
          <div style={{ padding: 24, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Action buttons */}
            {isAssignee && (task.status === TASK_STATUS.WORKING || task.status === TASK_STATUS.CHANGES_NEEDED) && (
              <button className="btn btn-primary w-full" onClick={handleSubmit}>
                <Send size={15} /> Submit for Review
              </button>
            )}
            {isAssignee && task.status === TASK_STATUS.ASSIGNED && (
              <button className="btn btn-secondary w-full" onClick={() => onUpdate({ status: TASK_STATUS.WORKING, progress: 10 })}>
                ▶ Start Working
              </button>
            )}
            {isAdmin && (task.status === TASK_STATUS.SUBMITTED || task.status === TASK_STATUS.UNDER_REVIEW) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button className="btn btn-success w-full" onClick={handleApprove}>
                  <Check size={15} /> Approve Task
                </button>
                <button className="btn btn-secondary w-full" onClick={handleChanges}>
                  <RotateCcw size={15} /> Request Changes
                </button>
                <button className="btn btn-danger w-full" onClick={handleReject}>
                  <X size={15} /> Reject
                </button>
              </div>
            )}

            <div className="divider" />

            {/* Metadata */}
            {[
              { icon: User, label: 'Assigned to', value: assignee?.name },
              { icon: User, label: 'Assigned by', value: assigner?.name },
              { icon: Calendar, label: 'Deadline', value: format(parseISO(task.deadline), 'MMMM d, yyyy') },
              { icon: Clock, label: 'Created', value: format(new Date(task.createdAt), 'MMMM d, yyyy') },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{label}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon size={14} color="var(--text-muted)" />
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>{value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
