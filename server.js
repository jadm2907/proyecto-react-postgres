const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'mi_base_de_datos',
  password: 'postgres',
  port: 5432,
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Ruta para obtener todos los usuarios (READ)
app.get('/api/usuarios', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM usuarios');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener los usuarios');
  }
});

// Ruta para obtener un usuario por ID (READ)
app.get('/api/usuarios/:id', async (req, res) => {
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
});

// Ruta para crear un nuevo usuario (CREATE)
app.post('/api/usuarios', async (req, res) => {
  const { nombre, email, edad } = req.body;
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
});

// Ruta para actualizar un usuario (UPDATE)
app.put('/api/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, email, edad } = req.body;
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
});

// Ruta para eliminar un usuario (DELETE)
app.delete('/api/usuarios/:id', async (req, res) => {
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
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});