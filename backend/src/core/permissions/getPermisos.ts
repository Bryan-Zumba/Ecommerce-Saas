import { ROLES_PERMISOS } from "./rolesPermisos";

export function obtenerPermisosRol(rol: keyof typeof ROLES_PERMISOS) {
    return ROLES_PERMISOS[rol] || [];
}