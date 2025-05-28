const db = require('../config/db');
const fs = require('fs');
const path = require('path');

const saveImage = (file) => {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const fileName = Date.now() + '-' + file.originalname;
  const filePath = path.join(uploadsDir, fileName);

  fs.writeFileSync(filePath, file.buffer);

  return `/uploads/${fileName}`; // Ruta pública para servir desde el frontend
};

module.exports = { saveImage };


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

    // Verificar si el vehículo está en una reserva activa
    const [reservas] = await db.query(
      `SELECT * FROM Reserva WHERE id_vehiculo = ? AND estado = 'activa'`,
      [vehiculoId]
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