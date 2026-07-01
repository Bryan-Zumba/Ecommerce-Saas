import React from 'react';

interface KPIItemsProps {
  total: number;
  totalProductos: number;
  totalServicios: number;
}

export const KPIItems: React.FC<KPIItemsProps> = ({ total, totalProductos, totalServicios }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
      {/* Total Ítems */}
      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 text-2xl font-bold shadow-inner">
          📦
        </div>
        <div className="text-left">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Total Ítems</p>
          <h3 className="text-3xl font-black text-gray-800">{total}</h3>
        </div>
      </div>

      {/* Total Productos */}
      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 text-2xl font-bold shadow-inner">
          🛍️
        </div>
        <div className="text-left">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Productos</p>
          <h3 className="text-3xl font-black text-gray-800">{totalProductos}</h3>
        </div>
      </div>

      {/* Total Servicios */}
      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
        <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-500 text-2xl font-bold shadow-inner">
          🛠️
        </div>
        <div className="text-left">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Servicios</p>
          <h3 className="text-3xl font-black text-gray-800">{totalServicios}</h3>
        </div>
      </div>
    </div>
  );
};
