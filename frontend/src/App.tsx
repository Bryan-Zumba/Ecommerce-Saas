import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProveedorCarrito } from "@/shared/context/ContextoCarrito";
import Home from "./pages/Page_Inicio";
import { PageTienda } from "./modules/productos/infrastructure/pages/PageTienda";
import { PageGestionProductos } from "./modules/productos/infrastructure/pages/PageGestionProductos";
import { PageGestionCategorias } from "./modules/productos/infrastructure/pages/PageGestionCategorias";
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
                <Route path="/productos" element={<PageTienda />} />
                <Route path="/items" element={<PageTienda/>} />
                <Route path="/gestion-items" element={<PageGestionProductos />} />
                <Route path="/gestion-categorias" element={<PageGestionCategorias />} />
                <Route path="/checkout" element={<Caja />} />
                <Route path="/success" element={<VentaExitosa />} />
                <Route path="/clientes" element={<PageClientes />} />
                <Route path="/bodegas" element={<PageBodegas />} />
                <Route path="/ingreso-stock" element={<Page_GestionStock />} />
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