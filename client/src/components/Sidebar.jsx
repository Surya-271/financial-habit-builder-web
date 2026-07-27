import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Wallet,
  TrendingDown,
  CalendarDays,
  Target,
  LineChart,
  ShieldCheck,
  Bell,
  User,
  LogOut,
  Users,
  FileBarChart,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

const Sidebar = ({ isOpen, onLinkClick }) => {
  const { user, admin, logout, logoutAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (admin) {
      logoutAdmin();
      navigate('/admin/login');
    } else {
      logout();
      navigate('/login');
    }
    if (onLinkClick) onLinkClick();
  };

  // Define Navigation Items for Standard Users
  const userLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/income', label: 'Income Manager', icon: Wallet },
    { path: '/expenses', label: 'Expense Tracker', icon: TrendingDown },
    { path: '/habits', label: 'Habit Tracker', icon: CalendarDays },
    { path: '/savings', label: 'Savings Goals', icon: Target },
    { path: '/investments', label: 'Investments', icon: Sparkles },
    { path: '/analytics', label: 'Wealth Analytics', icon: LineChart },
    { path: '/profile', label: 'My Profile', icon: User },
    { path: '/notifications', label: 'Notifications', icon: Bell },
    { path: '/feedback', label: 'Platform Feedback', icon: MessageSquare },
  ];

  // Define Navigation Items for Admins
  const adminLinks = [
    { path: '/admin/dashboard', label: 'Admin Panel', icon: ShieldCheck },
    { path: '/admin/users', label: 'User Accounts', icon: Users },
    { path: '/admin/reports', label: 'System Reports', icon: FileBarChart },
    { path: '/admin/feedback', label: 'User Feedback', icon: MessageSquare },
    { path: '/admin/profile', label: 'Admin Profile', icon: User },
  ];

  const links = admin ? adminLinks : userLinks;

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-dark-900 border-r border-slate-200/50 dark:border-slate-800/40 
        transform lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col justify-between
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:static lg:h-screen lg:w-64
      `}
    >
      {/* Brand Header */}
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center shrink-0">
        <Link to={admin ? "/admin/dashboard" : "/dashboard"} className="flex items-center gap-2">
          {/* Logo: Jar Icon Only */}
          <div className="w-10 h-10 shrink-0">
            <img src="/logo.png" alt="FinanceHabit Logo" className="w-full h-full object-contain animate-fade-in" />
          </div>
          <span className="text-xl font-sans font-semibold tracking-tight">
            <span className="text-slate-800 dark:text-white">Finance</span>
            <span className="text-brand-500">Habit</span>
          </span>
        </Link>
      </div>
      {/* Scrollable Link Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={onLinkClick}
              className={({ isActive }) =>
                isActive ? 'sidebar-link-active' : 'sidebar-link'
              }
              end={link.path === '/dashboard'}
            >
              <Icon size={18} className="mr-3 flex-shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Logout Action Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800/80">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl transition font-medium"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
