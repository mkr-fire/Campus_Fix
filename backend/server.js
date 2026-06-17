// ============================================================
// server.js — Point d'entrée du serveur Express (Campus Fix)
// Responsable : M1 (initialisation) + M2 (CORS, middleware)
// ============================================================

const express = require('express');
const dotenv  = require('dotenv');
const cors    = require('cors');

// Charger les variables d'environnement depuis .env
dotenv.config();

// Importer la fonction de connexion MongoDB (M1)
const connectDB = require('./config/db');

// Importer les routes tickets (M1 + M2)
const ticketRoutes = require('./routes/tickets');
const userRoutes = require('./routes/users');

// Importer le middleware de gestion d'erreurs (M2)
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

// --- Création de l'application Express ---
const app = express();

// Middleware pour parser le JSON dans les requêtes
app.use(express.json());

// Middleware CORS : autorise le frontend React (port 5173 en dev)
// TODO (M2) : ajuster l'origine si nécessaire
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
}));

// --- Déclaration des routes ---
// Toutes les routes tickets sont préfixées par /api/tickets
app.use('/api/tickets', ticketRoutes);
// Toutes les routes utilisateurs sont préfixées par /api/users
app.use('/api/users', userRoutes);

// Route de test rapide pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
  res.json({ message: '✅ Campus Fix API opérationnelle !' });
});

// Middleware de gestion des erreurs (doit être en DERNIER)
// Middleware pour route non trouvée (404)
app.use(notFound);

// Middleware de gestion des erreurs (doit être en DERNIER)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  if (!global.useMemoryDb) {
    const User = require('./models/User');
    const principalEmail = 'admin@campusfix.local';
    const principalName = 'Administrateur Campus Fix';

    const adminExists = await User.findOne({ email: principalEmail, role: 'admin' });
    if (!adminExists) {
      await User.create({
        name: principalName,
        email: principalEmail,
        role: 'admin',
        status: 'Actif',
      });
    }
  }

  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  });
};

startServer();
