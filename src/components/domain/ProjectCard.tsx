import { useNavigate } from "react-router"
import { Trash2, ArrowRight } from "lucide-react"
import type { Project } from "@/types"

export function ProjectCard({
  project, onDelete,
}: {
  project: Project
  onDelete: (id: string) => void
}) {
  const navigate = useNavigate()

  return (
    <div className="bg-white border rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <span className="font-semibold text-sm">{project.name}</span>
        <button
          onClick={() => onDelete(project.id)}
          className="text-gray-300 hover:text-red-500 transition-colors"
        >
          <Trash2 size={15} />
        </button>
      </div>

      {project.description && (
        <p className="text-xs text-gray-500 leading-relaxed">{project.description}</p>
      )}

      <div className="flex items-center justify-between mt-auto pt-2">
        {project.deadline ? (
          <span className="text-xs text-gray-400">
            Prazo: {new Date(project.deadline).toLocaleDateString("pt-BR")}
          </span>
        ) : (
          <span />
        )}
        <button
          onClick={() => navigate(`/kanban?project=${project.id}`)}
          className="flex items-center gap-1 text-xs text-black font-medium hover:underline"
        >
          Ver Kanban <ArrowRight size={13} />
        </button>
      </div>
    </div>
  )
}