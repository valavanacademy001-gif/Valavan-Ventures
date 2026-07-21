import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { mockUsers, mockProjects, attendanceChartData, taskCompletionData, projectProgressData } from '../../data/mockData';
import { TASK_STATUS, PRIORITY } from '../../data/mockData';
import {
  Users, CheckSquare, Clock, AlertTriangle, TrendingUp,
  UserCheck, UserX, Plus, FileText, Calendar, ChevronRight,
  Bell, Megaphone, ArrowUpRight, ArrowDownRight, Loader2
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Area, AreaChart, PieChart, Pie, Cell, Legend
} from 'recharts';
import { formatDistanceToNow, format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AddEmployeeModal from '../Employees/AddEmployeeModal';
import AssignTaskModal from '../Tasks/AssignTaskModal';
import ActivityFeed from '../../components/ActivityFeed/ActivityFeed';

function StatCard({ label, value, icon: Icon, color, bg, change, changeDir }) {
  return (
    <div className="stat-card" style={{ '--stat-color': color }}>
      <div className="stat-icon" style={{ background: bg }}>
        <Icon size={20} color={color} />
      </div>
      <div className="stat-body">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        {change && (
          <div className={`stat-change ${changeDir}`}>
            {changeDir === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {change}
          </div>
        )}
      </div>
    </div>
  );
}

const PRIORITY_COLORS = { critical: '#DC2626', high: '#F97316', medium: '#F59E0B', low: '#22C55E' };
const PIE_COLORS = ['#2563EB', '#7C3AED', '#059669', '#D97706'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', boxShadow: 'var(--shadow-md)' }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ fontSize: 12, color: entry.color, margin: '2px 0' }}>
          <span style={{ color: 'var(--text-muted)' }}>{entry.name}: </span>{entry.value}
        </p>
      ))}
    </div>
  );
};

export default function AdminDashboard() {
  const { tasks, leaves, attendance, announcements, notifications } = useApp();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showAddEmp, setShowAddEmp] = useState(false);
  const [showAssignTask, setShowAssignTask] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter(a => a.date === today);
  const presentToday = todayAttendance.filter(a => ['early', 'on_time', 'half_day', 'wfh', 'present'].includes(a.status)).length;
  const lateToday = todayAttendance.filter(a => a.status === 'late').length;
  const absentToday = todayAttendance.filter(a => a.status === 'absent').length;
  const onLeaveToday = todayAttendance.filter(a => ['sick', 'casual', 'earned', 'leave'].includes(a.status)).length;
  const holidayToday = todayAttendance.filter(a => a.status === 'sunday_holiday' || a.status === 'holiday').length;
  
  // Calculate Avg Arrival Time & Avg Working Hours
  const arrivals = todayAttendance.filter(a => a.checkIn).map(a => {
    const [h, m] = a.checkIn.split(':').map(Number);
    return h * 60 + m;
  });
  const avgArrivalMins = arrivals.length ? Math.round(arrivals.reduce((a, b) => a + b, 0) / arrivals.length) : 0;
  const avgArrivalStr = avgArrivalMins ? `${String(Math.floor(avgArrivalMins / 60)).padStart(2, '0')}:${String(avgArrivalMins % 60).padStart(2, '0')}` : '-';

  const avgWorkHours = todayAttendance.filter(a => a.workingHours > 0).length 
    ? +(todayAttendance.filter(a => a.workingHours > 0).reduce((a, b) => a + b.workingHours, 0) / todayAttendance.filter(a => a.workingHours > 0).length).toFixed(1) 
    : 0;

  const totalEmp = mockUsers.length;
  const attPercent = Math.round(((presentToday + lateToday) / (totalEmp - onLeaveToday - holidayToday || 1)) * 100) || 0;

  const pendingReviews = tasks.filter(t => t.status === TASK_STATUS.IN_REVIEW).length;
  const tasksDueToday = tasks.filter(t => t.deadline === today && t.status !== TASK_STATUS.COMPLETED).length;
  const overdueTasks = tasks.filter(t => t.deadline < today && t.status !== TASK_STATUS.COMPLETED).length;
  const pendingLeaves = leaves.filter(l => l.status === 'pending').length;
  const totalPendingApprovals = pendingReviews + pendingLeaves;

  const pendingLeavesData = leaves.filter(l => l.status === 'pending');

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>Good morning, {currentUser?.name?.split(' ')[0]} 👋</h1>
          <p>{format(new Date(), 'EEEE, MMMM d, yyyy')} · Here's what's happening today</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={() => setShowAssignTask(true)}>
            <Plus size={15} /> Assign Task
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddEmp(true)}>
            <Plus size={15} /> Add Employee
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stat-grid stat-grid-4 mb-6 stagger animate-slideUp">
        <StatCard label="Present Today" value={`${presentToday + lateToday}/${totalEmp}`} icon={UserCheck} color="#059669" bg="#ECFDF5" change={`${attPercent}% attendance`} changeDir="up" />
        <StatCard label="Late Arrivals" value={lateToday} icon={Clock} color="#D97706" bg="#FFFBEB" change={`Avg in: ${avgArrivalStr}`} />
        <StatCard label="On Leave" value={onLeaveToday} icon={UserX} color="#7C3AED" bg="#F5F3FF" />
        <StatCard label="Avg Work Hours" value={`${avgWorkHours}h`} icon={TrendingUp} color="#2563EB" bg="#EFF6FF" />
      </div>

      {/* Quick Actions */}
      <div className="card mb-6">
        <div className="card-header">
          <div>
            <div className="card-title">Quick Actions</div>
            <div className="card-subtitle">Frequently used admin shortcuts</div>
          </div>
        </div>
        <div className="card-body">
          <div className="quick-actions">
            {[
              { icon: CheckSquare, label: `Approvals (${totalPendingApprovals})`, color: '#F59E0B', action: () => navigate('/approvals') },
              { icon: Plus, label: 'Assign Task', color: '#2563EB', action: () => setShowAssignTask(true) },
              { icon: Users, label: 'Add Employee', color: '#7C3AED', action: () => setShowAddEmp(true) },
              { icon: FileText, label: 'Generate Payslip', color: '#059669', action: () => navigate('/payslips') },
            ].map(({ icon: Icon, label, color, action }) => (
              <div key={label} className="quick-action-card" onClick={action}>
                <div className="quick-action-icon" style={{ color }}>
                  <Icon size={20} />
                </div>
                <div className="quick-action-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts + Activity */}
      <div className="admin-chart-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 320px', gap: 16, marginBottom: 16 }}>
        {/* Attendance Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Weekly Attendance</div>
              <div className="card-subtitle">This week's attendance breakdown</div>
            </div>
          </div>
          <div className="card-body p-0" style={{ padding: '16px 8px' }}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={attendanceChartData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={30} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="present" fill="#2563EB" radius={[4, 4, 0, 0]} name="Present" />
                <Bar dataKey="late" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Late" />
                <Bar dataKey="absent" fill="#EF4444" radius={[4, 4, 0, 0]} name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Completion Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Task Completion</div>
              <div className="card-subtitle">6-month trend</div>
            </div>
          </div>
          <div className="card-body p-0" style={{ padding: '16px 8px' }}>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={taskCompletionData}>
                <defs>
                  <linearGradient id="completedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={30} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="completed" stroke="#2563EB" strokeWidth={2} fill="url(#completedGrad)" name="Completed" />
                <Area type="monotone" dataKey="pending" stroke="#F59E0B" strokeWidth={2} fill="none" name="Pending" strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Recent Activity</div>
          </div>
          <div className="card-body" style={{ padding: '16px 20px', maxHeight: 280, overflowY: 'auto' }}>
            <ActivityFeed limit={6} />
          </div>
        </div>
      </div>

      {/* Projects + Leaves + Announcements */}
      <div className="admin-bottom-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        {/* Project Progress */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Project Progress</div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/projects')}>View all <ChevronRight size={14} /></button>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {projectProgressData.map((p, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>{p.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${p.progress}%`, background: PIE_COLORS[i % 4] }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Leave Requests */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Leave Requests</div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/leaves')}>View all <ChevronRight size={14} /></button>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '14px 20px' }}>
            {pendingLeavesData.length === 0 ? (
              <div className="empty-state" style={{ padding: '20px' }}>
                <p>No pending requests</p>
              </div>
            ) : pendingLeavesData.map(leave => {
              const user = mockUsers.find(u => u.id === leave.userId);
              return (
                <div key={leave.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <div className="avatar avatar-sm" style={{ background: '#2563EB', flexShrink: 0 }}>
                    {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{leave.days} day{leave.days > 1 ? 's' : ''} · {leave.type}</div>
                  </div>
                  <span className="badge badge-warning">Pending</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Announcements */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Announcements</div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/announcements')}>View all <ChevronRight size={14} /></button>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {announcements.slice(0, 3).map(ann => (
              <div key={ann.id} onClick={() => navigate('/announcements')} style={{ padding: '12px', background: 'var(--bg-hover)', borderRadius: 'var(--radius)', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span className={`badge badge-${ann.priority === 'high' ? 'danger' : ann.priority === 'medium' ? 'warning' : 'gray'}`}>
                    {ann.priority}
                  </span>
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, lineHeight: 1.4 }}>{ann.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatDistanceToNow(new Date(ann.postedAt), { addSuffix: true })}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddEmp && <AddEmployeeModal onClose={() => setShowAddEmp(false)} />}
      {showAssignTask && <AssignTaskModal onClose={() => setShowAssignTask(false)} />}
    </div>
  );
}
