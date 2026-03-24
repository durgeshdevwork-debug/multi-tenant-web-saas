import { Outlet, Navigate } from 'react-router-dom';
import { useSession } from '../lib/auth';

export function ProtectedLayout({ requiredRole }: { requiredRole?: 'admin' | 'user' }) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!session?.user) {
    return <Navigate to="/login" replace />;
  }

  // Allow admin to access user routes if needed, otherwise strict
  if (requiredRole && session.user.role !== requiredRole) {
    if (requiredRole === 'admin') {
      return <Navigate to="/" replace />; // redirect users away from admin dashboard
    } else if (requiredRole === 'user' && session.user.role === 'admin') {
      return <Navigate to="/admin" replace />; // Redirect admins away from specific user views
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b px-6 py-4 flex items-center justify-between">
        <h1 className="font-bold text-lg">
          {session.user.role === 'admin' ? 'Super Admin Portal' : 'Tenant Portal'}
        </h1>
        <div className="text-sm">
          Welcome, {session.user.name} ({session.user.role})
        </div>
      </header>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
