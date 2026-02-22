const express = require('express');
const router = express.Router();
const knexConfig = require('./knexfile').development;
const knex = require('knex')(knexConfig);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer'); 
const { v4: uuidv4 } = require('uuid'); 

require('dotenv').config(); 
const JWT_SECRET = process.env.JWT_SECRET;


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  }
});

const sendVerificationEmail = async (userEmail, token) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Verifikasi Akun Movie App Anda',
    text: `Halo! Silakan verifikasi akun Anda dengan menggunakan token ini: ${token} \nAtau klik link: http://localhost:3000/users/verifikasi-email?token=${token}`
  };
  await transporter.sendMail(mailOptions);
};

const authMiddleware = require('./middleware/auth');


router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const exists = await knex('users')
      .where('email', email)
      .orWhere('username', username)
      .first();

    if (exists) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    

    const verification_token = uuidv4();

  
    const [newUser] = await knex('users')
      .insert({ 
        username, 
        email, 
        password_hash, 
        verification_token, 
        is_verified: false 
      })
      .returning(['id', 'username', 'email']);


    await sendVerificationEmail(email, verification_token);

    res.status(201).json({ 
      message: 'Registrasi berhasil. Silakan cek email untuk verifikasi.', 
      user: newUser 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/verifikasi-email', async (req, res) => {
  try {
    const { token } = req.query; 

    if (!token) {
      return res.status(400).json({ message: "Token tidak disediakan" });
    }

   
    const user = await knex('users').where({ verification_token: token }).first();

    if (!user) {
      return res.status(400).json({ message: "Invalid Verification Token" });
    }

    await knex('users')
      .where({ id: user.id })
      .update({ is_verified: true, verification_token: null });

    res.status(200).json({ message: "Email Verified Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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

router.get('/', authMiddleware, async (req, res) => {
     try {
    const users = await knex('users').select('id', 'username', 'email', 'created_at', 'updated_at');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { router, authMiddleware };
