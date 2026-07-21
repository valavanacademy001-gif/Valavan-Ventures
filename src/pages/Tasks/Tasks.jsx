import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { ROLES } from '../../data/mockData';
import TaskDashboardAdmin from './TaskDashboardAdmin';
import TaskDashboardEmployee from './TaskDashboardEmployee';
import TaskFilters from './components/TaskFilters';
import TaskDetailsDrawer from './components/TaskDetailsDrawer';
import TaskKPIListDrawer from './components/TaskKPIListDrawer';
import CreateTaskWizard from './components/CreateTaskWizard';
import TaskKanbanView from './views/TaskKanbanView';
import TaskTableView from './views/TaskTableView';
import TaskGridView from './views/TaskGridView';
import TaskTimelineView from './views/TaskTimelineView';
import TaskCalendarView from './views/TaskCalendarView';

export default function Tasks() {
  const { tasks } = useApp();
  const { currentUser } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedKPI, setSelectedKPI] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  
  // Filter States
  const [searchQ, setSearchQ] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const isAdmin = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.HR].includes(currentUser?.role);

  const visibleTasks = tasks.filter(t => {
    if (!isAdmin && t.assignedTo !== currentUser?.id) return false;
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    if (searchQ && !t.title.toLowerCase().includes(searchQ.toLowerCase())) return false;
    return true;
  });

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return isAdmin ? (
          <TaskDashboardAdmin onSwitchView={setCurrentView} onOpenTask={setSelectedTask} onSelectKPI={setSelectedKPI} />
        ) : (
          <TaskDashboardEmployee onSwitchView={setCurrentView} onOpenTask={setSelectedTask} onSelectKPI={setSelectedKPI} />
        );
      case 'kanban':
        return <TaskKanbanView tasks={visibleTasks} onOpenTask={setSelectedTask} />;
      case 'table':
        return <TaskTableView tasks={visibleTasks} onOpenTask={setSelectedTask} />;
      case 'grid':
        return <TaskGridView tasks={visibleTasks} onOpenTask={setSelectedTask} />;
      case 'timeline':
        return <TaskTimelineView tasks={visibleTasks} onOpenTask={setSelectedTask} />;
      case 'calendar':
        return <TaskCalendarView tasks={visibleTasks} onOpenTask={setSelectedTask} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div className="page-header" style={{ padding: '24px 32px', background: 'white', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="page-header-left">
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Task Management</h1>
          <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Manage projects, deadlines, and deliverables</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {currentView !== 'dashboard' && (
            <div style={{ display: 'flex', background: 'var(--bg-secondary)', padding: 4, borderRadius: 8 }}>
              {['kanban', 'table', 'grid', 'timeline', 'calendar'].map(view => (
                <button
                  key={view}
                  className={`btn ${currentView === view ? 'btn-primary' : ''}`}
                  style={{ 
                    padding: '6px 12px', 
                    fontSize: 13,
                    background: currentView === view ? 'white' : 'transparent',
                    color: currentView === view ? 'var(--text-primary)' : 'var(--text-muted)',
                    boxShadow: currentView === view ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                    border: 'none',
                    textTransform: 'capitalize'
                  }}
                  onClick={() => setCurrentView(view)}
                >
                  {view}
                </button>
              ))}
            </div>
          )}
          {currentView !== 'dashboard' && (
            <button className="btn btn-outline" onClick={() => setCurrentView('dashboard')}>
              Back to Dashboard
            </button>
          )}
          {isAdmin && (
            <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
              + Create Task
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column' }}>
        {currentView !== 'dashboard' && (
          <TaskFilters 
            searchQ={searchQ} setSearchQ={setSearchQ}
            filterStatus={filterStatus} setFilterStatus={setFilterStatus}
            filterPriority={filterPriority} setFilterPriority={setFilterPriority}
          />
        )}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {renderView()}
        </div>
      </div>

      {/* Task Details Drawer */}
      {selectedTask && (
        <TaskDetailsDrawer task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}

      {/* Task KPI List Drawer */}
      {selectedKPI && (
        <TaskKPIListDrawer kpi={selectedKPI} onClose={() => setSelectedKPI(null)} onOpenTask={setSelectedTask} />
      )}

      {/* Create Task Wizard */}
      {showCreate && (
        <CreateTaskWizard onClose={() => setShowCreate(false)} />
      )}
    </div>
  );
}
