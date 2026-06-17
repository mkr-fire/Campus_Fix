// ============================================================
// routes/users.js — Définition des routes /api/users
// Responsable : M2
// ============================================================

const express = require('express');
const router = express.Router();

const {
  createUser,
  getUsers,
  getUserById,
  updateStatus,
  deleteUser,
} = require('../controllers/userController');

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.patch('/:id/status', updateStatus);
router.delete('/:id', deleteUser);

module.exports = router;
