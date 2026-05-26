import { useState } from "react";

export interface DatosFormularioCliente{
    cedula: string;
    nombres: string;
    apellidos: string;
    email?: string;
    telefono?: string;
}    

interface FormularioClientesProps{
    onGuardar: (datos: DatosFormularioCliente) => void;
    onCancelar: () => void;
}

const FormularioCliente: React.FC<FormularioClientesProps> = ({onGuardar,onCancelar}) =>{
    const [cedula, setCedula] = useState('');
    const [nombres, setNombres] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    
    const manejarEnvio = (e: React.FormEvent) =>{
        e.preventDefault();

        onGuardar({
            cedula,
            nombres,
            apellidos,
            email,
            telefono,
        });

    }

    return (
        <div>
            <form onSubmit={manejarEnvio}>
                <label htmlFor="cedula">Cedula:</label>
                <input
                type="text"
                placeholder="Cédula"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                />
                <label htmlFor="nombres">Nombres:</label>
                <input
                type="text"
                placeholder="Nombres"
                value={nombres}
                onChange={(e) => setNombres(e.target.value)}
                />
                <label htmlFor="apellidos">Apellidos:</label>
                <input
                type="text"
                placeholder="Apellidos"
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                />
                <label htmlFor="email">Email:</label>
                <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="telefono">Telefono:</label>
                <input
                type="text"
                placeholder="Telefono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                />
                <button type="submit">Guardar</button>
            </form>
        </div>
    );
}

export default FormularioCliente;