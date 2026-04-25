import { Plus, Trash2 } from "lucide-react"
import { MediaAssetPicker } from "@/components/media-asset-picker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { type PageSection, type PageSectionItem } from "@/lib/api"

export function SectionItemsEditor({
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
          <MediaAssetPicker
            label="Image"
            value={item.imageUrl ?? ""}
            onChange={(url) => {
              const nextItems = [...items]
              nextItems[index] = {
                ...nextItems[index],
                imageUrl: url,
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
