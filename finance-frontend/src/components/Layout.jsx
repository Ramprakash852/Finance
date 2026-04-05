import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/authStore.jsx';
import { LayoutDashboard, ArrowLeftRight, Users, LogOut } from 'lucide-react';
 
const ALL_NAV = [
  { to: '/dashboard',    label: 'Dashboard',    icon: LayoutDashboard, roles: ['ADMIN','ANALYST','VIEWER'] },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight,  roles: ['ADMIN','ANALYST'] },
  { to: '/users',        label: 'Users',        icon: Users,           roles: ['ADMIN'] },
];
 
export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  // Filter navigation at the view layer so roles only see routes they can access.
  const nav = ALL_NAV.filter(n => n.roles.includes(user?.role));
 
  function handleLogout() {
    logout();
    navigate('/login');
  }
 
  return (
    <div className='flex min-h-screen bg-gray-50'>
      <aside className='w-56 bg-slate-900 flex flex-col fixed top-0 bottom-0'>
        <div className='p-5 border-b border-slate-700'>
          <span className='text-white font-bold text-lg'>FinanceOS</span>
        </div>
        <nav className='flex-1 p-3 space-y-1'>
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ' +
                (isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white')
              }
            >
              <Icon size={16} />{label}
            </NavLink>
          ))}
        </nav>
        <div className='p-4 border-t border-slate-700'>
          <div className='flex items-center gap-3 mb-3'>
            <div className='w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold'>
              {(user?.name || user?.email || 'U')[0].toUpperCase()}
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-white text-sm font-medium truncate'>{user?.name}</p>
              <p className='text-slate-400 text-xs'>{user?.role}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className='flex items-center gap-2 text-slate-400 hover:text-white text-sm w-full transition-colors'>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>
      <main className='ml-56 flex-1 p-8'><Outlet /></main>
    </div>
  );
}
