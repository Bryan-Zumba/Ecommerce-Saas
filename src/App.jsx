import { CartProvider } from "./context/CartContext";
import Products from "./pages/Products";

function App() {
  return (
    <CartProvider>
      <Products />
    </CartProvider>
  );
}

export default App;