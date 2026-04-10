import { useEffect, useState } from "react"
import { getProjects } from "@/services/projects.service"
import { getTasksByProject } from "@/services/tasks.service"
import type { Project, Task } from "@/types"
import { Button } from "@/components/ui/Button"
import { PageHeader } from "@/components/ui/PageHeader"

interface TaskWithProject extends Task {
  projectName: string
}

const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"]
const WEEKDAYS = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"]

const statusStyles: Record<Task["status"], string> = {
  todo: "bg-gray-100 text-gray-600 border-gray-200",
  in_progress: "bg-yellow-50 text-yellow-700 border-yellow-200",
  done: "bg-green-50 text-green-700 border-green-200",
}

const statusDot: Record<Task["status"], string> = {
  todo: "bg-gray-400",
  in_progress: "bg-yellow-400",
  done: "bg-green-500",
}

export default function CalendarPage() {
  const [tasks, setTasks] = useState<TaskWithProject[]>([])
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState(new Date())

  useEffect(() => {
    let cancelled = false
    async function load() {
      const projects = await getProjects()
      const all = await Promise.all(
        projects.map(async (p: Project) => {
          const t = await getTasksByProject(p.id)
          return t.map((task) => ({ ...task, projectName: p.name }))
        })
      )
      if (cancelled) return
      setTasks(all.flat())
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  const year = current.getFullYear()
  const month = current.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  function tasksForDay(day: number) {
    return tasks.filter((t) => {
      if (!t.due_date) return false
      const d = new Date(t.due_date + "T00:00:00")
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
      title={`${MONTHS[month]} ${year}`}
      label="Calendário"
      action={
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setCurrent(new Date(year, month - 1, 1))}>‹</Button>
          <Button variant="secondary" size="sm" onClick={() => setCurrent(new Date(year, month + 1, 1))}>›</Button>
        </div>
      }
    />

      {loading ? (
        <p className="text-gray-400">Carregando...</p>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          {/* Cabeçalho */}
          <div className="grid grid-cols-7 border-b bg-gray-50">
            {WEEKDAYS.map((d) => (
              <div key={d} className="text-xs font-medium text-gray-400 text-center py-3">
                {d}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7">
            {cells.map((day, i) => {
              const isToday =
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear()
              const dayTasks = day ? tasksForDay(day) : []

              return (
                <div
                  key={i}
                  className={`min-h-28 p-2 border-b border-r flex flex-col gap-1.5 ${
                    !day ? "bg-gray-50" : ""
                  }`}
                >
                  {day && (
                    <>
                      <span
                        className={`text-xs w-6 h-6 flex items-center justify-center rounded-full font-medium self-start ${
                          isToday ? "bg-black text-white" : "text-gray-500"
                        }`}
                      >
                        {day}
                      </span>

                      {dayTasks.map((t) => (
                        <div
                          key={t.id}
                          className={`text-xs px-1.5 py-1 rounded-md border flex flex-col gap-0.5 ${statusStyles[t.status]}`}
                          title={`${t.title} — ${t.projectName}`}
                        >
                          <div className="flex items-center gap-1 min-w-0">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot[t.status]}`} />
                            <span className="truncate font-medium">{t.title}</span>
                          </div>
                          <span className="truncate text-[10px] opacity-60 pl-2.5">
                            {t.projectName}
                          </span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}