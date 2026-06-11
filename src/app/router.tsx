import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { OAuthCallbackPage } from '@/features/auth/pages/OAuthCallbackPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { TwoFactorChallengePage } from '@/features/auth/pages/TwoFactorChallengePage';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { ProfilePage } from '@/features/profile/pages/ProfilePage';
import { SecurityPage } from '@/features/security/pages/SecurityPage';
import { AppShell } from '@/components/layout/AppShell';
import { RequireAuth } from '@/platform/auth/RequireAuth';
import { NotFoundPage } from '@/features/misc/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/app/dashboard" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/two-factor-challenge',
    element: <TwoFactorChallengePage />,
  },
  {
    path: '/oauth/google/callback',
    element: <OAuthCallbackPage />,
  },
  {
    path: '/app',
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/app/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'security', element: <SecurityPage /> },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
