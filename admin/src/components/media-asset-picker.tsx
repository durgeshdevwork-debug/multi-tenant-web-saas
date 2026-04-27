import { useId, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  listMediaAssets,
  uploadMediaAsset,
} from "@/features/content/services/media.api"
import type { MediaAsset } from "@/features/content/types"
import { Image, Upload, X } from "lucide-react"

type MediaAssetPickerProps = {
  label: string
  value?: string
  onChange: (url: string) => void
  helperText?: string
  className?: string
}

export function MediaLibrary({
  onSelect,
  value,
}: {
  onSelect: (url: string) => void
  value?: string
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
              onClick={() => {
                onSelect(asset.url)
              }}
              className={cn(
                "group overflow-hidden rounded-xl border text-left transition-all hover:border-primary/60",
                value === asset.url &&
                  "border-primary ring-1 ring-primary"
              )}
            >
              <div className="aspect-square bg-muted/20">
                <img
                  src={asset.url}
                  alt={asset.altText ?? asset.originalName}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-1 p-3">
                <p className="truncate text-sm font-medium">
                  {asset.originalName}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {asset.url}
                </p>
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
              <Label htmlFor={uploadId}>Choose image</Label>
              <Input
                id={uploadId}
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setSelectedFile(event.target.files?.[0] ?? null)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={altId}>Alt text</Label>
              <Input
                id={altId}
                placeholder="Describe the image"
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
              {uploadMutation.isPending
                ? "Uploading..."
                : "Upload and use"}
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
}: MediaAssetPickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className={cn("space-y-3", className)}>
      <Label>{label}</Label>
      <div className="space-y-3 rounded-xl border bg-background/70 p-3">
        {value ? (
          <div className="overflow-hidden rounded-lg border bg-muted/20">
            <img src={value} alt={label} className="h-40 w-full object-cover" />
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
            No image selected
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
            <DialogContent className="max-h-[85vh] overflow-hidden sm:max-w-4xl">
              <DialogHeader>
                <DialogTitle>Choose media</DialogTitle>
              </DialogHeader>

              <MediaLibrary 
                value={value} 
                onSelect={(url) => {
                  onChange(url)
                  setOpen(false)
                }} 
              />
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
