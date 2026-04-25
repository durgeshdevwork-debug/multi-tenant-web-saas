import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { FileText, Plus, Loader2 } from "lucide-react"
import { getTemplates, createTemplate, type Template } from "@/lib/api"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

const defaultModules = ["landing", "about", "services", "blog", "contact"]

export function TemplatesTab() {
  const queryClient = useQueryClient()
  const [templateForm, setTemplateForm] = useState({
    name: "",
    identifier: "",
    modules: defaultModules.join(", "),
  })

  const templatesQuery = useQuery({
    queryKey: ["templates"],
    queryFn: getTemplates,
  })

  const createTemplateMutation = useMutation({
    mutationFn: createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] })
      setTemplateForm({
        name: "",
        identifier: "",
        modules: defaultModules.join(", "),
      })
    },
  })

  const handleTemplateSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    createTemplateMutation.mutate({
      name: templateForm.name,
      identifier: templateForm.identifier,
      modules: templateForm.modules
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean),
    })
  }

  return (
    <Card className="border-none bg-gradient-to-br from-card to-muted/20 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <FileText className="h-6 w-6 text-primary" /> Platform Templates
        </CardTitle>
        <CardDescription>
          Seed or manage template definitions used during client onboarding.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleTemplateSubmit}
          className="mb-10 rounded-xl border bg-background/50 p-6 shadow-sm"
        >
          <h3 className="mb-4 text-lg font-semibold">Create New Template</h3>
          <div className="grid items-end gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                placeholder="E.g. Professional Services"
                value={templateForm.name}
                onChange={(event) =>
                  setTemplateForm((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="template-identifier">Identifier</Label>
              <Input
                id="template-identifier"
                placeholder="E.g. business_basic"
                value={templateForm.identifier}
                onChange={(event) =>
                  setTemplateForm((prev) => ({
                    ...prev,
                    identifier: event.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="template-modules">Modules</Label>
              <Input
                id="template-modules"
                placeholder="landing, about, services"
                value={templateForm.modules}
                onChange={(event) =>
                  setTemplateForm((prev) => ({
                    ...prev,
                    modules: event.target.value,
                  }))
                }
              />
            </div>
          </div>
          <Button
            type="submit"
            className="mt-4"
            disabled={createTemplateMutation.isPending}
          >
            {createTemplateMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            Create Template
          </Button>
        </form>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(templatesQuery.data as Template[] | undefined)?.map((template) => (
            <Card
              key={template._id}
              className="group overflow-hidden border-none bg-background/50 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:ring-2 hover:ring-primary/20 backdrop-blur-sm"
            >
              <CardHeader className="relative space-y-1 bg-gradient-to-br from-primary/10 via-background to-background pb-6">
                <div className="absolute top-4 right-4 rounded-full bg-primary/10 p-2 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <FileText className="h-4 w-4" />
                </div>
                <CardTitle className="text-xl font-bold">{template.name}</CardTitle>
                <CardDescription className="flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-primary/70">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  {template.identifier}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="mb-3 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                      Core Modules
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {template.modules?.map((module) => (
                        <Badge
                          key={module}
                          variant="secondary"
                          className="rounded-md border-none bg-muted/50 px-2 py-0.5 text-[11px] font-medium capitalize"
                        >
                          {module}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-between text-xs font-semibold hover:bg-primary/5 hover:text-primary"
                    asChild
                  >
                    <Link to="/admin/onboard">
                      Use this template
                      <Plus className="h-3.3 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
