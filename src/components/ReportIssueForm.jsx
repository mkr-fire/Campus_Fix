// ============================================================
// src/components/ReportIssueForm.jsx — Formulaire de déclaration
// Responsable : M3
// ============================================================
// Props reçues :
//   onTicketCreated (function) — appelée après soumission réussie
//                                pour rafraîchir le Dashboard (M5)
// ============================================================

import React, { useState } from 'react';
import { createTicket } from '../api/tickets.js'; // Fonction API centralisée (M5)

// État initial du formulaire — réutilisé lors de la réinitialisation
const initialForm = {
  title:       '',
  description: '',
  location:    '',
  category:    '',
  priority:    'Moyenne', // Valeur par défaut
};

function ReportIssueForm({ onTicketCreated }) {
  // État des champs du formulaire
  const [formData, setFormData] = useState(initialForm);

  // Message de retour (succès ou erreur) affiché à l'utilisateur
  const [message, setMessage] = useState(null);

  // TODO (M3) : Gérer la saisie dans les champs
  // Astuce : une seule fonction handleChange pour tous les champs
  const handleChange = (e) => {
    // À compléter par M3
    // setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // TODO (M3) : Gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    // TODO (M3) :
    // 1. Vérifier que tous les champs requis sont remplis
    // 2. Appeler createTicket(formData) depuis ../api/tickets.js
    // 3. En cas de succès : afficher un message vert + réinitialiser le formulaire
    // 4. Appeler onTicketCreated() pour rafraîchir le Dashboard
    // 5. En cas d'erreur : afficher un message rouge
  };

  return (
    <section>
      <h2>📝 Déclarer un Incident</h2>

      {/* Affichage du message de succès ou d'erreur */}
      {message && (
        <p style={{ color: message.type === 'success' ? 'green' : 'red' }}>
          {message.text}
        </p>
      )}

      {/* TODO (M3) : Construire le formulaire avec les champs suivants :
          - title       (input text, requis)
          - description (textarea, requis)
          - location    (input text, requis)
          - category    (select : Informatique | Plomberie | Electricite | Autre, requis)
          - priority    (select : Basse | Moyenne | Haute)
          - bouton Soumettre
      */}
      <form onSubmit={handleSubmit}>
        <p>[ Formulaire à construire par M3 ]</p>
        <button type="submit">Soumettre l'incident</button>
      </form>
    </section>
  );
}

export default ReportIssueForm;
