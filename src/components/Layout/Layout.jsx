import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdDashboard, MdMenuBook, MdTask, MdEventRepeat, MdSmartToy, MdSettings, MdClose, MdMenu } from 'react-icons/md';
import { useState } from 'react';
import './Layout.css';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: <MdDashboard /> },
  { path: '/subjects', label: 'Subjects', icon: <MdMenuBook /> },
  { path: '/tasks', label: 'Tasks', icon: <MdTask /> },
  { path: '/revision', label: 'Revision', icon: <MdEventRepeat /> },
  { path: '/ai-tools', label: 'AI Tools', icon: <MdSmartToy /> },
];

const Layout = ({ children, onOpenSettings }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    const item = navItems.find((n) => n.path === location.pathname);
    return item?.label || 'Study Companion';
  };

  return (
    <div className="layout">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__header">
          <div className="sidebar__logo">
            <span className="sidebar__logo-icon">📚</span>
            <span className="sidebar__logo-text">StudyAI</span>
          </div>
          <button className="sidebar__close" onClick={() => setSidebarOpen(false)}>
            <MdClose />
          </button>
        </div>

        <nav className="sidebar__nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sidebar__link-icon">{item.icon}</span>
              <span className="sidebar__link-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          <button className="sidebar__settings" onClick={onOpenSettings}>
            <MdSettings />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main">
        <header className="main__header">
          <button className="main__menu" onClick={() => setSidebarOpen(true)}>
            <MdMenu />
          </button>
          <h1 className="main__title">{getPageTitle()}</h1>
        </header>

        <motion.div
          key={location.pathname}
          className="main__content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;
