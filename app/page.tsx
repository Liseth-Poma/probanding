"use client"

import { LoginForm } from "@/components/login-form"
import useRedirectIfLoggedIn from "@/hooks/useRedirectIfLoggedIn"

export default function HomePage() {
  useRedirectIfLoggedIn()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Control de Prácticas</h1>
          <p className="text-gray-600">Sistema de Laboratorio Universitario</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
