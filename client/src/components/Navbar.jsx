import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Bell, LogOut, User as UserIcon, Menu } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = ({ onMenuToggle }) => {
  const { user, admin, logout, logoutAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (admin) {
      logoutAdmin();
      navigate('/admin/login');
    } else {
      logout();
      navigate('/login');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const currentUser = user || admin;

  return (
    <nav className="sticky top-0 z-40 bg-white/70 dark:bg-dark-900/60 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/40 px-6 py-4 flex items-center justify-between shadow-sm">
      {/* Brand / Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-4">
        {/* Dark/Light Mode Trigger */}
        <button
          onClick={toggleTheme}
          className="p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition active:scale-95"
          title="Toggle Theme"
        >
          {isDark ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} />}
        </button>

        {/* Notifications Shortcut (only for users, not admin) */}
        {user && (
          <Link
            to="/notifications"
            className="p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition relative active:scale-95"
            title="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-brand-500 rounded-full animate-ping"></span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-brand-500 rounded-full"></span>
          </Link>
        )}

        {/* User Session Avatar and Dropdown */}
        {currentUser && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              <div className="w-9.5 h-9.5 w-10 h-10 rounded-xl bg-gradient-to-r from-brand-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm tracking-wide shadow-md">
                {getInitials(currentUser.name)}
              </div>
              <span className="hidden md:inline text-sm font-medium text-slate-700 dark:text-slate-300">
                {currentUser.name}
              </span>
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2.5 w-52 bg-white dark:bg-dark-900 border border-slate-200/50 dark:border-slate-800/60 rounded-2xl shadow-xl z-20 py-2 animate-fade-in">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-400 dark:text-slate-500">Logged in as</p>
                    <p className="text-sm font-semibold truncate text-slate-700 dark:text-slate-300">
                      {currentUser.email}
                    </p>
                    {admin && (
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold text-purple-600 bg-purple-100 dark:text-purple-300 dark:bg-purple-900/40 rounded-md">
                        System Admin
                      </span>
                    )}
                  </div>

                  {!admin && (
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      <UserIcon size={16} />
                      Profile Details
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition text-left"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
