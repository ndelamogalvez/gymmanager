require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const authRoutes = require('./routes/auth');
const { verificarToken, requiereRol } = require('./middleware/auth');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.get('/socios', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM socios');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/socios', verificarToken, requiereRol('admin', 'entrenador'), async (req, res) => {
  const { nombre, apellido, telefono, fecha_alta } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO socios (nombre, apellido, telefono, fecha_alta) VALUES (?, ?, ?, ?)',
      [nombre, apellido, telefono, fecha_alta]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Listar todas las clases disponibles
app.get('/clases', verificarToken, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.id, c.nombre, c.dia_semana, c.hora_inicio, c.hora_fin, c.aforo_max, e.nombre AS entrenador
      FROM clases c
      LEFT JOIN entrenadores e ON c.entrenador_id = e.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// El socio reserva una clase
app.post('/reservas', verificarToken, async (req, res) => {
  const { clase_id, fecha_reserva } = req.body;
  const socio_id = req.usuario.socio_id;
  try {
    const [result] = await pool.query(
      'INSERT INTO reservas (socio_id, clase_id, fecha_reserva) VALUES (?, ?, ?)',
      [socio_id, clase_id, fecha_reserva]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// El socio ve sus propias reservas
app.get('/reservas/mias', verificarToken, async (req, res) => {
  const socio_id = req.usuario.socio_id;
  try {
    const [rows] = await pool.query(`
      SELECT r.id, r.fecha_reserva, r.estado, c.nombre AS clase, c.hora_inicio, c.hora_fin
      FROM reservas r
      JOIN clases c ON r.clase_id = c.id
      WHERE r.socio_id = ?
    `, [socio_id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.listen(3000, () => console.log('Servidor en http://localhost:3000'));