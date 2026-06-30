import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthGuard } from "./shared/guards/AuthGuard";

import { ProveedorCarrito } from "@/shared/context/ContextoCarrito";
import Home from "./pages/Page_Inicio";
import { PageTienda } from "./modules/items/infrastructure/pages/PageTienda";
import { PageGestionItems } from "./modules/items/infrastructure/pages/PageGestionItems";
import { PageGestionCategorias } from "./modules/items/infrastructure/pages/PageGestionCategorias";
import Caja from "./pages/Page_Caja";
import VentaExitosa from "./pages/Page_VentaExitosa";
import { PageBodega } from "./modules/bodegas/infrastructure/pages/PageBodega";
import Page_GestionStock from "./modules/stock/infrastructure/pages/Page_GestionStock";
import HistorialPersonal from "./pages/Pages_Historial_Personal";
import MainLayout from "@/shared/layout/MainLayout";
import { PageClientes } from "./modules/clientes/pages/PageClientes";
import { PageReportes } from "./modules/reportes/infrastructure/pages/PageReportes";
import { PageAuth } from "./modules/auth/pages/PageAuth";
import { PageOnboarding } from "./modules/auth/pages/PageOnboarding";
import { PageForcePasswordChange } from "./modules/auth/pages/PageForcePasswordChange";
import { PageChangePassword } from "./modules/auth/pages/PageUpdatePassword";
import { PageResetPassword } from "./modules/auth/pages/PageRecoverPassword";

import { PageMonitoreoInventario } from "./modules/inventario/infrastructure/pages/PageMonitoreoInventario";
import { PageGestionUsuarios } from "./modules/usuarios/pages/PageGestionUsuarios";
import { PageConsultaRoles } from "./modules/usuarios/pages/PageConsultaRoles";
import { AuthProvider } from "./shared/context/auth/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <ProveedorCarrito>
        <AuthProvider>
          <Routes>
            {/* Rutas publicas */}
            <Route path="/auth" element={<PageAuth />} />
            <Route path="/reset-password" element={<PageResetPassword />} />
            <Route path="/onboarding" element={<PageOnboarding />} />
            {/* Rutas privadas */}
            <Route element={<AuthGuard />}>
              <Route path="/auth/primer-acceso" element={<PageForcePasswordChange />} />
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/items" element={<PageTienda />} />
                <Route path="/gestion-items" element={<PageGestionItems />} />
                <Route path="/gestion-categorias" element={<PageGestionCategorias />} />
                <Route path="/checkout" element={<Caja />} />
                <Route path="/success" element={<VentaExitosa />} />
                <Route path="/clientes" element={<PageClientes />} />
                <Route path="/bodega" element={<PageBodega />} />
                <Route path="/ingreso-stock" element={<Page_GestionStock />} />
                <Route path="/monitoreo-inventario" element={<PageMonitoreoInventario />} />
                <Route path="/usuarios/gestion" element={<PageGestionUsuarios />} />
                <Route path="/roles/consulta" element={<PageConsultaRoles />} />
                <Route path="/historial" element={<HistorialPersonal />} />
                <Route path="/reportes" element={<PageReportes />} />
                <Route path="/cambiar-contrasena" element={<PageChangePassword />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </ProveedorCarrito>
    </BrowserRouter>
  );
}

export default App;
