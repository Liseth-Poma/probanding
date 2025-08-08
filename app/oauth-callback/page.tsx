"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function OAuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const token = searchParams.get('token')
        const userString = searchParams.get('user')
        const error = searchParams.get('error')

        if (error) {
          console.error('OAuth error:', error)
          router.push(`/?error=${error}`)
          return
        }

        if (!token || !userString) {
          console.error('Missing token or user data')
          router.push('/?error=oauth_incomplete')
          return
        }

        // Parsear datos del usuario
        const userData = JSON.parse(decodeURIComponent(userString))
        
        // Validar estructura de datos
        const requiredFields = ['id', 'correo', 'nombre', 'rol']
        const missingFields = requiredFields.filter(field => !userData[field])
        
        if (missingFields.length > 0) {
          console.error('Missing user fields:', missingFields)
          router.push('/?error=user_data_incomplete')
          return
        }

        // Crear objeto de usuario compatible con el contexto
        const userForContext = {
          id: userData.id.toString(),
          username: userData.correo,
          name: userData.nombre,
          role: userData.rol as "docente" | "estudiante",
          email: userData.correo,
          provider: userData.provider || 'google',
          avatar: userData.avatar
        }

        // Guardar en el contexto de autenticación
        await login(userForContext, token)
        
        // Redireccionar al dashboard
        router.push("/dashboard")
        
      } catch (error) {
        console.error('Error processing OAuth callback:', error)
        router.push('/?error=callback_processing_failed')
      }
    }

    handleOAuthCallback()
  }, [searchParams, login, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <h2 className="mt-4 text-lg font-medium text-gray-900">
            Procesando autenticación...
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Por favor espera mientras completamos tu inicio de sesión.
          </p>
        </div>
      </div>
    </div>
  )
}