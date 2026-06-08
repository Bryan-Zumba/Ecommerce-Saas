import React, { useState } from 'react';
import { PageInventario } from './PageInventario';
import { PageMovimientos } from './PageMovimientos';

type TabType = 'existencias' | 'movimientos';

export const PageMonitoreoInventario: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('existencias');

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Monitoreo de Inventario</h1>
        <p className="text-gray-500 mt-1">
          Gestiona y visualiza las existencias actuales y el historial de movimientos de productos.
        </p>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('existencias')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${activeTab === 'existencias'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Existencias en Bodega
          </button>

          <button
            onClick={() => setActiveTab('movimientos')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${activeTab === 'movimientos'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Historial de Movimientos
          </button>
        </nav>
      </div>

      <div className="mt-4">
        {activeTab === 'existencias' && <PageInventario isSubcomponent />}
        {activeTab === 'movimientos' && <PageMovimientos isSubcomponent />}
      </div>
    </div>
  );
};
