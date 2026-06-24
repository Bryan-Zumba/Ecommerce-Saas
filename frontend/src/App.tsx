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
import { PageClientes } from "./modules/clientes/infrastructure/pages/PageClientes";
import { PageReportes } from "./modules/reportes/infrastructure/pages/PageReportes";
import { PageAuth } from "./modules/auth/infrastructure/pages/PageAuth";
import { PageOnboarding } from "./modules/auth/infrastructure/pages/PageOnboarding";
import { PageForcePasswordChange } from "./modules/auth/infrastructure/pages/PageForcePasswordChange";
import { PageChangePassword } from "./modules/auth/infrastructure/pages/PageChangePassword";
import { PageResetPassword } from "./modules/auth/infrastructure/pages/PageResetPassword";

import { PageMonitoreoInventario } from "./modules/inventario/infrastructure/pages/PageMonitoreoInventario";
import { PageGestionUsuarios } from "./modules/usuarios/infrastructure/pages/PageGestionUsuarios";
import { PageConsultaRoles } from "./modules/roles/infrastructure/pages/PageConsultaRoles";

function App() {
  return (
    <BrowserRouter>
      <ProveedorCarrito>
        <Routes>
          <Route path="/auth" element={<PageAuth />} />
          <Route path="/auth/primer-acceso" element={<PageForcePasswordChange />} />
          <Route path="/reset-password" element={<PageResetPassword />} />
          <Route path="/onboarding" element={<PageOnboarding />} />
          <Route path="/*" element={
            <AuthGuard>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/items" element={<PageTienda/>} />
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
                </Routes>
              </MainLayout>
            </AuthGuard>
          } />
        </Routes>
      </ProveedorCarrito>
    </BrowserRouter>
  );
}

export default App;
