import type { ReactNode } from "react"

type FormFieldProps = {
  label: string
  helperText?: string
  children: ReactNode
}

export function FormField({ label, helperText, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <div className="space-y-0.5">
        <label className="text-sm font-medium leading-none">{label}</label>
        {helperText ? (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        ) : null}
      </div>
      {children}
    </div>
  )
}

