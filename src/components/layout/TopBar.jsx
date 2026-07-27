import { MdMenu, MdNotifications } from 'react-icons/md';
import { useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const pageTitles = {
  '/':             'Dashboard',
  '/products':     'Products',
  '/products/new': 'Add Product',
  '/categories':   'Categories',
  '/orders':       'Orders',
  '/customers':    'Customers',
  '/analytics':    'Analytics',
  '/settings':     'Settings',
};

export default function TopBar({ onMenuClick }) {
  const { pathname } = useLocation();
  const { user } = useAuthStore();

  const title =
    Object.entries(pageTitles).find(([path]) =>
      path === '/' ? pathname === '/' : pathname.startsWith(path)
    )?.[1] || 'Jibam Pharmacy';

  return (
    <header className="bg-white border-b px-4 lg:px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm"
      style={{ borderColor: '#EDF0F8' }}
    >
      {/* Left — hamburger + page title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl transition-colors hover:bg-slate-100"
          aria-label="Open menu"
        >
          <MdMenu className="text-2xl" style={{ color: '#0D1B5E' }} />
        </button>
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#0D1B5E' }}>{title}</h1>
          <p className="text-xs text-slate-400 hidden sm:block">
            {new Date().toLocaleDateString('en-NG', {
              weekday: 'long', year: 'numeric',
              month: 'long', day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Right — notifications + avatar */}
      <div className="flex items-center gap-2">
        <button
          className="p-2 rounded-xl transition-colors hover:bg-slate-100 relative"
          style={{ color: '#0D1B5E' }}
        >
          <MdNotifications className="text-2xl" />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ backgroundColor: '#00AEEF' }}
          />
        </button>

        <div className="flex items-center gap-2 pl-2 border-l" style={{ borderColor: '#EDF0F8' }}>
          {/* Cyan avatar circle */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: '#00AEEF' }}
          >
            {user?.fullname?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold leading-tight" style={{ color: '#0D1B5E' }}>
              {user?.fullname}
            </p>
            <p className="text-xs text-slate-400">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
