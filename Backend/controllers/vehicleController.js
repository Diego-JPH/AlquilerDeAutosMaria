const db = require('../config/db');
const fs = require('fs');
const path = require('path');
const { saveImage } = require('../models/saveImage'); // Ajustá el path si está en otra carpeta
const { getVehiclesAvailableBetweenDates, getVehiculosPorSucursal } = require("../models/vehicleModels");
const { getSucursalDelEmpleado } = require('../models/userModels');


const updateVehicle = async (req, res) => {
  const { patente } = req.params;
  const { precioPorDia, ultimoMantenimiento, estado , politicaDevolucion} = req.body;

  if ((precioPorDia === undefined || precioPorDia === '') &&
      (ultimoMantenimiento === undefined || ultimoMantenimiento === '') &&
      (estado === undefined || estado === '') &&
      (politicaDevolucion === undefined || politicaDevolucion === '')) {
    return res.status(400).json({ error: 'Debe enviar al menos precioPorDia, ultimoMantenimiento o un estado en el body' });
  }

  const estadosValidos = ['ocupado', 'disponible', 'mantenimiento'];

  try {
    const campos = [];
    const valores = [];

    if (precioPorDia !== undefined && precioPorDia !== '') {
      if (precioPorDia < 0) {
        return res.status(400).json({
          error: 'Precio por dia invalido. Debe ser mayor a 0',
        });
      }
      campos.push('precioPorDia = ?');
      valores.push(precioPorDia);
    }

    if (ultimoMantenimiento !== undefined && ultimoMantenimiento !== '') {
      campos.push('ultimo_mantenimiento = ?');
      valores.push(ultimoMantenimiento);
    }

    if (estado !== undefined && estado !== '') {
      if (!estadosValidos.includes(estado)) {
        return res.status(400).json({ error: 'Estado invalido. Debe ser ocupado, mantenimiento o disponible' });
      }
      campos.push('estado = ?');
      valores.push(estado);
    }

    if (politicaDevolucion !== undefined && politicaDevolucion !== '') {
      const porcentaje = parseInt(politicaDevolucion, 10);
      if (porcentaje < 0 || porcentaje > 100) {
        return res.status(400).json({
          error: 'Política de devolución inválida. Debe ser de 0 a 100',
        });
      }
      campos.push('politica_devolucion = ?');
      valores.push(politicaDevolucion);
    }

    valores.push(patente);

    const sql = `UPDATE Vehiculo SET ${campos.join(', ')} WHERE patente = ?`;
    const [result] = await db.query(sql, valores);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }

    res.json({
      message: 'Vehículo actualizado correctamente',
      patente,
      ...(precioPorDia !== undefined && precioPorDia !== '' && { nuevoPrecio: precioPorDia }),
      ...(ultimoMantenimiento && { nuevoUltimoMantenimiento: ultimoMantenimiento }),
      ...(estado && estado !== '' && { nuevoEstado: estado }),
      ...(politicaDevolucion && politicaDevolucion !== '' && { nuevaPolitica: politicaDevolucion }),
    });
  } catch (error) {
    console.error('Error actualizando vehículo:', error);
    res.status(500).json({ error: error.message });
  }
};


// Insertar vehículo
const insertVehicle = async (req, res) => {
  const {
    patente,
    marca,
    modelo,
    anio,
    precioPorDia,
    ultimoMantenimiento,
    categoria,
    sucursal,
    politicaDevolucion // 🆕 agregado
  } = req.body;

  if (!patente || !marca || !modelo || !anio || !precioPorDia || !ultimoMantenimiento || !categoria || !sucursal || politicaDevolucion === undefined) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }


  if (precioPorDia < 0) {
        return res.status(400).json({
          error: 'Precio por dia invalido. Debe ser mayor a 0',
        });
      }
  
    if (politicaDevolucion < 0 || politicaDevolucion > 100) {
        return res.status(400).json({
          error: 'Política de devolución inválida. Debe ser de 0 a 100',
        });
      }
  
  const politica = parseInt(politicaDevolucion, 10);
  

  try {
    const [existingVehicle] = await db.query('SELECT * FROM Vehiculo WHERE patente = ?', [patente]);
    if (existingVehicle.length > 0) {
      return res.status(409).json({ error: 'La patente ya existe en la base de datos' });
    }

    const [marcaResult] = await db.query('SELECT id_marca FROM Marca WHERE marca = ?', [marca]);
    let idMarca;
    if (marcaResult.length === 0) {
      const [insertMarca] = await db.query('INSERT INTO Marca (marca) VALUES (?)', [marca]);
      idMarca = insertMarca.insertId;
    } else {
      idMarca = marcaResult[0].id_marca;
    }

    const [modeloResult] = await db.query('SELECT id_modelo FROM Modelo WHERE modelo = ? AND id_marca = ?', [modelo, idMarca]);
    let idModelo;
    if (modeloResult.length === 0) {
      const [insertModelo] = await db.query('INSERT INTO Modelo (modelo, id_marca) VALUES (?, ?)', [modelo, idMarca]);
      idModelo = insertModelo.insertId;
    } else {
      idModelo = modeloResult[0].id_modelo;
    }

    const [categoriaResult] = await db.query('SELECT id_categoria FROM Categoria WHERE categoria = ?', [categoria]);
    let idCategoria;
    if (categoriaResult.length === 0) {
      const [insertCategoria] = await db.query('INSERT INTO Categoria (categoria) VALUES (?)', [categoria]);
      idCategoria = insertCategoria.insertId;
    } else {
      idCategoria = categoriaResult[0].id_categoria;
    }

    const [sucursalResult] = await db.query('SELECT id_sucursal FROM Sucursal WHERE sucursal = ?', [sucursal]);
    if (sucursalResult.length === 0) {
      return res.status(400).json({ error: 'Sucursal no encontrada' });
    }
    const idSucursal = sucursalResult[0].id_sucursal;

    // 🖼 Guardar imagen si se subió
    let imagenPath = null;
    if (req.file) {
      imagenPath = saveImage(req.file);
    }

    // 📝 Inserción con campo imagen
    const [insertVehicleResult] = await db.query(
      `INSERT INTO Vehiculo 
        (patente, id_modelo, año, precioPorDia, ultimo_mantenimiento, id_categoria, id_sucursal, politica_devolucion, imagen) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [patente, idModelo, anio, precioPorDia, ultimoMantenimiento, idCategoria, idSucursal, politica, imagenPath]
    );

    return res.status(201).json({
      message: 'Vehículo agregado correctamente',
      id: insertVehicleResult.insertId
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al agregar el vehículo' });
  }
};

const deleteVehicle = async (req, res) => {
  const { patente } = req.params;

  try {
    const [vehiculoRows] = await db.query(
      'SELECT id_vehiculo FROM Vehiculo WHERE patente = ?',
      [patente]
    );

    if (vehiculoRows.length === 0) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }

    const vehiculoId = vehiculoRows[0].id_vehiculo;

    const [reservas] = await db.query(
      `SELECT * FROM Reserva WHERE id_vehiculo = ? AND estado = 'activa'`,
      [vehiculoId]
    );

    if (reservas.length > 0) {
      return res.status(400).json({ error: 'El auto se encuentra en una reserva activa' });
    }

    // Marcar como inactivo
    const [result] = await db.query('UPDATE Vehiculo SET estado = "inactivo" WHERE patente = ?', [patente]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }

    res.json({ message: 'Vehículo eliminado correctamente', patente });
  } catch (error) {
    console.error('Error eliminando vehículo:', error);
    res.status(500).json({ error: error.message });
  }
};

const getVehicles = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT v.*, m.modelo AS modelo, ma.marca AS marca 
      FROM Vehiculo v 
      JOIN Modelo m ON v.id_modelo = m.id_modelo 
      JOIN Marca ma ON m.id_marca = ma.id_marca
      WHERE v.estado != 'inactivo'
    `);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener los vehículos:', error);
    res.status(500).json({ error: 'Error al obtener los vehículos' });
  }
};

const getVehiclesAdmin = async (req, res) => {
  try {
    const { patente } = req.query;

    let query = `
      SELECT v.*, m.modelo AS modelo, ma.marca AS marca 
      FROM Vehiculo v 
      JOIN Modelo m ON v.id_modelo = m.id_modelo 
      JOIN Marca ma ON m.id_marca = ma.id_marca
    `;

    const params = [];

    if (patente) {
      query += ` WHERE v.patente LIKE ?`;
      params.push(`${patente}%`);
    }

    const [rows] = await db.query(query, params);

    if (patente && rows.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontró ningún vehículo con la patente indicada' });
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener los vehículos (admin):', error);
    res.status(500).json({ error: 'Error al obtener los vehículos' });
  }
};

const getAvailableVehiclesByDate = async (req, res) => {
  const { fechaDesde, fechaHasta } = req.query;

  if (!fechaDesde || !fechaHasta) {
    return res.status(400).json({ error: "Fechas requeridas" });
  }

  try {
    const vehicles = await getVehiclesAvailableBetweenDates(fechaDesde, fechaHasta);
    res.status(200).json(vehicles);
  } catch (error) {
    console.error("Error al obtener vehículos disponibles:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
};

const getVehiclesByEmployeeBranch = async (req, res) => {
  try {
    const idUsuario = req.usuario.id;

    const empleado = await getSucursalDelEmpleado(idUsuario);

    if (!empleado) {
      return res.status(403).json({ mensaje: 'Empleado no encontrado o inactivo' });
    }

    const vehiculos = await getVehiculosPorSucursal(empleado.id_sucursal);

    res.status(200).json(vehiculos);
  } catch (error) {
    console.error("❌ Error al obtener vehículos por sucursal del empleado:", error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

module.exports = {
  updateVehicle,
  insertVehicle,
  deleteVehicle,
  getVehicles,
  getAvailableVehiclesByDate,
  getVehiclesAdmin,
  getVehiclesByEmployeeBranch,
};