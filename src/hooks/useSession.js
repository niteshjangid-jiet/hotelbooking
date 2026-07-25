import { useAuth } from '../context/AuthContext';

export const useSession = () => {
  const { session, user, isAuthenticated, loading } = useAuth();
  return {
    session,
    user,
    isAuthenticated,
    loading,
    userId: user?.id || null,
    userEmail: user?.email || null,
    userName: user?.user_metadata?.full_name || user?.name || 'Guest',
  };
};

export default useSession;
