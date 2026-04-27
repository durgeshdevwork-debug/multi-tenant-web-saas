import type { ReactNode } from "react"

type FormHeaderProps = {
  title: string
  description?: string
  actions?: ReactNode
}

export function FormHeader({ title, description, actions }: FormHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b bg-background/90 px-5 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/70 md:flex-row md:items-start md:justify-between">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
          {title}
        </h2>
        {description ? (
          <p className="max-w-3xl text-sm text-muted-foreground md:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  )
}

