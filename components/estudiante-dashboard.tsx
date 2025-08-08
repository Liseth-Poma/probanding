"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { BookOpen, FileText, Settings, LogOut, Plus, CheckCircle } from "lucide-react"
import { BitacoraForm } from "@/components/bitacora-form"
import { EquipoForm } from "@/components/agregarEquipo-form"
import Swal from 'sweetalert2';


interface User {
  id: number
  username?: string
  name: string
  role: "estudiante"
  email: string
}

interface EstudianteDashboardProps {
  user: User
}

export function EstudianteDashboard({ user }: EstudianteDashboardProps) {
  const { logout } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [showBitacoraForm, setShowBitacoraForm] = useState(false)
  const [showEquipoForm, setShowEquipoForm] = useState(false)

  const [materias, setMaterias] = useState<any[]>([])
  const [practicas, setPracticas] = useState<any[]>([])
  const [misBitacoras, setMisBitacoras] = useState<any[]>([])

  useEffect(() => {
    const token = localStorage.getItem("token")
    // 1. Cargar inscripciones del estudiante
    fetch(`http://localhost:3001/api/inscripciones-asignaturas?estudiante_id=${user.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(async (inscripcionesRes) => {
        // Extrae el array real de inscripciones
        const inscripciones = Array.isArray(inscripcionesRes) ? inscripcionesRes : inscripcionesRes.data || []
        // Si el endpoint devuelve solo IDs, pide los datos de cada asignatura
        const asignaturas = await Promise.all(
          inscripciones.map(async (insc: any) => {
            const res = await fetch(`http://localhost:3001/api/asignaturas/${insc.asignatura_id}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
            const materiaRes = await res.json()
            return materiaRes.data || materiaRes // Ajusta según tu backend
          })
        )
        setMaterias(asignaturas)

        // 2. Cargar guías de laboratorio para cada asignatura inscrita
        let allGuias: any[] = []
        for (const asignatura of asignaturas) {
          if (!asignatura?.id) continue // Evita undefined
          const res = await fetch(`http://localhost:3001/api/guias-laboratorio?asignatura_id=${asignatura.id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          const guiasRes = await res.json()
          const guias = Array.isArray(guiasRes) ? guiasRes : guiasRes.data || []
          allGuias = allGuias.concat(guias)
        }
        setPracticas(allGuias)
      })
      .catch(err => console.error("Error fetch inscripciones:", err))

    // 3. Cargar bitácoras del estudiante
    fetch(`http://localhost:3001/api/bitacoras?estudiante_id=${user.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(dataRes => {
        const bitacoras = Array.isArray(dataRes) ? dataRes : dataRes.data || []
        setMisBitacoras(bitacoras)
      })
      .catch(err => console.error("Error fetch bitacoras:", err))
  }, [user.id])

  const handleEquipoSubmit = async (form: any) => {
    const token = localStorage.getItem("token")

    // 1. Guardar en equipos
    const resEquipos = await fetch("http://localhost:3001/api/equipos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    })

    // 2. Guardar en equipos_laboratorio
    const resEquiposLab = await fetch("http://localhost:3001/api/equipos-laboratorio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    })

    if (resEquipos.ok && resEquiposLab.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Equipo agregado correctamente en ambas tablas',
      });
      setShowEquipoForm(false);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al agregar equipo',
      });
    }

  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showEquipoForm && (
        <EquipoForm
          guias={practicas}
          onClose={() => setShowEquipoForm(false)}
          onSubmit={handleEquipoSubmit}
        />
      )}
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Panel Estudiante</h1>
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
            <TabsTrigger value="practicas">Guias</TabsTrigger>
            {/* <TabsTrigger value="bitacoras">Bitácoras</TabsTrigger> */}
            <TabsTrigger value="perfil">Perfil</TabsTrigger>
          </TabsList>

          {/* Resumen */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Materias Inscritas</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{materias.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Guias Pendientes</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{practicas.filter((p) => p.id).length}</div>
                </CardContent>
              </Card>

              {/* <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Bitácoras Enviadas</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{misBitacoras.filter((b) => b.estado === "Enviada").length}</div>
                </CardContent>
              </Card> */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                </CardHeader>
                <CardContent>
                  <Button className="w-full" onClick={() => setShowEquipoForm(true)}>
                    Agregar equipo de laboratorio
                  </Button>
                </CardContent>
                <CardContent>
                  <Button className="w-full" >
                    Mirar registros de equipos
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Próximas Guias</CardTitle>
                <CardDescription>Guias programadas para esta semana</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {practicas
                    .filter((p) => p.estado !== "Completada")
                    .map((practica) => (
                      <div key={practica.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{practica.titulo}</p>
                          <p className="text-sm text-gray-600">Asignatura ID: {practica.asignatura_id}</p>
                          <p className="text-xs text-gray-500">{practica.createdAt}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              practica.estado === "Pendiente"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {practica.estado}
                          </span>
                          <Button size="sm">Ver Detalles</Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Materias */}
          <TabsContent value="materias" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mis Materias</CardTitle>
                <CardDescription>Materias inscritas este semestre</CardDescription>
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
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">
                            <strong>Docente:</strong> {materia.docente || "Sin asignar"}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Guias */}
          <TabsContent value="practicas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Registro de Guias</CardTitle>
                <CardDescription>Todas tus Guias de laboratorio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Guía</th>
                        <th className="px-4 py-2 text-left">Asignatura</th>
                        <th className="px-4 py-2 text-left">Laboratorio</th>
                        <th className="px-4 py-2 text-left">Docente</th>
                      </tr>
                    </thead>
                    <tbody>
                      {practicas.map((guia) => (
                        <tr key={guia.id} className="border-t">
                          <td className="px-4 py-2">{guia.titulo}</td>
                          <td className="px-4 py-2">{guia.asignatura?.nombre || "Sin asignatura"}</td>
                          <td className="px-4 py-2">{guia.laboratorio?.nombre || "Sin laboratorio"}</td>
                          <td className="px-4 py-2">
                            {guia.docente
                              ? `${guia.docente.nombre}` : "Sin docente"}
                          </td>
                        </tr>
                      ))}
                    </tbody>

                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bitácoras
          <TabsContent value="bitacoras" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mis Bitácoras</CardTitle>
                <CardDescription>Gestiona tus bitácoras de Guias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {misBitacoras.map((bitacora) => (
                    <div key={bitacora.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{bitacora.tema_practica_proyecto || bitacora.contenido || "Sin título"}</p>
                        <p className="text-sm text-gray-600">{bitacora.fecha_uso_laboratorio || bitacora.createdAt}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            bitacora.estado === "Enviada"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {bitacora.estado}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent> */}

          {/* Perfil */}
          <TabsContent value="perfil" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información del Perfil</CardTitle>
                <CardDescription>Datos personales y académicos</CardDescription>
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
                    <label className="text-sm font-medium">ID Estudiante</label>
                    <p className="text-gray-600">{user.id}</p>
                  </div>
                </div>
                <Button>
                  <Settings className="w-4 h-4 mr-2" />
                  Editar Perfil
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Libro del Estudiante</CardTitle>
                <CardDescription>Historial académico y calificaciones</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Aquí se mostrará tu historial académico completo una vez que se integren las APIs del Banner.
                </p>
                <Button variant="outline" className="mt-4 bg-transparent">
                  Descargar Historial
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}