import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ProtectedLayout } from './components/layouts/ProtectedLayout';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
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
    path: '/',
    element: <ProtectedLayout requiredRole="user" />,
    children: [
      {
        path: '',
        element: <UserDashboard />
      }
    ]
  },
  {
    path: '/admin',
    element: <ProtectedLayout requiredRole="admin" />,
    children: [
      {
        path: '',
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
