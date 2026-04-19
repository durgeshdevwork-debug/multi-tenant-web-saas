import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ProtectedLayout } from './components/layouts/ProtectedLayout';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { MediaLibraryPage } from './pages/MediaLibraryPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { UserDashboard } from './pages/UserDashboard';

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
        element: <Navigate to="/landing" replace />
      },
      {
        path: 'landing',
        element: <UserDashboard />
      },
      {
        path: 'about',
        element: <UserDashboard />
      },
      {
        path: 'services',
        element: <UserDashboard />
      },
      {
        path: 'blog',
        element: <UserDashboard />
      },
      {
        path: 'media',
        element: <MediaLibraryPage />
      },
      {
        path: 'contact',
        element: <UserDashboard />
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
