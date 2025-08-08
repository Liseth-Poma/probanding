import { Laboratorio, CreateLaboratorioData } from './types'

// Tipos para validación
export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

// Validar datos de laboratorio
export function validateLaboratorioData(data: CreateLaboratorioData): ValidationResult {
  const errors: string[] = []

  // Validar nombre
  if (!data.nombre || data.nombre.trim().length < 2) {
    errors.push('El nombre debe tener al menos 2 caracteres')
  }
  if (data.nombre && data.nombre.length > 100) {
    errors.push('El nombre no puede exceder 100 caracteres')
  }

  // Validar código
  if (!data.codigo || data.codigo.trim().length === 0) {
    errors.push('El código es requerido')
  }
  if (data.codigo && data.codigo.length > 20) {
    errors.push('El código no puede exceder 20 caracteres')
  }
  if (data.codigo && !/^[A-Z0-9_-]+$/i.test(data.codigo)) {
    errors.push('El código solo puede contener letras, números, guiones y guiones bajos')
  }

  // Validar ubicación
  if (!data.ubicacion || data.ubicacion.trim().length === 0) {
    errors.push('La ubicación es requerida')
  }
  if (data.ubicacion && data.ubicacion.length > 200) {
    errors.push('La ubicación no puede exceder 200 caracteres')
  }

  // Validar capacidad
  if (!data.capacidad_maxima || data.capacidad_maxima < 1) {
    errors.push('La capacidad mínima es 1 persona')
  }
  if (data.capacidad_maxima && data.capacidad_maxima > 100) {
    errors.push('La capacidad máxima es 100 personas')
  }

  // Validar tipo de laboratorio
  const tiposValidos = ['quimica', 'fisica', 'biologia', 'computacion', 'electronica']
  if (!data.tipo_laboratorio || !tiposValidos.includes(data.tipo_laboratorio)) {
    errors.push('El tipo de laboratorio debe ser uno de: ' + tiposValidos.join(', '))
  }

  // Validar equipos
  if (data.equipos_disponibles && data.equipos_disponibles.length > 50) {
    errors.push('No se pueden agregar más de 50 equipos')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Formatear laboratorio para mostrar
export function formatLaboratorioForDisplay(laboratorio: Laboratorio) {
  return {
    ...laboratorio,
    fechaCreacion: new Date(laboratorio.created_at).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    fechaActualizacion: new Date(laboratorio.updated_at).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    tipoFormateado: formatTipoLaboratorio(laboratorio.tipo_laboratorio),
    estadoFormateado: laboratorio.activo ? 'Activo' : 'Inactivo',
    capacidadFormateada: `${laboratorio.capacidad_maxima} ${laboratorio.capacidad_maxima === 1 ? 'persona' : 'personas'}`,
    equiposCount: laboratorio.equipos_disponibles?.length || 0
  }
}

// Formatear tipo de laboratorio
export function formatTipoLaboratorio(tipo: string): string {
  const tipos = {
    quimica: 'Química',
    fisica: 'Física',
    biologia: 'Biología',
    computacion: 'Computación',
    electronica: 'Electrónica'
  }
  return tipos[tipo as keyof typeof tipos] || tipo
}

// Obtener color para el estado del laboratorio
export function getLaboratorioStatusColor(activo: boolean): string {
  return activo 
    ? 'bg-green-100 text-green-800 border-green-300'
    : 'bg-red-100 text-red-800 border-red-300'
}

// Obtener color para el tipo de laboratorio
export function getTipoLaboratorioColor(tipo: string): string {
  const colors = {
    quimica: 'bg-blue-100 text-blue-800 border-blue-300',
    fisica: 'bg-green-100 text-green-800 border-green-300',
    biologia: 'bg-purple-100 text-purple-800 border-purple-300',
    computacion: 'bg-orange-100 text-orange-800 border-orange-300',
    electronica: 'bg-red-100 text-red-800 border-red-300'
  }
  return colors[tipo as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-300'
}

// Generar código único para laboratorio
export function generateLaboratorioCode(prefix: string = 'LAB'): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 3)
  return `${prefix}_${timestamp}_${random}`.toUpperCase()
}

// Filtrar laboratorios
export function filterLaboratorios(
  laboratorios: Laboratorio[],
  filters: {
    search?: string
    tipo?: string
    activo?: boolean | null
    capacidadMin?: number
    capacidadMax?: number
  }
): Laboratorio[] {
  return laboratorios.filter(laboratorio => {
    // Filtro de búsqueda
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const matches = [
        laboratorio.nombre.toLowerCase().includes(searchLower),
        laboratorio.codigo.toLowerCase().includes(searchLower),
        laboratorio.ubicacion.toLowerCase().includes(searchLower),
        laboratorio.observaciones?.toLowerCase().includes(searchLower)
      ]
      if (!matches.some(Boolean)) return false
    }

    // Filtro por tipo
    if (filters.tipo && filters.tipo !== 'all') {
      if (laboratorio.tipo_laboratorio !== filters.tipo) return false
    }

    // Filtro por estado
    if (filters.activo !== null && filters.activo !== undefined) {
      if (laboratorio.activo !== filters.activo) return false
    }

    // Filtro por capacidad mínima
    if (filters.capacidadMin !== undefined) {
      if (laboratorio.capacidad_maxima < filters.capacidadMin) return false
    }

    // Filtro por capacidad máxima
    if (filters.capacidadMax !== undefined) {
      if (laboratorio.capacidad_maxima > filters.capacidadMax) return false
    }

    return true
  })
}

// Ordenar laboratorios
export function sortLaboratorios(
  laboratorios: Laboratorio[],
  sortBy: 'nombre' | 'codigo' | 'tipo' | 'capacidad' | 'fecha' = 'nombre',
  sortOrder: 'asc' | 'desc' = 'asc'
): Laboratorio[] {
  return [...laboratorios].sort((a, b) => {
    let valueA: any
    let valueB: any

    switch (sortBy) {
      case 'nombre':
        valueA = a.nombre.toLowerCase()
        valueB = b.nombre.toLowerCase()
        break
      case 'codigo':
        valueA = a.codigo.toLowerCase()
        valueB = b.codigo.toLowerCase()
        break
      case 'tipo':
        valueA = a.tipo_laboratorio
        valueB = b.tipo_laboratorio
        break
      case 'capacidad':
        valueA = a.capacidad_maxima
        valueB = b.capacidad_maxima
        break
      case 'fecha':
        valueA = new Date(a.created_at).getTime()
        valueB = new Date(b.created_at).getTime()
        break
      default:
        valueA = a.nombre.toLowerCase()
        valueB = b.nombre.toLowerCase()
    }

    if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1
    if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1
    return 0
  })
}

// Calcular estadísticas de laboratorios
export function calculateLaboratoriosStats(laboratorios: Laboratorio[]) {
  const total = laboratorios.length
  const activos = laboratorios.filter(lab => lab.activo).length
  const inactivos = total - activos
  const capacidadTotal = laboratorios.reduce((sum, lab) => sum + lab.capacidad_maxima, 0)
  const capacidadPromedio = total > 0 ? Math.round(capacidadTotal / total) : 0

  // Estadísticas por tipo
  const porTipo = laboratorios.reduce((acc, lab) => {
    acc[lab.tipo_laboratorio] = (acc[lab.tipo_laboratorio] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Laboratorio con mayor capacidad
  const mayorCapacidad = laboratorios.reduce((max, lab) => 
    lab.capacidad_maxima > (max?.capacidad_maxima || 0) ? lab : max
  , laboratorios[0])

  return {
    total,
    activos,
    inactivos,
    capacidadTotal,
    capacidadPromedio,
    porTipo,
    mayorCapacidad,
    porcentajeActivos: total > 0 ? Math.round((activos / total) * 100) : 0
  }
}

// Validar horario disponible
export function validateHorarioDisponible(horario: Record<string, any>): ValidationResult {
  const errors: string[] = []
  const diasValidos = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
  const formatoHora = /^([01]?[0-9]|2[0-3]):[0-5][0-9]-([01]?[0-9]|2[0-3]):[0-5][0-9]$/

  for (const [dia, horarioString] of Object.entries(horario)) {
    if (!diasValidos.includes(dia.toLowerCase())) {
      errors.push(`Día inválido: ${dia}`)
      continue
    }

    if (typeof horarioString === 'string' && horarioString.trim() !== '') {
      if (!formatoHora.test(horarioString)) {
        errors.push(`Formato de horario inválido para ${dia}. Use formato HH:MM-HH:MM`)
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Calcular utilización de laboratorio (placeholder para futuras funcionalidades)
export function calculateLaboratorioUtilization(laboratorio: Laboratorio): number {
  // Esta función podría calcular la utilización basada en reservas
  // Por ahora retorna un valor placeholder
  return Math.floor(Math.random() * 100)
}

// Exportar laboratorio a CSV
export function exportLaboratoriosToCSV(laboratorios: Laboratorio[]): string {
  const headers = [
    'ID',
    'Nombre',
    'Código',
    'Ubicación',
    'Capacidad Máxima',
    'Tipo',
    'Equipos Disponibles',
    'Estado',
    'Observaciones',
    'Fecha Creación'
  ]

  const rows = laboratorios.map(lab => [
    lab.id,
    lab.nombre,
    lab.codigo,
    lab.ubicacion,
    lab.capacidad_maxima.toString(),
    formatTipoLaboratorio(lab.tipo_laboratorio),
    lab.equipos_disponibles?.join('; ') || '',
    lab.activo ? 'Activo' : 'Inactivo',
    lab.observaciones || '',
    new Date(lab.created_at).toLocaleDateString('es-ES')
  ])

  return [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n')
}

// Buscar laboratorios disponibles por criterios
export function findAvailableLaboratorios(
  laboratorios: Laboratorio[],
  criteria: {
    tipo?: string
    capacidadMinima?: number
    equiposRequeridos?: string[]
    fechaHora?: Date
  }
): Laboratorio[] {
  return laboratorios.filter(lab => {
    // Solo laboratorios activos
    if (!lab.activo) return false

    // Filtro por tipo
    if (criteria.tipo && lab.tipo_laboratorio !== criteria.tipo) return false

    // Filtro por capacidad
    if (criteria.capacidadMinima && lab.capacidad_maxima < criteria.capacidadMinima) return false

    // Filtro por equipos requeridos
    if (criteria.equiposRequeridos && criteria.equiposRequeridos.length > 0) {
      const equiposLab: (string | { nombre?: string })[] = lab.equipos_disponibles || []
      const tieneEquipos = criteria.equiposRequeridos.every(equipo =>
        equiposLab.some(equipoLab => 
          (typeof equipoLab === 'string'
            ? equipoLab.toLowerCase()
            : (equipoLab.nombre?.toLowerCase?.() || '')
          ).includes(equipo.toLowerCase())
        )
      )
      if (!tieneEquipos) return false
    }

    // TODO: Implementar filtro por disponibilidad de fecha/hora
    // Esto requeriría integración con un sistema de reservas

    return true
  })
}