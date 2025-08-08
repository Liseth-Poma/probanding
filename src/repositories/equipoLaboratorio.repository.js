const EquipoLaboratorio = require("../models/equipoLaboratorio.model")
const Laboratorio = require("../models/laboratorio.model")

class EquipoLaboratorioRepository {
  async findAll() {
    return await EquipoLaboratorio.findAll({
      include: [
        {
          model: Laboratorio,
          as: "laboratorio",
          attributes: ["id", "nombre", "ubicacion"],
        },
      ],
      order: [["nombre", "ASC"]],
    })
  }

  async findById(id) {
    return await EquipoLaboratorio.findByPk(id, {
      include: [
        {
          model: Laboratorio,
          as: "laboratorio",
        },
      ],
    })
  }

  async findByLaboratorio(laboratorioId) {
    return await EquipoLaboratorio.findAll({
      where: { laboratorio_id: laboratorioId },
      order: [["nombre", "ASC"]],
    })
  }

  async findByEstado(estado) {
    return await EquipoLaboratorio.findAll({
      where: { estado },
      include: [
        {
          model: Laboratorio,
          as: "laboratorio",
          attributes: ["id", "nombre", "ubicacion"],
        },
      ],
      order: [["nombre", "ASC"]],
    })
  }

  async create(equipoData) {
    return await EquipoLaboratorio.create(equipoData)
  }

  async update(id, equipoData) {
    const [updatedRowsCount] = await EquipoLaboratorio.update(equipoData, {
      where: { id },
    })
    return updatedRowsCount > 0
  }

  async delete(id) {
    return await EquipoLaboratorio.destroy({ where: { id } })
  }

  async findByCodigoInventario(codigoInventario) {
    return await EquipoLaboratorio.findOne({
      where: { codigo_inventario: codigoInventario },
    })
  }

  async findByNumeroSerie(numeroSerie) {
    return await EquipoLaboratorio.findOne({
      where: { numero_serie: numeroSerie },
    })
  }
}

module.exports = new EquipoLaboratorioRepository()
