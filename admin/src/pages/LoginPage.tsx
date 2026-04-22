import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { signInEmail, signInAdminEmail, signOut, useSession } from "@/lib/auth"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

type SessionUser = {
  role?: "admin" | "user"
}

export function LoginPage({ mode }: { mode: "admin" | "user" }) {
  const navigate = useNavigate()
  const { data: session, isPending } = useSession()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const user = session?.user as SessionUser | undefined
    if (!isPending && user) {
      if (user.role === "admin") {
        navigate("/admin", { replace: true })
      } else {
        navigate("/", { replace: true })
      }
    }
  }, [isPending, navigate, session])

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setLoading(true)

    try {
      const loginFn = mode === "admin" ? signInAdminEmail : signInEmail
      const response = await loginFn({ email, password, rememberMe: true })
      console.log("check resp : ", response)
      if (response?.error) {
        setError(response.error.message ?? "Login failed.")
        return
      }

      const user = response?.data?.user as SessionUser | undefined
      if (!user) {
        setError("Login failed. Please check your credentials.")
        return
      }

      if (mode === "admin" && user.role !== "admin") {
        await signOut()
        setError("This account is not an admin. Please use the user login.")
        return
      }

      if (mode === "user" && user.role === "admin") {
        await signOut()
        setError("Admin accounts should use the admin login.")
        return
      }

      navigate(mode === "admin" ? "/admin" : "/", { replace: true })
    } catch (err: any) {
      setError(err?.message ?? "Login failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold tracking-tight">
            {mode === "admin" ? "Admin Login" : "User Login"}
          </CardTitle>
          <CardDescription>
            Sign in to continue managing your site
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="login-form" className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                disabled={loading}
              />
            </div>

            {error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}
          </form>
        </CardContent>
        <CardFooter>
          <div className="w-full space-y-3">
            <Button
              form="login-form"
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Signing in..." : "Sign in"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Got a reset link from email?{" "}
              <Link
                to="/reset-password"
                className="font-medium text-primary hover:underline"
              >
                set your password
              </Link>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
