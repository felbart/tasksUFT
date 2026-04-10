import { useState } from "react"
import { Outlet, NavLink, useNavigate } from "react-router"
import { useAuth } from "@/contexts/AuthContext"
import { LayoutDashboard, FolderKanban, Kanban, Calendar, LogOut, Menu, X } from "lucide-react"

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projetos", icon: FolderKanban },
  { to: "/kanban", label: "Kanban", icon: Kanban },
  { to: "/calendar", label: "Calendário", icon: Calendar },
]

export default function AppLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
    navigate("/login")
  }

  return (
    <div className="flex min-h-screen bg-gray-50/80">

      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 w-60 bg-white flex flex-col z-30
          border-r border-gray-100 shadow-sm
          transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:translate-x-0 lg:flex lg:shrink-0 lg:h-screen
        `}
      >
        <div className="p-5 border-b flex items-center justify-between">
          <span className="font-bold text-lg">TaskManager</span>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-gray-400 hover:text-black"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t">
          <div className="text-xs text-gray-400 px-3 mb-2 truncate">{user?.email}</div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 w-full transition-colors"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </aside>

      {/* Conteúdo */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar mobile */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white shadow-sm sticky top-0 z-10">
          <button onClick={() => setOpen(true)} className="text-gray-600 hover:text-black">
            <Menu size={20} />
          </button>
          <span className="font-bold text-base">TaskManager</span>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  )
}