import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { redirectToGoogleOAuth } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/http';
import { useAuth } from '@/platform/auth/AuthProvider';

export function RegisterPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('Wai Mun Chan');
  const [email, setEmail] = useState('wai@example.test');
  const [workspaceName, setWorkspaceName] = useState('FlowHub Labs');
  const [password, setPassword] = useState('password');
  const [passwordConfirmation, setPasswordConfirmation] = useState('password');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await signUp({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        workspace_name: workspaceName,
      });
      navigate('/app/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to register.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleGoogleSignup() {
    redirectToGoogleOAuth('/app/dashboard');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-950">Create your FlowHub workspace</h1>
        <p className="mt-2 text-sm text-slate-600">This creates your user and first owner workspace.</p>

        <Button className="mt-6 w-full" onClick={handleGoogleSignup} type="button" variant="secondary">
          Continue with Google
        </Button>
        <p className="mt-2 text-xs text-slate-500">
          Google sign-up creates a default workspace that can be renamed later.
        </p>

        <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wide text-slate-400">
          <div className="h-px flex-1 bg-slate-200" />
          <span>Email sign up</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
            <Input value={name} onChange={(event) => setName(event.target.value)} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <Input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Workspace name</label>
            <Input value={workspaceName} onChange={(event) => setWorkspaceName(event.target.value)} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
            <Input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Confirm password</label>
            <Input value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} type="password" required />
          </div>

          {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}

          <Button className="w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Creating workspace...' : 'Create workspace'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account? <Link className="font-medium text-slate-950" to="/login">Sign in</Link>
        </p>
      </Card>
    </div>
  );
}
