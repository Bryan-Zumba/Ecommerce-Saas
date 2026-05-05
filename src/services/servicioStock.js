export const enviarSolicitudStock = async (datosFactura, productos) => {
  // Simulamos un retardo de red
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generar un número de orden aleatorio para simular el sistema
      const ordenIngreso = `ORD-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
      
      console.log("=== SOLICITUD DE INGRESO DE STOCK ENVIADA AL SUPERVISOR ===");
      console.log("Orden de Ingreso:", ordenIngreso);
      console.log("Datos de Factura:", datosFactura);
      console.log("Productos a ingresar:", productos);
      
      resolve({
        success: true,
        ordenIngreso,
        mensaje: "Solicitud enviada correctamente al supervisor."
      });
    }, 1500);
  });
};
