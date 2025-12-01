require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { sequelize, testConnection } = require('./config/database.js');

const authRoutes = require('./routes/auth');
const User = require('./models/user');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Auth system backend alive' });
});

console.log("Cargando rutas de AUTH...");
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await testConnection();

    await sequelize.sync();
    console.log("Modelos sincronizados correctamente");

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Unable to start server:', err);
    process.exit(1);
  }
})();