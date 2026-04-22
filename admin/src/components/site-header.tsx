import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { DoorOpen, ShieldCheck } from "lucide-react"

type SiteHeaderProps = {
  title: string
  roleLabel: string
  onSignOut: () => void
}

export function SiteHeader({ title, roleLabel, onSignOut }: SiteHeaderProps) {
  return (
    <header className="border-b border-border/70 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-col gap-4 px-4 py-4 md:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <SidebarTrigger className="-ml-1 shrink-0" />
          <Separator orientation="vertical" className="hidden h-6 md:block" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-lg font-semibold tracking-tight md:text-xl">
                {title}
              </h1>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase"
                )}
              >
                <ShieldCheck className="size-3.5" />
                {roleLabel}
              </span>
            </div>
            {/* <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p> */}
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 rounded-full border-border/70 bg-background/60 px-4"
          onClick={onSignOut}
        >
          <DoorOpen className="size-4" />
          Sign out
        </Button>
      </div>
    </header>
  )
}
