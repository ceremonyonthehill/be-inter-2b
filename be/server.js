const express = require('express');
const cors = require('cors');
const knex = require('knex');
const knexConfig = require('./knexfile');
const multer = require('multer'); // 1. Import multer
const path = require('path');

const app = express();
const db = knex(knexConfig.development);

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));


app.use('/uploads', express.static('uploads'));

const { router: usersRouter, authMiddleware } = require('./users');
app.use('/users', usersRouter);


const storage = multer.diskStorage({
  
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  // Format penamaan file agar unik (menghindari nama file yang sama tertimpa)
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


app.post('/upload', authMiddleware, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Tidak ada file yang diunggah' });
    }
    
  
    const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
    res.status(200).json({ 
      message: 'File berhasil diunggah', 
      imageUrl: imageUrl 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



app.get('/movies', async (req, res) => {
  try {
    const { search, sort } = req.query;
    let queryBuilder = db('movies').select('*');
    if (search) queryBuilder = queryBuilder.where('title', 'like', `%${search}%`);
    if (sort) queryBuilder = queryBuilder.orderBy('title', sort);
    const movies = await queryBuilder;
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/movies', authMiddleware, async (req, res) => {
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

app.put('/movies/:id', authMiddleware, async (req, res) => {
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

app.delete('/movies/:id', authMiddleware, async (req, res) => {
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