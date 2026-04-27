import { useQuery } from "@tanstack/react-query"
import { listMediaAssets } from "../services/media.api"

export function useMediaAssetsQuery() {
  return useQuery({
    queryKey: ["content", "media-assets"],
    queryFn: listMediaAssets,
  })
}

