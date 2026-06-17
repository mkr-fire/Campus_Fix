import React from "react";

const CATEGORIES = ["", "Informatique", "Plomberie", "Electricite", "Autre"];
const STATUSES = ["", "Nouveau", "En cours", "Resolu"];

function TicketFilter({ filters, onFilterChange, lockCategory = false, lockedCategoryLabel = "" }) {
  const handleChange = (event) => {
    const { name, value } = event.target;
    onFilterChange((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="filter-bar">
      <div>
        <label htmlFor="category">Categorie</label>
        {lockCategory ? (
          <div className="locked-filter">{lockedCategoryLabel}</div>
        ) : (
          <select id="category" name="category" value={filters.category} onChange={handleChange}>
            <option value="">Toutes</option>
            {CATEGORIES.filter(Boolean).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        )}
      </div>

      <div>
        <label htmlFor="status">Statut</label>
        <select id="status" name="status" value={filters.status} onChange={handleChange}>
          <option value="">Tous</option>
          {STATUSES.filter(Boolean).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default TicketFilter;
