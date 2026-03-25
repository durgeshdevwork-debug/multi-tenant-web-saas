import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { signOut, useSession } from '../../lib/auth';

export function ProtectedLayout({ requiredRole }: { requiredRole?: 'admin' | 'user' }) {
  const { data: session, isPending } = useSession();
  const user = session?.user as { role?: 'admin' | 'user'; name?: string; email?: string } | undefined;
  const navigate = useNavigate();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={requiredRole === 'admin' ? '/admin/login' : '/login'} replace />;
  }

  // Allow admin to access user routes if needed, otherwise strict
  if (requiredRole && user.role !== requiredRole) {
    if (requiredRole === 'admin') {
      return <Navigate to="/" replace />; // redirect users away from admin dashboard
    } else if (requiredRole === 'user' && user.role === 'admin') {
      return <Navigate to="/admin" replace />; // Redirect admins away from specific user views
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b px-6 py-4 flex items-center justify-between">
        <h1 className="font-bold text-lg">
          {user.role === 'admin' ? 'Super Admin Portal' : 'Tenant Portal'}
        </h1>
        <div className="flex items-center gap-4 text-sm">
          <div>
            Welcome, {user.name ?? user.email} ({user.role})
          </div>
          <button
            className="rounded-md border px-3 py-1 text-xs font-medium hover:bg-zinc-100"
            onClick={async () => {
              await signOut();
              navigate(requiredRole === 'admin' ? '/admin/login' : '/login', { replace: true });
            }}
          >
            Sign out
          </button>
        </div>
      </header>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
