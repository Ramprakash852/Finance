// Convenience re-export of useAuth from the auth store.
// Use this hook in any component that needs the current user,
// token, login function, or logout function.
// Usage: const { user, token, login, logout } = useAuth();

export { useAuth } from '../store/authStore.jsx';