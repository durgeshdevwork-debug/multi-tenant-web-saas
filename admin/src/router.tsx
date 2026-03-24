import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ProtectedLayout } from './components/layouts/ProtectedLayout';

// Placeholder Pages
const UserLogin = () => <div className="p-8">User Login Page Placeholder</div>;
const AdminLogin = () => <div className="p-8">Admin Login Page Placeholder</div>;
const AdminDashboard = () => <div className="p-8">Admin Dashboard - Manage Clients</div>;
const UserDashboard = () => <div className="p-8">Tenant Dashboard - Manage Content</div>;

const router = createBrowserRouter([
  {
    path: '/login',
    element: <UserLogin />
  },
  {
    path: '/admin/login',
    element: <AdminLogin />
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
