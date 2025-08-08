'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Plus, Search, Edit, Trash2 } from 'lucide-react'
import { LaboratorioForm } from './laboratorio-form'

interface Equipo {
  nombre: string
  cantidad: number
}

interface Laboratorio {
  id: string
  nombre: string
  codigo: string
  ubicacion: string
  capacidad_maxima: number
  tipo_laboratorio: 'quimica' | 'fisica' | 'biologia' | 'computacion' | 'electronica'
  equipos_disponibles: Equipo[]
  horario_disponible: Record<string, any>
  activo: boolean
  observaciones?: string
  created_at: string
  updated_at: string
}

interface CreateLaboratorioData {
  nombre: string
  codigo: string
  ubicacion: string
  capacidad_maxima: number
  tipo_laboratorio: 'quimica' | 'fisica' | 'biologia' | 'computacion' | 'electronica'
  equipos_disponibles: Equipo[]
  horario_disponible: Record<string, any>
  activo: boolean
  observaciones?: string
}

interface UpdateLaboratorioData extends Partial<CreateLaboratorioData> {
  id: string
}

const tiposLaboratorio = [
  { value: 'quimica', label: 'Química' },
  { value: 'fisica', label: 'Física' },
  { value: 'biologia', label: 'Biología' },
  { value: 'computacion', label: 'Computación' },
  { value: 'electronica', label: 'Electrónica' }
]

export default function LaboratorioCRUD() {
  const [laboratorios, setLaboratorios] = useState<Laboratorio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTipo, setFilterTipo] = useState('all')
  const [filterEstado, setFilterEstado] = useState('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingLaboratorio, setEditingLaboratorio] = useState<Laboratorio | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [laboratorioToDelete, setLaboratorioToDelete] = useState<Laboratorio | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Helper para normalizar equipos
  const normalizeEquipos = (equipos: any[]): Equipo[] => {
    if (!Array.isArray(equipos)) return []
    
    return equipos.map(equipo => {
      if (typeof equipo === 'string') {
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

  const fetchLaboratorios = async () => {
    try {
      setLoading(true)
      const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'
      const response = await fetch(`${API_BASE_URL}/api/laboratorios`)
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.success && Array.isArray(result.data)) {
        // Normalizar equipos al cargar los datos
        const laboratoriosNormalizados = result.data.map((lab: any) => ({
          ...lab,
          equipos_disponibles: normalizeEquipos(lab.equipos_disponibles || [])
        }))
        setLaboratorios(laboratoriosNormalizados)
      } else {
        setLaboratorios([])
      }
    } catch (error) {
      console.error('Error al obtener laboratorios:', error)
      setError('Error al cargar los laboratorios')
      setLaboratorios([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLaboratorios()
  }, [])

  const getLaboratoriosArray = () => Array.isArray(laboratorios) ? laboratorios : []

  const filteredLaboratorios = useMemo(() => {
    const labs = getLaboratoriosArray()
    return labs.filter(lab => {
      const matchesSearch = !searchTerm ||
        lab.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lab.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lab.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesTipo = filterTipo === 'all' || lab.tipo_laboratorio === filterTipo
      const matchesEstado = filterEstado === 'all' ||
        (filterEstado === 'activo' && lab.activo) ||
        (filterEstado === 'inactivo' && !lab.activo)
      return matchesSearch && matchesTipo && matchesEstado
    })
  }, [laboratorios, searchTerm, filterTipo, filterEstado])

  const handleSubmitForm = async (data: CreateLaboratorioData | UpdateLaboratorioData) => {
    try {
      setIsSubmitting(true)
      setError(null)
      
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'
      
      let response: Response
      
      if ('id' in data) {
        // Actualizar laboratorio existente
        response = await fetch(`${BACKEND_URL}/api/laboratorios/${data.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
      } else {
        // Crear nuevo laboratorio
        response = await fetch(`${BACKEND_URL}/api/laboratorios`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Error HTTP: ${response.status}`)
      }
      
      // Recargar la lista de laboratorios
      await fetchLaboratorios()
      
      // Cerrar el formulario
      setIsFormOpen(false)
      setEditingLaboratorio(null)
      
    } catch (error) {
      console.error('Error al guardar laboratorio:', error)
      setError(error instanceof Error ? error.message : 'Error desconocido al guardar')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (lab: Laboratorio) => {
    setEditingLaboratorio(lab)
    setIsFormOpen(true)
  }

  const handleDelete = (lab: Laboratorio) => {
    setLaboratorioToDelete(lab)
    setDeleteDialogOpen(true)
  }

  const handleNewLaboratorio = () => {
    setEditingLaboratorio(null)
    setIsFormOpen(true)
  }

  const handleCancelForm = () => {
    setIsFormOpen(false)
    setEditingLaboratorio(null)
  }

  const confirmDelete = async () => {
    if (!laboratorioToDelete) return
    
    try {
      setError(null)
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'
      const response = await fetch(`${BACKEND_URL}/api/laboratorios/${laboratorioToDelete.id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Error al eliminar laboratorio')
      }
      
      await fetchLaboratorios()
      setDeleteDialogOpen(false)
      setLaboratorioToDelete(null)
    } catch (error) {
      console.error('Error al eliminar:', error)
      setError('Error al eliminar laboratorio')
    }
  }

  const renderEstadisticas = () => {
    const labs = getLaboratoriosArray()
    const activosCount = labs.filter(l => l.activo).length
    const inactivosCount = labs.filter(l => !l.activo).length
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{labs.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{activosCount}</div>
            <div className="text-sm text-gray-600">Activos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{inactivosCount}</div>
            <div className="text-sm text-gray-600">Inactivos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{filteredLaboratorios.length}</div>
            <div className="text-sm text-gray-600">Filtrados</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const LaboratorioCard = ({ laboratorio, onEdit, onDelete }: {
    laboratorio: Laboratorio
    onEdit: (lab: Laboratorio) => void
    onDelete: (lab: Laboratorio) => void
  }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{laboratorio.nombre}</CardTitle>
            <p className="text-sm text-gray-600">{laboratorio.codigo}</p>
          </div>
          <Badge variant={laboratorio.activo ? 'default' : 'secondary'}>
            {laboratorio.activo ? 'Activo' : 'Inactivo'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm"><strong>Ubicación:</strong> {laboratorio.ubicacion}</p>
          <p className="text-sm"><strong>Capacidad:</strong> {laboratorio.capacidad_maxima}</p>
          <p className="text-sm"><strong>Tipo:</strong> {tiposLaboratorio.find(t => t.value === laboratorio.tipo_laboratorio)?.label}</p>
          
          {laboratorio.equipos_disponibles && laboratorio.equipos_disponibles.length > 0 && (
            <div className="text-sm">
              <strong>Equipos:</strong>
              <div className="flex flex-wrap gap-1 mt-1">
                {laboratorio.equipos_disponibles.map((equipo, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {equipo.nombre} ({equipo.cantidad})
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {laboratorio.observaciones && (
            <p className="text-sm"><strong>Obs:</strong> {laboratorio.observaciones}</p>
          )}
        </div>
        <div className="flex gap-2 mt-4">
          <Button size="sm" variant="outline" onClick={() => onEdit(laboratorio)}>
            <Edit className="w-4 h-4 mr-1" />Editar
          </Button>
          <Button size="sm" variant="outline" onClick={() => onDelete(laboratorio)}>
            <Trash2 className="w-4 h-4 mr-1" />Eliminar
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return <div className="p-6 text-center">Cargando laboratorios...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Laboratorios</h1>
        <Button onClick={handleNewLaboratorio}>
          <Plus className="w-4 h-4 mr-2" />Nuevo
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  id="search" 
                  placeholder="Buscar por nombre..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="pl-10" 
                />
              </div>
            </div>
            <div>
              <Label htmlFor="tipo">Tipo</Label>
              <Select value={filterTipo} onValueChange={setFilterTipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {tiposLaboratorio.map(tipo => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="estado">Estado</Label>
              <Select value={filterEstado} onValueChange={setFilterEstado}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="activo">Activos</SelectItem>
                  <SelectItem value="inactivo">Inactivos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {renderEstadisticas()}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredLaboratorios.map(lab => (
          <LaboratorioCard 
            key={lab.id} 
            laboratorio={lab} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        ))}
      </div>

      {/* Formulario Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingLaboratorio ? 'Editar Laboratorio' : 'Crear Nuevo Laboratorio'}
            </DialogTitle>
          </DialogHeader>
          <LaboratorioForm
            laboratorio={editingLaboratorio}
            onSubmit={handleSubmitForm}
            onCancel={handleCancelForm}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación para eliminar */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de eliminar este laboratorio?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el laboratorio "{laboratorioToDelete?.nombre}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}