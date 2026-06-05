// ============================================================
// middleware/errorHandler.js — Gestion globale des erreurs
// Responsable : M2
// ============================================================
// Ce middleware intercepte toutes les erreurs passées via next(error)
// Il doit être déclaré EN DERNIER dans server.js (après toutes les routes)
// ============================================================

const errorHandler = (err, req, res, next) => {

  // Afficher l'erreur dans la console du serveur (pour le debug)
  console.error(`❌ Erreur : ${err.message}`);

  // --- Erreur de validation Mongoose (champ requis manquant, enum invalide) ---
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      message: 'Erreur de validation',
      errors: messages,
    });
  }

  // --- ID MongoDB mal formaté (CastError) ---
  if (err.name === 'CastError') {
    return res.status(400).json({
      message: `ID invalide : ${err.value}`,
    });
  }

  // --- Erreur générique (500 = Internal Server Error) ---
  res.status(err.statusCode || 500).json({
    message: err.message || 'Erreur interne du serveur',
  });
};

module.exports = errorHandler;
