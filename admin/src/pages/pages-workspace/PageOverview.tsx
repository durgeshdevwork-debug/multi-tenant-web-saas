import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { FilePlus2, Loader2, Plus } from "lucide-react"
import { createPage, type Page } from "@/lib/api"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { emptyPage } from "./utils"

export function PageOverview({ pages = [] }: { pages: Page[] }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [quickTitle, setQuickTitle] = useState("")
  const [quickSlug, setQuickSlug] = useState("")
  const [quickParentId, setQuickParentId] = useState("root")

  const createMutation = useMutation<Page, Error, Page>({
    mutationFn: createPage,
    onSuccess: (page) => {
      queryClient.invalidateQueries({ queryKey: ["content", "pages"] })
      queryClient.invalidateQueries({ queryKey: ["content", "pages", "tree"] })
      navigate(`/pages/${page._id ?? page.id}`)
    },
  })

  const handleQuickCreate = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate({
      ...emptyPage(),
      title: quickTitle,
      slug: quickSlug || quickTitle.toLowerCase().replace(/\s+/g, "-"),
      parentId: quickParentId === "root" ? null : quickParentId,
    })
  }

  return (
    <div className="space-y-6">
      <Card className="border-none bg-gradient-to-br from-card to-muted/10 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <FilePlus2 className="h-6 w-6 text-primary" /> Pages Workspace
          </CardTitle>
          <CardDescription>
            Create new pages, organize nested structures, and open a page from
            the sidebar to edit its content blocks.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-xl border bg-background/50 p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Quick Create Page</h3>
            <form
              className="grid gap-4 md:grid-cols-4"
              onSubmit={handleQuickCreate}
            >
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="quick-title">Page Title</Label>
                <Input
                  id="quick-title"
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  placeholder="e.g. Our Services"
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="quick-slug">Slug (Optional)</Label>
                <Input
                  id="quick-slug"
                  value={quickSlug}
                  onChange={(e) => setQuickSlug(e.target.value)}
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
                    {pages.map((p) => (
                      <SelectItem key={p.id ?? p._id} value={(p.id ?? p._id)!}>
                        {p.title}
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
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {pages.map((page) => (
              <div
                key={page.id ?? page._id}
                className="rounded-2xl border bg-background p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold">{page.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {page.path}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/pages/${page.id ?? page._id}`)}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ))}
            {pages.length === 0 ? (
              <div className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
                No pages yet. Create the first one to start your site structure.
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
