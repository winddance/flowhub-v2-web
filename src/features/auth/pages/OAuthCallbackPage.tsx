import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/platform/auth/AuthProvider';

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  oauth_failed: 'Google sign-in failed. Please try again.',
  email_missing: 'Google did not return an email address for this account.',
  email_not_verified: 'Your Google email must be verified before you can sign in.',
  domain_not_allowed: 'This Google account is not allowed for this FlowHub environment.',
};

function safeNextPath(value: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('://')) {
    return '/app/dashboard';
  }

  return value;
}

export function OAuthCallbackPage() {
  const { refresh } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const errorCode = searchParams.get('error');
  const oauthError = errorCode ? OAUTH_ERROR_MESSAGES[errorCode] ?? 'Unable to complete Google sign-in.' : null;
  const [sessionError, setSessionError] = useState<string | null>(null);
  const error = oauthError ?? sessionError;

  useEffect(() => {
    if (oauthError) {
      return;
    }

    const nextPath = safeNextPath(searchParams.get('next'));

    refresh()
      .then(() => navigate(nextPath, { replace: true }))
      .catch(() => setSessionError('Google sign-in completed, but FlowHub could not load your session.'));
  }, [navigate, oauthError, refresh, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <Card className="w-full max-w-md">
        {error ? (
          <>
            <h1 className="text-2xl font-bold text-slate-950">Google sign-in failed</h1>
            <p className="mt-2 text-sm text-slate-600">{error}</p>
            <p className="mt-6 text-sm">
              <Link className="font-medium text-slate-950" to="/login">Back to sign in</Link>
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-slate-950">Completing Google sign-in</h1>
            <p className="mt-2 text-sm text-slate-600">Loading your FlowHub workspace session...</p>
          </>
        )}
      </Card>
    </div>
  );
}
