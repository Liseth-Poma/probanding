// hooks/useBitacoras.ts
import { useEffect, useState } from "react"

export interface Bitacora {
  id: string
  titulo_laboratorio: string
  tema: string
  fecha_bitacora: string
  estado: "borrador" | "en_sesion" | "completada" | "firmada" | "bloqueada"
}

export function useBitacoras(profesorId: string) {
  const [bitacoras, setBitacoras] = useState<Bitacora[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBitacoras = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/bitacoras/profesor/${profesorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!res.ok) throw new Error("Error al cargar bitácoras")

        const data = await res.json()
        setBitacoras(data)
      } catch (err) {
        console.error("Error en fetchBitacoras:", err)
      } finally {
        setLoading(false)
      }
    }

    if (profesorId) fetchBitacoras()
  }, [profesorId])

  return { bitacoras, loading }
}
