import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AppShell({ title, subtitle, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="main-content">
        <Topbar title={title} subtitle={subtitle} onMenuToggle={() => setMobileOpen(v => !v)} />
        <div className="page-content animate-fadeIn">
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
}
