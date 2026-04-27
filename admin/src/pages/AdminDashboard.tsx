import { useMemo } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { FileText, Plus, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ClientsTab } from "./admin-dashboard/ClientsTab"
import { OnboardTab } from "./admin-dashboard/OnboardTab"
import { TemplatesTab } from "./admin-dashboard/TemplatesTab"

type AdminSection = "clients" | "onboard" | "templates"

const sections: Array<{
  key: AdminSection
  title: string
  description: string
  icon: typeof Users
  actionLabel: string
  actionTo: string
}> = [
  {
    key: "clients",
    title: "Clients",
    description: "Review tenants, domains, and access details.",
    icon: Users,
    actionLabel: "Create client",
    actionTo: "/admin/onboard",
  },
  {
    key: "onboard",
    title: "Onboard",
    description: "Create a new tenant and generate credentials.",
    icon: Plus,
    actionLabel: "Go to onboarding",
    actionTo: "/admin/onboard",
  },
  {
    key: "templates",
    title: "Templates",
    description: "Manage reusable template definitions and modules.",
    icon: FileText,
    actionLabel: "Create template",
    actionTo: "/admin/templates",
  },
]

function getActiveSection(pathname: string): AdminSection {
  const slug = pathname.replace(/^\/admin\/?/, "")
  return (["clients", "onboard", "templates"].includes(slug)
    ? slug
    : "clients") as AdminSection
}

export function AdminDashboard() {
  const location = useLocation()
  const navigate = useNavigate()
  const activeSection = useMemo(
    () => getActiveSection(location.pathname),
    [location.pathname]
  )

  const currentSection = sections.find((section) => section.key === activeSection) ?? sections[0]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon
          const isActive = section.key === activeSection

          return (
            <button
              key={section.key}
              type="button"
              onClick={() => navigate(`/admin/${section.key}`)}
              className={cn(
                "rounded-2xl border bg-card p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md",
                isActive && "border-primary/60 ring-1 ring-primary/20"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="inline-flex rounded-full border bg-muted/40 p-2">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-base font-semibold">{section.title}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {section.description}
                    </div>
                  </div>
                </div>
                <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  View
                </span>
              </div>
            </button>
          )
        })}
      </div>

      <Card className="border-none bg-card/90 shadow-xl">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <CardTitle className="text-2xl">{currentSection.title}</CardTitle>
            <CardDescription>{currentSection.description}</CardDescription>
          </div>
          <Button asChild>
            <Link to={currentSection.actionTo}>{currentSection.actionLabel}</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {activeSection === "clients" ? <ClientsTab /> : null}
          {activeSection === "onboard" ? <OnboardTab /> : null}
          {activeSection === "templates" ? <TemplatesTab /> : null}
        </CardContent>
      </Card>
    </div>
  )
}

