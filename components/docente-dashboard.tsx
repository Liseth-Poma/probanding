"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { BookOpen, Users, FileText, Settings, LogOut, Download } from "lucide-react"
import { useBitacoras } from "@/hooks/useBitacoras"



interface User {
  id: string
  username: string
  name: string
  role: "docente" | "estudiante"
  email: string
}

interface DocenteDashboardProps {
  user: User
}

export function DocenteDashboard({ user }: DocenteDashboardProps) {
  const { logout } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  // Datos simulados (aquí irán las APIs)
  const materias = [
    { id: 1, nombre: "Química Orgánica", codigo: "QUI-301", estudiantes: 25 },
    { id: 2, nombre: "Física Experimental", codigo: "FIS-201", estudiantes: 30 },
  ]

  const { bitacoras, loading } = useBitacoras(user.id)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Panel Docente</h1>
              <p className="text-gray-600">Bienvenido, {user.name}</p>
            </div>
            <Button variant="outline" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="materias">Materias</TabsTrigger>
            <TabsTrigger value="bitacoras">Bitácoras</TabsTrigger>
            <TabsTrigger value="perfil">Perfil</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Materias</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{materias.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {materias.reduce((sum, materia) => sum + materia.estudiantes, 0)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Bitácoras Pendientes</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {bitacoras.filter((b) => b.estado === "pendiente").length}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Bitácoras Recientes</CardTitle>
                <CardDescription>Últimas actividades de los estudiantes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bitacoras.map((bitacora) => (
                    <div key={bitacora.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{bitacora.titulo_laboratorio}</p>
                        <p className="text-sm text-gray-600">{bitacora.tema}</p>
                        <p className="text-xs text-gray-500">{bitacora.fecha_bitacora}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            bitacora.estado === "completada"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {bitacora.estado}
                        </span>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="materias" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mis Materias</CardTitle>
                <CardDescription>Materias que impartes este semestre</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {materias.map((materia) => (
                    <Card key={materia.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{materia.nombre}</CardTitle>
                        <CardDescription>{materia.codigo}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{materia.estudiantes} estudiantes</span>
                          <Button size="sm">Ver Detalles</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bitacoras" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Bitácoras</CardTitle>
                <CardDescription>Administra las bitácoras de prácticas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Button>Generar Nueva Bitácora</Button>
                    <Button variant="outline">Exportar Reportes</Button>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left">Estudiante</th>
                          <th className="px-4 py-2 text-left">Práctica</th>
                          <th className="px-4 py-2 text-left">Fecha</th>
                          <th className="px-4 py-2 text-left">Estado</th>
                          <th className="px-4 py-2 text-left">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bitacoras.map((bitacora) => (
                          <tr key={bitacora.id} className="border-t">
                            <td className="px-4 py-2">{bitacora.nombre_profesor}</td>
                            <td className="px-4 py-2">{bitacora.tema}</td>
                            <td className="px-4 py-2">{bitacora.fecha_bitacora}</td>
                            <td className="px-4 py-2">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  bitacora.estado === "completada"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {bitacora.estado}
                              </span>
                            </td>
                            <td className="px-4 py-2">
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  Ver
                                </Button>
                                <Button size="sm" variant="outline">
                                  Descargar
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}

                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="perfil" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información del Perfil</CardTitle>
                <CardDescription>Datos personales y configuración</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nombre</label>
                    <p className="text-gray-600">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Rol</label>
                    <p className="text-gray-600 capitalize">{user.role}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">ID Usuario</label>
                    <p className="text-gray-600">{user.id}</p>
                  </div>
                </div>
                <Button>
                  <Settings className="w-4 h-4 mr-2" />
                  Editar Perfil
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
