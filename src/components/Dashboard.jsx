// ============================================================
// src/components/Dashboard.jsx — Tableau de bord technicien
// Responsable : M4
// ============================================================
// Ce composant :
//   1. Charge tous les tickets au démarrage (useEffect)
//   2. Stocke la liste brute dans `tickets` (useState)
//   3. Passe les filtres sélectionnés à TicketFilter
//   4. Applique Array.filter() pour produire `filteredTickets`
//   5. Affiche une TicketCard par ticket filtré
// ============================================================

import React, { useState, useEffect } from 'react';
import { getTickets, updateTicketStatus } from '../api/tickets.js';
import TicketFilter from './TicketFilter.jsx';
import TicketCard from './TicketCard.jsx';

function Dashboard() {
  // Liste brute de tous les tickets (données de l'API)
  const [tickets, setTickets] = useState([]);

  // Filtres actifs sélectionnés dans TicketFilter
  const [filters, setFilters] = useState({ status: '', category: '' });

  // État de chargement
  const [loading, setLoading] = useState(true);

  // TODO (M4) : Charger les tickets au montage du composant
  useEffect(() => {
    // À compléter par M4 :
    // 1. Appeler getTickets() depuis ../api/tickets.js
    // 2. Stocker le résultat dans setTickets(...)
    // 3. Mettre setLoading(false) dans tous les cas (succès ou erreur)
    setLoading(false); // Temporaire — à remplacer
  }, []);

  // TODO (M4) : Filtrage côté front avec Array.filter()
  // Appliquer les filtres actifs sur la liste complète
  const filteredTickets = tickets; // À remplacer par le vrai filtre

  // TODO (M4) : Mettre à jour le statut d'un ticket
  // Appelée depuis TicketCard quand l'utilisateur clique sur un bouton de statut
  const handleStatusChange = async (id, newStatus) => {
    // À compléter par M4 :
    // 1. Appeler updateTicketStatus(id, newStatus)
    // 2. Mettre à jour l'état local `tickets` sans recharger toute la page
    //    Astuce : setTickets(prev => prev.map(t => t._id === id ? updatedTicket : t))
  };

  if (loading) return <p>Chargement des incidents...</p>;

  return (
    <section>
      <h2>🔧 Tableau de Bord Technicien</h2>

      {/* Filtres (M4) */}
      <TicketFilter filters={filters} onFilterChange={setFilters} />

      {/* Liste des tickets */}
      {filteredTickets.length === 0 ? (
        <p>Aucun incident à afficher.</p>
      ) : (
        <div>
          {filteredTickets.map(ticket => (
            <TicketCard
              key={ticket._id}
              ticket={ticket}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Dashboard;
