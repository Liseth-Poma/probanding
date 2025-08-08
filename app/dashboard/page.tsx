"use client"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { DocenteDashboard } from "@/components/docente-dashboard"
import { EstudianteDashboard } from "@/components/estudiante-dashboard"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log("Dashboard: user:", user)
    console.log("Dashboard: loading:", loading)
    if (!loading && !user) {
      console.warn("No user found, redirecting to login")
      router.push("/?error=no_user")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  console.log("Usuario en dashboard:", user)
  console.log("Tipo de rol:", typeof user.role)
  console.log("Rol del usuario:", user.role)

  return (
    <div className="min-h-screen bg-gray-50">
      {user.role === "docente" ? (
        <DocenteDashboard user={{ ...user, role: "docente" }} />
      ) : (
        <EstudianteDashboard user={{ ...user, id: Number(user.id), role: "estudiante" }} />
      )}
    </div>
  )
}