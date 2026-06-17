// ============================================================
// models/User.js — Schéma Mongoose des utilisateurs
// Responsable : M2
// ============================================================

const mongoose = require('mongoose');

const categories = ['Informatique', 'Plomberie', 'Electricite', 'Autre'];

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est obligatoire'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'L\'email est obligatoire'],
    trim: true,
    lowercase: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'technician'],
  },
  category: {
    type: String,
    trim: true,
    enum: categories,
    required: function () {
      return this.role === 'technician';
    },
  },
  status: {
    type: String,
    enum: ['En attente', 'Approuve', 'Suspendu', 'Actif'],
    required: true,
    default: function () {
      return this.role === 'admin' ? 'Actif' : 'En attente';
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);
