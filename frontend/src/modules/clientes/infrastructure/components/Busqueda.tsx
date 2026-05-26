interface FiltrosBusquedaProps{
    search: string;
    setSearch: (value: string) => void;
}

const FiltrosBusqueda = ({search, setSearch}: FiltrosBusquedaProps) => {
    return (
        <div className="relative w-full sm:max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
                type="text" 
                placeholder="Buscar por nombre o cédula" 
                value={search}
                onChange={(e)=> setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-white shadow-sm" />
        </div>
        
    );
};

export default FiltrosBusqueda;