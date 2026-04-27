import type {
  Page,
  PageSection,
  PageSectionType,
} from "@/features/content/types"

export const sectionTypes: { value: PageSectionType; label: string }[] = [
  { value: "hero", label: "Hero" },
  { value: "richText", label: "Rich Text" },
  { value: "features", label: "Features" },
  { value: "cta", label: "Call To Action" },
  { value: "gallery", label: "Gallery" },
  { value: "collection", label: "Collection Grid (Auto-list Children)" },
  { value: "stats", label: "Stats" },
  { value: "faq", label: "FAQ" },
  { value: "testimonials", label: "Testimonials" },
  { value: "split", label: "Split Content" },
]

export const createSection = (type: PageSectionType = "richText"): PageSection => ({
  id: `section-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  type,
  name: "",
  content: {
    eyebrow: "",
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

export const emptyPage = (): Page => ({
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
  sections: [],
  seo: {
    metaTitle: "",
    metaDescription: "",
    ogImage: "",
  },
})

export const move = <T,>(items: T[], index: number, direction: -1 | 1) => {
  const nextIndex = index + direction
  if (nextIndex < 0 || nextIndex >= items.length) return items
  const copy = [...items]
  const [item] = copy.splice(index, 1)
  copy.splice(nextIndex, 0, item)
  return copy
}
