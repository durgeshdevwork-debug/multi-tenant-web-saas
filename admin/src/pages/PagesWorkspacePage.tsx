import { useEffect, useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { FilePlus2, Loader2, Plus, Save, Trash2 } from "lucide-react"

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
  type PageSection,
  type PageSectionItem,
  type PageSectionType,
} from "@/lib/api"

const sectionTypes: { value: PageSectionType; label: string }[] = [
  { value: "hero", label: "Hero" },
  { value: "richText", label: "Rich Text" },
  { value: "features", label: "Features" },
  { value: "cta", label: "Call To Action" },
  { value: "gallery", label: "Gallery" },
]

const createSection = (type: PageSectionType = "richText"): PageSection => ({
  id: `section-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  type,
  name: "",
  content: {
    heading: "",
    body: "",
    imageUrl: "",
    buttonLabel: "",
    buttonUrl: "",
    items:
      type === "features" || type === "gallery"
        ? [{ title: "", description: "", imageUrl: "" }]
        : [],
  },
  styles: {},
})

const emptyPage = (): Page => ({
  title: "",
  slug: "",
  parentId: null,
  navigationLabel: "",
  showInHeader: true,
  showInFooter: true,
  showHeader: true,
  showFooter: true,
  isHomePage: false,
  isPublished: true,
  sortOrder: 0,
  sections: [createSection("hero")],
  seo: {
    metaTitle: "",
    metaDescription: "",
    ogImage: "",
  },
})

const move = <T,>(items: T[], index: number, direction: -1 | 1) => {
  const nextIndex = index + direction
  if (nextIndex < 0 || nextIndex >= items.length) return items
  const copy = [...items]
  const [item] = copy.splice(index, 1)
  copy.splice(nextIndex, 0, item)
  return copy
}

function SectionItemsEditor({
  section,
  onChange,
}: {
  section: PageSection
  onChange: (section: PageSection) => void
}) {
  const items = section.content.items ?? []

  return (
    <div className="space-y-3 rounded-lg border bg-muted/20 p-4">
      {items.map((item, index) => (
        <div
          key={`${section.id}-item-${index}`}
          className="grid gap-3 md:grid-cols-2"
        >
          <Input
            placeholder="Item title"
            value={item.title ?? ""}
            onChange={(event) => {
              const nextItems = [...items]
              nextItems[index] = {
                ...nextItems[index],
                title: event.target.value,
              }
              onChange({
                ...section,
                content: { ...section.content, items: nextItems },
              })
            }}
          />
          <Input
            placeholder="Image URL"
            value={item.imageUrl ?? ""}
            onChange={(event) => {
              const nextItems = [...items]
              nextItems[index] = {
                ...nextItems[index],
                imageUrl: event.target.value,
              }
              onChange({
                ...section,
                content: { ...section.content, items: nextItems },
              })
            }}
          />
          <Textarea
            className="md:col-span-2"
            rows={2}
            placeholder="Item description"
            value={item.description ?? ""}
            onChange={(event) => {
              const nextItems = [...items]
              nextItems[index] = {
                ...nextItems[index],
                description: event.target.value,
              }
              onChange({
                ...section,
                content: { ...section.content, items: nextItems },
              })
            }}
          />
          <div className="flex justify-end md:col-span-2">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => {
                const nextItems = items.filter(
                  (_, itemIndex) => itemIndex !== index
                )
                onChange({
                  ...section,
                  content: { ...section.content, items: nextItems },
                })
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove Item
            </Button>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed"
        onClick={() => {
          const nextItems: PageSectionItem[] = [
            ...items,
            { title: "", description: "", imageUrl: "" },
          ]
          onChange({
            ...section,
            content: { ...section.content, items: nextItems },
          })
        }}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Item
      </Button>
    </div>
  )
}

function PageSectionEditor({
  section,
  index,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  disableMoveUp,
  disableMoveDown,
}: {
  section: PageSection
  index: number
  onChange: (section: PageSection) => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  disableMoveUp: boolean
  disableMoveDown: boolean
}) {
  const supportsItems =
    section.type === "features" || section.type === "gallery"
  const supportsImage = section.type === "hero" || section.type === "gallery"
  const supportsButton = section.type === "hero" || section.type === "cta"

  return (
    <div className="rounded-2xl border bg-background p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">Section {index + 1}</h3>
          <p className="text-sm text-muted-foreground">
            Choose the block type and edit its content fields.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onMoveUp}
            disabled={disableMoveUp}
          >
            Up
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onMoveDown}
            disabled={disableMoveDown}
          >
            Down
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onRemove}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remove
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Section Type</Label>
          <Select
            value={section.type}
            onValueChange={(value) =>
              onChange({ ...section, type: value as PageSectionType })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sectionTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Internal Name</Label>
          <Input
            value={section.name ?? ""}
            onChange={(event) =>
              onChange({ ...section, name: event.target.value })
            }
            placeholder="Hero banner"
          />
        </div>
        <div className="space-y-2">
          <Label>Eyebrow</Label>
          <Input
            value={section.content.eyebrow ?? ""}
            onChange={(event) =>
              onChange({
                ...section,
                content: { ...section.content, eyebrow: event.target.value },
              })
            }
            placeholder="Optional small heading"
          />
        </div>
        <div className="space-y-2">
          <Label>Heading</Label>
          <Input
            value={section.content.heading ?? ""}
            onChange={(event) =>
              onChange({
                ...section,
                content: { ...section.content, heading: event.target.value },
              })
            }
            placeholder="Section heading"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Body</Label>
          <Textarea
            rows={4}
            value={section.content.body ?? ""}
            onChange={(event) =>
              onChange({
                ...section,
                content: { ...section.content, body: event.target.value },
              })
            }
            placeholder="Write the main content for this section."
          />
        </div>
        {supportsImage ? (
          <div className="space-y-2 md:col-span-2">
            <Label>Image URL</Label>
            <Input
              value={section.content.imageUrl ?? ""}
              onChange={(event) =>
                onChange({
                  ...section,
                  content: { ...section.content, imageUrl: event.target.value },
                })
              }
              placeholder="https://example.com/image.jpg"
            />
          </div>
        ) : null}
        {supportsButton ? (
          <>
            <div className="space-y-2">
              <Label>Button Label</Label>
              <Input
                value={section.content.buttonLabel ?? ""}
                onChange={(event) =>
                  onChange({
                    ...section,
                    content: {
                      ...section.content,
                      buttonLabel: event.target.value,
                    },
                  })
                }
                placeholder="Learn more"
              />
            </div>
            <div className="space-y-2">
              <Label>Button URL</Label>
              <Input
                value={section.content.buttonUrl ?? ""}
                onChange={(event) =>
                  onChange({
                    ...section,
                    content: {
                      ...section.content,
                      buttonUrl: event.target.value,
                    },
                  })
                }
                placeholder="/contact"
              />
            </div>
          </>
        ) : null}
      </div>

      {supportsItems ? (
        <div className="mt-4">
          <Label className="mb-2 block">Section Items</Label>
          <SectionItemsEditor section={section} onChange={onChange} />
        </div>
      ) : null}
    </div>
  )
}

export function PagesWorkspacePage() {
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

  const createMutation = useMutation({
    mutationFn: createPage,
    onSuccess: (page) => {
      queryClient.invalidateQueries({ queryKey: ["content", "pages"] })
      queryClient.invalidateQueries({ queryKey: ["content", "pages", "tree"] })
      navigate(`/pages/${page._id ?? page.id}`)
    },
  })

  const updateMutation = useMutation({
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
        (page) => (page.id ?? page._id) !== pageId
      ),
    [pageId, pagesQuery.data]
  )

  const isCreateMode = pageId === "new"
  const isOverview = !pageId

  if (isOverview) {
    const pages = (pagesQuery.data as Page[] | undefined) ?? []

    return (
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
          <Button onClick={() => navigate("/pages/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Page
          </Button>

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
          onSubmit={(event) => {
            event.preventDefault()
            if (isCreateMode) {
              createMutation.mutate(form)
            } else if (pageId) {
              updateMutation.mutate({ id: pageId, payload: form })
            }
          }}
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
                  {availableParents.map((page) => (
                    <SelectItem
                      key={page.id ?? page._id}
                      value={page.id ?? (page._id as string)}
                    >
                      {page.title}
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
            <div className="space-y-2">
              <Label htmlFor="og-image">SEO OG Image</Label>
              <Input
                id="og-image"
                value={form.seo.ogImage ?? ""}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    seo: { ...prev.seo, ogImage: event.target.value },
                  }))
                }
                placeholder="https://example.com/og-image.jpg"
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
