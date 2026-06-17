import React, { useState } from "react";
import { createTicket } from "../api/tickets.js";

const initialForm = {
  reporterName: "",
  reporterContact: "",
  title: "",
  description: "",
  location: "",
  category: "Informatique",
  priority: "Moyenne",
};

function ReportIssueForm({ onTicketCreated, isGuest = false }) {
  const [formData, setFormData] = useState(initialForm);
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title || !formData.description || !formData.location) {
      setMessage({ type: "error", text: "Titre, description et localisation sont obligatoires." });
      return;
    }

    setIsSubmitting(true);

    try {
      const newTicket = await createTicket({
        ...formData,
        reporterName: formData.reporterName || "Invite",
        reporterContact: formData.reporterContact || "Non renseigne",
      });

      setMessage({ type: "success", text: "Incident declare avec succes." });
      setFormData(initialForm);

      if (onTicketCreated) onTicketCreated(newTicket);
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Erreur reseau." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="report-section">
      <form onSubmit={handleSubmit} className="card form-card">
        <div className="form-title-row">
          <div>
            <span className="eyebrow">{isGuest ? "Declaration sans compte" : "Nouvel incident"}</span>
            <h2>Renseignements d'incident</h2>
          </div>
          <span className="category-chip">Invite</span>
        </div>

        {message && (
          <div className={`message ${message.type === "success" ? "success" : "error"}`}>
            {message.text}
          </div>
        )}

        <div className="form-grid">
          <div>
            <label htmlFor="reporterName">Nom du declarant</label>
            <input
              id="reporterName"
              name="reporterName"
              placeholder="Facultatif"
              value={formData.reporterName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="reporterContact">Contact</label>
            <input
              id="reporterContact"
              name="reporterContact"
              placeholder="Mail ou telephone"
              value={formData.reporterContact}
              onChange={handleChange}
            />
          </div>
        </div>

        <label htmlFor="title">Titre *</label>
        <input
          id="title"
          name="title"
          placeholder="Ex: Projecteur en panne"
          value={formData.title}
          onChange={handleChange}
        />

        <label htmlFor="description">Description *</label>
        <textarea
          id="description"
          name="description"
          placeholder="Decrivez le probleme, son impact et toute information utile."
          value={formData.description}
          onChange={handleChange}
        />

        <div className="form-grid">
          <div>
            <label htmlFor="location">Localisation *</label>
            <input
              id="location"
              name="location"
              placeholder="Batiment, salle, zone"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="category">Categorie *</label>
            <select id="category" name="category" value={formData.category} onChange={handleChange}>
              <option value="Informatique">Informatique</option>
              <option value="Plomberie">Plomberie</option>
              <option value="Electricite">Electricite</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          <div>
            <label htmlFor="priority">Priorite</label>
            <select id="priority" name="priority" value={formData.priority} onChange={handleChange}>
              <option value="Basse">Basse</option>
              <option value="Moyenne">Moyenne</option>
              <option value="Haute">Haute</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? <span className="spinner" aria-hidden /> : null}
            {isSubmitting ? "Envoi..." : "Soumettre l'incident"}
          </button>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => setFormData(initialForm)}
            disabled={isSubmitting}
          >
            Reinitialiser
          </button>
        </div>
      </form>
    </section>
  );
}

export default ReportIssueForm;
