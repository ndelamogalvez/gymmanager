const express = require('express');
const pool = require('./db');
const app = express();

app.get('/socios', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM socios');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));