import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ApiError } from '@/lib/api/http';
import { useAuth } from '@/platform/auth/AuthProvider';

export function TwoFactorChallengePage() {
  const { completeTwoFactorChallenge } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [useRecoveryCode, setUseRecoveryCode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await completeTwoFactorChallenge(useRecoveryCode ? { recovery_code: recoveryCode } : { code });
      const intendedPath = sessionStorage.getItem('flowhub:intended-path') ?? '/app/dashboard';
      sessionStorage.removeItem('flowhub:intended-path');
      navigate(intendedPath, { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to verify two-factor challenge.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-950">Two-factor authentication</h1>
        <p className="mt-2 text-sm text-slate-600">Enter your authenticator app code or a recovery code.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {!useRecoveryCode ? (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Authenticator code</label>
              <Input
                value={code}
                onChange={(event) => setCode(event.target.value)}
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="123456"
                required
              />
            </div>
          ) : (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Recovery code</label>
              <Input value={recoveryCode} onChange={(event) => setRecoveryCode(event.target.value)} required />
            </div>
          )}

          {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}

          <Button className="w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Verifying...' : 'Verify'}
          </Button>
        </form>

        <button
          className="mt-4 text-sm font-medium text-slate-700 underline"
          type="button"
          onClick={() => setUseRecoveryCode((value) => !value)}
        >
          {useRecoveryCode ? 'Use authenticator code instead' : 'Use recovery code instead'}
        </button>

        <p className="mt-6 text-sm text-slate-600">
          <Link to="/login" className="font-medium text-slate-950">Back to sign in</Link>
        </p>
      </Card>
    </div>
  );
}
