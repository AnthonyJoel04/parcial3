require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { sequelize, testConnection } = require('./config/database.js');

const authRoutes = require('./routes/auth');
const User = require('./models/user');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ruta simple de prueba
app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Auth system backend alive' });
});

console.log("Cargando rutas de AUTH...");
// Rutas principales
app.use('/api/auth', authRoutes);

// Iniciar servidor y DB
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    // Primero probamos conexión (tu función)
    await testConnection();

    // Luego sincronizamos modelos
    await sequelize.sync();
    console.log("Modelos sincronizados correctamente");

    // Levantar servidor
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Unable to start server:', err);
    process.exit(1);
  }
})();