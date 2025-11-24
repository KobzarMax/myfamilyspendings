import { createFileRoute, useLocation } from '@tanstack/react-router';
import { useAuth } from '../context/AuthContext';
import { useAuthStore } from '../store/authStore';
import Layout from '../components/Layout';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    // Authentication check logic is handled by the layout or parent route
    // This route just ensures the user is authenticated
    return {};
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { user, loading } = useAuth();
  const hasCompletedOnboarding = useAuthStore((state) => state.hasCompletedOnboarding);
  const location = useLocation();

  // Wait for auth to load before redirecting
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-600">Loading...</div>
      </div>
    );
  }

  // Client-side auth check
  if (!user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }

  // Check if user has completed onboarding
  // Allow access to onboarding and create-family routes without onboarding check
  const isOnboardingRoute = location.pathname === '/onboarding';
  const isCreateFamilyRoute = location.pathname === '/create-family';

  if (!hasCompletedOnboarding && !isOnboardingRoute && !isCreateFamilyRoute) {
    if (typeof window !== 'undefined') {
      window.location.href = '/onboarding';
    }
    return null;
  }

  return <Layout />;
}
