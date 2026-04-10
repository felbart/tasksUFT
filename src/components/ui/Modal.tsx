import type { ReactNode } from "react"

interface ModalProps {
  title: string
  onClose: () => void
  children: ReactNode
}

export function Modal({ title, onClose, children }: ModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-xl p-6 w-full max-w-md flex flex-col gap-4">
        <h2 className="font-semibold text-lg">{title}</h2>
        {children}
      </div>
    </div>
  )
}