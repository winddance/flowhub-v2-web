import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-950">404</h1>
        <p className="mt-2 text-slate-600">Page not found.</p>
        <Link className="mt-6 inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white" to="/app/dashboard">
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
