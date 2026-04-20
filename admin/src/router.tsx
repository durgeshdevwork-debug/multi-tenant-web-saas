import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { ProtectedLayout } from './components/layouts/ProtectedLayout';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { MediaLibraryPage } from './pages/MediaLibraryPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { SiteSettingsPage } from './pages/SiteSettingsPage';
import { PagesWorkspacePage } from './pages/PagesWorkspacePage';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage mode="user" />
  },
  {
    path: '/admin/login',
    element: <LoginPage mode="admin" />
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />
  },
  {
    path: '/',
    element: <ProtectedLayout requiredRole="user" />,
    children: [
      {
        index: true,
        element: <Navigate to="/pages" replace />
      },
      {
        path: 'pages',
        element: <PagesWorkspacePage />
      },
      {
        path: 'pages/new',
        element: <PagesWorkspacePage />
      },
      {
        path: 'pages/:pageId',
        element: <PagesWorkspacePage />
      },
      {
        path: 'media',
        element: <MediaLibraryPage />
      },
      {
        path: 'site-settings',
        element: <SiteSettingsPage />
      }
    ]
  },
  {
    path: '/admin',
    element: <ProtectedLayout requiredRole="admin" />,
    children: [
      {
        index: true,
        element: <Navigate to="/admin/clients" replace />
      },
      {
        path: 'clients',
        element: <AdminDashboard />
      },
      {
        path: 'onboard',
        element: <AdminDashboard />
      },
      {
        path: 'templates',
        element: <AdminDashboard />
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);

export function Router() {
  return <RouterProvider router={router} />;
}
