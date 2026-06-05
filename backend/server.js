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

// Importer le middleware de gestion d'erreurs (M2)
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

// --- Connexion à la base de données ---
connectDB();

// --- Création de l'application Express ---
const app = express();

// Middleware pour parser le JSON dans les requêtes
app.use(express.json());

// Middleware CORS : autorise le frontend React (port 5173 en dev)
// TODO (M2) : ajuster l'origine si nécessaire
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH'],
}));

// --- Déclaration des routes ---
// Toutes les routes tickets sont préfixées par /api/tickets
app.use('/api/tickets', ticketRoutes);

// Route de test rapide pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
  res.json({ message: '✅ Campus Fix API opérationnelle !' });
});

// Middleware de gestion des erreurs (doit être en DERNIER)
// Middleware pour route non trouvée (404)
app.use(notFound);

// Middleware de gestion des erreurs (doit être en DERNIER)
app.use(errorHandler);

// --- Lancement du serveur ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
