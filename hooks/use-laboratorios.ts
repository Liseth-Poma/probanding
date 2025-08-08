"use client"

import { useState, useEffect } from 'react'
import type { Laboratorio } from '@/lib/types'
import { laboratorioService } from '@/lib/laboratorio-service'

export function useLaboratorios() {
  const [laboratorios, setLaboratorios] = useState<Laboratorio[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadLaboratorios = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await laboratorioService.getAll()
      
      // Asegurar que siempre sea un array
      if (Array.isArray(data)) {
        setLaboratorios(data)
      } else {
        console.warn('La respuesta no es un array:', data)
        setLaboratorios([])
      }
    } catch (err) {
      setError('Error al cargar los laboratorios')
      setLaboratorios([]) // Asegurar que sea un array vacío en caso de error
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadLaboratorios()
  }, [])

  return {
    laboratorios,
    isLoading,
    error,
    refresh: loadLaboratorios
  }
}

export function useLaboratoriosActivos() {
  const [laboratorios, setLaboratorios] = useState<Laboratorio[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadLaboratoriosActivos = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await laboratorioService.getByEstado('activo')
        
        // Asegurar que siempre sea un array
        if (Array.isArray(data)) {
          setLaboratorios(data)
        } else {
          console.warn('La respuesta no es un array:', data)
          setLaboratorios([])
        }
      } catch (err) {
        setError('Error al cargar los laboratorios')
        setLaboratorios([]) // Asegurar que sea un array vacío en caso de error
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadLaboratoriosActivos()
  }, [])

  return {
    laboratorios,
    isLoading,
    error
  }
}