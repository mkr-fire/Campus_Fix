// ============================================================
// controllers/ticketController.js — Logique métier des routes
// Responsable : M1 (createTicket, getTickets)
//               M2 (getTicketById, updateStatus)
// ============================================================

const Ticket = require('../models/Ticket');

// ------------------------------------------------------------
// [M1] POST /api/tickets — Créer un nouvel incident
// ------------------------------------------------------------
const createTicket = async (req, res, next) => {
  try {
    // Extraire les champs du corps de la requête
    const { title, description, location, category, priority } = req.body;

    // Créer et sauvegarder le ticket en base
    // Mongoose valide automatiquement les champs requis et les enums
    const ticket = await Ticket.create({ title, description, location, category, priority });

    // Répondre avec le ticket créé (201 = Created)
    res.status(201).json(ticket);
  } catch (error) {
    // Passer l'erreur au middleware errorHandler (M2)
    next(error);
  }
};

// ------------------------------------------------------------
// [M1] GET /api/tickets — Lister les tickets (avec filtres)
// Exemples : GET /api/tickets?status=Nouveau
//            GET /api/tickets?category=Plomberie
// ------------------------------------------------------------
const getTickets = async (req, res, next) => {
  try {
    // Construire le filtre à partir des query params
    const filter = {};
    if (req.query.status)   filter.status   = req.query.status;
    if (req.query.category) filter.category = req.query.category;

    // Récupérer les tickets correspondant au filtre, triés du plus récent
    const tickets = await Ticket.find(filter).sort({ createdAt: -1 });

    res.status(200).json(tickets);
  } catch (error) {
    next(error);
  }
};

// ------------------------------------------------------------
// [M2] GET /api/tickets/:id — Détails d'un ticket
// ------------------------------------------------------------
const getTicketById = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    // Si aucun ticket trouvé avec cet ID → erreur 404
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket non trouvé' });
    }

    res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
};

// ------------------------------------------------------------
// [M2] PATCH /api/tickets/:id/status — Mettre à jour le statut
// Corps attendu : { "status": "En cours" }
// ------------------------------------------------------------
const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    // Valeurs autorisées pour le statut
    const validStatuses = ['Nouveau', 'En cours', 'Resolu'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Statut invalide. Valeurs acceptées : ${validStatuses.join(', ')}` });
    }

    // Trouver le ticket et mettre à jour son statut
    // { new: true } retourne le document APRÈS modification
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket non trouvé' });
    }

    res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
};

module.exports = { createTicket, getTickets, getTicketById, updateStatus };
