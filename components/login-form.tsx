"use client"
import React from "react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { AlertCircle } from "lucide-react"

// Iconos para OAuth (puedes usar lucide-react o crear SVGs personalizados)
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="currentColor"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="currentColor"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="currentColor"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
)

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Obtener errores de OAuth desde la URL
  React.useEffect(() => {
    const urlError = searchParams.get('error')
    if (urlError) {
      const errorMessages = {
        'oauth_failed': 'Error en la autenticación con Google',
        'google_auth_failed': 'Error en la autenticación con Google',
        'oauth_error': 'Error en el proceso de autenticación',
        'oauth_incomplete': 'Datos de autenticación incompletos',
        'user_data_incomplete': 'Información de usuario incompleta',
        'callback_processing_failed': 'Error al procesar la autenticación'
      }
      setError(errorMessages[urlError as keyof typeof errorMessages] || 'Error de autenticación')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    
    try {
      if (!username || !password) {
        throw new Error("Todos los campos son obligatorios")
      }

      const res = await fetch("http://localhost:3001/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: username, password }),
      })

      const json = await res.json()
      
      if (!res.ok) {
        throw new Error(json.message || "Error al iniciar sesión")
      }

      console.log("Respuesta completa del backend:", json)
      console.log("Datos recibidos:", json.data)

      const { token, usuario } = json.data
      const { rol, nombre, id, correo, provider, avatar } = usuario

      // Debug: mostrar cada campo individualmente
      console.log("Token:", token)
      console.log("Rol:", rol) 
      console.log("Nombre:", nombre)
      console.log("ID:", id)
      console.log("Correo:", correo)
      console.log("Provider:", provider)

      // Validar que los datos necesarios estén presentes
      const missingFields = []
      if (!token) missingFields.push("token")
      if (!rol) missingFields.push("rol") 
      if (!nombre) missingFields.push("nombre")
      if (!id) missingFields.push("id")
      if (!correo) missingFields.push("correo")

      if (missingFields.length > 0) {
        throw new Error(`Datos de usuario incompletos. Faltan: ${missingFields.join(", ")}`)
      }

      // Crear objeto de usuario con la estructura correcta
      const userData = {
        id: id.toString(),
        username: correo,
        name: nombre,
        role: rol as "docente" | "estudiante",
        email: correo,
        provider: provider || 'local',
        avatar: avatar || null
      }

      console.log("Datos del usuario a guardar:", userData)

      // Guardar en el contexto
      await login(userData, token)
      
      // Redireccionar al dashboard
      router.push("/dashboard")
      
    } catch (err) {
      console.error("Error en login:", err)
      setError(err instanceof Error ? err.message : "Error de autenticación")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    // Redireccionar a la ruta OAuth de Google
    window.location.href = "http://localhost:3001/api/usuarios/auth/google"
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Iniciar Sesión</CardTitle>
        <CardDescription>Ingresa con tus credenciales o usa Google</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Botón de Google OAuth */}
        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center gap-2"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <GoogleIcon />
          Continuar con Google
        </Button>
        
        {/* Separador */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              O continúa con email
            </span>
          </div>
        </div>

        {/* Formulario local */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Usuario/Email</Label>
            <Input
              id="username"
              type="email"
              placeholder="tu.email@universidad.edu"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </form>

        {/* Información adicional */}
        <div className="text-xs text-muted-foreground text-center">
          Al iniciar sesión, tu sesión anterior será cerrada automáticamente por seguridad.
        </div>
      </CardContent>
    </Card>
  )
}