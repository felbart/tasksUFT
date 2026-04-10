import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react"

const baseStyles = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  rows?: number
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className = "", ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs text-gray-500">{label}</label>}
      <input ref={ref} className={`${baseStyles} ${className}`} {...props} />
    </div>
  )
)

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, rows = 3, className = "", ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs text-gray-500">{label}</label>}
      <textarea ref={ref} rows={rows} className={`${baseStyles} resize-none ${className}`} {...props} />
    </div>
  )
)

Input.displayName = "Input"
Textarea.displayName = "Textarea"