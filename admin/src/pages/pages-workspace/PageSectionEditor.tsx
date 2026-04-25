import { useMemo } from "react"
import { Trash2 } from "lucide-react"
import { MediaAssetPicker } from "@/components/media-asset-picker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { type Page, type PageSection, type PageSectionType } from "@/lib/api"
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
  const supportsItems =
    section.type === "features" || section.type === "gallery"
  const supportsImage = section.type === "hero" || section.type === "gallery"
  const supportsButton = section.type === "hero" || section.type === "cta"
  const isCollection = section.type === "collection"

  const collectionId = section.content.collectionId as string | undefined
  const selectedPageIds = (section.content.selectedPageIds as string[]) || []

  // Pages that can act as "collections" (pages with children or designated parents)
  const collectionPages = useMemo(() => {
    const parents = new Set(allPages.map(p => p.parentId).filter(Boolean))
    return allPages.filter(p => parents.has(p.id ?? p._id))
  }, [allPages])

  // Pages available in the selected collection
  const availablePages = useMemo(() => {
    if (!collectionId) return []
    return allPages.filter(p => p.parentId === collectionId)
  }, [allPages, collectionId])

  return (
    <div className="rounded-2xl border bg-background p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">Section {index + 1}</h3>
          <p className="text-sm text-muted-foreground">
            {isCollection ? "Pick a parent page and select which child pages to display." : "Choose the block type and edit its content fields."}
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
                    content: { ...section.content, collectionId: val === "none" ? undefined : val, selectedPageIds: [] }
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a collection..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Not selected</SelectItem>
                  {collectionPages.map(p => (
                    <SelectItem key={p.id ?? p._id} value={(p.id ?? p._id)!}>{p.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {collectionId && (
              <div className="space-y-3 rounded-xl border bg-muted/20 p-4">
                <Label className="mb-2 block">Select Pages to Display</Label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {availablePages.map(page => {
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
                              : selectedPageIds.filter(pid => pid !== id)
                            onChange({
                              ...section,
                              content: { ...section.content, selectedPageIds: nextIds }
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
                    <p className="col-span-full text-sm text-muted-foreground italic">No child pages found for this collection.</p>
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
            <div className="space-y-2 md:col-span-2">
              <Label>Body</Label>
              {section.type === "richText" ? (
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
          </>
        )}
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
