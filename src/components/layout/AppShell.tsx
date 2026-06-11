import { LogOut } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/platform/auth/AuthProvider';
import { WorkspaceSwitcher } from '@/platform/tenancy/WorkspaceSwitcher';
import { useNavigation } from '@/platform/modules/useNavigation';

export function AppShell() {
  const { current, signOut } = useAuth();
  const navigation = useNavigation();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 w-64 border-r border-slate-200 bg-white p-6">
        <div className="text-xl font-bold tracking-tight text-slate-950">FlowHub</div>
        <nav className="mt-8 space-y-1">
          {(navigation.data?.items ?? []).map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm font-medium ${
                  isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="ml-64">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
          <WorkspaceSwitcher />
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium text-slate-900">{current?.user.name}</div>
              <div className="text-xs text-slate-500">{current?.user.email}</div>
            </div>
            <Button variant="ghost" onClick={handleLogout} aria-label="Logout">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </header>
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
