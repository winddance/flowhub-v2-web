import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { requestMagicLink, redirectToGoogleOAuth, TwoFactorRequiredError } from '@/lib/api/auth';
import { ApiError, csrfCookie } from '@/lib/api/http';
import { configurePasskeys, Passkeys, passkeyRoutes } from '@/lib/passkeys';
import { useAuth } from '@/platform/auth/AuthProvider';

function intendedPathFromLocationState(state: unknown): string {
  const path = (state as { from?: { pathname?: string } } | null)?.from?.pathname;

  if (!path || !path.startsWith('/') || path.startsWith('//') || path.includes('://')) {
    return '/app/dashboard';
  }

  return path;
}

export function LoginPage() {
  const { signIn, refresh } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('admin@flowhub.local');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const [isPasswordlessSubmitting, setPasswordlessSubmitting] = useState(false);

  const intendedPath = intendedPathFromLocationState(location.state);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setSubmitting(true);

    try {
      await signIn({ email, password });
      navigate(intendedPath, { replace: true });
    } catch (err) {
      if (err instanceof TwoFactorRequiredError) {
        sessionStorage.setItem('flowhub:intended-path', intendedPath);
        navigate('/two-factor-challenge', { replace: true });
        return;
      }

      setError(err instanceof ApiError ? err.message : 'Unable to log in.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePasskeyLogin() {
    setError(null);
    setNotice(null);
    setPasswordlessSubmitting(true);

    try {
      await csrfCookie();
      configurePasskeys();
      await Passkeys.verify({ routes: passkeyRoutes.login });
      await refresh();
      navigate(intendedPath, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in with passkey.');
    } finally {
      setPasswordlessSubmitting(false);
    }
  }

  async function handleMagicLink() {
    setError(null);
    setNotice(null);
    setPasswordlessSubmitting(true);

    try {
      const response = await requestMagicLink({ email, redirect: intendedPath });
      setNotice(response.message);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to request magic link.');
    } finally {
      setPasswordlessSubmitting(false);
    }
  }

  function handleGoogleLogin() {
    redirectToGoogleOAuth(intendedPath);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-950">Sign in to FlowHub</h1>
        <p className="mt-2 text-sm text-slate-600">Use a passwordless method, Google, or your workspace password.</p>

        <div className="mt-6 grid gap-3">
          <Button onClick={handlePasskeyLogin} type="button" variant="secondary" disabled={isPasswordlessSubmitting}>
            Sign in with passkey
          </Button>
          <Button onClick={handleGoogleLogin} type="button" variant="secondary">
            Continue with Google
          </Button>
        </div>

        <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wide text-slate-400">
          <div className="h-px flex-1 bg-slate-200" />
          <span>Email sign in</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="login-email">Email</label>
            <Input
              id="login-email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              autoComplete="email webauthn"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="login-password">Password</label>
            <Input id="login-password" value={password} onChange={(event) => setPassword(event.target.value)} type="password" />
          </div>

          {notice && <div className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">{notice}</div>}
          {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}

          <Button className="w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Signing in...' : 'Sign in with password'}
          </Button>
          <Button className="w-full" disabled={isPasswordlessSubmitting || !email} type="button" variant="ghost" onClick={handleMagicLink}>
            Email me a magic sign-in link
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          New workspace? <Link className="font-medium text-slate-950" to="/register">Create an account</Link>
        </p>
      </Card>
    </div>
  );
}
