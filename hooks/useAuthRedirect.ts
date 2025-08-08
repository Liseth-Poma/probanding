"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function useAuthRedirect() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/") // Redirige al login si no hay token
    } else {
      setLoading(false)
    }
  }, [])

  return loading
}
