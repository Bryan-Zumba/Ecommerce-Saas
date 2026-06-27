import { Cliente } from "../domain/Cliente";
import { useState } from "react";

export interface DatosFormularioCliente {
    cedula: string;
    nombres: string;
    apellidos: string;
    email?: string;
    telefono?: string;
}

interface FormularioClientesProps {
    clienteActual?: Cliente | null;
    onGuardar: (datos: DatosFormularioCliente) => void;
    onCancelar: () => void;
}

const FormularioCliente: React.FC<FormularioClientesProps> = ({ clienteActual, onGuardar, onCancelar }) => {
    const [cedula, setCedula] = useState(clienteActual?.cedula || '');
    const [nombres, setNombres] = useState(clienteActual?.nombres || '');
    const [apellidos, setApellidos] = useState(clienteActual?.apellidos || '');
    const [email, setEmail] = useState(clienteActual?.email || '');
    const [telefono, setTelefono] = useState(clienteActual?.telefono || '');

    const manejarEnvio = (e: React.FormEvent) => {
        e.preventDefault();

        if ((!cedula || !nombres || !apellidos) && !clienteActual) {//soloo para cuando es crear cliente
            alert("Cedula, nombres y apellidos son obligatorios")
            return;
        }

        onGuardar({
            cedula,
            nombres,
            apellidos,
            email,
            telefono,
        });

    }

    return (

        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <form onSubmit={manejarEnvio} className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-gray-800">
                    {clienteActual ? 'Editar Cliente' : 'Nuevo Cliente'}
                </h3>

                <div className="space-y-1 text-left">
                    <label className="font-bold text-gray-400 ml-1" htmlFor="cedula">Cedula:</label>
                    <input
                        id="cedula"
                        type="text"
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-400"
                        placeholder="Cédula"
                        value={cedula}
                        disabled={!!clienteActual}
                        onChange={(e) => setCedula(e.target.value)}
                    />
                </div>

                <div className="space-y-1 text-left">
                    <label htmlFor="nombres" className="font-bold text-gray-400 ml-1" >Nombres:</label>
                    <input
                        id="nombres"
                        type="text"
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-400"
                        placeholder="Nombres"
                        value={nombres}
                        onChange={(e) => setNombres(e.target.value)}
                    />
                </div>

                <div className="space-y-1 text-left">
                    <label htmlFor="apellidos" className="font-bold text-gray-400 ml-1">Apellidos:</label>
                    <input
                        id="apellidos"
                        type="text"
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-400"
                        placeholder="Apellidos"
                        value={apellidos}
                        onChange={(e) => setApellidos(e.target.value)}
                    />
                </div>

                <div className="space-y-1 text-left">
                    <label htmlFor="email" className="font-bold text-gray-400 ml-1">Email:</label>
                    <input
                        id="email"
                        autoComplete="email"
                        type="email"
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-400"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="space-y-1 text-left">
                    <label htmlFor="telefono" className="font-bold text-gray-400 ml-1">Telefono:</label>
                    <input
                        id="telefono"
                        type="text"
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-400"
                        placeholder="Telefono"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                    />
                </div>

                <div className="pt-4 flex gap-3">
                    <button
                        id="cancelar"
                        type="button"
                        onClick={onCancelar}
                        className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-500 text-sm font-bold rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all text-center"
                    >
                        Cancelar
                    </button>

                    <button
                        id="guardar"
                        type="submit"
                        className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2.5 rounded-xl transition-all active:scale-95 shadow-sm shadow-emerald-200"
                    >
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    );
}

export default FormularioCliente;