import { useEffect, useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react"

import {
  createTestimonial,
  deleteTestimonial,
  getTestimonial,
  listTestimonialCollections,
  listTestimonials,
  updateTestimonial,
} from "@/features/content/services/testimonials.api"
import type { Testimonial } from "@/features/content/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MediaAssetPicker } from "@/components/media-asset-picker"

const emptyTestimonial = (collectionId = "general"): Testimonial => ({
  collectionId,
  format: "text",
  title: "",
  body: "",
  authorName: "",
  authorRole: "",
  company: "",
  avatarUrl: "",
  mediaUrl: "",
  thumbnailUrl: "",
  rating: 5,
  isPublished: true,
  sortOrder: 0,
})

export function TestimonialsPage() {
  const queryClient = useQueryClient()
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>("")
  const [selectedTestimonialId, setSelectedTestimonialId] = useState<string>("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [form, setForm] = useState<Testimonial>(emptyTestimonial())

  const collectionsQuery = useQuery({
    queryKey: ["content", "testimonials", "collections"],
    queryFn: listTestimonialCollections,
  })

  const testimonialsQuery = useQuery({
    queryKey: ["content", "testimonials", selectedCollectionId || "all"],
    queryFn: () => listTestimonials(selectedCollectionId || undefined),
  })

  const selectedTestimonialQuery = useQuery({
    queryKey: ["content", "testimonials", selectedTestimonialId],
    queryFn: () => getTestimonial(selectedTestimonialId),
    enabled: Boolean(selectedTestimonialId),
  })

  useEffect(() => {
    if (!selectedTestimonialQuery.data) return
    setForm({
      ...emptyTestimonial(selectedTestimonialQuery.data.collectionId),
      ...selectedTestimonialQuery.data,
    })
    setIsFormOpen(true)
  }, [selectedTestimonialQuery.data])

  const visibleTestimonials = useMemo(
    () => testimonialsQuery.data ?? [],
    [testimonialsQuery.data]
  )

  const selectedCollectionLabel =
    collectionsQuery.data?.find((collection) => collection.id === selectedCollectionId)?.label ||
    (selectedCollectionId ? selectedCollectionId : "All testimonials")

  const resetForm = (collectionId = selectedCollectionId || "general") => {
    setSelectedTestimonialId("")
    setForm(emptyTestimonial(collectionId))
  }

  const openCreateForm = () => {
    resetForm()
    setIsFormOpen(true)
  }

  const openEditForm = (testimonial: Testimonial) => {
    const id = testimonial._id ?? testimonial.id ?? ""
    setSelectedTestimonialId(id)
    setForm({
      ...emptyTestimonial(testimonial.collectionId),
      ...testimonial,
      collectionId: testimonial.collectionId || selectedCollectionId || "general",
    })
    setIsFormOpen(true)
  }

  const saveMutation = useMutation({
    mutationFn: async (payload: Testimonial) => {
      if (selectedTestimonialId) {
        return updateTestimonial(selectedTestimonialId, payload)
      }
      return createTestimonial(payload)
    },
    onSuccess: (testimonial) => {
      queryClient.invalidateQueries({ queryKey: ["content", "testimonials"] })
      queryClient.invalidateQueries({ queryKey: ["content", "testimonials", "collections"] })
      setSelectedTestimonialId("")
      setForm(emptyTestimonial(testimonial.collectionId))
      setIsFormOpen(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content", "testimonials"] })
      queryClient.invalidateQueries({ queryKey: ["content", "testimonials", "collections"] })
      setSelectedTestimonialId("")
      setForm(emptyTestimonial(selectedCollectionId || "general"))
      setIsFormOpen(false)
    },
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    saveMutation.mutate({
      ...form,
      collectionId: form.collectionId || "general",
    })
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-8">
      <section className="overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-r from-card via-card to-muted/20 shadow-sm">
        <div className="grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
              <Pencil className="size-3.5" />
              Testimonials
            </div>
            <div>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Manage testimonial collections and page-ready content.
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
                Create testimonial records here, then use them inside the Testimonials page section on any CMS page.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="rounded-full px-3 py-1">
                {visibleTestimonials.length} testimonials
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1">
                {(collectionsQuery.data ?? []).length} collections
              </Badge>
            </div>
          </div>

          <Card className="border-border/70 bg-background/70 shadow-none">
            <CardHeader className="space-y-1">
              <CardTitle className="text-lg font-semibold">Create testimonial</CardTitle>
              <CardDescription>
                Open the form to add a new testimonial to the current collection.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Collection</Label>
                <Select
                  value={selectedCollectionId || "all"}
                  onValueChange={(value) => setSelectedCollectionId(value === "all" ? "" : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All testimonials" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All testimonials</SelectItem>
                    {(collectionsQuery.data ?? []).map((collection) => (
                      <SelectItem key={collection.id} value={collection.id}>
                        {collection.label} ({collection.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="button" className="w-full" onClick={openCreateForm}>
                <Plus className="mr-2 h-4 w-4" />
                New Testimonial
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="">
        <Card className="border bg-background/60">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Entries</CardTitle>
            <CardDescription>{selectedCollectionLabel}</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[620px] pr-3">
              <div className="space-y-3">
                {visibleTestimonials.map((testimonial) => {
                  const id = testimonial.id ?? testimonial._id!
                  const isActive = selectedTestimonialId === id

                  return (
                    <div
                      key={id}
                      className={`rounded-xl border p-4 transition ${
                        isActive ? "border-primary bg-primary/5" : "bg-background hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <button
                          type="button"
                          className="text-left"
                          onClick={() => openEditForm(testimonial)}
                        >
                          <div className="font-medium">{testimonial.authorName}</div>
                          <div className="text-sm text-muted-foreground">
                            {testimonial.title || testimonial.company || "Untitled"}
                          </div>
                        </button>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="uppercase">
                            {testimonial.format}
                          </Badge>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => openEditForm(testimonial)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => deleteMutation.mutate(id)}
                            disabled={deleteMutation.isPending}
                          >
                            {deleteMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {visibleTestimonials.length === 0 ? (
                  <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                    No testimonials found for this filter.
                  </div>
                ) : null}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Dialog
          open={isFormOpen}
          onOpenChange={(open) => {
            setIsFormOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogContent className="max-h-[92vh] w-[min(96vw,1200px)] max-w-none overflow-hidden p-0 sm:max-w-none">
            <div className="flex h-[92vh] max-h-[92vh] min-h-0 flex-col">
              <DialogHeader className="border-b px-4 py-4 sm:px-6 sm:py-5">
                <DialogTitle className="text-xl sm:text-2xl">
                  {selectedTestimonialId ? "Edit testimonial" : "Create testimonial"}
                </DialogTitle>
                <DialogDescription className="max-w-2xl text-sm">
                  Eyebrow, heading, body, and media are used by the testimonial section on the website.
                </DialogDescription>
              </DialogHeader>

              <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
                <ScrollArea className="h-full min-h-0 flex-1">
                  <div className="min-h-0 space-y-5 px-4 py-5 pb-8 sm:px-6">
                    <Card className="border-border/70 bg-muted/20">
                      <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-base sm:text-lg">Basic details</CardTitle>
                        <CardDescription>
                          Choose the collection, format, and the identifying details for this testimonial.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                          <div className="space-y-2">
                            <Label htmlFor="testimonial-collection">Collection ID</Label>
                            <Input
                              id="testimonial-collection"
                              value={form.collectionId}
                              onChange={(event) =>
                                setForm((prev) => ({
                                  ...prev,
                                  collectionId: event.target.value,
                                }))
                              }
                              placeholder="general, home, product-launch"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="testimonial-format">Format</Label>
                            <Select
                              value={form.format}
                              onValueChange={(value) =>
                                setForm((prev) => ({
                                  ...prev,
                                  format: value as Testimonial["format"],
                                }))
                              }
                            >
                              <SelectTrigger id="testimonial-format">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">Text</SelectItem>
                                <SelectItem value="video">Video</SelectItem>
                                <SelectItem value="audio">Audio</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="testimonial-author">Author Name</Label>
                            <Input
                              id="testimonial-author"
                              value={form.authorName}
                              onChange={(event) =>
                                setForm((prev) => ({
                                  ...prev,
                                  authorName: event.target.value,
                                }))
                              }
                              placeholder="Jane Doe"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="testimonial-title">Title</Label>
                            <Input
                              id="testimonial-title"
                              value={form.title ?? ""}
                              onChange={(event) =>
                                setForm((prev) => ({
                                  ...prev,
                                  title: event.target.value,
                                }))
                              }
                              placeholder="Chief Marketing Officer"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="testimonial-role">Role</Label>
                            <Input
                              id="testimonial-role"
                              value={form.authorRole ?? ""}
                              onChange={(event) =>
                                setForm((prev) => ({
                                  ...prev,
                                  authorRole: event.target.value,
                                }))
                              }
                              placeholder="Marketing Lead"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="testimonial-company">Company</Label>
                            <Input
                              id="testimonial-company"
                              value={form.company ?? ""}
                              onChange={(event) =>
                                setForm((prev) => ({
                                  ...prev,
                                  company: event.target.value,
                                }))
                              }
                              placeholder="Acme Inc."
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-border/70 bg-background/70">
                      <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-base sm:text-lg">Media and ranking</CardTitle>
                        <CardDescription>
                          Pick media from your library or upload a new image, video, or audio file.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4 xl:grid-cols-2">
                          <MediaAssetPicker
                            label="Avatar"
                            value={form.avatarUrl ?? ""}
                            onChange={(url) =>
                              setForm((prev) => ({
                                ...prev,
                                avatarUrl: url,
                              }))
                            }
                            accept="image/*"
                            helperText="Choose an avatar from your media library or upload a new image."
                          />
                          <MediaAssetPicker
                            label="Media"
                            value={form.mediaUrl ?? ""}
                            onChange={(url) =>
                              setForm((prev) => ({
                                ...prev,
                                mediaUrl: url,
                              }))
                            }
                            accept="image/*,video/*,audio/*"
                            helperText="Use an image, video, or audio file from your media library."
                          />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="md:col-span-2">
                            <MediaAssetPicker
                              label="Thumbnail"
                              value={form.thumbnailUrl ?? ""}
                              onChange={(url) =>
                                setForm((prev) => ({
                                  ...prev,
                                  thumbnailUrl: url,
                                }))
                              }
                              accept="image/*"
                              helperText="Optional preview image for video or audio testimonials."
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="testimonial-rating">Rating</Label>
                            <Input
                              id="testimonial-rating"
                              type="number"
                              min="0"
                              max="5"
                              step="1"
                              value={form.rating ?? 0}
                              onChange={(event) =>
                                setForm((prev) => ({
                                  ...prev,
                                  rating: Number(event.target.value),
                                }))
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="testimonial-order">Sort Order</Label>
                            <Input
                              id="testimonial-order"
                              type="number"
                              value={form.sortOrder ?? 0}
                              onChange={(event) =>
                                setForm((prev) => ({
                                  ...prev,
                                  sortOrder: Number(event.target.value),
                                }))
                              }
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-border/70 bg-muted/20">
                      <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-base sm:text-lg">Publishing and content</CardTitle>
                        <CardDescription>
                          Control visibility and write the main testimonial body.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex flex-col gap-4 rounded-2xl border bg-background/80 p-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="space-y-1">
                            <Label htmlFor="testimonial-published">Published</Label>
                            <p className="text-sm text-muted-foreground">
                              Unpublished testimonials stay hidden from the public site.
                            </p>
                          </div>
                          <Switch
                            id="testimonial-published"
                            checked={Boolean(form.isPublished)}
                            onCheckedChange={(checked) =>
                              setForm((prev) => ({ ...prev, isPublished: checked }))
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="testimonial-body">Body</Label>
                          <Textarea
                            id="testimonial-body"
                            rows={7}
                            className="min-h-40"
                            value={form.body ?? ""}
                            onChange={(event) =>
                              setForm((prev) => ({
                                ...prev,
                                body: event.target.value,
                              }))
                            }
                            placeholder="Write the testimonial quote or transcript."
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </ScrollArea>

                <div className="shrink-0 border-t bg-background/95 px-4 py-4 backdrop-blur sm:px-6">
                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsFormOpen(false)
                        resetForm()
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={saveMutation.isPending}>
                      {saveMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="mr-2 h-4 w-4" />
                      )}
                      {selectedTestimonialId ? "Update Testimonial" : "Create Testimonial"}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </section>
    </div>
  )
}
