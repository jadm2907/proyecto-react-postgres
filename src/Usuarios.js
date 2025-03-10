import React, { useState, useEffect } from 'react';
import './App.css';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [edad, setEdad] = useState('');
  const [editando, setEditando] = useState(null);
  const [error, setError] = useState('');

  // Obtener todos los usuarios
  const fetchUsuarios = async () => {
    try {
      const response = await fetch('/api/usuarios');
      const data = await response.json();
      setUsuarios(data);
    } catch (err) {
      setError('Error al cargar los usuarios');
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Crear o actualizar un usuario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const usuario = { nombre, email, edad: parseInt(edad) };

    try {
      if (editando) {
        await fetch(`/api/usuarios/${editando}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(usuario),
        });
      } else {
        await fetch('/api/usuarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(usuario),
        });
      }

      setNombre('');
      setEmail('');
      setEdad('');
      setEditando(null);
      fetchUsuarios();
    } catch (err) {
      setError('Error al guardar el usuario');
    }
  };

  // Eliminar un usuario
  const handleDelete = async (id) => {
    try {
      await fetch(`/api/usuarios/${id}`, { method: 'DELETE' });
      fetchUsuarios();
    } catch (err) {
      setError('Error al eliminar el usuario');
    }
  };

  // Editar un usuario
  const handleEdit = (usuario) => {
    setNombre(usuario.nombre);
    setEmail(usuario.email);
    setEdad(usuario.edad);
    setEditando(usuario.id);
  };

  return (
    <div className="App">
      <h1>CRUD de Usuarios</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Edad"
          value={edad}
          onChange={(e) => setEdad(e.target.value)}
          required
        />
        <button type="submit">{editando ? 'Actualizar' : 'Crear'}</button>
      </form>

      <ul>
        {usuarios.map((usuario) => (
          <li key={usuario.id}>
            {usuario.nombre} - {usuario.email} - {usuario.edad} años
            <button onClick={() => handleEdit(usuario)}>Editar</button>
            <button onClick={() => handleDelete(usuario.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Usuarios;