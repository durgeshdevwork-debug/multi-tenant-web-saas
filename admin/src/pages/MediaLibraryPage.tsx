import { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  deleteMediaAsset,
  listMediaAssets,
  uploadMediaAsset,
} from "@/features/content/services/media.api"
import type { MediaAsset } from "@/features/content/types"
import { Loader2, Trash2, Upload, Image as ImageIcon } from "lucide-react"

export function MediaLibraryPage() {
  const queryClient = useQueryClient()
  const [file, setFile] = useState<File | null>(null)
  const [altText, setAltText] = useState("")

  const mediaQuery = useQuery({
    queryKey: ["media-assets"],
    queryFn: listMediaAssets,
  })

  const uploadMutation = useMutation({
    mutationFn: uploadMediaAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media-assets"] })
      setFile(null)
      setAltText("")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteMediaAsset,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["media-assets"] }),
  })

  const mediaAssets = (mediaQuery.data as MediaAsset[] | undefined) ?? []
  const totalBytes = useMemo(
    () => mediaAssets.reduce((sum, asset) => sum + asset.size, 0),
    [mediaAssets]
  )

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-8">
      <section className="overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-r from-card via-card to-muted/20 shadow-sm">
        <div className="grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
              <ImageIcon className="size-3.5" />
              Media library
            </div>
            <div>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Upload and reuse site images.
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
                Every image you upload here is tenant-scoped and can be reused
                across your dynamic pages and section blocks.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="rounded-full px-3 py-1">
                {mediaAssets.length} assets
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1">
                {(totalBytes / 1024 / 1024).toFixed(2)} MB used
              </Badge>
            </div>
          </div>

          <Card className="border-border/70 bg-background/70 shadow-none">
            <CardHeader className="space-y-1">
              <CardTitle className="text-lg font-semibold">
                Upload new media
              </CardTitle>
              <CardDescription>
                Choose a file and store it in your S3 bucket.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="media-file">Image file</Label>
                <Input
                  id="media-file"
                  type="file"
                  accept="image/*"
                  onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="media-alt">Alt text</Label>
                <Input
                  id="media-alt"
                  placeholder="Describe the image"
                  value={altText}
                  onChange={(event) => setAltText(event.target.value)}
                />
              </div>
              <Button
                type="button"
                className="w-full"
                onClick={() => {
                  if (!file) return
                  uploadMutation.mutate({ file, altText: altText || undefined })
                }}
                disabled={!file || uploadMutation.isPending}
              >
                {uploadMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                Upload image
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-sm tracking-[0.2em] text-muted-foreground uppercase">
            Library
          </p>
          <h3 className="mt-1 text-2xl font-semibold tracking-tight">
            Uploaded assets
          </h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mediaAssets.map((asset) => (
            <Card
              key={asset._id}
              className="overflow-hidden border-border/70 bg-card/90 shadow-sm"
            >
              <div className="aspect-square bg-muted/20">
                <img
                  src={asset.url}
                  alt={asset.altText ?? asset.originalName}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardContent className="space-y-3 p-4">
                <div>
                  <p className="truncate text-sm font-medium">
                    {asset.originalName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {asset.url}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <Badge variant="outline" className="max-w-28 truncate">
                    {asset.mimeType}
                  </Badge>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMutation.mutate(asset._id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {mediaAssets.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-border/70 bg-muted/10 p-10 text-center text-muted-foreground">
              No media uploaded yet. Add your first image above.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  )
}
