import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { DoorOpen } from "lucide-react"

type SiteHeaderProps = {
  title: string
  onSignOut: () => void
}

export function SiteHeader({ title, onSignOut }: SiteHeaderProps) {
  return (
    <header className="border-b border-border/70 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-col gap-4 px-4 py-4 md:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <SidebarTrigger className="-ml-1 shrink-0" />
          <Separator orientation="vertical" className="hidden h-6 md:block" />
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold tracking-tight md:text-xl">
              {title}
            </h1>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onSignOut}
        >
          <DoorOpen className="size-4" />
          Sign out
        </Button>
      </div>
    </header>
  )
}
