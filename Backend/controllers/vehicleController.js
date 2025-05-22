const db = require('../config/db');

const updateVehicle = async (req, res) => {
  const { patente } = req.params;
  const { precioPorDia, ultimoMantenimiento } = req.body;

  if (precioPorDia === undefined && !ultimoMantenimiento) {
    return res.status(400).json({ error: 'Debe enviar al menos precioPorDia o ultimoMantenimiento en el body' });
  }

  try {
    // Armar dinámicamente los campos a actualizar
    const campos = [];
    const valores = [];

    if (precioPorDia !== undefined) {
      campos.push('precioPorDia = ?');
      valores.push(precioPorDia);
    }

    if (ultimoMantenimiento) {
      campos.push('ultimo_mantenimiento = ?');
      valores.push(ultimoMantenimiento);
    }

    valores.push(patente); // La patente siempre va al final

    const sql = `UPDATE Vehiculo SET ${campos.join(', ')} WHERE patente = ?`;

    const [result] = await db.query(sql, valores);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }

    res.json({
      message: 'Vehículo actualizado correctamente',
      patente,
      ...(precioPorDia !== undefined && { nuevoPrecio: precioPorDia }),
      ...(ultimoMantenimiento && { nuevoUltimoMantenimiento: ultimoMantenimiento })
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
    sucursal
  } = req.body;

  if (!patente || !marca || !modelo || !anio || !precioPorDia || !ultimoMantenimiento || !categoria || !sucursal) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

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

    const [insertVehicleResult] = await db.query(
      `INSERT INTO Vehiculo 
        (patente, id_modelo, año, precioPorDia, ultimo_mantenimiento, id_categoria, id_sucursal) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [patente, idModelo, anio, precioPorDia, ultimoMantenimiento, idCategoria, idSucursal]
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
    // Verificar si el vehículo está en una reserva activa
    const [reservas] = await db.query(
      `SELECT * FROM Reserva WHERE patente = ? AND estado = 'activa'`,
      [patente]
    );

    if (reservas.length > 0) {
      return res.status(400).json({ error: 'El auto se encuentra en una reserva activa' });
    }

    // Eliminar el vehículo
    const [result] = await db.query('DELETE FROM Vehiculo WHERE patente = ?', [patente]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }

    res.json({ message: 'Vehículo eliminado correctamente', patente });
  } catch (error) {
    console.error('Error eliminando vehículo:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  updateVehicle,
  insertVehicle,
  deleteVehicle,
};
// hola