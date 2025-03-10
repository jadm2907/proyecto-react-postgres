const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} = require('./controllers/usuariosController');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.get('/api/usuarios', getUsuarios);
app.get('/api/usuarios/:id', getUsuarioById);
app.post('/api/usuarios', createUsuario);
app.put('/api/usuarios/:id', updateUsuario);
app.delete('/api/usuarios/:id', deleteUsuario);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});