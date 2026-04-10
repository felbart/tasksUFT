import { useEffect, useState } from "react"
import { getProjects, createProject, deleteProject } from "@/services/projects.service"
import type { Project } from "@/types"
import { Plus } from "lucide-react"
import { ProjectCard } from "@/components/domain/ProjectCard"
import { Button } from "@/components/ui/Button"
import { Modal } from "@/components/ui/Modal"
import { Input, Textarea } from "@/components/ui/Input"
import { PageHeader } from "@/components/ui/PageHeader"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      const data = await getProjects()
      if (!cancelled) {
        setProjects(data)
        setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  async function handleDelete(id: string) {
    if (!confirm("Excluir projeto?")) return
    await deleteProject(id)
    setProjects((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Projetos"
        action={
          <Button onClick={() => setShowModal(true)}>
            <Plus size={16} />
            Novo projeto
          </Button>
        }
      />

      {loading ? (
        <p className="text-gray-400">Carregando...</p>
      ) : projects.length === 0 ? (
        <p className="text-gray-400 text-sm">Nenhum projeto ainda.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {showModal && (
        <ProjectModal
          onClose={() => setShowModal(false)}
          onCreated={(p) => {
            setProjects((prev) => [p, ...prev])
            setShowModal(false)
          }}
        />
      )}
    </div>
  )
}

function ProjectModal({
  onClose,
  onCreated,
}: {
  onClose: () => void
  onCreated: (p: Project) => void
}) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [deadline, setDeadline] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    try {
      const project = await createProject({ name, description, deadline: deadline || undefined })
      onCreated(project)
    } catch (err) {
      console.error("Erro ao criar projeto:", err)
      alert("Erro ao criar projeto. Veja o console.")
    } finally {
      setLoading(false)
    }
  }

 return (
  <Modal title="Novo projeto" onClose={onClose}>
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Input
        placeholder="Nome do projeto"
        value={name}
        onChange={(e) => setName(e.target.value)}
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
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
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