import { useMemo } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { signOut, useSession } from "../../lib/auth"
import type { DashboardRole } from "@/lib/roles"

export function ProtectedLayout({
  requiredRole,
}: {
  requiredRole?: DashboardRole
}) {
  const { data: session, isPending } = useSession()
  const location = useLocation()

  const user = session?.user as
    | { role?: DashboardRole; name?: string; email?: string }
    | undefined

  const pageMeta = useMemo(() => {
    const pathname = location.pathname.replace(/^\//, "")

    if (requiredRole === "admin") {
      const adminMeta: Record<string, { title: string; description: string }> =
        {
          clients: {
            title: "Clients",
            description:
              "Monitor tenants, templates, and platform-wide content at a glance.",
          },
          onboard: {
            title: "Onboard Client",
            description: "Create new tenants and prepare them for publishing.",
          },
          templates: {
            title: "Templates",
            description: "Manage reusable platform templates and module sets.",
          },
        }

      return (
        adminMeta[pathname.replace(/^admin\/?/, "")] ?? {
          title: "Admin Console",
          description:
            "Monitor tenants, templates, and platform-wide content at a glance.",
        }
      )
    }

    if (pathname === "pages") {
      return {
        title: "Pages",
        description:
          "Create, edit, and structure pages for the public website.",
      }
    }

    if (pathname.startsWith("pages/")) {
      return {
        title: pathname === "pages/new" ? "Create Page" : "Edit Page",
        description:
          "Manage sections, SEO, hierarchy, and publishing controls for this page.",
      }
    }

    const userMeta: Record<string, { title: string; description: string }> = {
      media: {
        title: "Media Library",
        description:
          "Upload and reuse site images across every page and section.",
      },
      "site-settings": {
        title: "Site Settings",
        description:
          "Manage branding, contact details, SEO defaults, and global website configuration.",
      },
    }

    return (
      userMeta[pathname] ?? {
        title: "Content Workspace",
        description:
          "Track publishing progress, review pages, and keep the site ready to ship.",
      }
    )
  }, [location.pathname, requiredRole])

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading dashboard...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <Navigate
        to={requiredRole === "admin" ? "/admin/login" : "/login"}
        replace
      />
    )
  }

  if (requiredRole && user.role !== requiredRole) {
    if (requiredRole === "admin") {
      return <Navigate to="/" replace />
    }

    if (requiredRole === "user" && user.role === "admin") {
      return <Navigate to="/admin" replace />
    }
  }

  return (
    <SidebarProvider defaultOpen>
      <AppSidebar
        role={user.role === "admin" ? "admin" : "user"}
        user={{
          name: user.name ?? user.email ?? "Workspace User",
          email: user.email ?? "m@example.com",
        }}
        onSignOut={async () => {
          await signOut()
          window.location.href =
            requiredRole === "admin" ? "/admin/login" : "/login"
        }}
      />
      <SidebarInset className="h-svh min-h-0 overflow-hidden bg-background">
        <SiteHeader
          title={pageMeta.title}
          onSignOut={async () => {
            await signOut()
            window.location.href =
              requiredRole === "admin" ? "/admin/login" : "/login"
          }}
        />
        <div className="flex flex-1 min-h-0 flex-col overflow-hidden px-4 py-6 md:px-6 lg:px-8">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
