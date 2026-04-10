import { useDraggable } from "@dnd-kit/core"
import { Trash2 } from "lucide-react"
import type { Task } from "@/types"

const COLUMNS = [
  { key: "todo", label: "A fazer", color: "bg-gray-100 text-gray-600" },
  { key: "in_progress", label: "Em andamento", color: "bg-yellow-100 text-yellow-700" },
  { key: "done", label: "Concluído", color: "bg-green-100 text-green-700" },
] as const

export function TaskCard({ task, onDelete }: { task: Task; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id })

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)`, zIndex: 50 }
    : undefined

  const statusInfo = COLUMNS.find((c) => c.key === task.status)

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`bg-white border rounded-lg p-3 flex flex-col gap-2 cursor-grab active:cursor-grabbing select-none transition-shadow ${
        isDragging ? "shadow-lg opacity-90" : "hover:shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-medium leading-snug">{task.title}</span>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onDelete(task.id)}
          className="text-gray-200 hover:text-red-400 transition-colors shrink-0"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {task.description && (
        <p className="text-xs text-gray-400 leading-relaxed">{task.description}</p>
      )}

      <div className="flex items-center justify-between">
        {task.due_date && (
          <span className="text-xs text-gray-400">
            {new Date(task.due_date).toLocaleDateString("pt-BR")}
          </span>
        )}
        {statusInfo && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ml-auto ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        )}
      </div>
    </div>
  )
}