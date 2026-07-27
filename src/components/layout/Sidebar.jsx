import { NavLink, useNavigate } from 'react-router-dom';
import {
  MdDashboard, MdInventory, MdCategory, MdShoppingCart,
  MdPeople, MdBarChart, MdSettings, MdLogout,
} from 'react-icons/md';
import useAuthStore from '../../store/authStore';
import { authAPI } from '../../services/api';
import JibamLogo from '../common/JibamLogo';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/',           label: 'Dashboard',  icon: MdDashboard,  exact: true },
  { to: '/products',   label: 'Products',   icon: MdInventory },
  { to: '/categories', label: 'Categories', icon: MdCategory },
  { to: '/orders',     label: 'Orders',     icon: MdShoppingCart },
  { to: '/customers',  label: 'Customers',  icon: MdPeople },
  { to: '/analytics',  label: 'Analytics',  icon: MdBarChart },
  { to: '/settings',   label: 'Settings',   icon: MdSettings },
];

export default function Sidebar({ open, onClose }) {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await authAPI.logout(); } catch { /* ignore */ }
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-30 w-64 flex flex-col
        transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}
      style={{ backgroundColor: '#0D1B5E' }}   /* Jibam Navy */
    >
      {/* ── Logo ───────────────────────────────────────── */}
      <div className="flex items-center px-5 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <JibamLogo size="sm" light />
      </div>

      {/* ── Nav items ──────────────────────────────────── */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
               transition-all duration-150
               ${isActive
                 ? 'text-white shadow-md'
                 : 'text-blue-200 hover:bg-white/10 hover:text-white'
               }`
            }
            style={({ isActive }) =>
              isActive ? { backgroundColor: '#00AEEF' } : {}   /* Cyan active */
            }
          >
            <Icon className="text-xl flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* ── User + Logout ───────────────────────────────── */}
      <div className="px-4 py-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        {/* User info */}
        <div className="flex items-center gap-3 mb-3 px-2">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ backgroundColor: '#00AEEF' }}   /* Cyan avatar */
          >
            {user?.fullname?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">{user?.fullname}</p>
            <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.5)' }}>{user?.email}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
                     transition-colors duration-150 hover:bg-red-600 hover:text-white"
          style={{ color: 'rgba(255,255,255,0.6)' }}
        >
          <MdLogout className="text-xl" />
          Logout
        </button>
      </div>
    </aside>
  );
}
