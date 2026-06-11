import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/platform/auth/AuthProvider';

export function ProfilePage() {
  const { current } = useAuth();
  const providers = current?.user.authProviders ?? [];

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Profile</h1>
        <p className="mt-2 text-slate-600">Basic authenticated user module page.</p>
      </div>

      <Card>
        <div className="mb-6 flex items-center gap-4">
          {current?.user.avatarUrl ? (
            <img
              alt={current.user.name}
              className="h-14 w-14 rounded-full border border-slate-200 object-cover"
              src={current.user.avatarUrl}
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-700">
              {current?.user.name?.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div>
            <div className="font-semibold text-slate-950">{current?.user.name}</div>
            <div className="text-sm text-slate-500">{current?.user.email}</div>
          </div>
        </div>

        <dl className="space-y-4">
          <div>
            <dt className="text-sm font-medium text-slate-500">Name</dt>
            <dd className="mt-1 text-slate-950">{current?.user.name}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">Email</dt>
            <dd className="mt-1 text-slate-950">{current?.user.email}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">Authentication providers</dt>
            <dd className="mt-1 text-slate-950">{providers.length > 0 ? providers.join(', ') : 'Password'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">Security</dt>
            <dd className="mt-1 text-slate-950">
              {current?.user.security.twoFactorEnabled ? '2FA enabled' : '2FA not enabled'}; {current?.user.security.passkeysCount ?? 0} passkeys
              <Link className="ml-2 font-medium underline" to="/app/security">Manage</Link>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">Active workspace</dt>
            <dd className="mt-1 text-slate-950">{current?.activeWorkspace?.name}</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
