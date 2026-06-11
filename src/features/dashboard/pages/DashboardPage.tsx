import { Card } from '@/components/ui/Card';
import { useTenant } from '@/platform/tenancy/TenantProvider';

export function DashboardPage() {
  const { activeWorkspace } = useTenant();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Dashboard</h1>
        <p className="mt-2 text-slate-600">Tenant-safe workspace shell is ready for your first modules.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <div className="text-sm font-medium text-slate-500">Active workspace</div>
          <div className="mt-2 text-xl font-semibold text-slate-950">{activeWorkspace?.name ?? 'None selected'}</div>
        </Card>
        <Card>
          <div className="text-sm font-medium text-slate-500">Next module</div>
          <div className="mt-2 text-xl font-semibold text-slate-950">Tasks / Projects</div>
        </Card>
        <Card>
          <div className="text-sm font-medium text-slate-500">Platform status</div>
          <div className="mt-2 text-xl font-semibold text-slate-950">Auth + TenantContext MVP</div>
        </Card>
      </div>
    </div>
  );
}
