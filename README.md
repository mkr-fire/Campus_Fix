# Gestionnaire d'Incidents

Plateforme de signalement d'incidents pour l'Université de Maroua (ENSPM).  
Projet 8 : Campus_Fix (Full-Stack Node.js / React.js)

---

## 📁 Structure du projet

```
campus_fix/
│
├── README.md                  ← Ce fichier (documentation complète)
│
└── frontend/                  ← Application React (Vite)
    │
    ├── package.json           ← Dépendances React + scripts de lancement
    ├── vite.config.js         ← Config Vite (proxy API configuré)
    ├── index.html             ← Page HTML principale
    │
    ├── public/                ← Fichiers statiques (images, favicon)
    │
    ├── src/                   ← Code source React
    │   ├── main.jsx           ← Point d'entrée React
    │   ├── App.jsx            ← Composant racine + routage
    │   │
    │   ├── api/
    │   │   └── tickets.js     ← Toutes les fonctions fetch vers l'API
    │   │
    │   ├── styles/
    │   │   └── index.css      ← Styles globaux
    │   │
    │   └── components/
    │       ├── ReportIssueForm.jsx  ← Formulaire de déclaration d'incident (M3)
    │       ├── Dashboard.jsx        ← Tableau de bord principal (M4)
    │       ├── TicketFilter.jsx     ← Filtres par catégorie/statut (M4)
    │       └── TicketCard.jsx       ← Carte d'affichage d'un ticket (M4)
    │
    └── backend/               ← Serveur Node.js / Express (DANS le dossier frontend)
        │
        ├── package.json       ← Dépendances Express + scripts de lancement
        ├── server.js          ← Point d'entrée Express (crée le serveur HTTP)
        ├── .env               ← Variables d'environnement (NE PAS commiter sur Git)
        ├── .env.example       ← Modèle des variables d'environnement
        ├── .gitignore         ← Fichiers à ignorer par Git
        │
        ├── config/
        │   └── db.js          ← Connexion à MongoDB via Mongoose (M1)
        │
        ├── models/
        │   └── Ticket.js      ← Schéma Mongoose du ticket (M1)
        │
        ├── routes/
        │   └── tickets.js     ← Définition des routes /api/tickets (M1 + M2)
        │
        ├── controllers/
        │   └── ticketController.js  ← Logique métier de chaque route (M1 + M2)
        │
        └── middleware/
            └── errorHandler.js      ← Middleware global de gestion des erreurs (M2)
```

---

## ⚙️ Dépendances à installer

### Backend (dossier `frontend/backend/`)

| Package       | Rôle                                      |
|---------------|-------------------------------------------|
| express       | Framework web Node.js                     |
| mongoose      | ODM pour MongoDB                          |
| dotenv        | Chargement des variables d'environnement  |
| cors          | Autoriser les requêtes cross-origin React |
| nodemon       | Redémarrage auto du serveur (dev)         |

```bash
cd frontend/backend
npm install express mongoose dotenv cors
npm install --save-dev nodemon
```

### Frontend (dossier `frontend/`)

| Package       | Rôle                                      |
|---------------|-------------------------------------------|
| react         | Bibliothèque UI                           |
| react-dom     | Rendu React dans le DOM                   |
| vite          | Bundler ultra-rapide (dev + build)        |
| @vitejs/plugin-react | Plugin Vite pour React             |

```bash
cd frontend
npm install
```
> Le package.json frontend est déjà configuré avec Vite. Un simple `npm install` suffit.

---

## 🚀 Comment lancer l'application

### Étape 1 — Prérequis
- [Node.js](https://nodejs.org/) v18 ou supérieur installé
- [MongoDB](https://www.mongodb.com/) en cours d'exécution en local (port 27017)  
  OU une URL MongoDB Atlas (cloud gratuit)

### Étape 2 — Configurer les variables d'environnement

```bash
cd frontend/backend
cp .env.example .env
```
Puis ouvrir `.env` et renseigner :
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/campus_fix
```

### Étape 3 — Lancer le Backend

```bash
# Dans un premier terminal
cd frontend/backend
npm run dev
```
✅ Le serveur Express démarre sur **http://localhost:5000**

### Étape 4 — Lancer le Frontend

```bash
# Dans un second terminal (en parallèle)
cd frontend
npm run dev
```
✅ L'application React démarre sur **http://localhost:5173**

### Étape 5 — Accéder à l'application

Ouvrir le navigateur sur : **http://localhost:5173**

---

## 🔌 Routes API disponibles

| Méthode | Route                        | Description                    |
|---------|------------------------------|--------------------------------|
| POST    | /api/tickets                 | Créer un nouvel incident       |
| GET     | /api/tickets                 | Lister tous les tickets        |
| GET     | /api/tickets?status=Nouveau  | Filtrer par statut             |
| GET     | /api/tickets?category=Plomberie | Filtrer par catégorie       |
| GET     | /api/tickets/:id             | Voir un ticket en détail       |
| PATCH   | /api/tickets/:id/status      | Mettre à jour le statut        |

---

## 👥 Équipe

| Membre | Rôle              | Fichiers principaux                                      |
|--------|-------------------|----------------------------------------------------------|
| M1     | Backend Dev 1     | backend/config/db.js, models/Ticket.js, routes POST+GET  |
| M2     | Backend Dev 2     | backend/routes GET/:id + PATCH, middleware/errorHandler   |
| M3     | Frontend Dev 1    | src/components/ReportIssueForm.jsx                       |
| M4     | Frontend Dev 2    | src/components/Dashboard, TicketFilter, TicketCard       |
| M5     | Chef de Projet    | Architecture, App.jsx, src/api/tickets.js, README        |

---


```

---
