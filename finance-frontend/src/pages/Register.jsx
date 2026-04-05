import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../store/authStore.jsx';
import { register as registerApi } from '../api/auth.js';
import toast from 'react-hot-toast';
 
export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { role: 'VIEWER' }
  });
 
  async function onSubmit(data) {
    try {
      const res = await registerApi(data);
      login(res.data.user, res.data.token);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (e) {
      toast.error(e.response?.data?.error || 'Registration failed');
    }
  }
 
  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-8 w-full max-w-sm'>
        <h1 className='text-xl font-bold text-gray-900 mb-6 text-center'>Create Account</h1>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div>
            <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1'>Name</label>
            <input {...register('name', { required: 'Required' })}
              className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500' />
          </div>
          <div>
            <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1'>Email</label>
            <input type='email' {...register('email', { required: 'Required' })}
              className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500' />
          </div>
          <div>
            <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1'>Password</label>
            <input type='password' {...register('password', { required: 'Required', minLength: { value: 8, message: 'Min 8 chars' } })}
              className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500' />
            {errors.password && <p className='text-red-500 text-xs mt-1'>{errors.password.message}</p>}
          </div>
          <div>
            <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1'>Role</label>
            <select {...register('role')}
              className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'>
              <option value='VIEWER'>Viewer</option>
              <option value='ANALYST'>Analyst</option>
              <option value='ADMIN'>Admin</option>
            </select>
          </div>
          <button type='submit' disabled={isSubmitting}
            className='w-full bg-blue-600 text-white py-2 rounded-lg font-semibold text-sm hover:bg-blue-700 disabled:opacity-50'>
            {isSubmitting ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p className='text-center text-xs text-gray-500 mt-4'>
          Already have one? <Link to='/login' className='text-blue-600 font-medium'>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
