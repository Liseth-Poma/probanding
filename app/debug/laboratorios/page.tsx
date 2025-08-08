'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { laboratorioService } from '@/lib/laboratorio-service'
import { Laboratorio, CreateLaboratorioData, Equipo } from '@/lib/types'
import { 
  validateLaboratorioData, 
  formatLaboratorioForDisplay, 
  getLaboratorioStatusColor,
  generateLaboratorioCode,
  calculateLaboratorioUtilization
} from '@/lib/laboratorio-utils'

export default function DebugLaboratoriosPage() {
  const [laboratorios, setLaboratorios] = useState<Laboratorio[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const fetchLaboratorios = async () => {
    try {
      setLoading(false)
      setError(null)
      
      console.log('🔍 Fetching laboratorios...')
      const data = await laboratorioService.getAll()
      console.log('✅ Laboratorios fetched:', data)
      
      setLaboratorios(data)
      setSuccess(`✅ ${data.length} laboratorios cargados exitosamente`)
    } catch (err: any) {
      console.error('❌ Error fetching laboratorios:', err)
      setError(`❌ Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testCreateLaboratorio = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const testData: CreateLaboratorioData = {
        nombre: 'Laboratorio de Prueba',
        codigo: generateLaboratorioCode('TEST'),
        ubicacion: 'Edificio Test, Piso 1',
        capacidad_maxima: 25,
        tipo_laboratorio: 'computacion',
        equipos_disponibles: ['computadora', 'proyector', 'pizarra_digital'] as unknown as Equipo[],
        horario_disponible: {
          lunes: '08:00-18:00',
          martes: '08:00-18:00',
          miercoles: '08:00-18:00',
          jueves: '08:00-18:00',
          viernes: '08:00-16:00'
        },
        activo: true,
        observaciones: 'Laboratorio creado para pruebas de debug'
      }

      console.log('🧪 Testing create laboratorio:', testData)
      
      // Validar datos antes de enviar
      const validation = validateLaboratorioData(testData)
      if (!validation.isValid) {
        throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`)
      }

      const result = await laboratorioService.create(testData as Omit<Laboratorio, 'id'>)
      console.log('✅ Laboratorio created:', result)
      
      setSuccess('✅ Laboratorio de prueba creado exitosamente')
      fetchLaboratorios() // Recargar lista
    } catch (err: any) {
      console.error('❌ Error creating test laboratorio:', err)
      setError(`❌ Error al crear laboratorio: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testApiConnection = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔌 Testing API connection...')
      
      // Probar conexión básica
      const response = await fetch('/api')
      const health = await response.json()
      
      console.log('🏥 API Health:', health)
      
      setDebugInfo({
        apiHealth: health,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        apiUrl: process.env.NEXT_PUBLIC_API_URL
      })
      
      setSuccess('✅ Conexión API probada exitosamente')
    } catch (err: any) {
      console.error('❌ API Connection failed:', err)
      setError(`❌ Error de conexión: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const clearMessages = () => {
    setError(null)
    setSuccess(null)
  }

  useEffect(() => {
    fetchLaboratorios()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">🐛 Debug - Laboratorios</h1>
        <div className="flex gap-2">
          <Button onClick={clearMessages} variant="outline" size="sm">
            Limpiar Mensajes
          </Button>
          <Button onClick={fetchLaboratorios} disabled={loading} size="sm">
            🔄 Recargar
          </Button>
        </div>
      </div>

      {/* Alertas */}
      {error && (
        <Alert className="border-red-500 bg-red-50">
          <AlertDescription className="text-red-700 font-mono text-sm">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-500 bg-green-50">
          <AlertDescription className="text-green-700 font-mono text-sm">
            {success}
          </AlertDescription>
        </Alert>
      )}

      {/* Controles de Debug */}
      <Card>
        <CardHeader>
          <CardTitle>🛠️ Herramientas de Debug</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={testApiConnection} 
              disabled={loading}
              variant="outline"
            >
              🔌 Test API Connection
            </Button>
            <Button 
              onClick={testCreateLaboratorio} 
              disabled={loading}
              variant="outline"
            >
              🧪 Crear Laboratorio de Prueba
            </Button>
            <Button 
              onClick={() => console.log('Laboratorios State:', laboratorios)} 
              variant="outline"
            >
              📋 Log Estado
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Debug Info */}
      {debugInfo && (
        <Card>
          <CardHeader>
            <CardTitle>📊 Información de Debug</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
  <Card>
    <CardContent className="p-4">
      <div className="text-2xl font-bold text-blue-600">{laboratorios?.length || 0}</div>
      <div className="text-sm text-gray-600">Total Laboratorios</div>
    </CardContent>
  </Card>
  <Card>
    <CardContent className="p-4">
      <div className="text-2xl font-bold text-green-600">
        {laboratorios?.filter(lab => lab.activo)?.length || 0}
      </div>
      <div className="text-sm text-gray-600">Activos</div>
    </CardContent>
  </Card>
  <Card>
    <CardContent className="p-4">
      <div className="text-2xl font-bold text-red-600">
        {laboratorios?.filter(lab => !lab.activo)?.length || 0}
      </div>
      <div className="text-sm text-gray-600">Inactivos</div>
    </CardContent>
  </Card>
  <Card>
    <CardContent className="p-4">
      <div className="text-2xl font-bold text-purple-600">
        {laboratorios?.reduce((sum, lab) => sum + lab.capacidad_maxima, 0) || 0}
      </div>
      <div className="text-sm text-gray-600">Capacidad Total</div>
    </CardContent>
  </Card>
</div>

      {/* Lista de Laboratorios */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Lista de Laboratorios ({laboratorios.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : laboratorios.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay laboratorios disponibles</p>
          ) : (
            <div className="space-y-4">
              {laboratorios.map((laboratorio) => (
                <div key={laboratorio.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{laboratorio.nombre}</h3>
                      <p className="text-sm text-gray-600">Código: {laboratorio.codigo}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge 
                        className={getLaboratorioStatusColor(laboratorio.activo)}
                      >
                        {laboratorio.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                      <Badge variant="outline">
                        {laboratorio.tipo_laboratorio}
                      </Badge>
                    </div>
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Ubicación:</strong> {laboratorio.ubicacion}</p>
                      <p><strong>Capacidad:</strong> {laboratorio.capacidad_maxima} personas</p>
                      <p><strong>Equipos:</strong> {laboratorio.equipos_disponibles?.length || 0} disponibles</p>
                    </div>
                    <div>
                      <p><strong>Creado:</strong> {formatLaboratorioForDisplay(laboratorio).fechaCreacion}</p>
                      <p><strong>ID:</strong> <code className="bg-gray-100 px-1 rounded">{laboratorio.id}</code></p>
                    </div>
                  </div>

                  {laboratorio.observaciones && (
                    <div className="mt-3 p-2 bg-gray-50 rounded">
                      <p className="text-sm"><strong>Observaciones:</strong> {laboratorio.observaciones}</p>
                    </div>
                  )}

                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm text-blue-600 hover:underline">
                      Ver datos completos (JSON)
                    </summary>
                    <pre className="mt-2 bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                      {JSON.stringify(laboratorio, null, 2)}
                    </pre>
                  </details>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}