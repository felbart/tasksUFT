import type { ReactNode } from "react"
import { Navigate } from "react-router"
import { useAuth } from "../contexts/AuthContext"


type ProtectedRouteProps = {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Carregando...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}