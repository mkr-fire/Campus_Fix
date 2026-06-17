import React, { useState } from "react";

const STATUS_CLASS = {
  Nouveau: "status-nouveau",
  "En cours": "status-en-cours",
  Resolu: "status-resolu",
};

const BADGE_CLASS = {
  Nouveau: "badge-nouveau",
  "En cours": "badge-en-cours",
  Resolu: "badge-resolu",
};

const NEXT_STATUS = {
  Nouveau: "En cours",
  "En cours": "Resolu",
  Resolu: null,
};

function TicketCard({ ticket, onStatusChange }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const nextStatus = NEXT_STATUS[ticket.status];

  const handleClick = async () => {
    if (!nextStatus) return;

    setIsUpdating(true);
    setError("");

    try {
      await onStatusChange(ticket._id, nextStatus);
    } catch (err) {
      setError(err.message || "Impossible de mettre a jour le statut.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <article className={`ticket-card ${STATUS_CLASS[ticket.status] || ""}`}>
      <div className="ticket-card-header">
        <div>
          <strong>{ticket.title}</strong>
          <div className="ticket-meta">
            <span>{ticket.category}</span>
            <span>{ticket.location}</span>
            <span>Priorite : {ticket.priority}</span>
          </div>
        </div>
        <span className={`status-badge ${BADGE_CLASS[ticket.status] || ""}`}>{ticket.status}</span>
      </div>

      <p>{ticket.description}</p>

      <div className="ticket-footer">
        <div className="ticket-reporter">
          <span>{ticket.reporterName || "Invite"}</span>
          <small>{ticket.reporterContact || "Contact non renseigne"}</small>
          <small>{new Date(ticket.createdAt).toLocaleDateString("fr-FR")}</small>
        </div>

        {nextStatus ? (
          <button type="button" className="btn-primary" onClick={handleClick} disabled={isUpdating}>
            {isUpdating ? <span className="spinner" aria-hidden /> : null}
            {isUpdating ? "Mise a jour..." : `Passer a ${nextStatus}`}
          </button>
        ) : (
          <span className="resolved-note">Aucune action disponible</span>
        )}
      </div>

      {error && <div className="message error">{error}</div>}
    </article>
  );
}

export default TicketCard;
