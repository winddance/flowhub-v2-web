import { useTenant } from './TenantProvider';

export function WorkspaceSwitcher() {
  const { activeWorkspace, workspaces, switchToWorkspace } = useTenant();

  if (workspaces.length === 0) {
    return <span className="text-sm text-slate-500">No workspace</span>;
  }

  return (
    <label className="flex items-center gap-2 text-sm text-slate-700">
      <span className="font-medium">Workspace</span>
      <select
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm"
        value={activeWorkspace?.id ?? ''}
        onChange={(event) => switchToWorkspace(event.target.value)}
        aria-label="Switch workspace"
      >
        {workspaces.map((workspace) => (
          <option key={workspace.id} value={workspace.id}>
            {workspace.name}
          </option>
        ))}
      </select>
    </label>
  );
}
