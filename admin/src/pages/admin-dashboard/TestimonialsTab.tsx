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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

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

export function TestimonialsTab() {
  const queryClient = useQueryClient()
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>("")
  const [selectedTestimonialId, setSelectedTestimonialId] = useState<string>("")
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
    if (selectedTestimonialQuery.data) {
      setForm({
        ...emptyTestimonial(selectedTestimonialQuery.data.collectionId),
        ...selectedTestimonialQuery.data,
      })
    }
  }, [selectedTestimonialQuery.data])

  const visibleTestimonials = useMemo(
    () => testimonialsQuery.data ?? [],
    [testimonialsQuery.data]
  )

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
      setSelectedTestimonialId(testimonial._id ?? testimonial.id ?? "")
      setForm({
        ...emptyTestimonial(testimonial.collectionId),
        ...testimonial,
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content", "testimonials"] })
      queryClient.invalidateQueries({ queryKey: ["content", "testimonials", "collections"] })
      setSelectedTestimonialId("")
      setForm(emptyTestimonial(selectedCollectionId || "general"))
    },
  })

  const selectedCollectionLabel =
    collectionsQuery.data?.find((collection) => collection.id === selectedCollectionId)?.label ||
    (selectedCollectionId ? selectedCollectionId : "All testimonials")

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    saveMutation.mutate({
      ...form,
      collectionId: form.collectionId || "general",
    })
  }

  const startNew = () => {
    setSelectedTestimonialId("")
    setForm(emptyTestimonial(selectedCollectionId || "general"))
  }

  return (
    <Card className="border-none bg-gradient-to-br from-card to-muted/20 shadow-xl">
      <CardHeader>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Pencil className="h-6 w-6 text-primary" />
              Testimonials
            </CardTitle>
            <CardDescription>
              Manage testimonial collections and the entries used by the CMS testimonial section.
            </CardDescription>
          </div>
          <Button variant="outline" onClick={startNew}>
            <Plus className="mr-2 h-4 w-4" />
            New Testimonial
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 xl:grid-cols-[360px,1fr]">
          <div className="space-y-4">
            <Card className="border bg-background/60">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Collections</CardTitle>
                <CardDescription>
                  Pick a collection to filter the testimonial list.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <button
                  type="button"
                  onClick={() => setSelectedCollectionId("")}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                    selectedCollectionId === "" ? "border-primary bg-primary/5" : "bg-background hover:border-primary/40"
                  }`}
                >
                  <div className="font-medium">All testimonials</div>
                  <div className="text-sm text-muted-foreground">
                    {visibleTestimonials.length} entries
                  </div>
                </button>
                {(collectionsQuery.data ?? []).map((collection) => (
                  <button
                    key={collection.id}
                    type="button"
                    onClick={() => {
                      setSelectedCollectionId(collection.id)
                      setForm(emptyTestimonial(collection.id))
                      setSelectedTestimonialId("")
                    }}
                    className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                      selectedCollectionId === collection.id
                        ? "border-primary bg-primary/5"
                        : "bg-background hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium">{collection.label}</div>
                      <Badge variant="secondary">{collection.count}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{collection.id}</div>
                  </button>
                ))}
                {(collectionsQuery.data ?? []).length === 0 && (
                  <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                    No collections yet. Create a testimonial to start one.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border bg-background/60">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Entries</CardTitle>
                <CardDescription>{selectedCollectionLabel}</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[420px] pr-3">
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
                              onClick={() => setSelectedTestimonialId(id)}
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
                                onClick={() => setSelectedTestimonialId(id)}
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
                    {visibleTestimonials.length === 0 && (
                      <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                        No testimonials match this filter.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <Card className="border bg-background/60">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">
                {selectedTestimonialId ? "Edit testimonial" : "Create testimonial"}
              </CardTitle>
              <CardDescription>
                Author name, collection, and media format all drive how the section renders.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
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
                        setForm((prev) => ({ ...prev, format: value as Testimonial["format"] }))
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

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="testimonial-avatar">Avatar URL</Label>
                    <Input
                      id="testimonial-avatar"
                      value={form.avatarUrl ?? ""}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          avatarUrl: event.target.value,
                        }))
                      }
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="testimonial-media">Media URL</Label>
                    <Input
                      id="testimonial-media"
                      value={form.mediaUrl ?? ""}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          mediaUrl: event.target.value,
                        }))
                      }
                      placeholder="Video or audio source"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="testimonial-thumb">Thumbnail URL</Label>
                    <Input
                      id="testimonial-thumb"
                      value={form.thumbnailUrl ?? ""}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          thumbnailUrl: event.target.value,
                        }))
                      }
                      placeholder="Preview image for media formats"
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
                  <div className="flex items-center justify-between rounded-xl border bg-muted/20 px-4 py-3">
                    <div>
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="testimonial-body">Body</Label>
                  <Textarea
                    id="testimonial-body"
                    rows={6}
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

                <div className="flex flex-wrap items-center gap-3">
                  <Button type="submit" disabled={saveMutation.isPending}>
                    {saveMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="mr-2 h-4 w-4" />
                    )}
                    {selectedTestimonialId ? "Update Testimonial" : "Create Testimonial"}
                  </Button>
                  {selectedTestimonialId ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={startNew}
                    >
                      Cancel edit
                    </Button>
                  ) : null}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
