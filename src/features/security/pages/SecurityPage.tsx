import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import {
  confirmTwoFactor,
  deletePasskey,
  disableTwoFactor,
  enableTwoFactor,
  fetchRecoveryCodes,
  fetchSecurity,
  fetchTwoFactorQrCode,
  regenerateRecoveryCodes,
} from '@/lib/api/security';
import { csrfCookie } from '@/lib/api/http';
import { configurePasskeys, Passkeys, passkeyRoutes } from '@/lib/passkeys';

export function SecurityPage() {
  const queryClient = useQueryClient();
  const security = useQuery({ queryKey: ['security'], queryFn: fetchSecurity });
  const [passkeyName, setPasskeyName] = useState('My device');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [qrSvg, setQrSvg] = useState<string | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function reloadSecurity() {
    await queryClient.invalidateQueries({ queryKey: ['security'] });
    await queryClient.invalidateQueries({ queryKey: ['me'] });
  }

  async function handleAddPasskey(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setBusy('passkey');

    try {
      await csrfCookie();
      configurePasskeys();
      await Passkeys.register({ name: passkeyName, routes: passkeyRoutes.register });
      setNotice('Passkey added.');
      await reloadSecurity();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to add passkey.');
    } finally {
      setBusy(null);
    }
  }

  async function handleDeletePasskey(id: string) {
    setBusy(`delete-${id}`);
    setError(null);
    setNotice(null);

    try {
      await deletePasskey(id);
      setNotice('Passkey deleted.');
      await reloadSecurity();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete passkey.');
    } finally {
      setBusy(null);
    }
  }

  async function handleEnableTwoFactor() {
    setBusy('2fa-enable');
    setError(null);
    setNotice(null);

    try {
      await enableTwoFactor();
      const qr = await fetchTwoFactorQrCode();
      setQrSvg(qr.svg);
      setNotice('Scan the QR code and confirm the first code from your authenticator app.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to enable two-factor authentication.');
    } finally {
      setBusy(null);
    }
  }

  async function handleConfirmTwoFactor(event: FormEvent) {
    event.preventDefault();
    setBusy('2fa-confirm');
    setError(null);
    setNotice(null);

    try {
      await confirmTwoFactor(twoFactorCode);
      const codes = await fetchRecoveryCodes();
      setRecoveryCodes(codes);
      setQrSvg(null);
      setTwoFactorCode('');
      setNotice('Two-factor authentication enabled. Save your recovery codes.');
      await reloadSecurity();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to confirm two-factor authentication.');
    } finally {
      setBusy(null);
    }
  }

  async function handleRecoveryCodes() {
    setBusy('2fa-codes');
    setError(null);
    setNotice(null);

    try {
      setRecoveryCodes(await fetchRecoveryCodes());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load recovery codes.');
    } finally {
      setBusy(null);
    }
  }

  async function handleRegenerateRecoveryCodes() {
    setBusy('2fa-regenerate');
    setError(null);
    setNotice(null);

    try {
      await regenerateRecoveryCodes();
      setRecoveryCodes(await fetchRecoveryCodes());
      setNotice('Recovery codes regenerated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to regenerate recovery codes.');
    } finally {
      setBusy(null);
    }
  }

  async function handleDisableTwoFactor() {
    setBusy('2fa-disable');
    setError(null);
    setNotice(null);

    try {
      await disableTwoFactor();
      setRecoveryCodes([]);
      setNotice('Two-factor authentication disabled.');
      await reloadSecurity();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to disable two-factor authentication.');
    } finally {
      setBusy(null);
    }
  }

  const payload = security.data;

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Security</h1>
        <p className="mt-2 text-slate-600">Manage passkeys, passwordless sign-in, and two-factor authentication.</p>
      </div>

      {notice && <div className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">{notice}</div>}
      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <Card>
        <h2 className="text-lg font-semibold text-slate-950">Passkeys</h2>
        <p className="mt-1 text-sm text-slate-600">Use Face ID, Touch ID, Windows Hello, or a hardware security key to sign in without a password.</p>

        <form className="mt-4 flex gap-3" onSubmit={handleAddPasskey}>
          <Input value={passkeyName} onChange={(event) => setPasskeyName(event.target.value)} placeholder="Passkey name" required />
          <Button type="submit" disabled={busy === 'passkey'}>Add passkey</Button>
        </form>

        <div className="mt-5 space-y-3">
          {(payload?.passkeys ?? []).length === 0 ? (
            <p className="text-sm text-slate-500">No passkeys registered yet.</p>
          ) : (
            payload?.passkeys.map((passkey) => (
              <div key={passkey.id} className="flex items-center justify-between rounded-md border border-slate-200 p-3">
                <div>
                  <div className="font-medium text-slate-950">{passkey.name}</div>
                  <div className="text-xs text-slate-500">Added {passkey.createdAt ?? 'recently'}</div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={busy === `delete-${passkey.id}`}
                  onClick={() => handleDeletePasskey(passkey.id)}
                >
                  Delete
                </Button>
              </div>
            ))
          )}
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-slate-950">Authenticator app 2FA</h2>
        <p className="mt-1 text-sm text-slate-600">Require a time-based code after password login.</p>

        <div className="mt-4 rounded-md bg-slate-50 p-3 text-sm text-slate-700">
          Status: <strong>{payload?.twoFactorEnabled ? 'Enabled' : 'Not enabled'}</strong>
        </div>

        {!payload?.twoFactorEnabled && !qrSvg && (
          <Button className="mt-4" type="button" disabled={busy === '2fa-enable'} onClick={handleEnableTwoFactor}>
            Enable 2FA
          </Button>
        )}

        {qrSvg && (
          <form className="mt-4 space-y-4" onSubmit={handleConfirmTwoFactor}>
            <div className="rounded-md border border-slate-200 bg-white p-4" dangerouslySetInnerHTML={{ __html: qrSvg }} />
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Authenticator code</label>
              <Input value={twoFactorCode} onChange={(event) => setTwoFactorCode(event.target.value)} inputMode="numeric" required />
            </div>
            <Button type="submit" disabled={busy === '2fa-confirm'}>Confirm 2FA</Button>
          </form>
        )}

        {payload?.twoFactorEnabled && (
          <div className="mt-4 flex flex-wrap gap-3">
            <Button type="button" variant="secondary" disabled={busy === '2fa-codes'} onClick={handleRecoveryCodes}>
              Show recovery codes
            </Button>
            <Button type="button" variant="secondary" disabled={busy === '2fa-regenerate'} onClick={handleRegenerateRecoveryCodes}>
              Regenerate recovery codes
            </Button>
            <Button type="button" variant="ghost" disabled={busy === '2fa-disable'} onClick={handleDisableTwoFactor}>
              Disable 2FA
            </Button>
          </div>
        )}

        {recoveryCodes.length > 0 && (
          <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 text-sm font-medium text-slate-700">Recovery codes</div>
            <div className="grid gap-2 sm:grid-cols-2">
              {recoveryCodes.map((code) => (
                <code key={code} className="rounded bg-white px-2 py-1 text-sm text-slate-800">{code}</code>
              ))}
            </div>
          </div>
        )}
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-slate-950">Passwordless email links</h2>
        <p className="mt-1 text-sm text-slate-600">Users can request a one-time magic link from the login page. Links are signed, expire quickly, and are single use.</p>
      </Card>
    </div>
  );
}
