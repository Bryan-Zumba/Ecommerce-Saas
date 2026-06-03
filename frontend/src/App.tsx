import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProveedorCarrito } from "@/shared/context/ContextoCarrito";
import Home from "./pages/Page_Inicio";
import { PageTienda } from "./modules/items/infrastructure/pages/PageTienda";
import { PageGestionItems } from "./modules/items/infrastructure/pages/PageGestionItems";
import { PageGestionCategorias } from "./modules/items/infrastructure/pages/PageGestionCategorias";
import Caja from "./pages/Page_Caja";
import VentaExitosa from "./pages/Page_VentaExitosa";
import { PageBodegas } from "./modules/bodegas/infrastructure/pages/PageBodegas";
import Page_GestionStock from "./modules/stock/infrastructure/pages/Page_GestionStock";
import HistorialPersonal from "./pages/Pages_Historial_Personal";
import MainLayout from "@/shared/layout/MainLayout";
import { PageClientes } from "./modules/clientes/infrastructure/pages/PageClientes";
import { PageReportes } from "./modules/reportes/infrastructure/pages/PageReportes";
import { PageAuth } from "./modules/auth/infrastructure/pages/PageAuth";
import { PageOnboarding } from "./modules/auth/infrastructure/pages/PageOnboarding";

import { PageMonitoreoInventario } from "./modules/inventario/infrastructure/pages/PageMonitoreoInventario";
import { PageGestionUsuarios } from "./modules/usuarios/infrastructure/pages/PageGestionUsuarios";
import { PageConsultaRoles } from "./modules/roles/infrastructure/pages/PageConsultaRoles";

function App() {
  return (
    <BrowserRouter>
      <ProveedorCarrito>
        <Routes>
          <Route path="/auth" element={<PageAuth />} />
          <Route path="/onboarding" element={<PageOnboarding />} />
          <Route path="/*" element={
            <MainLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/items" element={<PageTienda/>} />
                <Route path="/gestion-items" element={<PageGestionItems />} />
                <Route path="/gestion-categorias" element={<PageGestionCategorias />} />
                <Route path="/checkout" element={<Caja />} />
                <Route path="/success" element={<VentaExitosa />} />
                <Route path="/clientes" element={<PageClientes />} />
                <Route path="/bodegas" element={<PageBodegas />} />
                <Route path="/ingreso-stock" element={<Page_GestionStock />} />
                <Route path="/monitoreo-inventario" element={<PageMonitoreoInventario />} />
                <Route path="/usuarios/gestion" element={<PageGestionUsuarios />} />
                <Route path="/roles/consulta" element={<PageConsultaRoles />} />
                <Route path="/historial" element={<HistorialPersonal />} />
                <Route path="/reportes" element={<PageReportes />} />
              </Routes>
            </MainLayout>
          } />
        </Routes>
      </ProveedorCarrito>
    </BrowserRouter>
  );
}

export default App;
