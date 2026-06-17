import React, { useEffect, useMemo, useState } from "react";
import { getTickets, updateTicketStatus } from "../api/tickets.js";
import TicketCard from "./TicketCard.jsx";
import TicketFilter from "./TicketFilter.jsx";

const emptyFilters = {
  status: "",
  category: "",
};

function Dashboard({
  role = "technician",
  technicianCategory = "",
  technicians = [],
  approvedTechnicians = [],
  pendingTechnicians = [],
  onApproveTechnician,
  onSuspendTechnician,
  onRemoveTechnician,
  isPrincipalAdmin = false,
  onAddAdmin,
}) {
  const [tickets, setTickets] = useState([]);
  const [filters, setFilters] = useState({
    ...emptyFilters,
    category: role === "technician" ? technicianCategory : "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTickets = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getTickets(role === "technician" ? { category: technicianCategory } : {});
      setTickets(data);
    } catch (err) {
      setError(err.message || "Impossible de charger les incidents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [role, technicianCategory]);

  const stats = useMemo(() => {
    return {
      total: tickets.length,
      nouveaux: tickets.filter((ticket) => ticket.status === "Nouveau").length,
      enCours: tickets.filter((ticket) => ticket.status === "En cours").length,
      resolus: tickets.filter((ticket) => ticket.status === "Resolu").length,
    };
  }, [tickets]);

  const [showAddAdminForm, setShowAddAdminForm] = useState(false);
  const [newAdminData, setNewAdminData] = useState({ name: "", email: "" });
  const [adminMessage, setAdminMessage] = useState(null);

  const filteredTickets = tickets.filter((ticket) => {
    const matchStatus = filters.status ? ticket.status === filters.status : true;
    const matchCategory =
      role === "technician"
        ? ticket.category === technicianCategory
        : filters.category
          ? ticket.category === filters.category
          : true;

    return matchStatus && matchCategory;
  });

  const handleNewAdminSubmit = (event) => {
    event.preventDefault();
    const name = newAdminData.name.trim();
    const email = newAdminData.email.trim().toLowerCase();

    if (!name || !email) {
      setAdminMessage({ type: "error", text: "Nom et email obligatoires." });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setAdminMessage({ type: "error", text: "Email non valide." });
      return;
    }

    onAddAdmin?.({
      id: `admin-${Date.now()}`,
      name,
      email,
      role: "admin",
    });

    setNewAdminData({ name: "", email: "" });
    setShowAddAdminForm(false);
    setAdminMessage({ type: "success", text: "Administrateur ajoute." });
  };

  const handleStatusChange = async (id, newStatus) => {
    const updated = await updateTicketStatus(id, newStatus);
    setTickets((prev) => prev.map((ticket) => (ticket._id === id ? updated : ticket)));
  };

  return (
    <section className="dashboard-section">
      <div className="stats-grid">
        <div className="stat-card">
          <span>Total</span>
          <strong>{stats.total}</strong>
        </div>
        <div className="stat-card">
          <span>Nouveaux</span>
          <strong>{stats.nouveaux}</strong>
        </div>
        <div className="stat-card">
          <span>En cours</span>
          <strong>{stats.enCours}</strong>
        </div>
        <div className="stat-card">
          <span>Resolus</span>
          <strong>{stats.resolus}</strong>
        </div>
      </div>

      {role === "admin" && (
        <section className="card technician-admin-panel">
          <div className="section-title-row">
            <div>
              <span className="eyebrow">Comptes techniciens</span>
              <h2>Validation administrateur</h2>
            </div>
            <div className="section-actions">
              {isPrincipalAdmin && (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    setShowAddAdminForm((prev) => !prev);
                    setAdminMessage(null);
                  }}
                >
                  {showAddAdminForm ? "Annuler" : "Ajouter un administrateur"}
                </button>
              )}
              <span className="category-chip">{pendingTechnicians.length} en attente</span>
            </div>
          </div>

          {isPrincipalAdmin && showAddAdminForm && (
            <div className="admin-add-form card compact">
              <h3>Nouvel administrateur</h3>
              {adminMessage && (
                <div className={`message ${adminMessage.type === "success" ? "success" : "error"}`}>
                  {adminMessage.text}
                </div>
              )}
              <form onSubmit={handleNewAdminSubmit}>
                <label htmlFor="new-admin-name">Nom</label>
                <input
                  id="new-admin-name"
                  value={newAdminData.name}
                  onChange={(event) =>
                    setNewAdminData((prev) => ({ ...prev, name: event.target.value }))
                  }
                  placeholder="Nom complet"
                />
                <label htmlFor="new-admin-email">Email</label>
                <input
                  id="new-admin-email"
                  type="email"
                  value={newAdminData.email}
                  onChange={(event) =>
                    setNewAdminData((prev) => ({ ...prev, email: event.target.value }))
                  }
                  placeholder="admin@campusfix.local"
                />
                <button type="submit" className="btn-primary">
                  Enregistrer l'administrateur
                </button>
              </form>
            </div>
          )}

          <div className="technician-columns">
            <div>
              <h3>Demandes a valider</h3>
              <div className="technician-list">
                {pendingTechnicians.length === 0 ? (
                  <p className="empty-state">Aucune demande en attente.</p>
                ) : (
                  pendingTechnicians.map((technician) => (
                    <article className="technician-row" key={technician.id}>
                      <div>
                        <strong>{technician.name}</strong>
                        <span>{technician.email}</span>
                        <small>{technician.category}</small>
                      </div>
                      <div className="row-actions">
                        <button
                          type="button"
                          className="btn-primary"
                          onClick={() => onApproveTechnician?.(technician.id)}
                        >
                          Valider
                        </button>
                        <button
                          type="button"
                          className="btn-ghost danger"
                          onClick={() => onRemoveTechnician?.(technician.id)}
                        >
                          Refuser
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>

            <div>
              <h3>Techniciens actifs</h3>
              <div className="technician-list">
                {approvedTechnicians.length === 0 ? (
                  <p className="empty-state">Aucun technicien valide.</p>
                ) : (
                  approvedTechnicians.map((technician) => (
                    <article className="technician-row" key={technician.id}>
                      <div>
                        <strong>{technician.name}</strong>
                        <span>{technician.email}</span>
                        <small>{technician.category}</small>
                      </div>
                      <button
                        type="button"
                        className="btn-ghost danger"
                        onClick={() => onSuspendTechnician?.(technician.id)}
                      >
                        Suspendre
                      </button>
                    </article>
                  ))
                )}
              </div>
            </div>
          </div>

          {technicians.some((technician) => technician.status === "Suspendu") && (
            <div className="suspended-list">
              <h3>Comptes suspendus</h3>
              {technicians
                .filter((technician) => technician.status === "Suspendu")
                .map((technician) => (
                  <article className="technician-row compact" key={technician.id}>
                    <div>
                      <strong>{technician.name}</strong>
                      <span>{technician.email}</span>
                    </div>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => onApproveTechnician?.(technician.id)}
                    >
                      Reactiver
                    </button>
                  </article>
                ))}
            </div>
          )}
        </section>
      )}

      <section className="card tickets-panel">
        <div className="section-title-row">
          <div>
            <span className="eyebrow">Incidents</span>
            <h2>{role === "admin" ? "Tous les signalements" : "Signalements de mon domaine"}</h2>
          </div>
          <button type="button" className="btn-ghost" onClick={loadTickets} disabled={loading}>
            Actualiser
          </button>
        </div>

        <TicketFilter
          filters={filters}
          onFilterChange={setFilters}
          lockCategory={role === "technician"}
          lockedCategoryLabel={technicianCategory}
        />

        {loading && (
          <div className="loading-state">
            <span className="spinner" aria-hidden />
            <span>Chargement des incidents...</span>
          </div>
        )}

        {error && <div className="message error">{error}</div>}

        {!loading && !error && filteredTickets.length === 0 && (
          <p className="empty-state">Aucun incident ne correspond aux filtres.</p>
        )}

        {!loading && !error && filteredTickets.length > 0 && (
          <div className="ticket-list">
            {filteredTickets.map((ticket) => (
              <TicketCard key={ticket._id} ticket={ticket} onStatusChange={handleStatusChange} />
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

export default Dashboard;
