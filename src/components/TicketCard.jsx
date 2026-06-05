// ============================================================
// src/components/TicketCard.jsx — Carte d'affichage d'un ticket
// Responsable : M4
// ============================================================
// Props reçues :
//   ticket        (object)   — données complètes du ticket
//   onStatusChange (function) — appelée avec (id, newStatus)
// ============================================================

import React from 'react';

// Associe chaque statut à une classe CSS définie dans index.css
const STATUS_CLASS = {
  'Nouveau':  'status-nouveau',
  'En cours': 'status-en-cours',
  'Resolu':   'status-resolu',
};

// Détermine le prochain statut logique pour les boutons
const NEXT_STATUS = {
  'Nouveau':  'En cours',
  'En cours': 'Resolu',
  'Resolu':   null, // Déjà résolu, pas de transition suivante
};

function TicketCard({ ticket, onStatusChange }) {
  const cssClass = STATUS_CLASS[ticket.status] || '';
  const nextStatus = NEXT_STATUS[ticket.status];

  return (
    <div
      className={cssClass}
      style={{
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '12px',
        backgroundColor: '#fff',
      }}
    >
      {/* Titre et catégorie */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <strong>{ticket.title}</strong>
        <span>[{ticket.category}]</span>
      </div>

      {/* Description */}
      <p style={{ margin: '8px 0', color: '#555' }}>{ticket.description}</p>

      {/* Métadonnées */}
      <small>
        📍 {ticket.location} &nbsp;|&nbsp;
        ⚡ Priorité : {ticket.priority} &nbsp;|&nbsp;
        🕐 {new Date(ticket.createdAt).toLocaleDateString('fr-FR')}
      </small>

      {/* Statut actuel + bouton de transition */}
      <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span>Statut : <strong>{ticket.status}</strong></span>

        {/* Afficher le bouton seulement s'il y a un statut suivant */}
        {nextStatus && (
          <button
            onClick={() => onStatusChange(ticket._id, nextStatus)}
            style={{ backgroundColor: '#2e75b6', color: '#fff' }}
          >
            {/* TODO (M4) : adapter le libellé selon le contexte */}
            → Passer à "{nextStatus}"
          </button>
        )}
      </div>
    </div>
  );
}

export default TicketCard;
