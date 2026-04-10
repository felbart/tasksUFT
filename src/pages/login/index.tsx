import { useState } from "react"
import { useNavigate } from "react-router"
import { useAuth } from "@/contexts/AuthContext"

export default function LoginPage() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mode, setMode] = useState<"login" | "register">("login")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault()
  setLoading(true)
  setError("")

  try {
    if (mode === "login") {
      await signIn(email, password)
    } else {
      await signUp(email, password)
    }
    navigate("/dashboard")
  } catch (err: unknown) {
    setError(err instanceof Error ? err.message : "Erro ao autenticar")
  } finally {
    setLoading(false)
  }
}

  return (
    <main className="flex flex-col gap-4 min-h-screen items-center justify-center">
      <h1 className="text-4xl font-bold">TasksUFT</h1>
      <span className="text-lg text-gray-600">Sistema de Gerenciamento de projetos e tarefas.</span>
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 border p-6 rounded"
      >
        <h1 className="text-xl font-semibold">
          {mode === "login" ? "Entrar" : "Criar conta"}
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <span className="text-red-500 text-sm">{error}</span>}

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white p-2 rounded"
        >
          {loading ? "Carregando..." : "Continuar"}
        </button>

        <button
          type="button"
          onClick={() =>
            setMode((prev) => (prev === "login" ? "register" : "login"))
          }
          className="text-sm underline"
        >
          {mode === "login"
            ? "Criar uma conta"
            : "Já tenho conta"}
        </button>
      </form>
      <p className="text-base text-gray-600 text-center absolute bottom-4">Desenvolvido como parte da avaliação da disciplina Projeto Integrador III-B <br />Curso de Análise e Desenvolvimento de Sistemas- EAD </p>
    </main>
  )
}