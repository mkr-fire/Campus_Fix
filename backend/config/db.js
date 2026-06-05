// ============================================================
// config/db.js — Connexion à MongoDB via Mongoose
// Responsable : M1
// ============================================================

const mongoose = require('mongoose');

// Variable globale pour savoir si on utilise la base de données réelle ou en mémoire
global.useMemoryDb = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campus_fix', {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB] Connecté avec succès : ${conn.connection.host}`);
  } catch (error) {
    console.warn('\n========================================================================');
    console.warn('[ATTENTION] Impossible de se connecter à la base de données MongoDB.');
    console.warn(`Détail de l'erreur : ${error.message}`);
    console.warn('Campus Fix fonctionnera temporairement en MODE SIMULATION.');
    console.warn('Les incidents seront stockés en mémoire vive (perdus après redémarrage).');
    console.warn('========================================================================\n');
    
    // Activer le mode simulation
    global.useMemoryDb = true;
  }
};

module.exports = connectDB;
