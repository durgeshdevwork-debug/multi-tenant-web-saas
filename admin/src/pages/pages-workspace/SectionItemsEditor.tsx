import { Plus, Trash2 } from "lucide-react"

import { EditorX } from "@/components/editor/EditorX"
import { MediaAssetPicker } from "@/components/media-asset-picker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { PageSection, PageSectionItem } from "@/features/content/types"

const makeItem = (section: PageSection): PageSectionItem => {
  switch (section.type) {
    case "hero":
      return {
        title: "",
        description: "",
        imageUrl: "",
        buttonLabel: "",
        buttonUrl: "",
      }
    case "stats":
      return {
        title: "",
        value: "",
        description: "",
      }
    case "faq":
      return {
        question: "",
        answer: "",
        imageUrl: "",
      }
    default:
      return {
        title: "",
        description: "",
        imageUrl: "",
      }
  }
}

const getItemsKey = (section: PageSection) =>
  section.type === "hero" ? "carouselItems" : "items"

export function SectionItemsEditor({
  section,
  onChange,
}: {
  section: PageSection
  onChange: (section: PageSection) => void
}) {
  const itemsKey = getItemsKey(section)
  const items = (section.content[itemsKey] ?? []) as PageSectionItem[]

  const updateItems = (nextItems: PageSectionItem[]) => {
    onChange({
      ...section,
      content: {
        ...section.content,
        [itemsKey]: nextItems,
      },
    })
  }

  const updateItem = (
    index: number,
    patch: Partial<PageSectionItem>
  ) => {
    const nextItems = [...items]
    nextItems[index] = {
      ...nextItems[index],
      ...patch,
    }
    updateItems(nextItems)
  }

  if (section.type === "testimonials") {
    return null
  }

  return (
    <div className="space-y-3 rounded-lg border bg-muted/20 p-4">
      {items.map((item, index) => (
        <div
          key={`${section.id}-item-${index}`}
          className="space-y-4 rounded-xl border bg-background p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-medium">Item {index + 1}</p>
              <p className="text-xs text-muted-foreground">
                {section.type === "hero"
                  ? "Configure an individual carousel slide."
                  : section.type === "faq"
                    ? "Define the question and answer pair."
                    : section.type === "stats"
                      ? "Describe a key metric."
                      : "Add supporting content for this section."}
              </p>
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => updateItems(items.filter((_, itemIndex) => itemIndex !== index))}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove
            </Button>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {section.type === "faq" ? (
              <>
                <div className="space-y-2 md:col-span-2">
                  <Label>Question</Label>
                  <Input
                    placeholder="What is included?"
                    value={item.question ?? ""}
                    onChange={(event) => updateItem(index, { question: event.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Answer</Label>
                  <EditorX
                    value={item.answer ?? ""}
                    onChange={(value) => updateItem(index, { answer: value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <MediaAssetPicker
                    label="Optional image"
                    value={item.imageUrl ?? ""}
                    onChange={(url) => updateItem(index, { imageUrl: url })}
                  />
                </div>
              </>
            ) : section.type === "stats" ? (
              <>
                <div className="space-y-2">
                  <Label>Label</Label>
                  <Input
                    placeholder="Projects launched"
                    value={item.title ?? ""}
                    onChange={(event) => updateItem(index, { title: event.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Value</Label>
                  <Input
                    placeholder="120+"
                    value={item.value ?? ""}
                    onChange={(event) => updateItem(index, { value: event.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Description</Label>
                  <Textarea
                    rows={3}
                    placeholder="Optional supporting text"
                    value={item.description ?? ""}
                    onChange={(event) => updateItem(index, { description: event.target.value })}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>{section.type === "hero" ? "Slide Heading" : "Title"}</Label>
                  <Input
                    placeholder={section.type === "hero" ? "Slide heading" : "Item title"}
                    value={item.title ?? ""}
                    onChange={(event) => updateItem(index, { title: event.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <MediaAssetPicker
                    label="Image"
                    value={item.imageUrl ?? ""}
                    onChange={(url) => updateItem(index, { imageUrl: url })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>{section.type === "hero" ? "Slide body" : "Description"}</Label>
                  <Textarea
                    rows={section.type === "hero" ? 4 : 3}
                    placeholder={
                      section.type === "hero"
                        ? "Short supporting copy for this slide"
                        : "Item description"
                    }
                    value={item.description ?? ""}
                    onChange={(event) => updateItem(index, { description: event.target.value })}
                  />
                </div>
                {section.type === "hero" ? (
                  <>
                    <div className="space-y-2">
                      <Label>Button Label</Label>
                      <Input
                        placeholder="Learn more"
                        value={item.buttonLabel ?? ""}
                        onChange={(event) =>
                          updateItem(index, { buttonLabel: event.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Button URL</Label>
                      <Input
                        placeholder="/contact"
                        value={item.buttonUrl ?? ""}
                        onChange={(event) =>
                          updateItem(index, { buttonUrl: event.target.value })
                        }
                      />
                    </div>
                  </>
                ) : null}
              </>
            )}
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed"
        onClick={() => updateItems([...items, makeItem(section)])}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Item
      </Button>
    </div>
  )
}
