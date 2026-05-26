import React from 'react';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface ToastContainerProps {
  toasts: Toast[];
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 pointer-events-auto min-w-[280px] max-w-sm animate-in slide-in-from-right-10 duration-300 border relative ${
            toast.type === 'success'
              ? 'bg-white border-emerald-100 text-gray-800'
              : toast.type === 'error'
              ? 'bg-white border-red-100 text-gray-800'
              : 'bg-white border-blue-100 text-gray-800'
          }`}
        >
          {/* Icono de Toast */}
          <span className="text-xl">
            {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : '⚠️'}
          </span>
          <div className="flex-1 text-left">
            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
              {toast.type === 'success' ? 'Éxito' : toast.type === 'error' ? 'Error' : 'Aviso'}
            </p>
            <p className="text-xs font-bold text-gray-700 leading-snug mt-0.5">{toast.message}</p>
          </div>
          {/* Pequeña barra animada de progreso */}
          <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r rounded-b-2xl transition-all duration-3000 ${
            toast.type === 'success' ? 'from-emerald-400 to-emerald-600 w-full animate-out fade-out' : toast.type === 'error' ? 'from-red-400 to-red-600 w-full' : 'from-blue-400 to-blue-600 w-full'
          }`} />
        </div>
      ))}
    </div>
  );
};
