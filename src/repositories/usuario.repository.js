const Usuario = require("../models/usuario.model")
const { Op } = require("sequelize")

class UsuarioRepository {
  async crear(datosUsuario) {
    try {
      return await Usuario.create(datosUsuario)
    } catch (error) {
      throw new Error(`Error al crear usuario: ${error.message}`)
    }
  }

  async obtenerPorId(id) {
    try {
      return await Usuario.findByPk(id)
    } catch (error) {
      throw new Error(`Error al obtener usuario: ${error.message}`)
    }
  }

  async obtenerPorCorreo(correo) {
    try {
      return await Usuario.findOne({ where: { correo } })
    } catch (error) {
      throw new Error(`Error al buscar usuario por correo: ${error.message}`)
    }
  }

  async obtenerTodos(filtros = {}) {
    try {
      const whereClause = {}

      if (filtros.rol) {
        whereClause.rol = filtros.rol
      }

      if (filtros.busqueda) {
        whereClause[Op.or] = [
          { nombre: { [Op.iLike]: `%${filtros.busqueda}%` } },
          { correo: { [Op.iLike]: `%${filtros.busqueda}%` } },
        ]
      }

      return await Usuario.findAll({
        where: whereClause,
        order: [["nombre", "ASC"]],
      })
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${error.message}`)
    }
  }

  async actualizar(id, datosActualizacion) {
    try {
      const [filasAfectadas] = await Usuario.update(datosActualizacion, {
        where: { id },
      })

      if (filasAfectadas === 0) {
        throw new Error("Usuario no encontrado")
      }

      return await this.obtenerPorId(id)
    } catch (error) {
      throw new Error(`Error al actualizar usuario: ${error.message}`)
    }
  }

  async eliminar(id) {
    try {
      const filasAfectadas = await Usuario.destroy({
        where: { id },
      })

      if (filasAfectadas === 0) {
        throw new Error("Usuario no encontrado")
      }

      return true
    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error.message}`)
    }
  }

  async obtenerPorRol(rol) {
    try {
      return await Usuario.findAll({
        where: { rol },
        order: [["nombre", "ASC"]],
      })
    } catch (error) {
      throw new Error(`Error al obtener usuarios por rol: ${error.message}`)
    }
  }
}

module.exports = new UsuarioRepository()
