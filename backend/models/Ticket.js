// ============================================================
// models/Ticket.js — Schéma Mongoose du ticket d'incident
// Responsable : M1
// ============================================================

const mongoose = require('mongoose');

// Définition du schéma (structure d'un document Ticket en base)
const ticketSchema = new mongoose.Schema({

  // Titre court de l'incident (obligatoire)
  title: {
    type: String,
    required: [true, 'Le titre est obligatoire'],
    trim: true,
  },

  // Description détaillée du problème (obligatoire)
  description: {
    type: String,
    required: [true, 'La description est obligatoire'],
    trim: true,
  },

  // Localisation physique (ex: "Salle B204") (obligatoire)
  location: {
    type: String,
    required: [true, 'La localisation est obligatoire'],
    trim: true,
  },

  // Catégorie du problème (obligatoire, valeurs prédéfinies)
  category: {
    type: String,
    required: [true, 'La catégorie est obligatoire'],
    enum: {
      values: ['Informatique', 'Plomberie', 'Electricite', 'Autre'],
      message: 'Catégorie invalide : {VALUE}',
    },
  },

  // Priorité de l'incident (optionnelle, "Moyenne" par défaut)
  priority: {
    type: String,
    enum: {
      values: ['Basse', 'Moyenne', 'Haute'],
      message: 'Priorité invalide : {VALUE}',
    },
    default: 'Moyenne',
  },

  // Statut de traitement du ticket ("Nouveau" à la création)
  status: {
    type: String,
    enum: {
      values: ['Nouveau', 'En cours', 'Resolu'],
      message: 'Statut invalide : {VALUE}',
    },
    default: 'Nouveau',
  },

  // Date de création (automatique)
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Création et export du modèle Mongoose
// mongoose.model('Ticket', ...) → collection "tickets" en base
module.exports = mongoose.model('Ticket', ticketSchema);
