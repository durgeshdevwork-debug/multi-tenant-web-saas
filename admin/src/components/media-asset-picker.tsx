import { useId, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Image, Upload, X } from "lucide-react"

import {
  listMediaAssets,
  uploadMediaAsset,
} from "@/features/content/services/media.api"
import type { MediaAsset } from "@/features/content/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type MediaAssetPickerProps = {
  label: string
  value?: string
  onChange: (url: string) => void
  helperText?: string
  className?: string
  accept?: string
}

function isVideoUrl(url?: string) {
  return Boolean(url && /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(url))
}

function isAudioUrl(url?: string) {
  return Boolean(url && /\.(mp3|wav|ogg|m4a|aac)(\?|#|$)/i.test(url))
}

export function MediaLibrary({
  onSelect,
  value,
  accept = "image/*",
}: {
  onSelect: (url: string) => void
  value?: string
  accept?: string
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [altText, setAltText] = useState("")
  const queryClient = useQueryClient()
  const reactId = useId()
  const uploadId = `media-upload-${reactId}`
  const altId = `media-alt-${reactId}`

  const mediaQuery = useQuery({
    queryKey: ["media-assets"],
    queryFn: listMediaAssets,
  })

  const uploadMutation = useMutation({
    mutationFn: uploadMediaAsset,
    onSuccess: (asset) => {
      queryClient.invalidateQueries({ queryKey: ["media-assets"] })
      onSelect(asset.url)
      setSelectedFile(null)
      setAltText("")
    },
  })

  const mediaAssets = (mediaQuery.data as MediaAsset[] | undefined) ?? []

  const renderPreview = (asset: MediaAsset) => {
    if (asset.mimeType.startsWith("video/")) {
      return (
        <video
          src={asset.url}
          className="h-full w-full object-cover"
          muted
          playsInline
        />
      )
    }

    if (asset.mimeType.startsWith("audio/")) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-2 bg-muted/10 p-3 text-center text-muted-foreground">
          <div className="text-xs font-medium uppercase tracking-[0.2em]">
            Audio
          </div>
          <audio controls className="w-full">
            <source src={asset.url} />
          </audio>
        </div>
      )
    }

    return (
      <img
        src={asset.url}
        alt={asset.altText ?? asset.originalName}
        className="h-full w-full object-cover"
      />
    )
  }

  return (
    <Tabs defaultValue="library" className="flex h-full flex-col">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="library">Media library</TabsTrigger>
        <TabsTrigger value="upload">Upload new</TabsTrigger>
      </TabsList>

      <TabsContent value="library" className="mt-4">
        <ScrollArea className="h-[60vh] pr-3">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {mediaAssets.map((asset) => (
              <button
                key={asset._id}
                type="button"
                onClick={() => onSelect(asset.url)}
                className={cn(
                  "group overflow-hidden rounded-xl border text-left transition-all hover:border-primary/60",
                  value === asset.url && "border-primary ring-1 ring-primary"
                )}
              >
                <div className="aspect-square bg-muted/20">{renderPreview(asset)}</div>
                <div className="space-y-1 p-3">
                  <p className="truncate text-sm font-medium">{asset.originalName}</p>
                  <p className="truncate text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {asset.mimeType.split("/")[0]}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{asset.url}</p>
                </div>
              </button>
            ))}
            {mediaAssets.length === 0 && (
              <div className="col-span-full rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                No media uploaded yet.
              </div>
            )}
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="upload" className="mt-4 space-y-4">
        <Card className="border-border/70 bg-muted/10">
          <CardContent className="space-y-4 p-4">
            <div className="space-y-2">
              <Label htmlFor={uploadId}>Choose media</Label>
              <Input
                id={uploadId}
                type="file"
                accept={accept}
                onChange={(event) =>
                  setSelectedFile(event.target.files?.[0] ?? null)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={altId}>Alt text</Label>
              <Input
                id={altId}
                placeholder="Describe the media"
                value={altText}
                onChange={(event) => setAltText(event.target.value)}
              />
            </div>
            {selectedFile ? (
              <div className="rounded-lg border bg-background p-3 text-sm">
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : null}
            <Button
              type="button"
              onClick={() => {
                if (!selectedFile) return
                uploadMutation.mutate({
                  file: selectedFile,
                  altText: altText || undefined,
                })
              }}
              disabled={!selectedFile || uploadMutation.isPending}
            >
              <Upload className="mr-2 h-4 w-4" />
              {uploadMutation.isPending ? "Uploading..." : "Upload and use"}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

export function MediaAssetPicker({
  label,
  value,
  onChange,
  helperText,
  className,
  accept = "image/*",
}: MediaAssetPickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className={cn("space-y-3", className)}>
      <Label>{label}</Label>
      <div className="space-y-3 rounded-xl border bg-background/70 p-3">
        {value ? (
          <div className="overflow-hidden rounded-lg border bg-muted/20">
            {isVideoUrl(value) ? (
              <video src={value} controls className="h-40 w-full object-cover" />
            ) : isAudioUrl(value) ? (
              <div className="flex h-40 items-center justify-center px-4">
                <audio controls className="w-full">
                  <source src={value} />
                </audio>
              </div>
            ) : (
              <img src={value} alt={label} className="h-40 w-full object-cover" />
            )}
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
            No media selected
          </div>
        )}

        <div className="grid gap-2 sm:grid-cols-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="outline" className="justify-start">
                <Image className="mr-2 h-4 w-4" />
                Select from media
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] w-[min(96vw,1200px)] max-w-none overflow-hidden p-0">
              <DialogHeader className="px-6 pt-6">
                <DialogTitle>Choose media</DialogTitle>
              </DialogHeader>

              <div className="px-6 pb-6">
                <MediaLibrary
                  value={value}
                  accept={accept}
                  onSelect={(url) => {
                    onChange(url)
                    setOpen(false)
                  }}
                />
              </div>
            </DialogContent>
          </Dialog>

          <Button
            type="button"
            variant="outline"
            className="justify-start"
            onClick={() => {
              onChange("")
            }}
          >
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>

        {helperText ? (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        ) : null}
      </div>
    </div>
  )
}
