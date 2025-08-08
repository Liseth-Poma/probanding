import React, { useState, useEffect } from 'react'
import { Button } from './button'
import { Input } from './input'
import { Textarea } from './textarea'
import { Label } from './label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { Badge } from './badge'
import { Plus, X } from 'lucide-react'
import { Laboratorio, CreateLaboratorioData, UpdateLaboratorioData } from '../../lib/types'

interface LaboratorioFormProps {
  laboratorio?: Laboratorio | null
  onSubmit: (data: CreateLaboratorioData | UpdateLaboratorioData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

// Interfaz para equipos
interface Equipo {
  nombre: string
  cantidad: number
}

// Estado inicial del formulario
const initialFormData: CreateLaboratorioData = {
  nombre: '',
  codigo: '',
  ubicacion: '',
  capacidad_maxima: 1,
  tipo_laboratorio: 'computacion',
  equipos_disponibles: [],
  horario_disponible: {},
  activo: true,
  observaciones: ''
}

export function LaboratorioForm({ laboratorio, onSubmit, onCancel, isLoading }: LaboratorioFormProps) {
  const [formData, setFormData] = useState<CreateLaboratorioData>(initialFormData)
  const [newEquipo, setNewEquipo] = useState({ nombre: '', cantidad: 1 })

  // Helper para normalizar equipos
  const normalizeEquipos = (equipos: any[]): Equipo[] => {
    if (!Array.isArray(equipos)) return []
    
    return equipos.map(equipo => {
      if (typeof equipo === 'string') {
        // Si es string, intentar parsear si tiene formato "nombre (cantidad)"
        const match = equipo.match(/^(.+?)\s*\((\d+)\)$/)
        if (match) {
          return {
            nombre: match[1].trim(),
            cantidad: parseInt(match[2]) || 1
          }
        }
        return {
          nombre: equipo,
          cantidad: 1
        }
      } else if (typeof equipo === 'object' && equipo.nombre) {
        return {
          nombre: equipo.nombre,
          cantidad: equipo.cantidad || 1
        }
      }
      return {
        nombre: String(equipo),
        cantidad: 1
      }
    })
  }

  // Cargar datos del laboratorio si está editando
  useEffect(() => {
    if (laboratorio) {
      const equiposNormalizados = normalizeEquipos(laboratorio.equipos_disponibles)
      setFormData({
        nombre: laboratorio.nombre,
        codigo: laboratorio.codigo,
        ubicacion: laboratorio.ubicacion,
        capacidad_maxima: laboratorio.capacidad_maxima,
        tipo_laboratorio: laboratorio.tipo_laboratorio,
        equipos_disponibles: equiposNormalizados,
        horario_disponible: laboratorio.horario_disponible || {},
        activo: laboratorio.activo,
        observaciones: laboratorio.observaciones || ''
      })
    } else {
      setFormData(initialFormData)
    }
  }, [laboratorio])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (laboratorio) {
        // Actualizar laboratorio existente
        await onSubmit({ ...formData, id: laboratorio.id } as UpdateLaboratorioData)
      } else {
        // Crear nuevo laboratorio
        await onSubmit(formData)
      }
    } catch (error) {
      console.error('Error al enviar formulario:', error)
    }
  }

  const addEquipo = () => {
    if (newEquipo.nombre.trim()) {
      const equiposActuales = Array.isArray(formData.equipos_disponibles) 
        ? formData.equipos_disponibles as Equipo[]
        : []
      
      // Verificar si el equipo ya existe
      const existeEquipo = equiposActuales.some(e => 
        e.nombre.toLowerCase() === newEquipo.nombre.toLowerCase()
      )
      
      if (!existeEquipo) {
        setFormData(prev => ({
          ...prev,
          equipos_disponibles: [...equiposActuales, { ...newEquipo }]
        }))
        setNewEquipo({ nombre: '', cantidad: 1 })
      }
    }
  }

  const removeEquipo = (equipoAEliminar: Equipo) => {
    const equiposActuales = Array.isArray(formData.equipos_disponibles) 
      ? formData.equipos_disponibles as Equipo[]
      : []
    
    setFormData(prev => ({
      ...prev,
      equipos_disponibles: equiposActuales.filter(e => 
        e.nombre !== equipoAEliminar.nombre || e.cantidad !== equipoAEliminar.cantidad
      )
    }))
  }

  const updateEquipoCantidad = (index: number, cantidad: number) => {
    const equiposActuales = Array.isArray(formData.equipos_disponibles) 
      ? formData.equipos_disponibles as Equipo[]
      : []
    
    const nuevosEquipos = [...equiposActuales]
    nuevosEquipos[index].cantidad = cantidad
    
    setFormData(prev => ({
      ...prev,
      equipos_disponibles: nuevosEquipos
    }))
  }

  // Asegurar que equipos_disponibles sea un array de objetos Equipo
  const equiposDisponibles = Array.isArray(formData.equipos_disponibles) 
    ? formData.equipos_disponibles as Equipo[]
    : []

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">
        {laboratorio ? 'Editar Laboratorio' : 'Crear Nuevo Laboratorio'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre del Laboratorio</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="codigo">Código</Label>
            <Input
              id="codigo"
              value={formData.codigo}
              onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
              required
              placeholder="Ej: LAB001"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="capacidad_maxima">Capacidad Máxima</Label>
            <Input
              id="capacidad_maxima"
              type="number"
              min="1"
              max="100"
              value={formData.capacidad_maxima}
              onChange={(e) => setFormData(prev => ({ ...prev, capacidad_maxima: parseInt(e.target.value) || 1 }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tipo_laboratorio">Tipo de Laboratorio</Label>
            <Select 
              value={formData.tipo_laboratorio} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, tipo_laboratorio: value as any }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quimica">Química</SelectItem>
                <SelectItem value="fisica">Física</SelectItem>
                <SelectItem value="biologia">Biología</SelectItem>
                <SelectItem value="computacion">Computación</SelectItem>
                <SelectItem value="electronica">Electrónica</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ubicacion">Ubicación</Label>
          <Input
            id="ubicacion"
            value={formData.ubicacion}
            onChange={(e) => setFormData(prev => ({ ...prev, ubicacion: e.target.value }))}
            required
            placeholder="Ej: Edificio A, Piso 2, Aula 201"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="observaciones">Observaciones</Label>
          <Textarea
            id="observaciones"
            rows={3}
            value={formData.observaciones}
            onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
            placeholder="Observaciones adicionales..."
          />
        </div>

        <div className="space-y-2">
          <Label>Equipos Disponibles</Label>
          <div className="grid grid-cols-3 gap-2">
            <Input
              value={newEquipo.nombre}
              onChange={(e) => setNewEquipo(prev => ({ ...prev, nombre: e.target.value }))}
              placeholder="Nombre del equipo"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEquipo())}
            />
            <Input
              type="number"
              min="1"
              value={newEquipo.cantidad}
              onChange={(e) => setNewEquipo(prev => ({ ...prev, cantidad: parseInt(e.target.value) || 1 }))}
              placeholder="Cantidad"
            />
            <Button type="button" onClick={addEquipo} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2 mt-2">
            {equiposDisponibles.map((equipo, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <span className="flex-1">{equipo.nombre}</span>
                <Input
                  type="number"
                  min="1"
                  value={equipo.cantidad}
                  onChange={(e) => updateEquipoCantidad(index, parseInt(e.target.value) || 1)}
                  className="w-20"
                />
                <X 
                  className="h-4 w-4 cursor-pointer hover:text-red-500" 
                  onClick={() => removeEquipo(equipo)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="activo"
            checked={formData.activo}
            onChange={(e) => setFormData(prev => ({ ...prev, activo: e.target.checked }))}
          />
          <Label htmlFor="activo">Laboratorio activo</Label>
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Guardando...' : (laboratorio ? 'Actualizar' : 'Crear')}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}