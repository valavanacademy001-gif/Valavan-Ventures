import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard, Users, CheckSquare, FolderOpen, Calendar,
  DollarSign, CalendarOff, MessageSquare, Megaphone, Settings,
  Building2, LogOut, ChevronRight, Shield, CheckCircle
} from 'lucide-react';
import { ROLES } from '../../data/mockData';

const COLORS = ['#2563EB','#7C3AED','#059669','#D97706','#DC2626','#0EA5E9','#EC4899','#F97316'];

function getAvatarColor(name) {
  const idx = name ? name.charCodeAt(0) % COLORS.length : 0;
  return COLORS[idx];
}

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

const navItems = [
  {
    section: 'Overview',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    ]
  },
  {
    section: 'Work',
    items: [
      { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
      { to: '/projects', icon: FolderOpen, label: 'Projects' },
    ]
  },
  {
    section: 'People',
    items: [
      { to: '/employees', icon: Users, label: 'Employees', roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR, ROLES.MANAGER] },
      { to: '/attendance', icon: Calendar, label: 'Attendance' },
      { to: '/leaves', icon: CalendarOff, label: 'Leaves' },
    ]
  },
  {
    section: 'Finance',
    items: [
      { to: '/payslips', icon: DollarSign, label: 'Payslips' },
    ]
  },
  {
    section: 'Communication',
    items: [
      { to: '/chat', icon: MessageSquare, label: 'Chat' },
      { to: '/announcements', icon: Megaphone, label: 'Notice Board' },
    ]
  },
];

const adminItems = [
  { to: '/approvals', icon: CheckCircle, label: 'Approval Center', roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR, ROLES.MANAGER] },
  { to: '/settings', icon: Settings, label: 'Settings', roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN] },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const { currentUser, logout } = useAuth();
  const { notifications } = useApp();
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read && n.userId === currentUser?.id).length;

  const canSeeItem = (item) => {
    if (!item.roles) return true;
    return item.roles.includes(currentUser?.role);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {mobileOpen && <div className="mobile-overlay" onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',zIndex:99}} />}
      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <img src="/logo.png" alt="Valavan Ventures" className="desktop-logo" />
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map(section => (
            <div key={section.section}>
              <div className="sidebar-section-label">{section.section}</div>
              {section.items.filter(canSeeItem).map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <item.icon size={16} />
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}

          {adminItems.filter(canSeeItem).length > 0 && (
            <div>
              <div className="sidebar-section-label">Admin</div>
              {adminItems.filter(canSeeItem).map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <item.icon size={16} />
                  {item.label}
                </NavLink>
              ))}
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user" onClick={handleLogout} data-tooltip="Click to logout">
            <div
              className="avatar avatar-sm"
              style={{ background: getAvatarColor(currentUser?.name), flexShrink: 0 }}
            >
              {getInitials(currentUser?.name)}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{currentUser?.name}</div>
              <div className="sidebar-user-role">{currentUser?.role?.replace('_', ' ')}</div>
            </div>
            <LogOut size={14} color="var(--text-muted)" />
          </div>
        </div>
      </aside>
    </>
  );
}
