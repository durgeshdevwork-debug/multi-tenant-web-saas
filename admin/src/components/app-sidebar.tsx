import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { Link, NavLink } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { NavUser } from "@/components/nav-user"
import { listPageTree } from "@/features/content/services/pages.api"
import type { Page } from "@/features/content/types"
import type { DashboardRole } from "@/lib/roles"
import { cn } from "@/lib/utils"
import {
  ArrowRight,
  CaretDown,
  ChartBar,
  ChatsCircle,
  Files,
  FolderOpen,
  Gear,
  Image,
  Layout,
  ListChecks,
  MagnifyingGlass,
  PlusSquare,
  SlidersHorizontal,
  Users,
} from "@phosphor-icons/react"

const sidebarConfig: Record<
  DashboardRole,
  {
    brand: string
    mark: string
    subtitle: string
    user: {
      name: string
      email: string
      avatar?: string
    }
    navMain?: { title: string; url: string; icon: React.ReactNode }[]
    documents?: { name: string; url: string; icon: React.ReactNode }[]
    secondary?: { title: string; url: string; icon: React.ReactNode }[]
  }
> = {
  admin: {
    brand: "Multi Tenant Admin",
    mark: "MT",
    subtitle: "Tenant operations and platform health",
    user: {
      name: "admin",
      email: "m@example.com",
    },
    navMain: [
      { title: "Clients", url: "/admin/clients", icon: <Users /> },
      { title: "Onboard", url: "/admin/onboard", icon: <Layout /> },
      { title: "Templates", url: "/admin/templates", icon: <ListChecks /> },
    ],
    documents: [
      { name: "Clients", url: "/admin/clients", icon: <ChartBar /> },
      { name: "Templates", url: "/admin/templates", icon: <Files /> },
      { name: "Support", url: "/admin/onboard", icon: <ChatsCircle /> },
    ],
    secondary: [
      { title: "Clients", url: "/admin/clients", icon: <Gear /> },
      { title: "Templates", url: "/admin/templates", icon: <MagnifyingGlass /> },
    ],
  },
  user: {
    brand: "Tenant Portal",
    mark: "TP",
    subtitle: "Pages, branding, and media for your website",
    user: {
      name: "shadcn",
      email: "m@example.com",
    },
  },
}

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  role: DashboardRole
  user: {
    name: string
    email: string
    avatar?: string
  }
  onSignOut: () => void
}

function SidebarBrand({
  role,
  brand,
  subtitle,
  mark,
}: {
  role: DashboardRole
  brand: string
  subtitle: string
  mark: string
}) {
  return (
    <SidebarHeader className="gap-3 border-b border-sidebar-border/70 px-3 py-4">
      <Link
        to={role === "admin" ? "/admin/clients" : "/pages"}
        className="group flex items-center gap-3 rounded-[var(--radius)] border border-sidebar-border/80 bg-sidebar-accent/20 p-3 transition-colors hover:bg-sidebar-accent/30"
      >
        <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius)] border border-sidebar-border bg-gradient-to-br from-sidebar-primary/20 via-sidebar-accent/30 to-sidebar/60 shadow-sm">
          <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_55%)]" />
          <span className="relative text-sm font-bold tracking-[0.24em] text-sidebar-foreground">
            {mark}
          </span>
        </span>

        <span className="grid min-w-0 flex-1 text-left leading-tight">
          <span className="truncate text-sm font-semibold text-sidebar-foreground">
            {brand}
          </span>
          <span className="truncate text-xs text-sidebar-foreground/70">
            {subtitle}
          </span>
        </span>

        <ArrowRight className="ml-auto size-4 text-sidebar-foreground/45 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </SidebarHeader>
  )
}

function SidebarSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      {description ? (
        <p className="px-2 pb-2 text-xs leading-5 text-sidebar-foreground/60">
          {description}
        </p>
      ) : null}
      <SidebarGroupContent>{children}</SidebarGroupContent>
    </SidebarGroup>
  )
}

function SidebarNavLink({
  to,
  label,
  icon,
  tooltip,
}: {
  to: string
  label: string
  icon: React.ReactNode
  tooltip?: string
}) {
  return (
    <SidebarMenuButton asChild tooltip={tooltip ?? label}>
      <NavLink
        to={to}
        className={({ isActive }) =>
          cn(
            "flex w-full items-center gap-2",
            isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
          )
        }
      >
        {icon}
        <span>{label}</span>
      </NavLink>
    </SidebarMenuButton>
  )
}

function PageTreeItem({ page, isSub = false }: { page: Page; isSub?: boolean }) {
  const hasChildren = Boolean(page.children?.length)
  const [isOpen, setIsOpen] = React.useState(true)

  if (isSub) {
    return (
      <SidebarMenuSubItem>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center">
            <SidebarMenuSubButton asChild className="flex-1">
              <NavLink
                to={`/pages/${page.id ?? page._id}`}
                className={({ isActive }) =>
                  cn(
                    "flex w-full items-center gap-2",
                    isActive &&
                      "bg-sidebar-accent text-sidebar-accent-foreground"
                  )
                }
              >
                <span>{page.navigationLabel || page.title}</span>
              </NavLink>
            </SidebarMenuSubButton>
            {hasChildren ? (
              <CollapsibleTrigger asChild>
                <button className="flex size-7 items-center justify-center rounded-[var(--radius)] text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                  <CaretDown
                    className={cn(
                      "size-3 transition-transform duration-200",
                      isOpen ? "rotate-0" : "-rotate-90"
                    )}
                  />
                </button>
              </CollapsibleTrigger>
            ) : null}
          </div>

          {hasChildren ? (
            <CollapsibleContent>
              <SidebarMenuSub>
                {page.children?.map((child) => (
                  <PageTreeItem
                    key={child.id ?? child._id}
                    page={child}
                    isSub
                  />
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          ) : null}
        </Collapsible>
      </SidebarMenuSubItem>
    )
  }

  return (
    <SidebarMenuItem>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center">
          <SidebarMenuButton asChild tooltip={page.title} className="flex-1">
            <NavLink
              to={`/pages/${page.id ?? page._id}`}
              className={({ isActive }) =>
                cn(
                  "flex w-full items-center gap-2",
                  isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                )
              }
            >
              <FolderOpen />
              <span>{page.navigationLabel || page.title}</span>
            </NavLink>
          </SidebarMenuButton>

          {hasChildren ? (
            <CollapsibleTrigger asChild>
              <button className="flex size-8 items-center justify-center rounded-[var(--radius)] text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                <CaretDown
                  className={cn(
                    "size-4 transition-transform duration-200",
                    isOpen ? "rotate-0" : "-rotate-90"
                  )}
                />
              </button>
            </CollapsibleTrigger>
          ) : null}
        </div>

        {hasChildren ? (
          <CollapsibleContent>
            <SidebarMenuSub>
              {page.children?.map((child) => (
                <PageTreeItem
                  key={child.id ?? child._id}
                  page={child}
                  isSub
                />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        ) : null}
      </Collapsible>
    </SidebarMenuItem>
  )
}

function UserSidebarContent() {
  const pageTreeQuery = useQuery({
    queryKey: ["content", "pages", "tree"],
    queryFn: listPageTree,
  })

  const pageTree = (pageTreeQuery.data as Page[] | undefined) ?? []

  return (
    <>
      <SidebarSection
        title="Pages"
        description="Create pages, manage hierarchy, and edit content."
      >
        <SidebarMenu className="gap-1.5">
          <SidebarMenuItem>
            <SidebarMenuButton asChild variant="outline" tooltip="Create Page">
              <NavLink
                to="/pages/new"
                className="flex w-full items-center gap-2"
              >
                <PlusSquare />
                <span>New Page</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarNavLink
              to="/pages"
              label="Pages Overview"
              icon={<Layout />}
              tooltip="All Pages"
            />
          </SidebarMenuItem>
          {pageTree.map((page) => (
            <PageTreeItem key={page.id ?? page._id} page={page} />
          ))}
        </SidebarMenu>
      </SidebarSection>

      <SidebarSection
        title="Global"
        description="Shared settings used across the entire site."
      >
        <SidebarMenu className="gap-1.5">
          <SidebarMenuItem>
            <SidebarNavLink
              to="/site-settings"
              label="Site Settings"
              icon={<SlidersHorizontal />}
              tooltip="Site Settings"
            />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarNavLink
              to="/media"
              label="Media Library"
              icon={<Image />}
              tooltip="Media Library"
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarSection>
    </>
  )
}

export function AppSidebar({
  role,
  user,
  onSignOut,
  ...props
}: AppSidebarProps) {
  const config = sidebarConfig[role]

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarBrand
        role={role}
        brand={config.brand}
        subtitle={config.subtitle}
        mark={config.mark}
      />

      <SidebarContent className="gap-5 px-1.5">
        {role === "admin" ? (
          <>
            <SidebarSection
              title="Operations"
              description="Primary workspace entry points for the admin team."
            >
              <SidebarMenu className="gap-1.5">
                {(config.navMain ?? []).map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarNavLink
                      to={item.url}
                      label={item.title}
                      icon={item.icon}
                      tooltip={item.title}
                    />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarSection>

            <SidebarSection
              title="Resources"
              description="Supporting pages and operational references."
            >
              <SidebarMenu className="gap-1.5">
                {(config.documents ?? []).map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarNavLink
                      to={item.url}
                      label={item.name}
                      icon={item.icon}
                      tooltip={item.name}
                    />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarSection>

            <SidebarSection title="Quick Links">
              <SidebarMenu className="gap-1.5">
                {(config.secondary ?? []).map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarNavLink
                      to={item.url}
                      label={item.title}
                      icon={item.icon}
                      tooltip={item.title}
                    />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarSection>
          </>
        ) : (
          <UserSidebarContent />
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/70 p-2">
        <NavUser user={user} onSignOut={onSignOut} />
      </SidebarFooter>
    </Sidebar>
  )
}
