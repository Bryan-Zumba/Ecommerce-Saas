import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { ClienteResponse } from "../types/ClienteResponse";
import { ClienteCreateDTO } from "../types/ClienteRequest";

export interface DatosFormularioCliente extends Omit<ClienteCreateDTO, "id_empresa"> {}

type ClienteLocal = ClienteResponse["clientes"][0];

interface FormularioClientesProps {
    isOpen: boolean;
    clienteActual?: ClienteLocal | null;
    onGuardar: (datos: DatosFormularioCliente) => void;
    onCancelar: () => void;
}

const FormularioCliente: React.FC<FormularioClientesProps> = ({ isOpen, clienteActual, onGuardar, onCancelar }) => {
    const [cedula, setCedula] = useState(clienteActual?.cedula || '');
    const [nombres, setNombres] = useState(clienteActual?.nombres || '');
    const [apellidos, setApellidos] = useState(clienteActual?.apellidos || '');
    const [email, setEmail] = useState(clienteActual?.email || '');
    const [telefono, setTelefono] = useState(clienteActual?.telefono || '');
    const [direccion, setDireccion] = useState(clienteActual?.direccion || '');
    const [errorGeneral, setErrorGeneral] = useState('');

    useEffect(() => {
        if (isOpen) {
            setCedula(clienteActual?.cedula || '');
            setNombres(clienteActual?.nombres || '');
            setApellidos(clienteActual?.apellidos || '');
            setEmail(clienteActual?.email || '');
            setTelefono(clienteActual?.telefono || '');
            setDireccion(clienteActual?.direccion || '');
            setErrorGeneral('');
        }
    }, [isOpen, clienteActual]);

    if (!isOpen) return null;

    const manejarEnvio = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorGeneral('');

        if (!cedula && !clienteActual) {
            setErrorGeneral('La cédula es obligatoria.');
            return;
        }
        if (!nombres || !apellidos) {
            setErrorGeneral('Nombres y apellidos son obligatorios.');
            return;
        }

        onGuardar({
            cedula,
            nombres,
            apellidos,
            email: email || undefined,
            telefono: telefono || undefined,
            direccion: direccion || undefined,
        });
    };

    const inputClass = "block w-full px-4 py-2.5 border border-gray-100 rounded-xl bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-sm font-semibold text-gray-800 transition-all disabled:opacity-60";
    const labelClass = "text-xs font-extrabold text-gray-500 uppercase tracking-wider";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onCancelar}
        >
            <div
                className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 text-left"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-50 bg-gradient-to-r from-emerald-50 to-white flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-extrabold text-gray-900">
                            {clienteActual ? '✏️ Editar Cliente' : '👥 Registrar Cliente'}
                        </h3>
                        <p className="text-xs text-gray-400 font-semibold mt-1">
                            {clienteActual ? 'Actualiza los datos del cliente.' : 'Completa los campos para registrar el cliente.'}
                        </p>
                    </div>
                    <button
                        onClick={onCancelar}
                        className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-400 font-bold transition-colors flex items-center justify-center text-sm"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={manejarEnvio}>
                    <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">

                        {errorGeneral && (
                            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">
                                {errorGeneral}
                            </div>
                        )}

                        {/* Cédula */}
                        <div className="space-y-1">
                            <label className={labelClass}>Cédula / RUC <span className="text-red-500">*</span></label>
                            <input
                                id="cedula"
                                type="text"
                                maxLength={20}
                                required={!clienteActual}
                                disabled={!!clienteActual}
                                placeholder="Ej. 0912345678"
                                value={cedula}
                                onChange={(e) => setCedula(e.target.value)}
                                className={inputClass}
                            />
                        </div>

                        {/* Nombres y Apellidos en grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <label className={labelClass}>Nombres <span className="text-red-500">*</span></label>
                                    <span className={`text-[10px] font-bold ${nombres.length > 90 ? 'text-red-500' : 'text-gray-400'}`}>{nombres.length}/100</span>
                                </div>
                                <input
                                    id="nombres"
                                    type="text"
                                    maxLength={100}
                                    required
                                    placeholder="Juan"
                                    value={nombres}
                                    onChange={(e) => setNombres(e.target.value)}
                                    className={inputClass}
                                />
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <label className={labelClass}>Apellidos <span className="text-red-500">*</span></label>
                                    <span className={`text-[10px] font-bold ${apellidos.length > 90 ? 'text-red-500' : 'text-gray-400'}`}>{apellidos.length}/100</span>
                                </div>
                                <input
                                    id="apellidos"
                                    type="text"
                                    maxLength={100}
                                    required
                                    placeholder="Pérez"
                                    value={apellidos}
                                    onChange={(e) => setApellidos(e.target.value)}
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                            <label className={labelClass}>Email</label>
                            <input
                                id="email"
                                type="email"
                                maxLength={255}
                                autoComplete="email"
                                placeholder="juan.perez@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={inputClass}
                            />
                        </div>

                        {/* Teléfono */}
                        <div className="space-y-1">
                            <label className={labelClass}>Teléfono</label>
                            <input
                                id="telefono"
                                type="tel"
                                maxLength={20}
                                placeholder="0999 999 999"
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                                className={inputClass}
                            />
                        </div>

                        {/* Dirección */}
                        <div className="space-y-1">
                            <label className={labelClass}>Dirección</label>
                            <input
                                id="direccion"
                                type="text"
                                maxLength={300}
                                placeholder="Calle principal y transversal..."
                                value={direccion}
                                onChange={(e) => setDireccion(e.target.value)}
                                className={inputClass}
                            />
                        </div>

                    </div>

                    {/* Footer */}
                    <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                        <button
                            id="cancelar"
                            type="button"
                            onClick={onCancelar}
                            className="bg-white border border-gray-100 hover:bg-gray-100 text-gray-700 px-5 py-3 rounded-2xl font-extrabold text-xs uppercase tracking-widest transition-all active:scale-95 shadow-sm"
                        >
                            Cancelar
                        </button>
                        <button
                            id="guardar"
                            type="submit"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-md shadow-emerald-600/10"
                        >
                            {clienteActual ? 'Actualizar' : 'Registrar'}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default FormularioCliente;
