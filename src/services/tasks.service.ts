import { supabase } from "@/lib/supabase"
import type { Task, CreateTaskData } from "@/types"

export async function getTasksByProject(projectId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true })

  if (error) throw error
  return data
}

export async function createTask(payload: CreateTaskData): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .insert(payload)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateTaskStatus(id: string, status: Task["status"]): Promise<void> {
  const { error } = await supabase.from("tasks").update({ status }).eq("id", id)
  if (error) throw error
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase.from("tasks").delete().eq("id", id)
  if (error) throw error
}