import React from 'react';

const CustomerFilters = ({ searchQuery, setSearchQuery, onAddNew }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pt-4">
      <div className="relative w-full sm:max-w-md">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        <input
          type="text"
          placeholder="Buscar por nombre, cédula o email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-white shadow-sm"
        />
      </div>
      <button
        onClick={onAddNew}
        className="flex shrink-0 items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all active:scale-95 shadow-sm shadow-emerald-200 w-full sm:w-auto justify-center"
      >
        <span>+</span> Nuevo Cliente
      </button>
    </div>
  );
};

export default CustomerFilters;
