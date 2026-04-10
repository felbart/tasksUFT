import { supabase } from "@/lib/supabase"
import type { Project, CreateProjectData } from "@/types"

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function createProject(payload: CreateProjectData): Promise<Project> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Usuário não autenticado")

  const { data, error } = await supabase
    .from("projects")
    .insert({ ...payload, owner_id: user.id })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase.from("projects").delete().eq("id", id)
  if (error) throw error
}