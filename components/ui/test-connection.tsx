"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wifi, WifiOff, Loader2 } from 'lucide-react'
import { validateLaboratorioData, formatLaboratorioForDisplay } from '@/lib/laboratorio-utils'


export default function TestConnection() {
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [connectionMessage, setConnectionMessage] = useState('')

  const testConnection = async () => {
    setIsTestingConnection(true)
    setConnectionStatus('idle')
    setConnectionMessage('')

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      
      // Probar conexión básica
      const response = await fetch(`${API_URL}/api/laboratorios`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Agregar headers de autenticación si es necesario
        }
      })

      if (response.ok) {
        const data = await response.json()
        setConnectionStatus('success')
        setConnectionMessage(`✅ Conexión exitosa! Se encontraron ${data.length || 0} laboratorios`)
      } else {
        setConnectionStatus('error')
        setConnectionMessage(`❌ Error ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      setConnectionStatus('error')
      setConnectionMessage(`❌ Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    } finally {
      setIsTestingConnection(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wifi className="h-5 w-5" />
          Test de Conexión API
        </CardTitle>
        <CardDescription>
          Prueba la conexión con el backend de laboratorios
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            <strong>URL del API:</strong> {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Endpoint:</strong> /api/laboratorios
          </p>
        </div>

        <Button 
          onClick={testConnection} 
          disabled={isTestingConnection}
          className="w-full"
        >
          {isTestingConnection ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Probando conexión...
            </>
          ) : (
            <>
              <Wifi className="h-4 w-4 mr-2" />
              Probar Conexión
            </>
          )}
        </Button>

        {connectionStatus === 'success' && (
          <Alert className="border-green-200 bg-green-50">
            <Wifi className="h-4 w-4" />
            <AlertDescription className="text-green-800">
              {connectionMessage}
            </AlertDescription>
          </Alert>
        )}

        {connectionStatus === 'error' && (
          <Alert variant="destructive">
            <WifiOff className="h-4 w-4" />
            <AlertDescription>
              {connectionMessage}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-center">
          <Badge variant={connectionStatus === 'success' ? 'default' : connectionStatus === 'error' ? 'destructive' : 'secondary'}>
            {connectionStatus === 'success' ? 'Conectado' : connectionStatus === 'error' ? 'Desconectado' : 'Sin probar'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}