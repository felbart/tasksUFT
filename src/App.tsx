import { signIn, signUp } from "./lib/auth"

async function testAuth() {
  const email = "teste@email.com"
  const password = "123456"

  const res = await signUp(email, password)
  console.log("SIGN UP:", res)

  const login = await signIn(email, password)
  console.log("LOGIN:", login)
}

testAuth()


function App() {
  
  return (
    <section className="h-screen bg-purple-50 flex items-center justify-center">
     <h1 className="text-6xl font-bold">Taks</h1>
      
    </section>
  )
}

export default App
