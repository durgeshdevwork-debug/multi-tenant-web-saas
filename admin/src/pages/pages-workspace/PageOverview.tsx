import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { FilePlus2, Loader2, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Link } from "react-router-dom"
import { FormHeader } from "@/components/forms/form-header"
import { FormSection } from "@/components/forms/form-section"
import type { Page } from "@/features/content/types"
import { createPage } from "@/features/content/services/pages.api"
import { emptyPage } from "./utils"

export function PageOverview({ pages = [] }: { pages: Page[] }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [quickTitle, setQuickTitle] = useState("")
  const [quickSlug, setQuickSlug] = useState("")
  const [quickParentId, setQuickParentId] = useState("root")

  const createMutation = useMutation({
    mutationFn: createPage,
    onSuccess: (page) => {
      queryClient.invalidateQueries({ queryKey: ["content", "pages"] })
      queryClient.invalidateQueries({ queryKey: ["content", "pages", "tree"] })
      navigate(`/pages/${page._id ?? page.id}`)
    },
  })

  const handleQuickCreate = (event: React.FormEvent) => {
    event.preventDefault()

    if (!quickTitle.trim()) return

    createMutation.mutate({
      ...emptyPage(),
      title: quickTitle.trim(),
      slug:
        quickSlug.trim() || quickTitle.trim().toLowerCase().replace(/\s+/g, "-"),
      parentId: quickParentId === "root" ? null : quickParentId,
    })
  }

  const topLevelPages = pages.filter((page) => !page.parentId)

  return (
    <Card className="border-none bg-card/90 shadow-xl">
      <FormHeader
        title="Pages Workspace"
        description="Create pages, organize parent-child structures, and open a page to edit its content blocks."
        actions={
          <Button asChild>
            <Link to="/pages/new">
              <Plus className="mr-2 h-4 w-4" />
              New Page
            </Link>
          </Button>
        }
      />
      <CardContent className="space-y-6 p-5">
        <FormSection
          title="Quick Create"
          description="Create a new page and decide where it belongs in the hierarchy."
        >
          <form className="grid gap-4 md:grid-cols-4" onSubmit={handleQuickCreate}>
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="quick-title">Page Title</Label>
              <Input
                id="quick-title"
                value={quickTitle}
                onChange={(event) => setQuickTitle(event.target.value)}
                placeholder="e.g. Our Services"
                required
              />
            </div>
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="quick-slug">Slug</Label>
              <Input
                id="quick-slug"
                value={quickSlug}
                onChange={(event) => setQuickSlug(event.target.value)}
                placeholder="e.g. services"
              />
            </div>
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="quick-parent">Parent Page</Label>
              <Select value={quickParentId} onValueChange={setQuickParentId}>
                <SelectTrigger id="quick-parent">
                  <SelectValue placeholder="Top-level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="root">Top-level</SelectItem>
                  {topLevelPages.map((page) => (
                    <SelectItem key={page.id ?? page._id} value={(page.id ?? page._id)!}>
                      {page.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                type="submit"
                className="w-full"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                Create Page
              </Button>
            </div>
          </form>
        </FormSection>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {pages.map((page) => (
            <button
              key={page.id ?? page._id}
              type="button"
              onClick={() => navigate(`/pages/${page.id ?? page._id}`)}
              className="rounded-2xl border bg-background p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-base font-semibold">{page.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {page.path || `/${page.slug}`}
                  </div>
                </div>
                <FilePlus2 className="mt-1 h-4 w-4 text-muted-foreground" />
              </div>
            </button>
          ))}
          {pages.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
              No pages yet. Create the first one to start your site structure.
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
