import * as React from "react"
import { useQuery } from "@tanstack/react-query"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
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
import type { DashboardRole } from "@/lib/roles"
import {
  ChartBar,
  ChatsCircle,
  Command,
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
  CaretDown,
} from "@phosphor-icons/react"
import { Link, NavLink } from "react-router-dom"
import { listPageTree, type Page } from "@/lib/api"
import { cn } from "@/lib/utils"

const sidebarConfig: Record<
  DashboardRole,
  {
    brand: string
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
    brand: "multi tenant Admin",
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
      {
        title: "Templates",
        url: "/admin/templates",
        icon: <MagnifyingGlass />,
      },
    ],
  },
  user: {
    brand: "Tenant Portal",
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
                    "flex w-full items-center gap-2 rounded-none",
                    isActive &&
                      "bg-sidebar-accent text-sidebar-accent-foreground"
                  )
                }
              >
                <span>{page.navigationLabel || page.title}</span>
              </NavLink>
            </SidebarMenuSubButton>
            {hasChildren && (
              <CollapsibleTrigger asChild>
                <button className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-sidebar-accent">
                  <CaretDown
                    className={cn(
                      "h-3 w-3 transition-transform duration-200",
                      isOpen ? "rotate-0" : "-rotate-90"
                    )}
                  />
                </button>
              </CollapsibleTrigger>
            )}
          </div>
          {hasChildren && (
            <CollapsibleContent>
              <SidebarMenuSub>
                {page.children?.map((child) => (
                  <PageTreeItem
                    key={child.id ?? child._id}
                    page={child}
                    isSub={true}
                  />
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          )}
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
                  "flex w-full items-center gap-2 rounded-none",
                  isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                )
              }
            >
              <FolderOpen />
              <span>{page.navigationLabel || page.title}</span>
            </NavLink>
          </SidebarMenuButton>
          {hasChildren && (
            <CollapsibleTrigger asChild>
              <button className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-sidebar-accent">
                <CaretDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    isOpen ? "rotate-0" : "-rotate-90"
                  )}
                />
              </button>
            </CollapsibleTrigger>
          )}
        </div>

        {hasChildren && (
          <CollapsibleContent>
            <SidebarMenuSub>
              {page.children?.map((child) => (
                <PageTreeItem
                  key={child.id ?? child._id}
                  page={child}
                  isSub={true}
                />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        )}
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
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Create Page"
                className="min-w-8 bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
              >
                <Link to="/pages/new">
                  <PlusSquare />
                  <span>Create Page</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Pages</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="All Pages">
                <NavLink
                  to="/pages"
                  className={({ isActive }) =>
                    cn(
                      "flex w-full items-center gap-2 rounded-none",
                      isActive &&
                        "bg-sidebar-accent text-sidebar-accent-foreground"
                    )
                  }
                >
                  <Layout />
                  <span>Pages Overview</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {pageTree.map((page) => (
              <PageTreeItem key={page.id ?? page._id} page={page} />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Global</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Site Settings">
                <NavLink
                  to="/site-settings"
                  className={({ isActive }) =>
                    cn(
                      "flex w-full items-center gap-2 rounded-none",
                      isActive &&
                        "bg-sidebar-accent text-sidebar-accent-foreground"
                    )
                  }
                >
                  <SlidersHorizontal />
                  <span>Site Settings</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Media Library">
                <NavLink
                  to="/media"
                  className={({ isActive }) =>
                    cn(
                      "flex w-full items-center gap-2 rounded-none",
                      isActive &&
                        "bg-sidebar-accent text-sidebar-accent-foreground"
                    )
                  }
                >
                  <Image />
                  <span>Media Library</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
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
      <SidebarHeader className="gap-3 border-b border-sidebar-border/70 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link to={role === "admin" ? "/admin/clients" : "/pages"}>
                <Command className="size-5" />
                <span className="text-base font-semibold">{config.brand}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="px-2">
          <Link
            to={role === "admin" ? "/admin/onboard" : "/pages/new"}
            className="flex w-full items-center justify-between rounded-xl border border-sidebar-border bg-sidebar-accent/50 px-3 py-2 text-left text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
          >
            <span className="flex items-center gap-2">
              <span className="inline-flex size-6 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                +
              </span>
              {role === "admin" ? "Quick Create" : "New Page"}
            </span>
            <span className="text-xs text-muted-foreground">New</span>
          </Link>
          <p className="mt-2 px-1 text-xs text-sidebar-foreground/70">
            {config.subtitle}
          </p>
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-4">
        {role === "admin" ? (
          <>
            <NavMain items={config.navMain ?? []} />
            <NavDocuments items={config.documents ?? []} />
            <NavSecondary items={config.secondary ?? []} className="mt-auto" />
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
