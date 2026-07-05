require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/socios', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM socios');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/socios', async (req, res) => {
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

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));