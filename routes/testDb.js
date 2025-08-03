// for testing purposes


import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

router.get('/etrackerdb', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ connected: true, time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ connected: false, error: err.message });
  }
});

export default router;