// ============================================================
// src/api/tickets.js — Fonctions centralisées d'appel à l'API
// Responsable : M5 (Chef de Projet)
// ============================================================
// RÈGLE : Tous les appels fetch vers le backend passent par ici.
// Les composants React n'écrivent JAMAIS de fetch en dur.
// Ils importent ces fonctions et les appellent.
//
// Grâce au proxy Vite (vite.config.js), on écrit juste "/api/..."
// sans avoir à écrire "http://localhost:5000/api/..." en dur.
// ============================================================

const BASE_URL = '/api/tickets';

// ------------------------------------------------------------
// Créer un nouveau ticket (utilisé par M3 — ReportIssueForm)
// @param {Object} ticketData — { title, description, location, category, priority }
// @returns {Object} Le ticket créé
// ------------------------------------------------------------
export const createTicket = async (ticketData) => {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ticketData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de la création du ticket');
  }

  return response.json();
};

// ------------------------------------------------------------
// Récupérer tous les tickets (utilisé par M4 — Dashboard)
// @param {Object} filters — { status: 'Nouveau', category: 'Plomberie' } (optionnel)
// @returns {Array} Liste de tickets
// ------------------------------------------------------------
export const getTickets = async (filters = {}) => {
  // Construire les paramètres de requête si des filtres sont fournis
  const params = new URLSearchParams();
  if (filters.status)   params.append('status', filters.status);
  if (filters.category) params.append('category', filters.category);

  const url = params.toString() ? `${BASE_URL}?${params}` : BASE_URL;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Erreur lors du chargement des tickets');
  }

  return response.json();
};

// ------------------------------------------------------------
// Mettre à jour le statut d'un ticket (utilisé par M4 — TicketCard)
// @param {string} id — ID MongoDB du ticket
// @param {string} status — Nouveau statut : 'En cours' ou 'Resolu'
// @returns {Object} Le ticket mis à jour
// ------------------------------------------------------------
export const updateTicketStatus = async (id, status) => {
  const response = await fetch(`${BASE_URL}/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de la mise à jour du statut');
  }

  return response.json();
};
