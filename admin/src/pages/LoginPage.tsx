import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInEmail, signOut, useSession } from '@/lib/auth';

export function LoginPage({ mode }: { mode: 'admin' | 'user' }) {
  const navigate = useNavigate();
  const { data: session, isPending } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const user = session?.user as { role?: 'admin' | 'user' } | undefined;
    if (!isPending && user) {
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isPending, navigate, session]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await signInEmail({ email, password, rememberMe: true });
      if (response?.error) {
        setError(response.error.message ?? 'Login failed.');
        return;
      }

      const user = response?.data?.user;
      if (!user) {
        setError('Login failed. Please check your credentials.');
        return;
      }

      if (mode === 'admin' && user.role !== 'admin') {
        await signOut();
        setError('This account is not an admin. Please use the user login.');
        return;
      }

      if (mode === 'user' && user.role === 'admin') {
        await signOut();
        setError('Admin accounts should use the admin login.');
        return;
      }

      navigate(mode === 'admin' ? '/admin' : '/', { replace: true });
    } catch (err: any) {
      setError(err?.message ?? 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">{mode === 'admin' ? 'Admin Login' : 'User Login'}</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Sign in to continue managing your site.
        </p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input
              className="w-full rounded-md border px-3 py-2 text-sm"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <input
              className="w-full rounded-md border px-3 py-2 text-sm"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {error ? <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}

          <button
            type="submit"
            className="w-full rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
