type EnvioStockResult = {
  success: boolean;
  ordenIngreso: string;
  mensaje: string;
};

export const enviarSolicitudStock = async (datosFactura: any, productos: any[], bodegaId: number | null): Promise<EnvioStockResult> => {
  // Simulamos un retardo de red
  return new Promise<EnvioStockResult>((resolve) => {
    setTimeout(() => {
      // Generar un número de orden aleatorio para simular el sistema
      const ordenIngreso = `ORD-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
      
      console.log("=== SOLICITUD DE INGRESO DE STOCK ENVIADA AL SUPERVISOR ===");
      console.log("Orden de Ingreso:", ordenIngreso);
      console.log("Datos de Factura:", datosFactura);
      console.log("Productos a ingresar:", productos);
      console.log("Bodega seleccionada:", bodegaId);
      
      resolve({
        success: true,
        ordenIngreso,
        mensaje: "Solicitud enviada correctamente al supervisor."
      });
    }, 1500);
  });
};
