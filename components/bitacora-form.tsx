"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Save, Send } from "lucide-react"

interface Practica {
  id: number
  nombre: string
  materia: string
  fecha: string
  estado: string
}

interface BitacoraFormProps {
  onClose: () => void
  practicas: Practica[]
}

export function BitacoraForm({ onClose, practicas }: BitacoraFormProps) {
  const [formData, setFormData] = useState({
    practicaId: "",
    fecha: "",
    objetivos: "",
    materiales: "",
    procedimiento: "",
    observaciones: "",
    resultados: "",
    conclusiones: "",
    equiposUtilizados: "",
  })

  const handleSubmit = (e: React.FormEvent, action: "save" | "send") => {
    e.preventDefault()

    // Aquí se enviarían los datos a la API
    console.log("Bitácora:", { ...formData, estado: action === "save" ? "Borrador" : "Enviada" })

    alert(`Bitácora ${action === "save" ? "guardada como borrador" : "enviada"} exitosamente`)
    onClose()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Nueva Bitácora de Práctica</CardTitle>
              <CardDescription>Completa todos los campos requeridos</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="practica">Práctica *</Label>
                <Select value={formData.practicaId} onValueChange={(value) => handleInputChange("practicaId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una práctica" />
                  </SelectTrigger>
                  <SelectContent>
                    {practicas.map((practica) => (
                      <SelectItem key={practica.id} value={practica.id.toString()}>
                        {practica.nombre} - {practica.materia}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha de Realización *</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => handleInputChange("fecha", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="objetivos">Objetivos *</Label>
              <Textarea
                id="objetivos"
                placeholder="Describe los objetivos de la práctica..."
                value={formData.objetivos}
                onChange={(e) => handleInputChange("objetivos", e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="materiales">Materiales y Reactivos *</Label>
              <Textarea
                id="materiales"
                placeholder="Lista todos los materiales y reactivos utilizados..."
                value={formData.materiales}
                onChange={(e) => handleInputChange("materiales", e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="equipos">Equipos Utilizados *</Label>
              <Textarea
                id="equipos"
                placeholder="Especifica los equipos de laboratorio utilizados (incluye números de serie si aplica)..."
                value={formData.equiposUtilizados}
                onChange={(e) => handleInputChange("equiposUtilizados", e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="procedimiento">Procedimiento *</Label>
              <Textarea
                id="procedimiento"
                placeholder="Describe paso a paso el procedimiento seguido..."
                value={formData.procedimiento}
                onChange={(e) => handleInputChange("procedimiento", e.target.value)}
                rows={5}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                placeholder="Anota cualquier observación relevante durante la práctica..."
                value={formData.observaciones}
                onChange={(e) => handleInputChange("observaciones", e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resultados">Resultados *</Label>
              <Textarea
                id="resultados"
                placeholder="Presenta los resultados obtenidos, incluyendo datos, cálculos y gráficas..."
                value={formData.resultados}
                onChange={(e) => handleInputChange("resultados", e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="conclusiones">Conclusiones *</Label>
              <Textarea
                id="conclusiones"
                placeholder="Escribe tus conclusiones basadas en los resultados obtenidos..."
                value={formData.conclusiones}
                onChange={(e) => handleInputChange("conclusiones", e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={(e) => handleSubmit(e, "save")} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Guardar Borrador
              </Button>
              <Button type="button" onClick={(e) => handleSubmit(e, "send")} className="flex-1">
                <Send className="w-4 h-4 mr-2" />
                Enviar Bitácora
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
