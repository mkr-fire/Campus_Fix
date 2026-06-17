// ============================================================
// controllers/userController.js — Gestion des utilisateurs
// Responsable : M2
// ============================================================

const User = require('../models/User');

let memoryUsers = [
  {
    _id: 'memory-admin-principal',
    id: 'memory-admin-principal',
    name: 'Administrateur Campus Fix',
    email: 'admin@campusfix.local',
    role: 'admin',
    status: 'Actif',
    createdAt: new Date().toISOString(),
  },
];

const buildMemoryUser = ({ name, email, role, category }) => ({
  _id: `memory-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  id: `memory-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  name,
  email,
  role,
  category: role === 'technician' ? category : undefined,
  status: role === 'admin' ? 'Actif' : 'En attente',
  createdAt: new Date().toISOString(),
});

const getMemoryUsers = (query) => {
  return memoryUsers.filter((user) => {
    const matchRole = query.role ? user.role === query.role : true;
    const matchStatus = query.status ? user.status === query.status : true;
    const matchEmail = query.email ? user.email === query.email : true;
    return matchRole && matchStatus && matchEmail;
  });
};

const createUser = async (req, res, next) => {
  try {
    const { name, email, role, category } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ message: 'Nom, email et role sont obligatoires.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = name.trim();

    if (role === 'technician' && !category) {
      return res.status(400).json({ message: 'La categorie est obligatoire pour un technicien.' });
    }

    if (global.useMemoryDb) {
      if (memoryUsers.some((user) => user.email === normalizedEmail)) {
        return res.status(400).json({ message: 'Un utilisateur existe deja avec cette adresse.' });
      }

      const user = buildMemoryUser({
        name: normalizedName,
        email: normalizedEmail,
        role,
        category,
      });

      memoryUsers.unshift(user);
      return res.status(201).json(user);
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'Un utilisateur existe deja avec cette adresse.' });
    }

    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      role,
      category: role === 'technician' ? category : undefined,
      status: role === 'admin' ? 'Actif' : 'En attente',
    });

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    if (global.useMemoryDb) {
      return res.status(200).json(getMemoryUsers(req.query));
    }

    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.email) filter.email = req.query.email.trim().toLowerCase();

    const users = await User.find(filter).sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    if (global.useMemoryDb) {
      const user = memoryUsers.find((item) => item._id === req.params.id || item.id === req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouve' });
      }
      return res.status(200).json(user);
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouve' });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['En attente', 'Approuve', 'Suspendu', 'Actif'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: `Statut invalide. Valeurs acceptees : ${allowedStatuses.join(', ')}` });
    }

    if (global.useMemoryDb) {
      const user = memoryUsers.find((item) => item._id === req.params.id || item.id === req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouve' });
      }
      user.status = status;
      return res.status(200).json(user);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouve' });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    if (global.useMemoryDb) {
      const initialSize = memoryUsers.length;
      memoryUsers = memoryUsers.filter((item) => item._id !== req.params.id && item.id !== req.params.id);
      if (memoryUsers.length === initialSize) {
        return res.status(404).json({ message: 'Utilisateur non trouve' });
      }
      return res.status(200).json({ message: 'Utilisateur supprime' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouve' });
    }

    res.status(200).json({ message: 'Utilisateur supprime' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createUser, getUsers, getUserById, updateStatus, deleteUser };
