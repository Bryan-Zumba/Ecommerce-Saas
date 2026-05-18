import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProveedorCarrito } from "@/shared/context/ContextoCarrito";
import Home from "./pages/Page_Inicio";
import Productos from "./pages/Page_Productos";
import Caja from "./pages/Page_Caja";
import VentaExitosa from "./pages/Page_VentaExitosa";
import ClientesPage from "./pages/Page_Clientes";
import IngresoStock from "./pages/Page_IngresoStock";
import HistorialPersonal from "./pages/Pages_Historial_Personal";
import MainLayout from "@/shared/layout/MainLayout";
import { PageClientes } from "./modules/clientes/infrastructure/components/PageClientes";

function App() {
  return (
    <BrowserRouter>
      <ProveedorCarrito>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/checkout" element={<Caja />} />
            <Route path="/success" element={<VentaExitosa />} />
            <Route path="/clientes" element={<ClientesPage />} />
            <Route path="/clientes-api" element={<PageClientes />} />
            <Route path="/ingreso-stock" element={<IngresoStock />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/historial" element={<HistorialPersonal />} />
          </Routes>
        </MainLayout>
      </ProveedorCarrito>
    </BrowserRouter>
  );
}

export default App;