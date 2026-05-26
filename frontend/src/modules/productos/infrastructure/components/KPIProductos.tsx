import React from 'react';

interface KPIProductosProps {
  total: number;
  bajoStock: number;
  sinStock: number;
}

export const KPIProductos: React.FC<KPIProductosProps> = ({ total, bajoStock, sinStock }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
      {/* Total Productos */}
      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 text-2xl font-bold shadow-inner">
          📦
        </div>
        <div className="text-left">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Total Productos</p>
          <h3 className="text-3xl font-black text-gray-800">{total}</h3>
        </div>
      </div>

      {/* Bajo Stock */}
      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
        <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 text-2xl font-bold shadow-inner">
          ⚠️
        </div>
        <div className="text-left">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Bajo Stock (≤ 5)</p>
          <h3 className="text-3xl font-black text-gray-800">{bajoStock}</h3>
        </div>
      </div>

      {/* Sin Stock */}
      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 text-2xl font-bold shadow-inner">
          🚨
        </div>
        <div className="text-left">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Agotados (0)</p>
          <h3 className="text-3xl font-black text-gray-800">{sinStock}</h3>
        </div>
      </div>
    </div>
  );
};
