// Users page — ADMIN only. Shows user cards with role change dropdown
// and activate/deactivate toggle. React Query handles loading + cache.
 
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUsers, updateUser } from '../api/users.js';
import RoleGuard from '../components/RoleGuard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import toast from 'react-hot-toast';
 
const ROLE_STYLES = {
  ADMIN:   'bg-blue-100 text-blue-700',
  ANALYST: 'bg-teal-100 text-teal-700',
  VIEWER:  'bg-green-100 text-green-700',
};
 
export default function Users() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['users'], queryFn: getUsers });
 
  async function changeRole(id, role) {
    try {
      await updateUser(id, { role });
      toast.success('Role updated to ' + role);
      qc.invalidateQueries(['users']);
    } catch (e) { toast.error(e.response?.data?.error || 'Failed'); }
  }
 
  async function toggleActive(id, isActive) {
    try {
      await updateUser(id, { isActive });
      toast.success(isActive ? 'User activated' : 'User deactivated');
      qc.invalidateQueries(['users']);
    } catch (e) { toast.error(e.response?.data?.error || 'Failed'); }
  }
 
  const users = data?.data || [];
 
  return (
    <RoleGuard roles={['ADMIN']}>
      <div>
        <div className='mb-6'>
          <h1 className='text-2xl font-bold text-gray-900'>Users</h1>
          <p className='text-gray-500 text-sm'>{users.length} team members</p>
        </div>
        {isLoading ? <LoadingSpinner /> : (
          <div className='grid grid-cols-3 gap-4'>
            {users.map(u => (
              <div key={u.id} className='bg-white rounded-xl border border-gray-200 p-5 shadow-sm'>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold'>
                    {(u.name || u.email)[0].toUpperCase()}
                  </div>
                  <div>
                    <p className='font-semibold text-gray-900 text-sm'>{u.name}</p>
                    <p className='text-gray-400 text-xs'>{u.email}</p>
                  </div>
                </div>
                <div className='flex items-center justify-between mb-3'>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${ROLE_STYLES[u.role]}`}>{u.role}</span>
                  <span className={`text-xs flex items-center gap-1 ${u.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                    <span className={`w-2 h-2 rounded-full ${u.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                    {u.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className='flex gap-2'>
                  <select value={u.role} onChange={e => changeRole(u.id, e.target.value)}
                    className='flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500'>
                    <option value='VIEWER'>Viewer</option>
                    <option value='ANALYST'>Analyst</option>
                    <option value='ADMIN'>Admin</option>
                  </select>
                  <button onClick={() => toggleActive(u.id, !u.isActive)}
                    className={`px-2 py-1 rounded-lg text-xs border font-medium transition-colors ${ u.isActive ? 'border-red-200 text-red-500 hover:bg-red-50' : 'border-green-200 text-green-600 hover:bg-green-50' }`}>
                    {u.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
