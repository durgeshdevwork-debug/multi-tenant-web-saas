import { useEffect, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { Loader2, KeyRound } from "lucide-react"

import { resetPassword } from "@/lib/auth"
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

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token") ?? ""

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!token) {
      setError("This reset link is missing a token. Please request a new one.")
    }
  }, [token])

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")

    if (!token) {
      setError("This reset link is invalid or expired.")
      return
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)

    try {
      const response = await resetPassword({
        newPassword,
        token,
      })

      if (response?.error) {
        setError(response.error.message ?? "Unable to reset password.")
        return
      }

      setSuccess(true)
      setTimeout(() => {
        navigate("/login", { replace: true })
      }, 1200)
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Unable to reset password."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_28%),linear-gradient(180deg,_#0f172a_0%,_#020617_100%)] p-6">
      <Card className="w-full max-w-md border-white/10 bg-slate-950/80 text-slate-100 shadow-2xl backdrop-blur">
        <CardHeader className="space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/30 bg-blue-500/10 text-blue-300">
            <KeyRound className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Set a new password
          </CardTitle>
          <CardDescription className="text-slate-400">
            Use the link from your email to finish updating your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="reset-form" className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
                disabled={loading || success}
                className="border-white/10 bg-white/5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                disabled={loading || success}
                className="border-white/10 bg-white/5"
              />
            </div>

            {error ? (
              <Alert
                variant="destructive"
                className="border-red-500/30 bg-red-500/10 text-red-100"
              >
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            {success ? (
              <Alert className="border-emerald-500/30 bg-emerald-500/10 text-emerald-100">
                <AlertDescription>
                  Password updated successfully. Redirecting to login...
                </AlertDescription>
              </Alert>
            ) : null}
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button
            form="reset-form"
            type="submit"
            className="w-full"
            disabled={loading || success || !token}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Updating..." : "Update password"}
          </Button>

          <p className="text-center text-sm text-slate-400">
            Back to{" "}
            <Link
              to="/login"
              className="font-medium text-blue-300 hover:text-blue-200"
            >
              login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
