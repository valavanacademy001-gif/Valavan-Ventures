import { useState, useRef, useEffect } from 'react';
import { Search, Sun, Moon, Menu, Bell, User, LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import NotificationPanel from '../shared/NotificationPanel';
import GlobalSearch from '../shared/GlobalSearch';

const COLORS = ['#2563EB','#7C3AED','#059669','#D97706','#DC2626','#0EA5E9','#EC4899','#F97316'];
function getAvatarColor(name) {
  const idx = name ? name.charCodeAt(0) % COLORS.length : 0;
  return COLORS[idx];
}
function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

export default function Topbar({ title, subtitle, onMenuToggle }) {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();
  const { notifications } = useApp();
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  const unread = notifications.filter(n => !n.read && n.userId === currentUser?.id).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="topbar" style={{ display: 'flex', alignItems: 'center', height: 'var(--topbar-height)' }}>
        {/* Hamburger – mobile only */}
        <button className="icon-btn mobile-menu-btn" onClick={onMenuToggle} aria-label="Open menu" style={{ marginRight: 8 }}>
          <Menu size={18} />
        </button>

        {/* Mobile logo — visibility controlled by CSS */}
        <div className="mobile-only-logo" style={{ display: 'flex', alignItems: 'center', marginRight: 12 }}>
          <img src="/logo.png" alt="Valavan Ventures" className="mobile-logo-icon" style={{ width: 'auto', height: 26, objectFit: 'contain' }} />
        </div>

        {/* Page title */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', minWidth: 0 }} className="topbar-title-container">
          <div className="topbar-title" style={{ display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}>
            <span style={{ fontWeight: 600 }}>{title}</span>
            {subtitle && <span className="topbar-subtitle" style={{ opacity: 0.6 }}>/ {subtitle}</span>}
          </div>
        </div>

        <div className="topbar-actions">
          {/* Desktop search bar */}
          <div className="topbar-search" onClick={() => setShowSearch(true)} style={{ cursor: 'pointer' }}>
            <Search size={14} color="var(--text-muted)" />
            <input readOnly placeholder="Search anything..." style={{ cursor: 'pointer' }} />
            <kbd style={{ fontSize: '10px', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 4, padding: '1px 5px', background: 'var(--bg-hover)' }}>⌘K</kbd>
          </div>

          {/* Mobile search icon (hidden on desktop, shown via CSS) */}
          <button
            className="icon-btn topbar-search-icon"
            onClick={() => setShowSearch(true)}
            aria-label="Search"
          >
            <Search size={16} />
          </button>

          {/* Theme toggle */}
          <button className="icon-btn" onClick={toggleTheme} data-tooltip={theme === 'light' ? 'Dark mode' : 'Light mode'}>
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* Notifications */}
          <div style={{ position: 'relative' }}>
            <button className="icon-btn" onClick={() => setShowNotif(v => !v)} aria-label="Notifications">
              <Bell size={16} />
              {unread > 0 && <span className="notif-dot" />}
            </button>
            {showNotif && <NotificationPanel onClose={() => setShowNotif(false)} />}
          </div>

          {/* Profile Dropdown */}
          <div style={{ position: 'relative', marginLeft: 4 }} ref={profileRef}>
            <button 
              style={{
                width: 36, height: 36, borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: getAvatarColor(currentUser?.name), color: 'white', fontWeight: 600, fontSize: 13,
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0
              }}
              onClick={() => setShowProfile(v => !v)}
            >
              {getInitials(currentUser?.name)}
            </button>

            {showProfile && (
              <div className="dropdown-menu" style={{ right: 0, top: '100%', marginTop: 8, minWidth: 220 }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{currentUser?.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'capitalize', marginTop: 2 }}>
                    {currentUser?.role?.replace(/_/g, ' ')}
                  </div>
                </div>
                
                <div className="dropdown-item" onClick={() => { setShowProfile(false); navigate('/settings'); }}>
                  <User size={15} /> My Profile
                </div>
                <div className="dropdown-separator" />
                <div className="dropdown-item danger" onClick={handleLogout}>
                  <LogOut size={15} /> Sign Out
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {showSearch && <GlobalSearch onClose={() => setShowSearch(false)} />}
    </>
  );
}
