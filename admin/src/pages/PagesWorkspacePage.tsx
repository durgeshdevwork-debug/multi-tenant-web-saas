import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { listPages, type Page } from "@/lib/api"
import { PageOverview } from "./pages-workspace/PageOverview"
import { PageEditor } from "./pages-workspace/PageEditor"

export function PagesWorkspacePage() {
  const { pageId } = useParams()

  const pagesQuery = useQuery({
    queryKey: ["content", "pages"],
    queryFn: listPages,
  })

  const isOverview = !pageId

  if (isOverview) {
    const pages = (pagesQuery.data as Page[] | undefined) ?? []
    return <PageOverview pages={pages} />
  }

  return <PageEditor />
}
