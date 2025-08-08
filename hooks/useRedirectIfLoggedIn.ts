"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function useRedirectIfLoggedIn() {
  const router = useRouter()
  const { token, loading } = useAuth()

  useEffect(() => {
    if (!loading && token) {
      router.push("/dashboard")
    }
  }, [loading, token, router])
}
