export interface Project {
  id: string
  name: string
  description: string | null
  deadline: string | null
  owner_id: string
  created_at: string
}

export interface Task {
  id: string
  project_id: string
  title: string
  description: string | null
  status: "todo" | "in_progress" | "done"
  assignee_id: string | null
  due_date: string | null
  created_at: string
}

export interface CreateProjectData {
  name: string
  description?: string
  deadline?: string
}

export interface CreateTaskData {
  project_id: string
  title: string
  description?: string
  status?: Task["status"]
  due_date?: string
}