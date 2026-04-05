import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../store/authStore.jsx';
import { login as loginApi } from '../api/auth.js';
import toast from 'react-hot-toast';
 
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm();
 
  async function onSubmit(data) {
    try {
      const res = await loginApi(data);
      login(res.data.user, res.data.token);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (e) {
      toast.error(e.response?.data?.error || 'Login failed');
    }
  }
 
  function quickLogin(email, password) {
    // Demo logins keep the seeded accounts easy to test during reviews.
    setValue('email', email);
    setValue('password', password);
    handleSubmit(onSubmit)();
  }
 
  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-8 w-full max-w-sm'>
        <div className='text-center mb-8'>
          <div className='w-12 h-12 bg-blue-600 rounded-xl mx-auto mb-3 flex items-center justify-center text-white font-bold text-xl'>F</div>
          <h1 className='text-xl font-bold text-gray-900'>Sign in to FinanceOS</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div>
            <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1'>Email</label>
            <input type='email' {...register('email', { required: 'Required' })}
              className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500' />
            {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email.message}</p>}
          </div>
          <div>
            <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1'>Password</label>
            <input type='password' {...register('password', { required: 'Required' })}
              className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500' />
            {errors.password && <p className='text-red-500 text-xs mt-1'>{errors.password.message}</p>}
          </div>
          <button type='submit' disabled={isSubmitting}
            className='w-full bg-blue-600 text-white py-2 rounded-lg font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors'>
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className='mt-4 pt-4 border-t border-gray-100'>
          <p className='text-xs text-gray-400 text-center mb-2'>Quick login (seeded accounts)</p>
          <div className='space-y-2'>
            {[['admin@finance.com','ADMIN'],['analyst@finance.com','ANALYST'],['viewer@finance.com','VIEWER']]
              .map(([email, role]) => (
              <button key={email} onClick={() => quickLogin(email, 'Password123!')}
                className='w-full flex justify-between items-center px-3 py-2 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors'>
                <span>{email}</span>
                <span className='bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-semibold'>{role}</span>
              </button>
            ))}
          </div>
        </div>
        <p className='text-center text-xs text-gray-500 mt-4'>
          No account? <Link to='/register' className='text-blue-600 font-medium'>Create one</Link>
        </p>
      </div>
    </div>
  );
}
