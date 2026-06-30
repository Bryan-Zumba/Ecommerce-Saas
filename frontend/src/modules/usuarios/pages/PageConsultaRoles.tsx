import React, { useState, useEffect } from 'react';
import { Rol } from '../types/RolesTypes';
import { useRoles } from '../hooks/useRoles';
import { RolService } from '../services/RolService';

interface PermisoAgrupado {
  modulo: string;
  acciones: string[];
}

export const PageConsultaRoles: React.FC = () => {
  const { roles, cargando, error } = useRoles();
  const [selectedRol, setSelectedRol] = useState<Rol | null>(null);
  const [permisosRol, setPermisosRol] = useState<PermisoAgrupado[]>([]);
  const [cargandoPermisos, setCargandoPermisos] = useState(false);

  // Seleccionar automáticamente el primer rol cuando carguen
  useEffect(() => {
    if (roles && roles.length > 0 && !selectedRol) {
      setSelectedRol(roles[0]);
    }
  }, [roles, selectedRol]);

  useEffect(() => {
    if (selectedRol) {
      setCargandoPermisos(true);
      setPermisosRol([]);
      RolService.obtenerPermisosRol(selectedRol.nombre)
        .then((data) => {
          const permisosRaw: string[] = data.permisos || [];
          const agrupados: Record<string, string[]> = {};
          
          permisosRaw.forEach((p) => {
            const partes = p.split(':');
            if (partes.length === 2) {
              const [modulo, accion] = partes;
              const moduloCapitalized = modulo.charAt(0).toUpperCase() + modulo.slice(1);
              if (!agrupados[moduloCapitalized]) {
                agrupados[moduloCapitalized] = [];
              }
              agrupados[moduloCapitalized].push(accion);
            } else {
              if (!agrupados['Otros']) agrupados['Otros'] = [];
              agrupados['Otros'].push(p);
            }
          });

          const resultado: PermisoAgrupado[] = Object.keys(agrupados).map((modulo) => ({
            modulo,
            acciones: agrupados[modulo]
          }));

          setPermisosRol(resultado);
        })
        .catch((err) => {
          console.error("Error obteniendo permisos", err);
          setPermisosRol([]);
        })
        .finally(() => {
          setCargandoPermisos(false);
        });
    }
  }, [selectedRol]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Consulta de Roles y Permisos</h1>
        <p className="text-gray-500 mt-1">
          Visualiza los perfiles de acceso configurados en el sistema y sus permisos asociados.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl font-medium">
          ⚠️ {error}
        </div>
      )}

      {cargando ? (
        <div className="bg-blue-50 text-blue-700 p-4 rounded-lg flex items-center gap-3">
          <p>Cargando roles...</p>
        </div>
      ) : !roles || roles.length === 0 ? (
        <div className="bg-blue-50 text-blue-700 p-4 rounded-lg flex items-center gap-3">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>No existen roles registrados en el sistema actualmente.</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Lista de Roles */}
          <div className="lg:w-1/3 flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Roles Disponibles</h2>
            {roles.map((rol) => (
              <div
                key={rol.id_rol}
                onClick={() => setSelectedRol(rol)}
                className={`
                  p-4 rounded-xl cursor-pointer transition-all border
                  ${selectedRol?.id_rol === rol.id_rol
                    ? 'bg-emerald-50 border-emerald-200 shadow-sm'
                    : 'bg-white border-gray-200 hover:border-emerald-300 hover:shadow-sm'
                  }
                `}
              >
                <div className="flex justify-between items-center mb-1">
                  <h3 className={`font-bold ${selectedRol?.id_rol === rol.id_rol ? 'text-emerald-800' : 'text-gray-900'}`}>
                    {rol.nombre}
                  </h3>
                  {rol.estado ? (
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  )}
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">{rol.descripcion}</p>
              </div>
            ))}
          </div>

          {/* Detalle del Rol Seleccionado */}
          <div className="lg:w-2/3">
            {selectedRol ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
                <div className="mb-6 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">{selectedRol.nombre}</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                      ID: {selectedRol.id_rol}
                    </span>
                  </div>
                  <p className="text-gray-600">{selectedRol.descripcion}</p>
                </div>

                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  Permisos de Acceso {cargandoPermisos && <span className="text-xs text-emerald-500 normal-case animate-pulse">(Cargando...)</span>}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {permisosRol.map((permiso, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Módulo: {permiso.modulo}
                      </h4>
                      {permiso.acciones && permiso.acciones.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {permiso.acciones.map((accion, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-white border border-gray-200 text-gray-600 text-xs rounded-md shadow-sm"
                            >
                              {accion}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 italic">Sin accesos en este módulo</p>
                      )}
                    </div>
                  ))}
                  {(!permisosRol || permisosRol.length === 0) && !cargandoPermisos && (
                    <p className="text-sm text-gray-500 col-span-2">Este rol no tiene permisos definidos.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl border border-gray-200 border-dashed p-8 h-full flex flex-col items-center justify-center text-gray-400">
                <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <p>Selecciona un rol para ver sus detalles y permisos</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
