// Redirects to /login if no token in auth store.
// Wrap all authenticated pages with this in the router.
 
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../store/authStore.jsx';
 
export default function ProtectedRoute() {
  const { token } = useAuth();
  return token ? <Outlet /> : <Navigate to='/login' replace />;
}
