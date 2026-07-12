const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { nombre, apellido, email, password, rol, telefono } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const hash = await bcrypt.hash(password, 10);

    let socio_id = null;

    if (rol === 'socio' || !rol) {
      const [socioResult] = await conn.query(
        'INSERT INTO socios (nombre, apellido, telefono, fecha_alta) VALUES (?, ?, ?, CURDATE())',
        [nombre, apellido || '', telefono || null]
      );
      socio_id = socioResult.insertId;
    }

    const [userResult] = await conn.query(
      'INSERT INTO usuarios (nombre, email, password_hash, rol, socio_id) VALUES (?, ?, ?, ?, ?)',
      [nombre, email, hash, rol || 'socio', socio_id]
    );

    await conn.commit();
    res.status(201).json({ id: userResult.insertId, socio_id });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });

    const usuario = rows[0];
    const valido = await bcrypt.compare(password, usuario.password_hash);
    if (!valido) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol, nombre: usuario.nombre, socio_id: usuario.socio_id },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, rol: usuario.rol, nombre: usuario.nombre });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;