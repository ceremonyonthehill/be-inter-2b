const express = require('express');
const cors = require('cors');
const knex = require('knex');
const knexConfig = require('./knexfile');

const app = express();
const db = knex(knexConfig.development);

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

const usersRouter = require('./users');
app.use('/users', usersRouter);

// get
app.get('/movies', async (req, res) => {
  try {
    const movies = await db('movies').select('*');
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// post
app.post('/movies', async (req, res) => {
  try {
    const { title, poster } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    const [newMovie] = await db('movies')
      .insert({ title, poster })
      .returning('*');
    res.status(201).json(newMovie);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// put
app.put('/movies/:id', async (req, res) => {
  try {
    const { title, poster } = req.body;
    const [updated] = await db('movies')
      .where({ id: req.params.id })
      .update({ title, poster, updated_at: db.fn.now() })
      .returning('*');
    
    if (!updated) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// delete
app.delete('/movies/:id', async (req, res) => {
  try {
    const deleted = await db('movies').where({ id: req.params.id }).del();
    if (!deleted) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Movie API running on http://localhost:${PORT}`);
});
