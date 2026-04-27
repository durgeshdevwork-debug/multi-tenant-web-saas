import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type FormSectionProps = {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export function FormSection({
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <section
      className={cn(
        "space-y-4 rounded-[var(--radius)] border bg-card p-5 shadow-sm",
        className
      )}
    >
      <div className="space-y-1">
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  )
}
