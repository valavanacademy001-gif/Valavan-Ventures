import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mockUsers } from '../../data/mockData';
import { Plus, Search, FolderOpen, Users, Calendar, TrendingUp, Clock, CheckSquare } from 'lucide-react';
import { format, parseISO, isPast } from 'date-fns';

const STATUS_COLORS = {
  active: { bg: '#ECFDF5', color: '#059669', label: 'Active' },
  completed: { bg: '#EFF6FF', color: '#2563EB', label: 'Completed' },
  'on-hold': { bg: '#FFFBEB', color: '#D97706', label: 'On Hold' },
  planning: { bg: '#F5F3FF', color: '#7C3AED', label: 'Planning' },
};

export default function Projects() {
  const { projects } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = projects.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.client?.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    return true;
  });

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Projects</h1>
          <p>Track all ongoing and completed projects</p>
        </div>
        <div className="page-header-actions">
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="input" style={{ paddingLeft: 32, width: 200 }} placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="input select" style={{ width: 140 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="stat-grid stat-grid-4 mb-6">
        {[
          { label: 'Total Projects', value: projects.length, color: '#2563EB', bg: '#EFF6FF', icon: FolderOpen },
          { label: 'Active', value: projects.filter(p => p.status === 'active').length, color: '#059669', bg: '#ECFDF5', icon: TrendingUp },
          { label: 'Completed', value: projects.filter(p => p.status === 'completed').length, color: '#7C3AED', bg: '#F5F3FF', icon: CheckSquare },
          { label: 'On Hold', value: projects.filter(p => p.status === 'on-hold').length, color: '#D97706', bg: '#FFFBEB', icon: Clock },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ '--stat-color': s.color }}>
            <div className="stat-icon" style={{ background: s.bg }}><s.icon size={20} color={s.color} /></div>
            <div className="stat-body">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Projects Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {filtered.map(project => {
          const { bg, color, label } = STATUS_COLORS[project.status] || STATUS_COLORS.active;
          const assignees = project.assignedEmployees.map(id => mockUsers.find(u => u.id === id)).filter(Boolean);
          const isOverdue = project.deadline < new Date().toISOString().split('T')[0] && project.status !== 'completed';

          return (
            <div key={project.id} className="card" style={{ cursor: 'pointer' }}>
              {/* Color header */}
              <div style={{ height: 6, background: project.color, borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }} />
              <div style={{ padding: '20px 22px' }}>
                {/* Status + Client */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span className="badge" style={{ background: bg, color }}>{label}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{project.client}</span>
                </div>

                {/* Name */}
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, letterSpacing: -0.3 }}>{project.name}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{project.description}</div>

                {/* Progress */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>Progress</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: project.color }}>{project.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${project.progress}%`, background: project.color }} />
                  </div>
                </div>

                {/* Task Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
                  {[
                    { label: 'Total', value: project.taskStats.total, color: 'var(--text-secondary)' },
                    { label: 'Done', value: project.taskStats.completed, color: '#059669' },
                    { label: 'Overdue', value: project.taskStats.overdue, color: '#DC2626' },
                  ].map(s => (
                    <div key={s.label} style={{ background: 'var(--bg-hover)', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: -4 }}>
                    {assignees.slice(0, 4).map((u, i) => (
                      <div key={u.id} className="avatar avatar-xs" style={{ background: project.color, marginLeft: i > 0 ? -6 : 0, border: '2px solid var(--bg-card)', fontSize: 8 }}>
                        {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                    ))}
                    {assignees.length > 4 && <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 6 }}>+{assignees.length - 4}</span>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Calendar size={13} color={isOverdue ? 'var(--danger)' : 'var(--text-muted)'} />
                    <span style={{ fontSize: 12, color: isOverdue ? 'var(--danger)' : 'var(--text-muted)', fontWeight: isOverdue ? 700 : 400 }}>
                      {format(parseISO(project.deadline), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon"><FolderOpen size={32} color="var(--text-muted)" /></div>
          <h3>No projects found</h3>
          <p>Try adjusting your search or filter.</p>
        </div>
      )}
    </div>
  );
}
