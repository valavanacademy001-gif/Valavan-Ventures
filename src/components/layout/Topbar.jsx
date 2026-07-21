import { useState } from 'react';
import { Search, Sun, Moon, Menu, Bell } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import NotificationPanel from '../shared/NotificationPanel';
import GlobalSearch from '../shared/GlobalSearch';

export default function Topbar({ title, subtitle, onMenuToggle }) {
  const { theme, toggleTheme } = useTheme();
  const { currentUser } = useAuth();
  const { notifications } = useApp();
  const [showNotif, setShowNotif] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const unread = notifications.filter(n => !n.read && n.userId === currentUser?.id).length;

  return (
    <>
      <header className="topbar">
        {/* Hamburger – mobile only */}
        <button className="icon-btn mobile-menu-btn" onClick={onMenuToggle} aria-label="Open menu">
          <Menu size={18} />
        </button>

        {/* Mobile logo */}
        <div className="mobile-only-logo" style={{ display: 'none', marginLeft: 8 }}>
          <img src="/logo-icon.png" alt="VA" className="mobile-logo-icon" />
        </div>

        {/* Page title */}
        <div style={{ flex: 1, marginLeft: 16 }}>
          <div className="topbar-title">
            {title}
            {subtitle && <span className="topbar-subtitle">/ {subtitle}</span>}
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
        </div>
      </header>

      {showSearch && <GlobalSearch onClose={() => setShowSearch(false)} />}
    </>
  );
}
