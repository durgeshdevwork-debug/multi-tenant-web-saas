import { useMemo } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { signOut, useSession } from '../../lib/auth';
import type { DashboardRole } from '@/lib/roles';

export function ProtectedLayout({ requiredRole }: { requiredRole?: DashboardRole }) {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  const user = session?.user as { role?: DashboardRole; name?: string; email?: string } | undefined;

  const pageMeta = useMemo(() => {
    const pathname = location.pathname.replace(/^\//, '');

    if (requiredRole === 'admin') {
      const adminMeta: Record<string, { title: string; description: string }> = {
        clients: {
          title: 'Clients',
          description: 'Monitor tenants, templates, and platform-wide content at a glance.'
        },
        onboard: {
          title: 'Onboard Client',
          description: 'Create new tenants and prepare them for publishing.'
        },
        templates: {
          title: 'Templates',
          description: 'Manage reusable platform templates and module sets.'
        }
      };

      return adminMeta[pathname.replace(/^admin\/?/, '')] ?? {
        title: 'Admin Console',
        description: 'Monitor tenants, templates, and platform-wide content at a glance.'
      };
    }

    const userMeta: Record<string, { title: string; description: string }> = {
      landing: {
        title: 'Landing Page',
        description: 'Update the hero, calls to action, and highlights that introduce the website.'
      },
      about: {
        title: 'About Page',
        description: 'Manage company story, team members, and supporting content for the about page.'
      },
      services: {
        title: 'Services',
        description: 'Maintain your service offerings and reuse media assets across the site.'
      },
      blog: {
        title: 'Blog',
        description: 'Create and edit articles, then attach existing or newly uploaded media.'
      },
      contact: {
        title: 'Contact',
        description: 'Edit the contact section that appears on the public website.'
      },
      media: {
        title: 'Media Library',
        description: 'Upload and reuse site images across every content module.'
      }
    };

    return userMeta[pathname] ?? {
      title: 'Content Workspace',
      description: 'Track publishing progress, review sections, and keep the site ready to ship.'
    };
  }, [location.pathname, requiredRole]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading dashboard…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={requiredRole === 'admin' ? '/admin/login' : '/login'} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    if (requiredRole === 'admin') {
      return <Navigate to="/" replace />;
    }

    if (requiredRole === 'user' && user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
  }

  const roleLabel = user.role === 'admin' ? 'Admin access' : 'User access';

  return (
    <SidebarProvider defaultOpen>
      <AppSidebar
        role={user.role === 'admin' ? 'admin' : 'user'}
        user={{
          name: user.name ?? user.email ?? 'Workspace User',
          email: user.email ?? 'm@example.com'
        }}
        onSignOut={async () => {
          await signOut();
          navigate(requiredRole === 'admin' ? '/admin/login' : '/login', { replace: true });
        }}
      />
      <SidebarInset className="bg-background">
        <SiteHeader
          title={pageMeta.title}
          // description={pageMeta.description}
          roleLabel={roleLabel}
          onSignOut={async () => {
            await signOut();
            navigate(requiredRole === 'admin' ? '/admin/login' : '/login', { replace: true });
          }}
        />
        <div className="flex-1 px-4 py-6 md:px-6 lg:px-8">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
