// ============================================================
// src/components/TicketCard.jsx — Carte d'affichage d'un ticket
// Responsable : M4
// ============================================================
// Props reçues :
//   ticket        (object)   — données complètes du ticket
//   onStatusChange (function) — appelée avec (id, newStatus)
// ============================================================

import React, { useState } from 'react';

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

  const [isUpdating, setIsUpdating] = useState(false);

  return (
    <div className={`card ${cssClass}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <strong style={{ fontSize: '1.05rem' }}>{ticket.title}</strong>
          <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: 6 }}>[{ticket.category}]</div>
        </div>

        <div>
          <span className={`status-badge ${ticket.status === 'Nouveau' ? 'badge-nouveau' : ticket.status === 'En cours' ? 'badge-en-cours' : 'badge-resolu'}`}>
            {ticket.status}
          </span>
        </div>
      </div>

      <p style={{ margin: '12px 0', color: '#555' }}>{ticket.description}</p>

      <div style={{ display: 'flex', gap: 12, color: 'var(--muted)', fontSize: '0.9rem', alignItems: 'center' }}>
        <span><svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z" stroke="#2e75b6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>{ticket.location}</span>
        <span>• Priorité : <strong>{ticket.priority}</strong></span>
        <span>• {new Date(ticket.createdAt).toLocaleDateString('fr-FR')}</span>
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
        {nextStatus ? (
          <button
            onClick={async () => {
              setIsUpdating(true);
              try { await onStatusChange(ticket._id, nextStatus); } catch (e) { /* handled upstream */ }
              setIsUpdating(false);
            }}
            className="btn-primary"
            disabled={isUpdating}
          >
            {isUpdating ? <span className="spinner" /> : (
              <svg width="14" height="14" viewBox="0 0 24 24" style={{ verticalAlign:'middle', marginRight:8 }} xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14M13 5l7 7-7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
            )}
            {isUpdating ? 'En cours...' : `Passer à « ${nextStatus} »`}
          </button>
        ) : (
          <span style={{ color: 'var(--muted)' }}>Aucune action disponible</span>
        )}
      </div>
    </div>
  );
}

export default TicketCard;
