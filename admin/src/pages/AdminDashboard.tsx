import { useMemo } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  FileText,
  Users,
} from "lucide-react"

import { ClientsTab } from "./admin-dashboard/ClientsTab"
import { OnboardTab } from "./admin-dashboard/OnboardTab"
import { TemplatesTab } from "./admin-dashboard/TemplatesTab"

export function AdminDashboard() {
  const location = useLocation()
  const navigate = useNavigate()

  const activeTab = useMemo(() => {
    const pathname = location.pathname.replace(/^\/admin\/?/, "")
    return (
      ["clients", "onboard", "templates"].includes(pathname)
        ? pathname
        : "clients"
    ) as "clients" | "onboard" | "templates"
  }, [location.pathname])

  const handleTabChange = (value: string) => {
    navigate(`/admin/${value}`)
  }

  return (
    <div className="container mx-auto max-w-7xl animate-in p-4 duration-500 zoom-in-95 fade-in md:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Admin Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your tenants, clients, and platform templates.
          </p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="inline-flex rounded-lg bg-muted p-1">
            <TabsTrigger
              value="clients"
              className="flex items-center gap-2 rounded-md px-6"
            >
              <Users className="h-4 w-4" /> Clients
            </TabsTrigger>
            <TabsTrigger
              value="onboard"
              className="flex items-center gap-2 rounded-md px-6"
            >
              <Plus className="h-4 w-4" /> Onboard
            </TabsTrigger>
            <TabsTrigger
              value="templates"
              className="flex items-center gap-2 rounded-md px-6"
            >
              <FileText className="h-4 w-4" /> Templates
            </TabsTrigger>
          </TabsList>

          {activeTab === "clients" ? (
            <Button asChild>
              <Link to="/admin/onboard">
                <Plus className="mr-2 h-4 w-4" />
                Create Client
              </Link>
            </Button>
          ) : null}
        </div>

        <TabsContent value="clients" className="mt-0">
          <ClientsTab />
        </TabsContent>

        <TabsContent value="onboard" className="mt-0">
          <OnboardTab />
        </TabsContent>

        <TabsContent value="templates" className="mt-0">
          <TemplatesTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
