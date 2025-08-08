"use client"
import React, { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  username: string
  name: string
  role: "docente" | "estudiante" | "admin"
  email: string
  provider?: string
  avatar?: string | null
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (userData: User, token: string) => Promise<void>
  logout: () => void
  loading: boolean
  isOAuthUser: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const isOAuthUser = !!(user?.provider && user.provider !== 'local')

  useEffect(() => {
    // Función para verificar y validar el token guardado
    const initializeAuth = async () => {
      try {
        const savedToken = localStorage.getItem("token")
        const savedUser = localStorage.getItem("user")
        
        if (savedToken && savedUser) {
          // Verificar que el token sea válido haciendo una petición al backend
          const response = await fetch("http://localhost:3001/api/usuarios/verify", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${savedToken}`,
              "Content-Type": "application/json"
            }
          })
          
          if (response.ok) {
            // Token válido, restaurar sesión
            const result = await response.json()
            const parsedUser = JSON.parse(savedUser)
            
            // Actualizar datos del usuario si el backend devuelve datos más recientes
            if (result.data?.usuario) {
              const updatedUser = {
                ...parsedUser,
                ...result.data.usuario,
                // Mantener campos que podrían no estar en la respuesta del backend
                username: result.data.usuario.correo || parsedUser.username,
                name: result.data.usuario.nombre || parsedUser.name,
                role: result.data.usuario.rol || parsedUser.role,
                email: result.data.usuario.correo || parsedUser.email
              }
              setUser(updatedUser)
              localStorage.setItem("user", JSON.stringify(updatedUser))
            } else {
              setUser(parsedUser)
            }
            
            setToken(savedToken)
          } else {
            // Token inválido, limpiar datos
            console.warn("Token inválido, cerrando sesión")
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            
            // Si el error indica que hay otra sesión activa, mostrar mensaje
            if (response.status === 401) {
              const errorData = await response.json().catch(() => ({}))
              if (errorData.code === "TOKEN_INVALID") {
                console.info("Sesión cerrada: se detectó una nueva sesión en otro dispositivo")
              }
            }
          }
        }
      } catch (error) {
        console.error("Error al verificar autenticación:", error)
        // En caso de error de red o servidor, mantener sesión local temporalmente
        // pero marcar para revalidación posterior
        const savedToken = localStorage.getItem("token")
        const savedUser = localStorage.getItem("user")
        
        if (savedToken && savedUser) {
          console.warn("Error de conectividad. Manteniendo sesión local temporalmente.")
          try {
            const parsedUser = JSON.parse(savedUser)
            setUser(parsedUser)
            setToken(savedToken)
          } catch (parseError) {
            console.error("Error al parsear usuario guardado:", parseError)
            localStorage.removeItem("token")
            localStorage.removeItem("user")
          }
        }
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (userData: User, token: string) => {
    // Validar datos de entrada
    const requiredFields = ['id', 'username', 'name', 'role', 'email'] as const
    const missingFields = requiredFields.filter(field => !(userData as any)[field])
    
    if (missingFields.length > 0) {
      throw new Error(`Datos de usuario inválidos. Faltan: ${missingFields.join(", ")}`)
    }

    console.log("Guardando usuario en contexto:", userData)
    
    setUser(userData)
    setToken(token)
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("token", token)
  }

  const logout = async () => {
    try {
      // Intentar notificar al servidor del logout si hay token
      if (token) {
        await fetch("http://localhost:3001/api/usuarios/logout", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }).catch(error => {
          console.warn("No se pudo notificar logout al servidor:", error)
        })
      }
    } finally {
      // Limpiar estado local siempre, independientemente del resultado del servidor
      setUser(null)
      setToken(null)
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      
      // Redireccionar al login
      window.location.href = "/"
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      loading, 
      isOAuthUser 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}