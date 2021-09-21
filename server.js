const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const pool = require('./db');
const app = express();
const port = 5000;

app.use(cors());

app.use(morgan('combined'));
app.use(express.json());

app.get('/data', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();

    var query = 'select * from weather_data';
    var rows = await conn.query(query);

    res.send(rows);
  } catch (err) {
    throw err;
  } finally {
    if (conn) return conn.release();
  }
});

app.get('/data/latest', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();

    var query = `
      SELECT * FROM weather_data
      WHERE id IN (SELECT id FROM weather_data WHERE created_at = (SELECT MAX(created_at) FROM weather_data))
      ORDER BY id DESC
      LIMIT 1
    `;
    var rows = await conn.query(query);

    res.send(rows);
  } catch (err) {
    throw err;
  } finally {
    if (conn) return conn.release();
  }
});

app.post('/data', async (req, res, next) => {
  let conn;
  const temp = req.body.temp;
  const hum = req.body.hum;
  try {
    conn = await pool.getConnection();

    var sql = 'INSERT INTO weather_data (temp, hum) VALUES(?, ?)';
    const row = await conn.query(sql, [temp, hum]);

    res.send(`${new Date()}: created record ${row.insertId}`);
  } catch (err) {
    console.error(`Error while creating record`, err.message);
    next(err);
  } finally {
    if (conn) return conn.release();
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
