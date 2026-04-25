import { useState, useMemo, useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import {
  ExternalLink,
  Files,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react"
import { MediaAssetPicker } from "@/components/media-asset-picker"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  createPage,
  deletePage,
  getPage,
  listPages,
  updatePage,
  type Page,
} from "@/lib/api"
import { emptyPage, createSection, move } from "./utils"
import { PageSectionEditor } from "./PageSectionEditor"

export function PageEditor() {
  const { pageId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const pagesQuery = useQuery({
    queryKey: ["content", "pages"],
    queryFn: listPages,
  })

  const pageQuery = useQuery({
    queryKey: ["content", "page", pageId],
    queryFn: () => getPage(pageId as string),
    enabled: Boolean(pageId) && pageId !== "new",
  })

  const [form, setForm] = useState<Page>(emptyPage())

  useEffect(() => {
    if (pageId === "new") {
      setForm(emptyPage())
      return
    }

    if (pageQuery.data) {
      const page = pageQuery.data as Page
      setForm({
        ...emptyPage(),
        ...page,
        parentId: page.parentId ?? null,
        sections: page.sections?.length
          ? page.sections
          : [createSection("hero")],
      })
    }
  }, [pageId, pageQuery.data])

  const createMutation = useMutation<Page, Error, Page>({
    mutationFn: createPage,
    onSuccess: (page) => {
      queryClient.invalidateQueries({ queryKey: ["content", "pages"] })
      queryClient.invalidateQueries({ queryKey: ["content", "pages", "tree"] })
      navigate(`/pages/${page._id ?? page.id}`)
    },
  })

  const updateMutation = useMutation<
    Page,
    Error,
    { id: string; payload: Page }
  >({
    mutationFn: ({ id, payload }: { id: string; payload: Page }) =>
      updatePage(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content", "pages"] })
      queryClient.invalidateQueries({ queryKey: ["content", "pages", "tree"] })
      if (pageId) {
        queryClient.invalidateQueries({ queryKey: ["content", "page", pageId] })
      }
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deletePage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content", "pages"] })
      queryClient.invalidateQueries({ queryKey: ["content", "pages", "tree"] })
      navigate("/pages")
    },
  })

  const availableParents = useMemo(
    () =>
      ((pagesQuery.data as Page[] | undefined) ?? []).filter(
        (p) => (p.id ?? p._id) !== pageId
      ),
    [pageId, pagesQuery.data]
  )

  const children = useMemo(
    () =>
      ((pagesQuery.data as Page[] | undefined) ?? []).filter(
        (p) => p.parentId === pageId
      ),
    [pageId, pagesQuery.data]
  )

  const isCreateMode = pageId === "new"

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (isCreateMode) {
      createMutation.mutate(form)
    } else if (pageId) {
      updateMutation.mutate({ id: pageId, payload: form })
    }
  }

  if (pageQuery.isLoading && !isCreateMode) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Card className="border-none bg-gradient-to-br from-card to-muted/10 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">
          {isCreateMode
            ? "Create Page"
            : `Edit Page: ${form.title || "Untitled"}`}
        </CardTitle>
        <CardDescription>
          Manage page settings, parent page, SEO metadata, and dynamic sections
          from one place.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="page-editor-form"
          className="space-y-8"
          onSubmit={handleSubmit}
        >
          <section className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="page-title">Title</Label>
              <Input
                id="page-title"
                value={form.title}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, title: event.target.value }))
                }
                placeholder="About Us"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="page-slug">Slug</Label>
              <Input
                id="page-slug"
                value={form.slug}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, slug: event.target.value }))
                }
                placeholder="about-us"
              />
            </div>
            <div className="space-y-2">
              <Label>Parent Page</Label>
              <Select
                value={form.parentId ?? "root"}
                onValueChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    parentId: value === "root" ? null : value,
                  }))
                }
                disabled={form.isHomePage}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Top-level page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="root">Top-level page</SelectItem>
                  {availableParents.map((p) => (
                    <SelectItem
                      key={p.id ?? p._id}
                      value={(p.id ?? p._id)!}
                    >
                      {p.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nav-label">Navigation Label</Label>
              <Input
                id="nav-label"
                value={form.navigationLabel ?? ""}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    navigationLabel: event.target.value,
                  }))
                }
                placeholder="About"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sort-order">Sort Order</Label>
              <Input
                id="sort-order"
                type="number"
                value={String(form.sortOrder)}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    sortOrder: Number(event.target.value) || 0,
                  }))
                }
              />
            </div>
          </section>

          {children.length > 0 && (
            <section className="space-y-4 rounded-2xl border bg-muted/5 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 border-b pb-3">
                <Files className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold">Child Pages</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {children.map((child) => (
                  <button
                    key={child.id ?? child._id}
                    type="button"
                    onClick={() => navigate(`/pages/${child.id ?? child._id}`)}
                    className="flex items-center justify-between gap-4 rounded-xl border bg-background p-4 text-left transition-all hover:border-primary/50 hover:shadow-md"
                  >
                    <div>
                      <div className="font-semibold">{child.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {child.path}
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </section>
          )}

          <section className="space-y-4">
            <div className="space-y-2">
              <MediaAssetPicker
                label="SEO OG Image"
                value={form.seo.ogImage ?? ""}
                onChange={(url) =>
                  setForm((prev) => ({
                    ...prev,
                    seo: { ...prev.seo, ogImage: url },
                  }))
                }
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="meta-title">SEO Title</Label>
              <Input
                id="meta-title"
                value={form.seo.metaTitle ?? ""}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    seo: { ...prev.seo, metaTitle: event.target.value },
                  }))
                }
                placeholder="Page meta title"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="meta-description">SEO Description</Label>
              <Textarea
                id="meta-description"
                rows={3}
                value={form.seo.metaDescription ?? ""}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    seo: { ...prev.seo, metaDescription: event.target.value },
                  }))
                }
                placeholder="Describe this page for search and social previews."
              />
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg border p-4">
              <Switch
                checked={form.isHomePage}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({
                    ...prev,
                    isHomePage: checked,
                    parentId: checked ? null : prev.parentId,
                  }))
                }
              />
              <Label>Homepage</Label>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-4">
              <Switch
                checked={form.isPublished}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({ ...prev, isPublished: checked }))
                }
              />
              <Label>Published</Label>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-4">
              <Switch
                checked={form.showHeader}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({ ...prev, showHeader: checked }))
                }
              />
              <Label>Show Header</Label>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-4">
              <Switch
                checked={form.showFooter}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({ ...prev, showFooter: checked }))
                }
              />
              <Label>Show Footer</Label>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-4">
              <Switch
                checked={form.showInHeader}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({ ...prev, showInHeader: checked }))
                }
              />
              <Label>Show In Header Nav</Label>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-4">
              <Switch
                checked={form.showInFooter}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({ ...prev, showInFooter: checked }))
                }
              />
              <Label>Show In Footer Nav</Label>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-4 border-b pb-2">
              <div>
                <h2 className="text-lg font-semibold">Sections</h2>
                <p className="text-sm text-muted-foreground">
                  Add content blocks and control their order for the page
                  renderer.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    sections: [...prev.sections, createSection("richText")],
                  }))
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Section
              </Button>
            </div>

            <div className="space-y-4">
              {form.sections.map((section, index) => (
                <PageSectionEditor
                  key={section.id}
                  section={section}
                  index={index}
                  allPages={pagesQuery.data as Page[]}
                  disableMoveUp={index === 0}
                  disableMoveDown={index === form.sections.length - 1}
                  onMoveUp={() =>
                    setForm((prev) => ({
                      ...prev,
                      sections: move(prev.sections, index, -1),
                    }))
                  }
                  onMoveDown={() =>
                    setForm((prev) => ({
                      ...prev,
                      sections: move(prev.sections, index, 1),
                    }))
                  }
                  onRemove={() =>
                    setForm((prev) => ({
                      ...prev,
                      sections: prev.sections.filter(
                        (item) => item.id !== section.id
                      ),
                    }))
                  }
                  onChange={(nextSection) =>
                    setForm((prev) => ({
                      ...prev,
                      sections: prev.sections.map((item) =>
                        item.id === nextSection.id ? nextSection : item
                      ),
                    }))
                  }
                />
              ))}
            </div>
          </section>
        </form>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t bg-muted/50 py-4">
        <div>
          {!isCreateMode && pageId ? (
            <Button
              type="button"
              variant="destructive"
              onClick={() => deleteMutation.mutate(pageId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete Page
            </Button>
          ) : null}
        </div>
        <Button
          form="page-editor-form"
          type="submit"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {createMutation.isPending || updateMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {isCreateMode ? "Create Page" : "Save Page"}
        </Button>
      </CardFooter>
    </Card>
  )
}
