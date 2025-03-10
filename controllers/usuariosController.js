const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'mi_base_de_datos',
  password: 'postgres',
  port: 5432,
});

// Obtener todos los usuarios
const getUsuarios = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM usuarios');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener los usuarios');
  }
};

// Obtener un usuario por ID
const getUsuarioById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).send('Usuario no encontrado');
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener el usuario');
  }
};

// Crear un nuevo usuario
const createUsuario = async (req, res) => {
  const { nombre, email, edad } = req.body;
  if (!nombre || !email || !edad) {
    return res.status(400).send('Todos los campos son obligatorios');
  }
  try {
    const { rows } = await pool.query(
      'INSERT INTO usuarios (nombre, email, edad) VALUES ($1, $2, $3) RETURNING *',
      [nombre, email, edad]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al crear el usuario');
  }
};

// Actualizar un usuario
const updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, email, edad } = req.body;
  if (!nombre || !email || !edad) {
    return res.status(400).send('Todos los campos son obligatorios');
  }
  try {
    const { rows } = await pool.query(
      'UPDATE usuarios SET nombre = $1, email = $2, edad = $3 WHERE id = $4 RETURNING *',
      [nombre, email, edad, id]
    );
    if (rows.length === 0) {
      return res.status(404).send('Usuario no encontrado');
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al actualizar el usuario');
  }
};

// Eliminar un usuario
const deleteUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);
    if (rows.length === 0) {
      return res.status(404).send('Usuario no encontrado');
    }
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al eliminar el usuario');
  }
};

module.exports = {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
};