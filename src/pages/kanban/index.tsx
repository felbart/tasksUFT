import { useEffect, useState } from "react"
import { useSearchParams } from "react-router"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { getProjects } from "@/services/projects.service"
import { getTasksByProject, createTask, updateTaskStatus, deleteTask } from "@/services/tasks.service"
import type { Task } from "@/types"
import { KanbanColumn } from "@/components/domain/KanbanColumn"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { Input, Textarea } from "@/components/ui/Input"
import { PageHeader } from "@/components/ui/PageHeader"
import { ChevronsUpDown } from "lucide-react"

const COLUMNS: { key: Task["status"]; label: string; color: string }[] = [
  { key: "todo", label: "A fazer", color: "bg-gray-100 text-gray-600" },
  { key: "in_progress", label: "Em andamento", color: "bg-yellow-100 text-yellow-700" },
  { key: "done", label: "Concluído", color: "bg-green-100 text-green-700" },
]

export default function KanbanPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([])
  const [selectedProject, setSelectedProject] = useState<string>("")
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [addingToStatus, setAddingToStatus] = useState<Task["status"]>("todo")
  const [showProjectMenu, setShowProjectMenu] = useState(false)

  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: { distance: 5 },
  }))

  useEffect(() => {
    let cancelled = false
    getProjects().then((data) => {
      if (cancelled) return
      setProjects(data)
      const fromUrl = searchParams.get("project")
      const initial = fromUrl ?? data[0]?.id ?? ""
      setSelectedProject(initial)
    })
    return () => { cancelled = true }
  }, [searchParams])

  useEffect(() => {
    if (!selectedProject) return
    let cancelled = false
    async function fetchTasks() {
      setLoading(true)
      const data = await getTasksByProject(selectedProject)
      if (cancelled) return
      setTasks(data)
      setLoading(false)
    }
    fetchTasks()
    return () => { cancelled = true }
  }, [selectedProject])

  function handleSelectProject(id: string) {
    setSelectedProject(id)
    setSearchParams({ project: id })
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return
    const taskId = active.id as string
    const newStatus = over.id as Task["status"]
    const task = tasks.find((t) => t.id === taskId)
    if (!task || task.status === newStatus) return
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status: newStatus } : t))
    await updateTaskStatus(taskId, newStatus)
  }

  async function handleDelete(taskId: string) {
    await deleteTask(taskId)
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
  }

  return (
    <div className="flex flex-col">
      <PageHeader
        label="Kanban"
        title={
          <div className="relative">
            <button
              onClick={() => setShowProjectMenu((v) => !v)}
              className="flex items-center gap-2 hover:opacity-70 transition-opacity"
            >
              {projects.find((p) => p.id === selectedProject)?.name ?? "Selecionar projeto"}
              <ChevronsUpDown size={18} className="text-gray-400" />
            </button>

            {showProjectMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowProjectMenu(false)}
                />
                <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden">
                  {projects.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        handleSelectProject(p.id)
                        setShowProjectMenu(false)
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        p.id === selectedProject
                          ? "bg-gray-50 font-medium"
                          : "hover:bg-gray-50 text-gray-600"
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        }
      />

      {loading ? (
        <p className="text-gray-400">Carregando...</p>
      ) : !selectedProject ? (
        <p className="text-gray-400 text-sm">Crie um projeto primeiro.</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible lg:mx-0 lg:px-0">
            {COLUMNS.map(({ key, label, color }) => (
              <KanbanColumn
                key={key}
                status={key}
                label={label}
                color={color}
                tasks={tasks.filter((t) => t.status === key)}
                onDelete={handleDelete}
                onAddTask={() => { setAddingToStatus(key); setShowModal(true) }}
              />
            ))}
          </div>
        </DndContext>
      )}

      {showModal && (
        <TaskModal
          status={addingToStatus}
          projectId={selectedProject}
          onClose={() => setShowModal(false)}
          onCreated={(t) => { setTasks((prev) => [...prev, t]); setShowModal(false) }}
        />
      )}
    </div>
  )
}

function TaskModal({
  status, projectId, onClose, onCreated,
}: {
  status: Task["status"]
  projectId: string
  onClose: () => void
  onCreated: (t: Task) => void
}) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    try {
      const task = await createTask({
        project_id: projectId,
        title,
        description,
        status,
        due_date: dueDate || undefined,
      })
      onCreated(task)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title="Nova tarefa" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          placeholder="Título da tarefa"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Textarea
          placeholder="Descrição (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          type="date"
          label="Prazo"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <div className="flex gap-2 justify-end mt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Criando..." : "Criar"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}