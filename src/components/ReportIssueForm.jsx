// ============================================================
// src/components/ReportIssueForm.jsx — Formulaire de déclaration
// Responsable : M3
// ============================================================
// Props reçues :
//   onTicketCreated (function) — appelée après soumission réussie
//                                pour rafraîchir le Dashboard (M5)
// ============================================================

import React, { useState } from "react";
import { createTicket } from "../api/tickets.js";

const initialForm = {
  title: "",
  description: "",
  location: "",
  category: "Informatique",
  priority: "Moyenne",
};

function ReportIssueForm({ onTicketCreated }) {
  const [formData, setFormData] = useState(initialForm);
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ FIX 1 : handleChange
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ✅ FIX 2 : submit complet
  const handleSubmit = async (e) => {
    e.preventDefault();

    // validation simple
    if (!formData.title || !formData.description || !formData.location) {
      setMessage({ type: "error", text: "Tous les champs sont obligatoires" });
      return;
    }

    setIsSubmitting(true);
    try {
      const newTicket = await createTicket(formData);

      setMessage({ type: "success", text: "Incident créé avec succès" });

      setFormData(initialForm);

      // refresh dashboard
      if (onTicketCreated) onTicketCreated(newTicket);
    } catch (err) {
      setMessage({ type: "error", text: err.message || 'Erreur réseau' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section>
      <h2>📝 Déclarer un Incident</h2>

      <form onSubmit={handleSubmit} className="card">
        {message && (
          <div className={`message ${message.type === 'success' ? 'success' : 'error'}`}>
            {message.text}
          </div>
        )}

        <label htmlFor="title">Titre *</label>
        <input
          id="title"
          name="title"
          placeholder="Titre"
          value={formData.title}
          onChange={handleChange}
        />

        <label htmlFor="description">Description *</label>
        <textarea
          id="description"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />

        <label htmlFor="location">Localisation *</label>
        <input
          id="location"
          name="location"
          placeholder="Localisation"
          value={formData.location}
          onChange={handleChange}
        />

        <label htmlFor="category">Catégorie *</label>
        <select id="category" name="category" value={formData.category} onChange={handleChange}>
          <option value="Informatique">Informatique</option>
          <option value="Plomberie">Plomberie</option>
          <option value="Electricite">Electricite</option>
          <option value="Autre">Autre</option>
        </select>

        <label htmlFor="priority">Priorité</label>
        <select id="priority" name="priority" value={formData.priority} onChange={handleChange}>
          <option value="Basse">Basse</option>
          <option value="Moyenne">Moyenne</option>
          <option value="Haute">Haute</option>
        </select>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? <span className="spinner" aria-hidden></span> : (
              <svg className="icon" width="16" height="16" viewBox="0 0 24 24" style={{ verticalAlign:'middle', marginRight:8 }} xmlns="http://www.w3.org/2000/svg"><path d="M22 2L11 13" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/><path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#fff" strokeWidth="0" fill="#fff"/></svg>
            )}
            {isSubmitting ? 'Envoi...' : 'Soumettre'}
          </button>
          <button type="button" className="btn-ghost" onClick={() => setFormData(initialForm)} disabled={isSubmitting}>Réinitialiser</button>
        </div>
      </form>
    </section>
  );
}

export default ReportIssueForm;