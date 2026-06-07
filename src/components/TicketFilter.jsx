// ============================================================
// src/components/TicketFilter.jsx — Barre de filtres
// Responsable : M4
// ============================================================
// Props reçues :
//   filters       (object)   — { status: '', category: '' }
//   onFilterChange (function) — appelée quand un filtre change
// ============================================================

import React from 'react';

// Options disponibles pour les filtres
const CATEGORIES = ['', 'Informatique', 'Plomberie', 'Electricite', 'Autre'];
const STATUTS    = ['', 'Nouveau', 'En cours', 'Resolu'];

function TicketFilter({ filters, onFilterChange }) {

  // TODO (M4) : Gérer le changement d'un filtre
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>

      {/* Filtre par Catégorie */}
      <div>
        <label htmlFor="category">Catégorie : </label>
        <select
          id="category"
          name="category"
          value={filters.category}
          onChange={handleChange}
        >
          <option value="">Toutes</option>
          {CATEGORIES.filter(c => c !== '').map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Filtre par Statut */}
      <div>
        <label htmlFor="status">Statut : </label>
        <select
          id="status"
          name="status"
          value={filters.status}
          onChange={handleChange}
        >
          <option value="">Tous</option>
          {STATUTS.filter(s => s !== '').map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

    </div>
  );
}

export default TicketFilter;
