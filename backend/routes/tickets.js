// ============================================================
// routes/tickets.js — Définition des routes /api/tickets
// Responsable : M1 (POST, GET) + M2 (GET/:id, PATCH/:id/status)
// ============================================================

const express = require('express');
const router  = express.Router();

// Importer les fonctions du controller
const {
  createTicket,    // M1
  getTickets,      // M1
  getTicketById,   // M2
  updateStatus,    // M2
} = require('../controllers/ticketController');

// --- Définition des routes ---

// POST   /api/tickets         → Créer un incident (M1)
router.post('/', createTicket);

// GET    /api/tickets         → Lister tous les tickets (M1)
// Supporte les query params : ?status=Nouveau  ou  ?category=Plomberie
router.get('/', getTickets);

// GET    /api/tickets/:id     → Détails d'un ticket (M2)
router.get('/:id', getTicketById);

// PATCH  /api/tickets/:id/status → Changer le statut (M2)
router.patch('/:id/status', updateStatus);

module.exports = router;
