import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProveedorCarrito } from "@/shared/context/ContextoCarrito";
import Home from "./pages/Page_Inicio";
import { PageTienda } from "./modules/productos/infrastructure/pages/PageTienda";
import { PageGestionProductos } from "./modules/productos/infrastructure/pages/PageGestionProductos";
import { PageGestionCategorias } from "./modules/productos/infrastructure/pages/PageGestionCategorias";
import Caja from "./pages/Page_Caja";
import VentaExitosa from "./pages/Page_VentaExitosa";
import { PageBodegas } from "./modules/bodegas/infrastructure/pages/PageBodegas";
import IngresoStock from "./pages/Page_IngresoStock";
import HistorialPersonal from "./pages/Pages_Historial_Personal";
import MainLayout from "@/shared/layout/MainLayout";
import { PageClientes } from "./modules/clientes/infrastructure/pages/PageClientes";
import { PageReportes } from "./modules/reportes/infrastructure/pages/PageReportes";


function App() {
  return (
    <BrowserRouter>
      <ProveedorCarrito>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<PageTienda />} />
            <Route path="/gestion-productos" element={<PageGestionProductos />} />
            <Route path="/gestion-categorias" element={<PageGestionCategorias />} />
            <Route path="/checkout" element={<Caja />} />
            <Route path="/success" element={<VentaExitosa />} />
            <Route path="/clientes" element={<PageClientes />} />
            <Route path="/bodegas" element={<PageBodegas />} />
            <Route path="/ingreso-stock" element={<IngresoStock />} />
            <Route path="/historial" element={<HistorialPersonal />} />
            <Route path="/reportes" element={<PageReportes />} />
            </Routes>
        </MainLayout>
      </ProveedorCarrito>
    </BrowserRouter>
  );
}

export default App;