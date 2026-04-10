import type { ReactNode } from "react"

interface PageHeaderProps {
  label?: string
  title: ReactNode
  action?: ReactNode
}

export function PageHeader({ label, title, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-1 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          {label && (
            <span className="text-xs text-gray-400 uppercase tracking-wide">{label}</span>
          )}
          <div className="text-2xl font-bold">{title}</div>
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="h-px bg-gray-100 mt-2" />
    </div>
  )
}