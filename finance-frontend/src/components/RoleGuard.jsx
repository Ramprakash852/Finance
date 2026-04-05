import { useAuth } from '../store/authStore.jsx';
 
export default function RoleGuard({ roles, children }) {
  const { user } = useAuth();
  if (!user || !roles.includes(user.role)) {
    return (
      <div className='flex flex-col items-center justify-center h-64 text-center'>
        <div className='text-5xl mb-4 opacity-30'>403</div>
        <h3 className='text-lg font-semibold text-gray-700 mb-2'>Access Restricted</h3>
        <p className='text-gray-500 text-sm'>
          Your role ({user?.role}) does not have permission for this page.
        </p>
      </div>
    );
  }
  return children;
}
