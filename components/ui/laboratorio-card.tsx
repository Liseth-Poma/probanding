import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Badge } from './badge'
import { Button } from './button'
import { Edit, Trash2, MapPin, Users, Monitor, Calendar, AlertCircle } from 'lucide-react'
import { Laboratorio } from '../../lib/types'
import { validateLaboratorioData, formatLaboratorioForDisplay } from '@/lib/laboratorio-utils'

interface LaboratorioCardProps {
  laboratorio: Laboratorio
  onEdit: (laboratorio: Laboratorio) => void
  onDelete: (id: string) => void
}

export function LaboratorioCard({ laboratorio, onEdit, onDelete }: LaboratorioCardProps) {
  const getTipoColor = (tipo: string) => {
    const colors = {
      quimica: 'bg-blue-100 text-blue-800',
      fisica: 'bg-green-100 text-green-800',
      biologia: 'bg-purple-100 text-purple-800',
      computacion: 'bg-orange-100 text-orange-800',
      electronica: 'bg-red-100 text-red-800'
    }
    return colors[tipo as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const formatTipo = (tipo: string) => {
    const tipos = {
      quimica: 'Química',
      fisica: 'Física',
      biologia: 'Biología',
      computacion: 'Computación',
      electronica: 'Electrónica'
    }
    return tipos[tipo as keyof typeof tipos] || tipo
  }

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <Card className={`hover:shadow-lg transition-shadow duration-200 ${!laboratorio.activo ? 'opacity-75' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
              {laboratorio.nombre}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {laboratorio.codigo}
              </Badge>
              <Badge className={`text-xs ${getTipoColor(laboratorio.tipo_laboratorio)}`}>
                {formatTipo(laboratorio.tipo_laboratorio)}
              </Badge>
            </div>
          </div>
          <Badge 
            variant={laboratorio.activo ? "default" : "destructive"}
            className="ml-2"
          >
            {laboratorio.activo ? 'Activo' : 'Inactivo'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Ubicación */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{laboratorio.ubicacion}</span>
          </div>

          {/* Capacidad */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>Capacidad: {laboratorio.capacidad_maxima} personas</span>
          </div>

          {/* Equipos disponibles */}
          {laboratorio.equipos_disponibles && laboratorio.equipos_disponibles.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Monitor className="h-4 w-4" />
                <span>Equipos disponibles ({laboratorio.equipos_disponibles.length})</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {laboratorio.equipos_disponibles.slice(0, 3).map((equipo, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {typeof equipo === 'string' ? equipo : equipo.nombre ?? JSON.stringify(equipo)}
                  </Badge>
                ))}
                {laboratorio.equipos_disponibles.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{laboratorio.equipos_disponibles.length - 3} más
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Observaciones */}
          {laboratorio.observaciones && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <AlertCircle className="h-4 w-4" />
                <span>Observaciones</span>
              </div>
              <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded-md">
                {laboratorio.observaciones.length > 100 
                  ? `${laboratorio.observaciones.substring(0, 100)}...`
                  : laboratorio.observaciones
                }
              </p>
            </div>
          )}

          {/* Fecha de creación */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            <span>Creado: {formatFecha(laboratorio.created_at)}</span>
          </div>

          {/* Horario disponible (si existe) */}
          {laboratorio.horario_disponible && Object.keys(laboratorio.horario_disponible).length > 0 && (
            <div className="text-xs text-gray-500">
              <span>Horario configurado disponible</span>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(laboratorio)}
            className="flex-1 flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(laboratorio.id)}
            className="flex-1 flex items-center gap-2 text-red-600 hover:text-red-900 hover:border-red-300"
          >
            <Trash2 className="h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}