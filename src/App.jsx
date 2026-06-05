// ============================================================
// src/App.jsx — Composant racine de l'application
// Responsable : M5 (Chef de Projet)
// ============================================================
// Ce composant orchestre l'affichage global :
//   - En haut : le formulaire de déclaration (M3)
//   - En bas  : le tableau de bord technicien (M4)
// ============================================================

import React, { useState } from 'react';
import ReportIssueForm from './components/ReportIssueForm.jsx';
import Dashboard from './components/Dashboard.jsx';

function App() {
  // Cet état sert à forcer le rechargement du Dashboard
  // quand un nouveau ticket est créé via le formulaire.
  // M5 passe cette fonction à ReportIssueForm comme prop.
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTicketCreated = () => {
    // Incrémenter refreshKey force le Dashboard à se recharger
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '20px' }}>

      {/* En-tête */}
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>🏫 Campus Fix</h1>
        <p>Plateforme de signalement d'incidents — Université de Maroua</p>
      </header>

      {/* Formulaire de déclaration d'incident (M3) */}
      {/* onTicketCreated est appelé après une soumission réussie */}
      <ReportIssueForm onTicketCreated={handleTicketCreated} />

      <hr style={{ margin: '40px 0' }} />

      {/* Tableau de bord technicien (M4) */}
      {/* refreshKey change → Dashboard se réexécute et recharge les tickets */}
      <Dashboard key={refreshKey} />

    </div>
  );
}

export default App;
