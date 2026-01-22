const express = require('express');
const router = express.Router();
const knexConfig = require('./knexfile').development;
const knex = require('knex')(knexConfig);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config(); 

const JWT_SECRET = process.env.JWT_SECRET;

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // cek user/email sudah ada
    const exists = await knex('users')
      .where('email', email)
      .orWhere('username', username)
      .first();

    if (exists) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const [newUser] = await knex('users')
      .insert({ username, email, password_hash })
      .returning(['id', 'username', 'email']);

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'All fields are required' });

    const user = await knex('users').where({ email }).first();
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// dapetin semua user
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // {id, email}
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await knex('users').select('id', 'username', 'email', 'created_at', 'updated_at');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

