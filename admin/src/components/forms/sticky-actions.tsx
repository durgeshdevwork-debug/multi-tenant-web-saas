import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type StickyActionsProps = {
  children: ReactNode
  className?: string
}

export function StickyActions({ children, className }: StickyActionsProps) {
  return (
    <div
      className={cn(
        "sticky top-0 z-30 border-b bg-background/90 px-5 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/75",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-end gap-2">
        {children}
      </div>
    </div>
  )
}

