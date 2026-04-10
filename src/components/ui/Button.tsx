import type { ButtonHTMLAttributes } from "react"

type Variant = "primary" | "secondary" | "ghost" | "danger"
type Size = "sm" | "md"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variants: Record<Variant, string> = {
  primary: "bg-black text-white hover:bg-gray-800",
  secondary: "bg-white text-black border border-gray-200 hover:bg-gray-50",
  ghost: "text-gray-500 hover:text-black hover:bg-gray-100",
  danger: "text-red-400 hover:text-red-600 hover:bg-red-50",
}

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg font-medium
        transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
    >
      {children}
    </button>
  )
}