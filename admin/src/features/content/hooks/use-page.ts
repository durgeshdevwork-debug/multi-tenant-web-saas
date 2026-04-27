import { useQuery } from "@tanstack/react-query"
import { getPage } from "../services/pages.api"

export function usePageQuery(pageId?: string) {
  return useQuery({
    queryKey: ["content", "page", pageId],
    queryFn: () => getPage(pageId as string),
    enabled: Boolean(pageId) && pageId !== "new",
  })
}

