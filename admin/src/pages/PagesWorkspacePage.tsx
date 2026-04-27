import { useParams } from "react-router-dom"

import { usePagesQuery } from "@/features/content/hooks/use-pages"
import type { Page } from "@/features/content/types"
import { PageEditor } from "./pages-workspace/PageEditor"
import { PageOverview } from "./pages-workspace/PageOverview"

export function PagesWorkspacePage() {
  const { pageId } = useParams()
  const pagesQuery = usePagesQuery()

  if (!pageId) {
    return <PageOverview pages={(pagesQuery.data ?? []) as Page[]} />
  }

  return <PageEditor />
}

