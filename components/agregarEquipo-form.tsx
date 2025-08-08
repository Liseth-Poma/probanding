import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface Guia {
  id: number
  titulo: string
  laboratorio_id: number
  asignatura_id: number
  docente_id: number
  createdAt: string
}

interface EquipoFormProps {
  guias: Guia[]
  onClose: () => void
  onSubmit: (form: any) => void
}

export function EquipoForm({ guias, onClose, onSubmit }: EquipoFormProps) {
  const [guiaId, setGuiaId] = useState("")
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    marca: "",
    modelo: "",
    numero_serie: "",
    codigo_inventario: "",
    estado: "disponible",
    fecha_adquisicion: "",
    valor_adquisicion: "",
    observaciones: "",
    laboratorio_id: "",
    asignatura_id: "",
    docente_id: "",
    createdAt: "",
  })

  useEffect(() => {
    if (!guiaId) return
    const guia = guias.find((g) => g.id === Number(guiaId))
    if (guia) {
      setForm((prev) => ({
        ...prev,
        laboratorio_id: String(guia.laboratorio_id),
        asignatura_id: String(guia.asignatura_id),
        docente_id: String(guia.docente_id),
        createdAt: guia.createdAt ? guia.createdAt.split("T")[0] : "",
      }))
    }
  }, [guiaId, guias])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Agregar equipo de laboratorio</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Guía</label>
            <select
              className="w-full border rounded px-2 py-1"
              value={guiaId}
              onChange={(e) => setGuiaId(e.target.value)}
              required
            >
              <option value="">Seleccione una guía</option>
              {guias.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.titulo}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs">Asignatura</label>
              <input className="w-full border rounded px-2 py-1 bg-gray-100" value={form.asignatura_id} disabled />
            </div>
            <div>
              <label className="block text-xs">Laboratorio</label>
              <input className="w-full border rounded px-2 py-1 bg-gray-100" value={form.laboratorio_id} disabled />
            </div>
            <div>
              <label className="block text-xs">Docente</label>
              <input className="w-full border rounded px-2 py-1 bg-gray-100" value={form.docente_id} disabled />
            </div>
            <div>
              <label className="block text-xs">Fecha Guía</label>
              <input className="w-full border rounded px-2 py-1 bg-gray-100" value={form.createdAt} disabled />
            </div>
          </div>
          <div>
            <label className="block text-xs">Nombre del equipo</label>
            <input name="nombre" className="w-full border rounded px-2 py-1" value={form.nombre} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-xs">Descripción</label>
            <input name="descripcion" className="w-full border rounded px-2 py-1" value={form.descripcion} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs">Marca</label>
              <input name="marca" className="w-full border rounded px-2 py-1" value={form.marca} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-xs">Modelo</label>
              <input name="modelo" className="w-full border rounded px-2 py-1" value={form.modelo} onChange={handleChange} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs">Número de serie</label>
              <input name="numero_serie" className="w-full border rounded px-2 py-1" value={form.numero_serie} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-xs">Código inventario</label>
              <input name="codigo_inventario" className="w-full border rounded px-2 py-1" value={form.codigo_inventario} onChange={handleChange} />
            </div>
          </div>
          <div>
            <label className="block text-xs">Estado</label>
            <select name="estado" className="w-full border rounded px-2 py-1" value={form.estado} onChange={handleChange}>
              <option value="disponible">Disponible</option>
              <option value="en_uso">En uso</option>
              <option value="mantenimiento">Mantenimiento</option>
              <option value="dañado">Dañado</option>
              <option value="fuera_servicio">Fuera de servicio</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs">Fecha adquisición</label>
              <input name="fecha_adquisicion" type="date" className="w-full border rounded px-2 py-1" value={form.fecha_adquisicion} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-xs">Valor adquisición</label>
              <input name="valor_adquisicion" type="number" className="w-full border rounded px-2 py-1" value={form.valor_adquisicion} onChange={handleChange} />
            </div>
          </div>
          <div>
            <label className="block text-xs">Observaciones</label>
            <input name="observaciones" className="w-full border rounded px-2 py-1" value={form.observaciones} onChange={handleChange} />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Guardar equipo</Button>
          </div>
        </form>
      </div>
    </div>
  )
}