interface PanelLateralDerProps {
    abierto: boolean;
    titulo: string;
    onCerrar: () => void;
    children: React.ReactNode;
}

const PanelLateralDer: React.FC<PanelLateralDerProps> = ({abierto, titulo, onCerrar, children}) =>{
    if (!abierto) return null;

    return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onCerrar} />

      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">{titulo}</h2>

          <button
            onClick={onCerrar}
            className="text-gray-500 hover:text-gray-900"
          >
            Cerrar
          </button>
        </div>

        {children}
      </aside>
    </div>
    );
}

export default PanelLateralDer;
