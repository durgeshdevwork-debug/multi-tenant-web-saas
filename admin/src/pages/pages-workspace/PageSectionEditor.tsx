import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { Trash2 } from "lucide-react"

import { MediaAssetPicker } from "@/components/media-asset-picker"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import type { Page, PageSection, PageSectionType } from "@/features/content/types"
import {
  listTestimonialCollections,
  listTestimonials,
} from "@/features/content/services/testimonials.api"
import { sectionTypes } from "./utils"
import { SectionItemsEditor } from "./SectionItemsEditor"
import { EditorX } from "@/components/editor/EditorX"

export function PageSectionEditor({
  section,
  index,
  allPages = [],
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  disableMoveUp,
  disableMoveDown,
}: {
  section: PageSection
  index: number
  allPages?: Page[]
  onChange: (section: PageSection) => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  disableMoveUp: boolean
  disableMoveDown: boolean
}) {
  const heroCarouselEnabled = section.type === "hero" && Boolean(section.content.carouselEnabled)
  const supportsImage =
    ["gallery", "split"].includes(section.type) ||
    (section.type === "hero" && !heroCarouselEnabled)
  const supportsButton =
    ["cta", "split"].includes(section.type) ||
    (section.type === "hero" && !heroCarouselEnabled)
  const isCollection = section.type === "collection"
  const isTestimonials = section.type === "testimonials"
  const hasRichBody = section.type === "richText"

  const collectionId = section.content.collectionId as string | undefined
  const selectedPageIds = (section.content.selectedPageIds as string[]) || []
  const selectedTestimonialIds =
    (section.content.selectedTestimonialIds as string[]) || []

  const collectionPages = useMemo(() => {
    const parentIds = new Set(
      allPages.map((page) => page.parentId).filter(Boolean) as string[]
    )

    return allPages.filter((page) => {
      const id = page.id ?? page._id
      return Boolean(id) && !page.parentId && parentIds.has(id as string)
    })
  }, [allPages])

  const availablePages = useMemo(() => {
    if (!collectionId) return []
    return allPages.filter((page) => page.parentId === collectionId)
  }, [allPages, collectionId])

  const testimonialCollectionsQuery = useQuery({
    queryKey: ["content", "testimonials", "collections"],
    queryFn: listTestimonialCollections,
    enabled: isTestimonials,
  })

  const testimonialItemsQuery = useQuery({
    queryKey: ["content", "testimonials", collectionId],
    queryFn: () => listTestimonials(collectionId),
    enabled: isTestimonials && Boolean(collectionId),
  })

  const testimonialItems = testimonialItemsQuery.data ?? []

  return (
    <div className="rounded-2xl border bg-background p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">Section {index + 1}</h3>
          <p className="text-sm text-muted-foreground">
            {isCollection
              ? "Pick a parent page and select which child pages to display."
              : isTestimonials
                ? "Choose a testimonial collection and pick which entries should appear."
                : "Choose the block type and edit its content fields."}
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

        {isCollection ? (
          <div className="space-y-4 md:col-span-2">
            <div className="space-y-2">
              <Label>Source Collection (Parent Page)</Label>
              <Select
                value={collectionId || "none"}
                onValueChange={(val) =>
                  onChange({
                    ...section,
                    content: {
                      ...section.content,
                      collectionId: val === "none" ? undefined : val,
                      selectedPageIds: [],
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a collection..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Not selected</SelectItem>
                  {collectionPages.map((page) => (
                    <SelectItem
                      key={page.id ?? page._id}
                      value={(page.id ?? page._id)!}
                    >
                      {page.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {collectionId && (
              <div className="space-y-3 rounded-xl border bg-muted/20 p-4">
                <Label className="mb-2 block">Select Pages to Display</Label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {availablePages.map((page) => {
                    const id = (page.id ?? page._id)!
                    const isChecked = selectedPageIds.includes(id)
                    return (
                      <div key={id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`page-${id}`}
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            const nextIds = checked
                              ? [...selectedPageIds, id]
                              : selectedPageIds.filter((pageId) => pageId !== id)
                            onChange({
                              ...section,
                              content: {
                                ...section.content,
                                selectedPageIds: nextIds,
                              },
                            })
                          }}
                        />
                        <label
                          htmlFor={`page-${id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {page.title}
                        </label>
                      </div>
                    )
                  })}
                  {availablePages.length === 0 && (
                    <p className="col-span-full text-sm italic text-muted-foreground">
                      No child pages found for this collection.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
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

            {section.type === "hero" ? (
              <div className="flex items-center justify-between rounded-xl border bg-muted/20 px-4 py-3 md:col-span-2">
                <div>
                  <div className="font-medium">Enable carousel</div>
                  <p className="text-sm text-muted-foreground">
                    Turn this hero into a multi-slide carousel.
                  </p>
                </div>
                <Switch
                  checked={Boolean(section.content.carouselEnabled)}
                  onCheckedChange={(checked) =>
                    onChange({
                      ...section,
                      content: {
                        ...section.content,
                        carouselEnabled: checked,
                        carouselItems:
                          checked && !section.content.carouselItems?.length
                            ? [
                                {
                                  title: "",
                                  description: "",
                                  imageUrl: "",
                                  buttonLabel: "",
                                  buttonUrl: "",
                                },
                              ]
                            : section.content.carouselItems,
                      },
                    })
                  }
                />
              </div>
            ) : null}

            <div className="space-y-2 md:col-span-2">
              <Label>{hasRichBody ? "Body" : "Body / Description"}</Label>
              {hasRichBody ? (
                <EditorX
                  value={section.content.body ?? ""}
                  onChange={(val) =>
                    onChange({
                      ...section,
                      content: { ...section.content, body: val },
                    })
                  }
                />
              ) : (
                <Textarea
                  rows={section.type === "split" ? 6 : 4}
                  value={section.content.body ?? ""}
                  onChange={(event) =>
                    onChange({
                      ...section,
                      content: { ...section.content, body: event.target.value },
                    })
                  }
                  placeholder="Write the main content for this section."
                />
              )}
            </div>

            {supportsImage ? (
              <div className="space-y-2 md:col-span-2">
                <MediaAssetPicker
                  label="Section Image"
                  value={section.content.imageUrl ?? ""}
                  onChange={(url) =>
                    onChange({
                      ...section,
                      content: { ...section.content, imageUrl: url },
                    })
                  }
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

            {isTestimonials ? (
              <div className="space-y-4 md:col-span-2">
                <div className="space-y-2">
                  <Label>Testimonial Collection</Label>
                  <Select
                    value={collectionId || "none"}
                    onValueChange={(value) =>
                      onChange({
                        ...section,
                        content: {
                          ...section.content,
                          collectionId: value === "none" ? undefined : value,
                          selectedTestimonialIds: [],
                        },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a testimonial collection" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Not selected</SelectItem>
                      {(testimonialCollectionsQuery.data ?? []).map((collection) => (
                        <SelectItem key={collection.id} value={collection.id}>
                          {collection.label} ({collection.count})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {collectionId ? (
                  <div className="space-y-3 rounded-xl border bg-muted/20 p-4">
                    <Label className="mb-2 block">Select Testimonials to Display</Label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {testimonialItems.map((testimonial) => {
                        const id = testimonial.id ?? testimonial._id!
                        const isChecked = selectedTestimonialIds.includes(id)

                        return (
                          <div key={id} className="rounded-lg border bg-background p-3">
                            <div className="flex items-start gap-3">
                              <Checkbox
                                id={`testimonial-${id}`}
                                checked={isChecked}
                                onCheckedChange={(checked) => {
                                  const nextIds = checked
                                    ? [...selectedTestimonialIds, id]
                                    : selectedTestimonialIds.filter((itemId) => itemId !== id)
                                  onChange({
                                    ...section,
                                    content: {
                                      ...section.content,
                                      selectedTestimonialIds: nextIds,
                                    },
                                  })
                                }}
                              />
                              <label
                                htmlFor={`testimonial-${id}`}
                                className="block flex-1 cursor-pointer text-sm"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {testimonial.authorName}
                                  </span>
                                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                                    {testimonial.format}
                                  </span>
                                </div>
                                <div className="text-muted-foreground">
                                  {testimonial.title || testimonial.company || "Untitled testimonial"}
                                </div>
                              </label>
                            </div>
                          </div>
                        )
                      })}
                      {testimonialItems.length === 0 && (
                        <p className="col-span-full text-sm italic text-muted-foreground">
                          No testimonials found in this collection yet.
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                    Select a testimonial collection to load available items.
                  </p>
                )}
              </div>
            ) : null}

            {heroCarouselEnabled || section.type === "features" || section.type === "gallery" || section.type === "stats" || section.type === "faq" ? (
              <div className="md:col-span-2">
                <Label className="mb-2 block">
                  {section.type === "hero" ? "Carousel Slides" : "Section Items"}
                </Label>
                <SectionItemsEditor section={section} onChange={onChange} />
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}
