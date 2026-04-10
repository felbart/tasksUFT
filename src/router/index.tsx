import { createBrowserRouter, Navigate } from "react-router"


import LoginPage from "@/pages/login"
import DashboardPage from "@/pages/dashboard"
import ProjectsPage from "@/pages/projects"
import KanbanPage from "@/pages/kanban"
import CalendarPage from "@/pages/calendar"

import AppLayout from "@/layouts/AppLayout"
import { ProtectedRoute } from "./ProtectedRoute"

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "projects",
        element: <ProjectsPage />,
      },
      {
        path: "kanban",
        element: <KanbanPage />,
      },
      {
        path: "calendar",
        element: <CalendarPage />,
      },
    ],
  },
])