import { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { useAuth } from '../../../context/AuthContext';
import { X, Search, Filter, Download, Printer, ChevronLeft, ChevronRight, Eye, Edit2, Check, RotateCcw, MessageSquare, Clock, Users, ArrowUpDown } from 'lucide-react';
import { format, parseISO, isBefore, isToday, differenceInDays } from 'date-fns';
import { mockUsers, DEPARTMENTS, ROLES } from '../../../data/mockData';
import { getAvatarColor, PRIORITY_CONFIG, STATUS_CONFIG } from './TaskCard';
import { useToast } from '../../../context/ToastContext';

export default function TaskKPIListDrawer({ kpi, onClose, onOpenTask, onEditTask }) {
  const { tasks, projects, employees, approveTask, requestChanges } = useApp();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const isAdmin = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.HR].includes(currentUser?.role);

  // Filter States
  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [employeeFilter, setEmployeeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');

  // Sorting
  const [sortBy, setSortBy] = useState('deadline');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  // Loading indicator for simulated lazy load
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(timer);
  }, [kpi, search, projectFilter, employeeFilter, priorityFilter, statusFilter, dateFilter, deptFilter, sortBy, sortOrder]);

  // Reset page on filter changes
  useEffect(() => {
    setPage(1);
  }, [search, projectFilter, employeeFilter, priorityFilter, statusFilter, dateFilter, deptFilter]);

  // Base tasks for current user role
  const roleFilteredTasks = useMemo(() => {
    return tasks.filter(t => {
      if (!isAdmin) {
        return t.assignedTo === currentUser?.id;
      }
      return true;
    });
  }, [tasks, currentUser, isAdmin]);

  // Get today's start/end string
  const todayStr = new Date().toISOString().split('T')[0];

  // Specific KPI type filtering
  const kpiFilteredTasks = useMemo(() => {
    return roleFilteredTasks.filter(t => {
      switch (kpi.type) {
        case 'total':
          return true;
        case 'active':
          return !['completed', 'approved'].includes(t.status);
        case 'assignedToday':
          return t.createdAt?.startsWith(todayStr);
        case 'pending':
        case 'review':
          return ['submitted', 'under_review'].includes(t.status);
        case 'completedToday':
          // Status is completed or approved, and was updated/created today
          return ['completed', 'approved'].includes(t.status) && (
            t.timeline?.some(ev => ['completed', 'approved'].includes(ev.action) && ev.timestamp?.startsWith(todayStr)) ||
            t.createdAt?.startsWith(todayStr)
          );
        case 'overdue':
          return !['completed', 'approved'].includes(t.status) && t.deadline && isBefore(parseISO(t.deadline), new Date(todayStr));
        case 'highPriority':
          return ['critical', 'high'].includes(t.priority);
        case 'dueToday':
          return t.deadline && isToday(parseISO(t.deadline));
        case 'revision':
          return t.status === 'changes_needed';
        case 'history':
          return ['completed', 'approved'].includes(t.status);
        default:
          return true;
      }
    });
  }, [roleFilteredTasks, kpi.type, todayStr]);

  // Apply user-selected filters
  const finalTasks = useMemo(() => {
    let list = [...kpiFilteredTasks];

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t => 
        t.title?.toLowerCase().includes(q) || 
        t.description?.toLowerCase().includes(q)
      );
    }

    // Project
    if (projectFilter !== 'all') {
      list = list.filter(t => t.project === projectFilter);
    }

    // Employee (Admin only filter)
    if (isAdmin && employeeFilter !== 'all') {
      list = list.filter(t => t.assignedTo === employeeFilter);
    }

    // Priority
    if (priorityFilter !== 'all') {
      list = list.filter(t => t.priority === priorityFilter);
    }

    // Status
    if (statusFilter !== 'all') {
      list = list.filter(t => t.status === statusFilter);
    }

    // Date
    if (dateFilter) {
      list = list.filter(t => t.deadline === dateFilter || t.createdAt?.startsWith(dateFilter));
    }

    // Department (Admin only filter)
    if (isAdmin && deptFilter !== 'all') {
      list = list.filter(t => {
        const emp = mockUsers.find(u => u.id === t.assignedTo);
        return emp?.department === deptFilter;
      });
    }

    // Apply Sorting
    list.sort((a, b) => {
      let valA = a[sortBy] || '';
      let valB = b[sortBy] || '';

      if (sortBy === 'deadline') {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        valA = parseISO(a.deadline).getTime();
        valB = parseISO(b.deadline).getTime();
      }

      if (sortBy === 'progress') {
        valA = a.progress || 0;
        valB = b.progress || 0;
      }

      if (sortBy === 'priority') {
        const priorityWeight = { critical: 4, high: 3, medium: 2, low: 1 };
        valA = priorityWeight[a.priority] || 0;
        valB = priorityWeight[b.priority] || 0;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [kpiFilteredTasks, search, projectFilter, employeeFilter, priorityFilter, statusFilter, dateFilter, deptFilter, sortBy, sortOrder, isAdmin]);

  // Pagination logic
  const paginatedTasks = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return finalTasks.slice(start, start + itemsPerPage);
  }, [finalTasks, page]);

  const totalPages = Math.ceil(finalTasks.length / itemsPerPage) || 1;

  // Grouped by employee view for "Assigned Today" (only if kpi.type is 'assignedToday' and admin is viewing)
  const isAssignedTodayGrouped = kpi.type === 'assignedToday' && isAdmin;

  const groupedByEmployee = useMemo(() => {
    if (!isAssignedTodayGrouped) return [];
    const groups = {};
    finalTasks.forEach(t => {
      const empId = t.assignedTo || 'unassigned';
      if (!groups[empId]) {
        groups[empId] = [];
      }
      groups[empId].push(t);
    });
    return Object.entries(groups).map(([empId, tList]) => {
      const emp = mockUsers.find(u => u.id === empId);
      return {
        employee: emp || { name: 'Unassigned', department: '' },
        tasks: tList
      };
    }).sort((a, b) => b.tasks.length - a.tasks.length);
  }, [finalTasks, isAssignedTodayGrouped]);

  // Export handlers
  const handleExportCSV = () => {
    let headers = ['Task Name', 'Project', 'Assignee', 'Priority', 'Status', 'Deadline', 'Progress'];
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + finalTasks.map(t => {
          const prj = projects?.find(p => p.id === t.project)?.name || '';
          const emp = mockUsers.find(u => u.id === t.assignedTo)?.name || '';
          return `"${t.title || ''}","${prj}","${emp}","${t.priority}","${t.status}","${t.deadline || ''}",${t.progress || 0}`;
        }).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `tasks_kpi_${kpi.type}_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV downloaded successfully!', 'success');
  };

  const handleExportExcel = () => {
    // Simulating excel download with a simple CSV formatted file with xls extension
    handleExportCSV();
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Tasks Printout - ${kpi.label}</title>
          <style>
            body { font-family: sans-serif; padding: 20px; color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 13px; }
            th { background-color: #f5f5f5; }
            h2 { margin: 0 0 10px 0; }
          </style>
        </head>
        <body>
          <h2>${kpi.label} — Tasks Report</h2>
          <p>Total Records: ${finalTasks.length} | Export Date: ${new Date().toLocaleDateString('en-IN')}</p>
          <table>
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Project</th>
                <th>Assignee</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Deadline</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              ${finalTasks.map(t => `
                <tr>
                  <td><b>${t.title}</b></td>
                  <td>${projects?.find(p => p.id === t.project)?.name || '—'}</td>
                  <td>${mockUsers.find(u => u.id === t.assignedTo)?.name || '—'}</td>
                  <td>${t.priority}</td>
                  <td>${t.status}</td>
                  <td>${t.deadline || '—'}</td>
                  <td>${t.progress || 0}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 998, animation: 'fadeIn 0.2s ease' }} />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: '85%', maxWidth: 1050,
        background: 'var(--bg-card)', zIndex: 999, display: 'flex', flexDirection: 'column',
        boxShadow: '-8px 0 36px rgba(0,0,0,0.15)', animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Drawer Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-hover)' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
              {kpi.label}
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', background: 'var(--primary-light)', padding: '2px 8px', borderRadius: 99 }}>
                {finalTasks.length} tasks
              </span>
            </h2>
            <p style={{ margin: '3px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>Interactive KPI list view & actions</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button className="btn btn-secondary btn-sm" onClick={handleExportCSV} title="Export CSV" style={{ gap: 4 }}>
              <Download size={14} /> Export CSV
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handlePrint} title="Print" style={{ gap: 4 }}>
              <Printer size={14} /> Print
            </button>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Toolbar: Search & Filters */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', background: 'var(--bg-card)' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search task name or description..."
              className="input input-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 32 }}
            />
          </div>

          {/* Project Filter */}
          <select className="input input-sm" style={{ width: 'auto' }} value={projectFilter} onChange={e => setProjectFilter(e.target.value)}>
            <option value="all">All Projects</option>
            {projects?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>

          {/* Admin only Filters */}
          {isAdmin && (
            <>
              <select className="input input-sm" style={{ width: 'auto' }} value={employeeFilter} onChange={e => setEmployeeFilter(e.target.value)}>
                <option value="all">All Employees</option>
                {employees?.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
              </select>
              <select className="input input-sm" style={{ width: 'auto' }} value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
                <option value="all">All Departments</option>
                {DEPARTMENTS?.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </>
          )}

          {/* Priority Filter */}
          <select className="input input-sm" style={{ width: 'auto' }} value={priorityFilter} onChange={e => setTransitionFilter(e, setPriorityFilter)}>
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Status Filter */}
          <select className="input input-sm" style={{ width: 'auto' }} value={statusFilter} onChange={e => setTransitionFilter(e, setStatusFilter)}>
            <option value="all">All Statuses</option>
            {Object.entries(STATUS_CONFIG).map(([k, cfg]) => (
              <option key={k} value={k}>{cfg.label}</option>
            ))}
          </select>

          {/* Date Filter */}
          <input
            type="date"
            className="input input-sm"
            style={{ width: 'auto' }}
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
          />
        </div>

        {/* List Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', background: 'var(--bg)' }}>
          {loading ? (
            /* Loading skeletons */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1, 2, 3, 4, 5].map(n => (
                <div key={n} style={{ height: 68, background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 16 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--border)', animation: 'pulse 1.5s infinite' }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ height: 14, background: 'var(--border)', borderRadius: 4, width: '40%', animation: 'pulse 1.5s infinite' }} />
                    <div style={{ height: 10, background: 'var(--border)', borderRadius: 4, width: '20%', animation: 'pulse 1.5s infinite' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : isAssignedTodayGrouped ? (
            /* Assigned Today Grouped by Employee View */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {groupedByEmployee.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)', background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)' }}>
                  No tasks assigned today match the criteria
                </div>
              ) : (
                groupedByEmployee.map(g => (
                  <div key={g.employee.id} style={{ background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
                    <div style={{ padding: '12px 18px', background: 'var(--bg-hover)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: getAvatarColor(g.employee.name), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
                          {g.employee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{g.employee.name}</span>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>{g.employee.department}</span>
                        </div>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--primary)', background: 'var(--primary-light)', padding: '2px 8px', borderRadius: 99 }}>
                        {g.tasks.length} Tasks
                      </span>
                    </div>
                    <div style={{ padding: '8px 16px' }}>
                      {g.tasks.map(t => (
                        <TaskSimpleRow key={t.id} task={t} projects={projects} onOpenTask={onOpenTask} approveTask={approveTask} requestChanges={requestChanges} isAdmin={isAdmin} currentUser={currentUser} />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* Regular list view */
            <div style={{ background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
              {finalTasks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
                  No tasks match the filter criteria
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {/* Sorting Header Row */}
                  <div style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg-hover)', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }} onClick={() => handleSort('title')}>
                      Task Name <ArrowUpDown size={11} />
                    </div>
                    <div style={{ flex: 1.2 }}>Project</div>
                    <div style={{ flex: 1.2 }}>Assignee</div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }} onClick={() => handleSort('priority')}>
                      Priority <ArrowUpDown size={11} />
                    </div>
                    <div style={{ flex: 1 }}>Status</div>
                    <div style={{ flex: 1.2, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }} onClick={() => handleSort('deadline')}>
                      Deadline <ArrowUpDown size={11} />
                    </div>
                    <div style={{ flex: 0.8, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }} onClick={() => handleSort('progress')}>
                      Progress <ArrowUpDown size={11} />
                    </div>
                    <div style={{ width: 140, textAlign: 'right' }}>Actions</div>
                  </div>

                  {/* Task list rows */}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {paginatedTasks.map((t, idx) => (
                      <TaskSimpleRow
                        key={t.id}
                        task={t}
                        projects={projects}
                        onOpenTask={onOpenTask}
                        approveTask={approveTask}
                        requestChanges={requestChanges}
                        isAdmin={isAdmin}
                        currentUser={currentUser}
                        style={{ borderBottom: idx === paginatedTasks.length - 1 ? 'none' : '1px solid var(--border)' }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer: Pagination */}
        {!isAssignedTodayGrouped && (
          <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-hover)' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Showing <b>{Math.min(finalTasks.length, (page - 1) * itemsPerPage + 1)}-{Math.min(finalTasks.length, page * itemsPerPage)}</b> of <b>{finalTasks.length}</b> tasks
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{ padding: 6 }}
              >
                <ChevronLeft size={16} />
              </button>
              <span style={{ fontSize: 12, fontWeight: 700 }}>Page {page} of {totalPages}</span>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{ padding: 6 }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
      `}</style>
    </>
  );

  function setTransitionFilter(e, setFn) {
    setFn(e.target.value);
  }

  function handleSort(field) {
    if (sortBy === field) {
      setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  }
}

function TaskSimpleRow({ task, projects, onOpenTask, approveTask, requestChanges, isAdmin, currentUser, style }) {
  const prj = projects?.find(p => p.id === task.project);
  const emp = mockUsers.find(u => u.id === task.assignedTo);
  const st = STATUS_CONFIG[task.status] || STATUS_CONFIG.assigned;
  const pr = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const isOverdue = task.deadline && isBefore(parseISO(task.deadline), new Date()) && !['completed', 'approved'].includes(task.status);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', padding: '14px 20px',
      background: isOverdue ? '#FFF5F5' : 'transparent',
      transition: 'background 0.15s', cursor: 'pointer', ...style
    }}
      onMouseEnter={e => e.currentTarget.style.background = isOverdue ? '#FFEBEB' : 'var(--bg-hover)'}
      onMouseLeave={e => e.currentTarget.style.background = isOverdue ? '#FFF5F5' : 'transparent'}
      onClick={() => onOpenTask(task)}
    >
      {/* Title */}
      <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 2, paddingRight: 10 }}>
        <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)', textDecoration: ['completed', 'approved'].includes(task.status) ? 'line-through' : 'none' }}>
          {task.title}
        </span>
        {isOverdue && (
          <span style={{ fontSize: 11, color: '#DC2626', fontWeight: 600 }}>⚠️ Overdue</span>
        )}
      </div>

      {/* Project */}
      <div style={{ flex: 1.2, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--text-secondary)' }}>
        {prj ? (
          <>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: prj.color }} />
            {prj.name}
          </>
        ) : '—'}
      </div>

      {/* Assignee */}
      <div style={{ flex: 1.2, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--text-secondary)' }}>
        {emp ? (
          <>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: getAvatarColor(emp.name), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700 }}>
              {emp.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            {emp.name}
          </>
        ) : '—'}
      </div>

      {/* Priority */}
      <div style={{ flex: 1, fontSize: 12, fontWeight: 700, color: pr.color }}>
        {pr.label}
      </div>

      {/* Status */}
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: st.color, background: st.bg, padding: '3px 8px', borderRadius: 6 }}>
          {st.label}
        </span>
      </div>

      {/* Deadline */}
      <div style={{ flex: 1.2, fontSize: 12.5, color: isOverdue ? '#DC2626' : 'var(--text-secondary)', fontWeight: isOverdue ? 700 : 500 }}>
        {task.deadline || '—'}
      </div>

      {/* Progress */}
      <div style={{ flex: 0.8, fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)' }}>
        {task.progress || 0}%
      </div>

      {/* Actions */}
      <div style={{ width: 140, display: 'flex', gap: 6, justifyContent: 'flex-end' }} onClick={e => e.stopPropagation()}>
        <button className="icon-btn" onClick={() => onOpenTask(task)} title="View Details">
          <Eye size={14} />
        </button>
        {isAdmin && ['submitted', 'under_review'].includes(task.status) && (
          <>
            <button className="icon-btn" style={{ color: '#059669', background: '#ECFDF5' }} onClick={() => approveTask(task.id, currentUser.id)} title="Approve Task">
              <Check size={14} />
            </button>
            <button className="icon-btn" style={{ color: '#EA580C', background: '#FFF7ED' }} onClick={() => requestChanges(task.id, currentUser.id, 'Changes required.')} title="Request Revision">
              <RotateCcw size={14} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
