import * as React from 'react';

import { NavDocuments } from '@/components/nav-documents';
import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import type { DashboardRole } from '@/lib/roles';
import {
  ArrowSquareOut,
  ChartBar,
  ChatsCircle,
  Command,
  Files,
  Gear,
  House,
  Image,
  Layout,
  ListChecks,
  MagnifyingGlass,
  Users
} from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

const sidebarConfig: Record<
  DashboardRole,
  {
    brand: string;
    subtitle: string;
    user: {
      name: string;
      email: string;
      avatar?: string;
    };
    navMain: { title: string; url: string; icon: React.ReactNode }[];
    documents: { name: string; url: string; icon: React.ReactNode }[];
    secondary: { title: string; url: string; icon: React.ReactNode }[];
  }
> = {
  admin: {
    brand: 'Acme Admin',
    subtitle: 'Tenant operations and platform health',
    user: {
      name: 'shadcn',
      email: 'm@example.com'
    },
    navMain: [
      { title: 'Clients', url: '/admin/clients', icon: <Users /> },
      { title: 'Onboard', url: '/admin/onboard', icon: <Layout /> },
      { title: 'Templates', url: '/admin/templates', icon: <ListChecks /> }
    ],
    documents: [
      { name: 'Clients', url: '/admin/clients', icon: <ChartBar /> },
      { name: 'Templates', url: '/admin/templates', icon: <Files /> },
      { name: 'Support', url: '/admin/onboard', icon: <ChatsCircle /> }
    ],
    secondary: [
      { title: 'Clients', url: '/admin/clients', icon: <Gear /> },
      { title: 'Templates', url: '/admin/templates', icon: <MagnifyingGlass /> }
    ]
  },
  user: {
    brand: 'Tenant Portal',
    subtitle: 'Content workspace and publishing tasks',
    user: {
      name: 'shadcn',
      email: 'm@example.com'
    },
    navMain: [
      { title: 'Landing', url: '/landing', icon: <House /> },
      { title: 'About', url: '/about', icon: <Layout /> },
      { title: 'Services', url: '/services', icon: <Files /> },
      { title: 'Blog', url: '/blog', icon: <ListChecks /> },
      { title: 'Contact', url: '/contact', icon: <MagnifyingGlass /> },
      { title: 'Media Library', url: '/media', icon: <Image /> }
    ],
    documents: [
      { name: 'Landing', url: '/landing', icon: <Files /> },
      { name: 'About', url: '/about', icon: <ArrowSquareOut /> },
      { name: 'Blog', url: '/blog', icon: <ChatsCircle /> },
      { name: 'Media', url: '/media', icon: <Image /> }
    ],
    secondary: [
      { title: 'Contact', url: '/contact', icon: <Gear /> },
      { title: 'Services', url: '/services', icon: <MagnifyingGlass /> }
    ]
  }
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  role: DashboardRole;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  onSignOut: () => void;
};

export function AppSidebar({ role, user, onSignOut, ...props }: AppSidebarProps) {
  const config = sidebarConfig[role];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="gap-3 border-b border-sidebar-border/70 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <Link to={role === 'admin' ? '/admin/clients' : '/landing'}>
                <Command className="size-5" />
                <span className="text-base font-semibold">{config.brand}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="px-2">
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-xl border border-sidebar-border bg-sidebar-accent/50 px-3 py-2 text-left text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
          >
            <span className="flex items-center gap-2">
              <span className="inline-flex size-6 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                +
              </span>
              Quick Create
            </span>
            <span className="text-xs text-muted-foreground">New</span>
          </button>
          <p className="mt-2 px-1 text-xs text-sidebar-foreground/70">{config.subtitle}</p>
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-4">
        <NavMain items={config.navMain} />
        <NavDocuments items={config.documents} />
        <NavSecondary items={config.secondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/70 p-2">
        <NavUser user={user} onSignOut={onSignOut} />
      </SidebarFooter>
    </Sidebar>
  );
}
