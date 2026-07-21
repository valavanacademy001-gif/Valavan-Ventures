import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ROLES } from './data/mockData';

// Layout
import AppShell from './components/layout/AppShell';

// Pages
import Login from './pages/Login';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import EmployeeDashboard from './pages/Dashboard/EmployeeDashboard';
import Tasks from './pages/Tasks/Tasks';
import Projects from './pages/Projects/Projects';
import Employees from './pages/Employees/Employees';
import Attendance from './pages/Attendance/Attendance';
import Payslips from './pages/Payslips/Payslips';
import Leaves from './pages/Leaves/Leaves';
import Chat from './pages/Chat/Chat';
import Notifications from './pages/Notifications/NotificationCenter';
import Announcements from './pages/Announcements/Announcements';
import ApprovalCenter from './pages/Approvals/ApprovalCenter';
import Settings from './pages/Settings/Settings';

// Page title mapping for the topbar
const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/tasks': 'Task Board',
  '/projects': 'Projects',
  '/employees': 'Employees',
  '/attendance': 'Attendance',
  '/payslips': 'Payslips',
  '/leaves': 'Leave Management',
  '/chat': 'Team Chat',
  '/notifications': 'Notifications',
  '/announcements': 'Notice Board',
  '/approvals': 'Approval Center',
  '/settings': 'Settings',
};

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
}

function DashboardRoute() {
  const { currentUser } = useAuth();
  const isEmployee = currentUser?.role === ROLES.EMPLOYEE;
  return isEmployee ? <EmployeeDashboard /> : <AdminDashboard />;
}

function AppLayout() {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'EMS';

  return (
    <AppShell title={title}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardRoute />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/payslips" element={<Payslips />} />
        <Route path="/leaves" element={<Leaves />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/approvals" element={<ApprovalCenter />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppShell>
  );
}

export default function App() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={currentUser ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/*" element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      } />
    </Routes>
  );
}
