import React from 'react';

interface KPICardsProps {
  total: number;
  activas: number;
  inactivas: number;
}

export const KPICards: React.FC<KPICardsProps> = ({ total, activas, inactivas }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
      {/* Total Bodegas */}
      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 text-2xl font-bold shadow-inner">
          🏬
        </div>
        <div className="text-left">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Total Bodegas</p>
          <h3 className="text-3xl font-black text-gray-800">{total}</h3>
        </div>
      </div>

      {/* Activas */}
      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 text-2xl font-bold shadow-inner">
          🟢
        </div>
        <div className="text-left">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Activas</p>
          <h3 className="text-3xl font-black text-gray-800">{activas}</h3>
        </div>
      </div>

      {/* Inactivas */}
      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 text-2xl font-bold shadow-inner">
          🔴
        </div>
        <div className="text-left">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Inactivas</p>
          <h3 className="text-3xl font-black text-gray-800">{inactivas}</h3>
        </div>
      </div>
    </div>
  );
};
