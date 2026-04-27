import { useQuery } from "@tanstack/react-query"
import { listPageTree, listPages } from "../services/pages.api"

export function usePagesQuery() {
  return useQuery({
    queryKey: ["content", "pages"],
    queryFn: listPages,
  })
}

export function usePageTreeQuery() {
  return useQuery({
    queryKey: ["content", "pages", "tree"],
    queryFn: listPageTree,
  })
}

