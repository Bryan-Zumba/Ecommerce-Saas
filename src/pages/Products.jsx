function Products() {
  return (
    <div>
        <h1>Productos</h1>

        <button>Agregar Producto</button>

        <input type="search" placeholder="Buscar Producto"/>

        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <div style={{ border: "1px solid #ccc", padding: "10px" }}>
            <h3>Coca Cola</h3>
            <p>Precio: $15</p>
            <p>Stock: 10</p>
            </div>
        </div>
    </div>
  );
}

export default Products;