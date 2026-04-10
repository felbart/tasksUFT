import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { getProjects } from "@/services/projects.service"
import { getTasksByProject } from "@/services/tasks.service"
import type { Project, Task } from "@/types"
import { PageHeader } from "@/components/ui/PageHeader"

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
  let cancelled = false
  async function load() {
    const ps = await getProjects()
    if (cancelled) return
    setProjects(ps)
    const all = await Promise.all(ps.map((p) => getTasksByProject(p.id)))
    if (cancelled) return
    setTasks(all.flat())
    setLoading(false)
  }
  load()
  return () => { cancelled = true }
}, [])

  const todo = tasks.filter((t) => t.status === "todo").length
  const inProgress = tasks.filter((t) => t.status === "in_progress").length
  const done = tasks.filter((t) => t.status === "done").length

  if (loading) return <p className="text-gray-400">Carregando...</p>

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Dashboard" />

      {/* Cards de resumo */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Projetos", value: projects.length, color: "bg-blue-50 text-blue-700" },
          { label: "A fazer", value: todo, color: "bg-gray-50 text-gray-700" },
          { label: "Em andamento", value: inProgress, color: "bg-yellow-50 text-yellow-700" },
          { label: "Concluídas", value: done, color: "bg-green-50 text-green-700" },
        ].map(({ label, value, color }) => (
          <div key={label} className={`rounded-xl p-5 ${color}`}>
            <p className="text-sm font-medium">{label}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
          </div>
        ))}
      </div>

      {/* Lista de projetos recentes */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Projetos recentes</h2>
        {projects.length === 0 ? (
          <p className="text-gray-400 text-sm">Nenhum projeto criado ainda.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {projects.slice(0, 5).map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/kanban?project=${p.id}`)}
                className="flex items-center justify-between bg-white border rounded-lg px-4 py-3 cursor-pointer hover:border-black transition-colors"
              >
                <span className="font-medium text-sm">{p.name}</span>
                {p.deadline && (
                  <span className="text-xs text-gray-400">
                    {new Date(p.deadline).toLocaleDateString("pt-BR")}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}