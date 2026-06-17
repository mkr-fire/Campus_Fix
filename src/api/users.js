// ============================================================
// src/api/users.js — Appels API pour les utilisateurs
// Responsable : M5
// ============================================================

const BASE_URL = '/api/users';

const normalizeUser = (user) => ({
  ...user,
  id: user.id || user._id,
});

const normalizeUsers = (users) => users.map(normalizeUser);

export const getUsers = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.role) params.append('role', filters.role);
  if (filters.status) params.append('status', filters.status);
  if (filters.email) params.append('email', filters.email);

  const url = params.toString() ? `${BASE_URL}?${params}` : BASE_URL;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Erreur lors du chargement des utilisateurs');
  }

  const data = await response.json();
  return normalizeUsers(data);
};

export const createUser = async (userData) => {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Erreur lors de la création de l\'utilisateur');
  }

  return normalizeUser(data);
};

export const updateUserStatus = async (id, status) => {
  const response = await fetch(`${BASE_URL}/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Erreur lors de la mise à jour du statut');
  }

  return normalizeUser(data);
};

export const deleteUser = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Erreur lors de la suppression de l\'utilisateur');
  }

  return response.json();
};
