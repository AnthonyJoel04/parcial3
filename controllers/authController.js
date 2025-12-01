const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');

const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

function generateToken(user) {
  const payload = { id: user.id, email: user.email };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
}

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email y password son requeridos' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Ya existe un usuario con ese email' });
    }

    const hashed = await bcrypt.hash(password, saltRounds);
    
    const newUser = await User.create({ name, email, password: hashed });

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente',
      token
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email y password son requeridos' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Usuario logueado',
      token
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 🔥 AQUÍ VA TU FUNCIÓN NUEVA
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.status(200).json({
      success: true,
      users
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Error obteniendo usuarios',
      error: err.message
    });
  }
};
