import { useEffect, useMemo, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { Loader2, Plus, Save, Trash2 } from "lucide-react"

import { MediaAssetPicker } from "@/components/media-asset-picker"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { FormSection } from "@/components/forms/form-section"
import { usePagesQuery } from "@/features/content/hooks/use-pages"
import { usePageQuery } from "@/features/content/hooks/use-page"
import {
  createPage,
  deletePage,
  updatePage,
} from "@/features/content/services/pages.api"
import type { Page } from "@/features/content/types"
import { PageSectionEditor } from "./PageSectionEditor"
import { createSection, emptyPage, move } from "./utils"

export function PageEditor() {
  const { pageId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const pagesQuery = usePagesQuery()
  const pageQuery = usePageQuery(pageId)
  const isCreateMode = pageId === "new"

  const [form, setForm] = useState<Page>(emptyPage())

  useEffect(() => {
    if (isCreateMode) {
      setForm(emptyPage())
      return
    }

    if (pageQuery.data) {
      const page = pageQuery.data
      setForm({
        ...emptyPage(),
        ...page,
        parentId: page.parentId ?? null,
        sections: page.sections?.length ? page.sections : [],
      })
    }
  }, [isCreateMode, pageQuery.data])

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

  const topLevelPages = useMemo(
    () =>
      (pagesQuery.data ?? []).filter(
        (page) => !page.parentId && (page.id ?? page._id) !== pageId
      ),
    [pageId, pagesQuery.data]
  )

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    const payload = {
      ...form,
      sections: form.sections ?? [],
      parentId: form.isHomePage ? null : form.parentId ?? null,
    }

    if (isCreateMode) {
      createMutation.mutate(payload)
      return
    }

    if (pageId) {
      updateMutation.mutate({ id: pageId, payload })
    }
  }

  const busy = createMutation.isPending || updateMutation.isPending
  const pageStatus = form.isPublished ? "Published" : "Draft"

  if (pageQuery.isLoading && !isCreateMode) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-2xl border bg-card">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Card className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden border-none bg-card/90 shadow-xl">
      <div className="sticky top-0 z-30 border-b bg-background/95 px-5 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-[var(--radius)] border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
              <span>{isCreateMode ? "New page" : "Editing page"}</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground" />
              <span>{pageStatus}</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
                {isCreateMode ? "Create Page" : form.title || "Untitled Page"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isCreateMode
                  ? "Create a new page and start with sections, SEO, and hierarchy."
                  : `Slug /${form.slug || "new"} · ${
                      form.parentId ? "Child page" : "Top-level page"
                    }`}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
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
            {!isCreateMode ? (
              <Button
                type="button"
                variant="destructive"
                onClick={() => pageId && deleteMutation.mutate(pageId)}
                disabled={deleteMutation.isPending || busy}
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                Delete Page
              </Button>
            ) : null}
            <Button form="page-editor-form" type="submit" disabled={busy}>
              {busy ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {isCreateMode ? "Create Page" : "Save Page"}
            </Button>
          </div>
        </div>
      </div>
      <CardContent className="flex min-h-0 w-full flex-1 overflow-hidden p-0">
        <ScrollArea className="flex min-h-0 w-full flex-1">
          <form
            id="page-editor-form"
            className="min-w-0 space-y-6 p-5"
            onSubmit={handleSubmit}
          >
            <FormSection
              title="Basics"
              description="Title, slug, and navigation settings."
            >
              <div className="grid gap-4 md:grid-cols-2">
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
                      {topLevelPages.map((page) => (
                        <SelectItem key={page.id ?? page._id} value={(page.id ?? page._id)!}>
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
              </div>
            </FormSection>

            <FormSection
              title="SEO"
              description="Set default metadata and the social preview image."
            >
              <div className="space-y-4">
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
                <div className="space-y-2">
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
                <div className="space-y-2">
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
              </div>
            </FormSection>

            <FormSection
              title="Visibility"
              description="Control how the page appears in the site navigation and layout."
            >
              <div className="grid gap-3 md:grid-cols-3">
                {(
                  [
                    {
                      label: "Homepage",
                      key: "isHomePage" as const,
                    },
                    {
                      label: "Published",
                      key: "isPublished" as const,
                    },
                    {
                      label: "Show Header",
                      key: "showHeader" as const,
                    },
                    {
                      label: "Show Footer",
                      key: "showFooter" as const,
                    },
                    {
                      label: "Show In Header Nav",
                      key: "showInHeader" as const,
                    },
                    {
                      label: "Show In Footer Nav",
                      key: "showInFooter" as const,
                    },
                  ] satisfies ReadonlyArray<{
                    label: string
                    key: keyof Pick<
                      Page,
                      | "isHomePage"
                      | "isPublished"
                      | "showHeader"
                      | "showFooter"
                      | "showInHeader"
                      | "showInFooter"
                    >
                  }>
                ).map(({ label, key }) => (
                  <div key={key} className="flex items-center gap-3 rounded-lg border p-4">
                    <Switch
                      checked={Boolean(form[key])}
                      onCheckedChange={(checked) =>
                        setForm((prev) => ({
                          ...prev,
                          [key]: checked,
                          parentId: key === "isHomePage" && checked ? null : prev.parentId,
                        }))
                      }
                    />
                    <Label>{label}</Label>
                  </div>
                ))}
              </div>
            </FormSection>

            <FormSection
              title="Sections"
              description="Add content blocks and control their order for the page renderer."
            >
              <p className="text-sm text-muted-foreground">
                Sections are fully dynamic. Collection blocks can render child pages from a selected parent page.
              </p>

              <div className="space-y-4">
                {form.sections.length === 0 ? (
                  <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                    Start by adding a section. Rich text, collection, gallery, FAQ, and testimonial blocks are available.
                  </div>
                ) : null}

                {form.sections.map((section, index) => (
                  <PageSectionEditor
                    key={section.id}
                    section={section}
                    index={index}
                    allPages={pagesQuery.data ?? []}
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
            </FormSection>
          </form>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
