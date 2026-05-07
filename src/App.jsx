import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Products from "./pages/Products";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import CustomersPage from "./pages/CustomersPage";
import IngresoStock from "./pages/IngresoStock";
import MainLayout from "./components/layout/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <MainLayout>
          <Routes>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/success" element={<Success />} />
            <Route path="/clientes" element={<CustomersPage />} />
            <Route path="/ingreso-stock" element={<IngresoStock />} />
            <Route path="/productos" element={<Products />} />
          </Routes>
        </MainLayout>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;