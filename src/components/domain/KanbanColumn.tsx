import { useDroppable } from "@dnd-kit/core"
import { Plus } from "lucide-react"
import { TaskCard } from "./TaskCard"
import type { Task } from "@/types"

export function KanbanColumn({
  status, label, color, tasks, onDelete, onAddTask,
}: {
  status: Task["status"]
  label: string
  color: string
  tasks: Task[]
  onDelete: (id: string) => void
  onAddTask: () => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col gap-3 rounded-xl p-4 min-w-72 border transition-colors ${
        isOver ? "bg-gray-100 border-gray-300" : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between px-1">
        <span className="text-sm font-semibold text-gray-600">{label}</span>
        <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${color}`}>
          {tasks.length}
        </span>
      </div>

      <div className="flex flex-col gap-2 min-h-24">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onDelete={onDelete} />
        ))}
      </div>

      <button
        onClick={onAddTask}
        className="flex items-center gap-2 text-xs text-gray-400 hover:text-black transition-colors py-1 px-1"
      >
        <Plus size={14} /> Adicionar tarefa
      </button>
    </div>
  )
}