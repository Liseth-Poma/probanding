"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function OAuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const [isProcessed, setIsProcessed] = useState(false)

  useEffect(() => {
    if (isProcessed) return

    const handleOAuthCallback = async () => {
      try {
        console.log('=== OAuth Callback Processing ===')
        const token = searchParams.get('token')
        const userString = searchParams.get('user')
        const error = searchParams.get('error')

        console.log('Token received:', token)
        console.log('User string received:', userString)
        console.log('Error received:', error)

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

        let userData
        try {
          userData = JSON.parse(decodeURIComponent(userString))
          console.log('Parsed user data:', userData)
        } catch (parseError) {
          console.error('Error parsing user data:', parseError)
          router.push('/?error=user_data_parse_failed')
          return
        }

        const requiredFields = ['id', 'correo', 'nombre', 'rol']
        const missingFields = requiredFields.filter(field => !userData[field])
        
        if (missingFields.length > 0) {
          console.error('Missing user fields:', missingFields)
          router.push('/?error=user_data_incomplete')
          return
        }

        const userForContext = {
          id: userData.id.toString(),
          username: userData.correo,
          name: userData.nombre,
          role: userData.rol as "docente" | "estudiante" | "admin",
          email: userData.correo,
          provider: userData.provider || 'google',
          avatar: userData.avatar
        }

        console.log('User for context:', userForContext)
        await login(userForContext, token)
        console.log('Token saved in localStorage:', localStorage.getItem("token"))
        console.log('User saved in localStorage:', localStorage.getItem("user"))
        
        try {
          await router.push("/dashboard")
          console.log("Redirected to /dashboard successfully")
        } catch (routerError) {
          console.error('Error redirecting to dashboard:', routerError)
          router.push('/?error=dashboard_redirect_failed')
        }
        
      } catch (error) {
        console.error('Error processing OAuth callback:', error)
        router.push('/?error=callback_processing_failed')
      } finally {
        setIsProcessed(true)
      }
    }

    handleOAuthCallback()
  }, [searchParams, login, router, isProcessed])

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