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

import React, { useState, useEffect } from "react";
import {
  getTickets,
  updateTicketStatus,
} from "../api/tickets.js";

import TicketFilter from "./TicketFilter.jsx";
import TicketCard from "./TicketCard.jsx";

function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    category: "",
  });

  const [loading, setLoading] = useState(true);

  //  FIX 1 : charger API
  const loadTickets = async () => {
    setLoading(true);
    try {
      const data = await getTickets();
      setTickets(data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTickets();
  }, []);

  //  FIX 2 : filtrage réel
  const filteredTickets = tickets.filter((t) => {
    return (
      (filters.status ? t.status === filters.status : true) &&
      (filters.category ? t.category === filters.category : true)
    );
  });

  //  FIX 3 : PATCH + update UI sans refresh
  const handleStatusChange = async (id, newStatus) => {
    try {
      const updated = await updateTicketStatus(id, newStatus);

      setTickets((prev) =>
        prev.map((t) => (t._id === id ? updated : t))
      );
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 40 }}><div className="spinner" /></div>;

  return (
    <section>
      <h2>Dashboard Technicien</h2>

      <TicketFilter filters={filters} onFilterChange={setFilters} />

      {filteredTickets.map((ticket) => (
        <TicketCard
          key={ticket._id}
          ticket={ticket}
          onStatusChange={handleStatusChange}
        />
      ))}
    </section>
  );
}

export default Dashboard;