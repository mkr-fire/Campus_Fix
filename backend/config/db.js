// ============================================================
// config/db.js — Connexion à MongoDB via Mongoose
// Responsable : M1
// ============================================================

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Connexion à MongoDB avec l'URI définie dans .env
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB connecté : ${conn.connection.host}`);
  } catch (error) {
    // Si la connexion échoue, on affiche l'erreur et on arrête le serveur
    console.error(`❌ Erreur de connexion MongoDB : ${error.message}`);
    process.exit(1); // Code 1 = sortie avec erreur
  }
};

module.exports = connectDB;
