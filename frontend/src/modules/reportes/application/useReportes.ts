import { useState, useEffect } from 'react';
import { ItemReporte } from '../domain/ItemReporte';
import { Egreso } from '../domain/Egreso';
import { BalanceConsolidado } from '../domain/BalanceConsolidado';
import { CierrePeriodo } from '../domain/CierrePeriodo';

// 1. MOCK DATA INICIAL DE PRODUCTOS (Basado exactamente en tu Excel)
const PRODUCTOS_INICIALES: Omit<ItemReporte, 'inversionReferencial' | 'totalVentaPvp' | 'totalVentaFactura' | 'utilidad' | 'perdidaMonto' | 'percha'>[] = [
  { id_item: 1, nombre: 'Galleta Amor 130 g Pekes', ingresoTotal: 84, precioFactura: 1.05, pvp: 1.35, ventaUnidades: 78, usados: 5 },
  { id_item: 2, nombre: 'Galleta Amor 100 g Surt', ingresoTotal: 80, precioFactura: 0.73, pvp: 1.00, ventaUnidades: 73, usados: 5 },
  { id_item: 3, nombre: 'Galleta Maria', ingresoTotal: 18, precioFactura: 0.77, pvp: 1.25, ventaUnidades: 14, usados: 2 },
  { id_item: 4, nombre: 'Galleta Mueca', ingresoTotal: 21, precioFactura: 0.73, pvp: 1.00, ventaUnidades: 17, usados: 4 },
  { id_item: 5, nombre: 'Galleta Oreo', ingresoTotal: 50, precioFactura: 0.38, pvp: 0.60, ventaUnidades: 42, usados: 5 },
  { id_item: 6, nombre: 'Galleta Saltica', ingresoTotal: 118, precioFactura: 0.29, pvp: 0.50, ventaUnidades: 102, usados: 11 },
  { id_item: 7, nombre: 'Chifles / La Orquidea', ingresoTotal: 64, precioFactura: 0.50, pvp: 0.60, ventaUnidades: 55, usados: 8 },
  { id_item: 8, nombre: 'Madurito / L. Orquidea', ingresoTotal: 98, precioFactura: 0.51, pvp: 0.60, ventaUnidades: 88, usados: 9 },
  { id_item: 9, nombre: 'K-chitos 67 g', ingresoTotal: 82, precioFactura: 0.36, pvp: 0.50, ventaUnidades: 73, usados: 9 },
  { id_item: 10, nombre: 'Doritos 45 g', ingresoTotal: 143, precioFactura: 0.52, pvp: 0.75, ventaUnidades: 120, usados: 22 },
  { id_item: 11, nombre: 'Doritos 23 g', ingresoTotal: 105, precioFactura: 0.28, pvp: 0.40, ventaUnidades: 93, usados: 12 },
  { id_item: 12, nombre: 'Rizadas 45 g', ingresoTotal: 24, precioFactura: 0.44, pvp: 0.75, ventaUnidades: 23, usados: 1 },
  { id_item: 13, nombre: 'Pepitas / Rizada pequeña', ingresoTotal: 142, precioFactura: 0.22, pvp: 0.35, ventaUnidades: 133, usados: 9 },
  { id_item: 14, nombre: 'Golpe 45 g', ingresoTotal: 16, precioFactura: 0.44, pvp: 0.75, ventaUnidades: 16, usados: 0 },
  { id_item: 15, nombre: 'Golpe 25 g', ingresoTotal: 102, precioFactura: 0.22, pvp: 0.35, ventaUnidades: 84, usados: 18 },
  { id_item: 16, nombre: 'Cheetos', ingresoTotal: 74, precioFactura: 0.20, pvp: 0.35, ventaUnidades: 59, usados: 15 },
  { id_item: 17, nombre: 'Palomitas', ingresoTotal: 24, precioFactura: 0.22, pvp: 0.35, ventaUnidades: 19, usados: 5 },
  { id_item: 18, nombre: 'Choco Disk', ingresoTotal: 94, precioFactura: 0.25, pvp: 0.35, ventaUnidades: 84, usados: 10 },
  { id_item: 19, nombre: 'Paleta UFO', ingresoTotal: 0, precioFactura: 0.11, pvp: 0.25, ventaUnidades: 0, usados: 0 },
  { id_item: 20, nombre: 'Atún Real 160 g', ingresoTotal: 9, precioFactura: 1.16, pvp: 1.75, ventaUnidades: 6, usados: 3 },
  { id_item: 21, nombre: 'Cigarrillos Doble Capsula (Cajetilla)', ingresoTotal: 7, precioFactura: 1.70, pvp: 3.75, ventaUnidades: 4, usados: 3 },
  { id_item: 22, nombre: 'Cigarrillos Doble Capsula (Caja 20 Und)', ingresoTotal: 600, precioFactura: 0.09, pvp: 0.25, ventaUnidades: 600, usados: 0 },
  { id_item: 23, nombre: 'Fósforo', ingresoTotal: 10, precioFactura: 0.06, pvp: 0.15, ventaUnidades: 5, usados: 5 },
  { id_item: 24, nombre: 'Chupete Plop', ingresoTotal: 120, precioFactura: 0.08, pvp: 0.20, ventaUnidades: 95, usados: 24 },
  { id_item: 25, nombre: 'Chupete American', ingresoTotal: 72, precioFactura: 0.07, pvp: 0.15, ventaUnidades: 62, usados: 10 },
  { id_item: 26, nombre: 'Kataboom', ingresoTotal: 271, precioFactura: 0.05, pvp: 0.10, ventaUnidades: 250, usados: 21 },
  { id_item: 27, nombre: 'Tumix', ingresoTotal: 735, precioFactura: 0.05, pvp: 0.10, ventaUnidades: 684, usados: 51 },
  { id_item: 28, nombre: 'Millows 250 g (Besitos)', ingresoTotal: 512, precioFactura: 0.05, pvp: 0.10, ventaUnidades: 444, usados: 68 },
  { id_item: 29, nombre: 'Menta', ingresoTotal: 430, precioFactura: 0.02, pvp: 0.05, ventaUnidades: 257, usados: 165 },
  { id_item: 30, nombre: 'Jazz', ingresoTotal: 137, precioFactura: 0.02, pvp: 0.05, ventaUnidades: 119, usados: 18 },
  { id_item: 31, nombre: 'Blanchi', ingresoTotal: 697, precioFactura: 0.02, pvp: 0.05, ventaUnidades: 581, usados: 116 },
  { id_item: 32, nombre: 'Toallas Higiénicas', ingresoTotal: 8, precioFactura: 0.75, pvp: 1.25, ventaUnidades: 5, usados: 3 },
  { id_item: 33, nombre: 'Papel Higiénico', ingresoTotal: 11, precioFactura: 0.33, pvp: 0.50, ventaUnidades: 8, usados: 3 },
  { id_item: 34, nombre: 'Jabón Protex', ingresoTotal: 9, precioFactura: 0.75, pvp: 1.25, ventaUnidades: 7, usados: 2 },
  { id_item: 35, nombre: 'Shampoo Sachet', ingresoTotal: 59, precioFactura: 0.20, pvp: 0.40, ventaUnidades: 51, usados: 8 },
];

// 2. MOCK DATA INICIAL DE EGRESOS (Basado exactamente en tu Excel)
const EGRESOS_INICIALES: Egreso[] = [
  // Facturas de stock (Ajustadas a montos menores y más realistas para un balance saludable)
  { id: 'F1', fecha: '2026-05-31', descripcion: 'Factura Compra Insumos Rápida', monto: 10.50, tipo: 'FacturaProveedor' },
  { id: 'F2', fecha: '2026-05-31', descripcion: 'Factura Bebidas Cola / Jsugos', monto: 150.00, tipo: 'FacturaProveedor' },
  { id: 'F3', fecha: '2026-05-17', descripcion: 'Factura Cervezas Nacionales', monto: 120.00, tipo: 'FacturaProveedor' },
  { id: 'F4', fecha: '2026-05-06', descripcion: 'Factura Confitería y Snacks', monto: 95.00, tipo: 'FacturaProveedor' },
  { id: 'F5', fecha: '2026-05-09', descripcion: 'Factura Reposición Cigarros', monto: 83.59, tipo: 'FacturaProveedor' },
  { id: 'F6', fecha: '2026-05-28', descripcion: 'Gastos de Transporte / Pasajes', monto: 41.60, tipo: 'FacturaProveedor' },
  
  // Gastos Extras
  { id: 'GE1', fecha: '2026-05-10', descripcion: 'Recogedor', monto: 1.46, tipo: 'GastoExtra' },
  { id: 'GE2', fecha: '2026-05-12', descripcion: 'Tira Vaso Col', monto: 2.00, tipo: 'GastoExtra' },
  { id: 'GE3', fecha: '2026-05-16', descripcion: 'Tira Vaso Col', monto: 5.58, tipo: 'GastoExtra' },
  { id: 'GE4', fecha: '2026-05-18', descripcion: 'Funda Negra', monto: 0.85, tipo: 'GastoExtra' },
  { id: 'GE5', fecha: '2026-05-20', descripcion: 'Tira Vaso Col', monto: 1.05, tipo: 'GastoExtra' },
  { id: 'GE6', fecha: '2026-05-22', descripcion: 'Tira Vaso Col', monto: 2.78, tipo: 'GastoExtra' },
  { id: 'GE7', fecha: '2026-05-25', descripcion: 'Tira Vaso Col', monto: 4.88, tipo: 'GastoExtra' },
  { id: 'GE8', fecha: '2026-05-28', descripcion: 'Vaso Cervecero', monto: 17.18, tipo: 'GastoExtra' },
  { id: 'GE9', fecha: '2026-05-30', descripcion: 'Vaso Cervecero', monto: 8.80, tipo: 'GastoExtra' },

  // Pago de Personal / Servicios
  { id: 'P1', fecha: '2026-05-31', descripcion: 'Pagado Ayudante', monto: 125.00, tipo: 'PagoPersonal' },
  { id: 'PF1', fecha: '2026-05-31', descripcion: 'Pago por Fiscalización (Auditoría)', monto: 25.00, tipo: 'PagoPersonal' }
];

export const useReportes = () => {
  const [items, setItems] = useState<ItemReporte[]>([]);
  const [egresos, setEgresos] = useState<Egreso[]>([]);
  const [cierres, setCierres] = useState<CierrePeriodo[]>([]);
  const [periodoActual, setPeriodoActual] = useState<string>('Mayo 2026 - Junio 2026');
  const [pagoFiscalizacion, setPagoFiscalizacion] = useState<number>(25.00);

  // Inicializar cargando desde localStorage o Mock Data
  useEffect(() => {
    const itemsGuardados = localStorage.getItem('bar_reportes_items');
    const egresosGuardados = localStorage.getItem('bar_reportes_egresos');
    const cierresGuardados = localStorage.getItem('bar_reportes_cierres');
    const periodoGuardado = localStorage.getItem('bar_reportes_periodo_actual');
    const fiscalizacionGuardado = localStorage.getItem('bar_reportes_fiscalizacion');

    if (itemsGuardados) {
      setItems(JSON.parse(itemsGuardados));
    } else {
      const itemsCompletos = PRODUCTOS_INICIALES.map(item => calcularCamposItem(item));
      setItems(itemsCompletos);
    }

    if (egresosGuardados) {
      const parsed = JSON.parse(egresosGuardados) as Egreso[];
      const sumaTotal = parsed.reduce((sum, e) => sum + e.monto, 0);
      
      // Si detectamos la base de datos de egresos antigua sobredimensionada (> $1500), forzamos la carga limpia y balanceada
      if (sumaTotal > 1500) {
        setEgresos(EGRESOS_INICIALES);
        const itemsCompletos = PRODUCTOS_INICIALES.map(item => calcularCamposItem(item));
        setItems(itemsCompletos);
        localStorage.setItem('bar_reportes_egresos', JSON.stringify(EGRESOS_INICIALES));
        localStorage.setItem('bar_reportes_items', JSON.stringify(itemsCompletos));
      } else {
        setEgresos(parsed);
      }
    } else {
      setEgresos(EGRESOS_INICIALES);
    }

    if (cierresGuardados) {
      setCierres(JSON.parse(cierresGuardados));
    } else {
      setCierres([]);
    }

    if (periodoGuardado) {
      setPeriodoActual(periodoGuardado);
    }

    if (fiscalizacionGuardado) {
      setPagoFiscalizacion(Number(fiscalizacionGuardado));
    }
  }, []);

  // Guardar en localStorage cada vez que cambien los estados
  useEffect(() => {
    if (items.length > 0) localStorage.setItem('bar_reportes_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (egresos.length > 0) localStorage.setItem('bar_reportes_egresos', JSON.stringify(egresos));
  }, [egresos]);

  useEffect(() => {
    localStorage.setItem('bar_reportes_cierres', JSON.stringify(cierres));
  }, [cierres]);

  useEffect(() => {
    localStorage.setItem('bar_reportes_periodo_actual', periodoActual);
  }, [periodoActual]);

  useEffect(() => {
    localStorage.setItem('bar_reportes_fiscalizacion', String(pagoFiscalizacion));
  }, [pagoFiscalizacion]);

  // Función interna auxiliar para calcular todos los campos automáticos de un producto
  function calcularCamposItem(
    item: Omit<ItemReporte, 'inversionReferencial' | 'totalVentaPvp' | 'totalVentaFactura' | 'utilidad' | 'perdidaMonto' | 'percha'>
  ): ItemReporte {
    const inversionReferencial = Number((item.ingresoTotal * item.precioFactura).toFixed(2));
    const totalVentaPvp = Number((item.ventaUnidades * item.pvp).toFixed(2));
    const totalVentaFactura = Number((item.ventaUnidades * item.precioFactura).toFixed(2));
    const utilidad = Number((totalVentaPvp - totalVentaFactura).toFixed(2));
    const perdidaMonto = Number((item.usados * item.precioFactura).toFixed(2));
    const percha = Math.max(0, item.ingresoTotal - item.ventaUnidades - item.usados);

    return {
      ...item,
      inversionReferencial,
      totalVentaPvp,
      totalVentaFactura,
      utilidad,
      perdidaMonto,
      percha
    };
  }

  // Ajustar mermas (usados) interactivamente
  const ajustarUsados = (id_item: number, incremento: number) => {
    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id_item === id_item) {
          const nuevosUsados = Math.max(0, item.usados + incremento);
          // Validar que no supere el stock disponible tras las ventas
          const maxUsados = Math.max(0, item.ingresoTotal - item.ventaUnidades);
          const usadosValidados = Math.min(nuevosUsados, maxUsados);
          return calcularCamposItem({
            ...item,
            usados: usadosValidados
          });
        }
        return item;
      })
    );
  };

  // Calcular el balance consolidado final exacto
  const obtenerBalanceConsolidado = (): BalanceConsolidado => {
    const totalIngresos = Number(items.reduce((sum, item) => sum + item.totalVentaPvp, 0).toFixed(2));
    
    const totalFacturas = Number(
      egresos
        .filter(e => e.tipo === 'FacturaProveedor')
        .reduce((sum, e) => sum + e.monto, 0)
        .toFixed(2)
    );

    const totalGastosExtras = Number(
      egresos
        .filter(e => e.tipo === 'GastoExtra')
        .reduce((sum, e) => sum + e.monto, 0)
        .toFixed(2)
    );

    const totalPagoPersonal = Number(
      egresos
        .filter(e => e.tipo === 'PagoPersonal')
        .reduce((sum, e) => sum + e.monto, 0)
        .toFixed(2)
    );

    const totalEgresos = Number((totalFacturas + totalGastosExtras + totalPagoPersonal).toFixed(2));
    const utilidadPeriodo = Number((totalIngresos - totalEgresos).toFixed(2));
    const dineroNetoCaja = utilidadPeriodo; // Ya consolida todo, incluyendo la fiscalización
    
    const valorMercaderiaPercha = Number(
      items.reduce((sum, item) => sum + item.percha * item.precioFactura, 0).toFixed(2)
    );

    return {
      totalIngresos,
      totalFacturas,
      totalGastosExtras,
      totalPagoPersonal,
      totalEgresos,
      utilidadPeriodo,
      pagoFiscalizacion: 25.00, // Fijado como egreso regular
      dineroNetoCaja,
      valorMercaderiaPercha,
      items,
      egresos
    };
  };

  // Cierre de periodo (Traspaso contable automático)
  const ejecutarCierrePeriodo = (nuevoNombrePeriodo: string) => {
    const balance = obtenerBalanceConsolidado();
    
    // 1. Crear foto del cierre
    const nuevoCierre: CierrePeriodo = {
      id: `C-${Date.now()}`,
      fechaCierre: new Date().toLocaleDateString('es-ES'),
      periodo: periodoActual,
      totalIngresos: balance.totalIngresos,
      totalEgresos: balance.totalEgresos,
      utilidad: balance.utilidadPeriodo,
      pagoFiscalizacion: balance.pagoFiscalizacion,
      dineroNetoCaja: balance.dineroNetoCaja,
      valorMercaderiaPercha: balance.valorMercaderiaPercha,
      fotoInventario: items.map(item => ({
        id_item: item.id_item,
        nombre: item.nombre,
        stockFinal: item.percha,
        usados: item.usados,
        perdidaMonto: item.perdidaMonto
      }))
    };

    // 2. Archivar el cierre contable
    setCierres(prev => [nuevoCierre, ...prev]);

    // 3. Traspaso contable automático para el nuevo periodo:
    // El stock final (percha) se hereda como saldo inicial (ingreso total) del nuevo mes contable.
    // Ventas y Usados se reinician a 0.
    const nuevosItems = items.map(item =>
      calcularCamposItem({
        id_item: item.id_item,
        nombre: item.nombre,
        ingresoTotal: item.percha, // Stock remanente de percha pasa a stock inicial
        precioFactura: item.precioFactura,
        pvp: item.pvp,
        ventaUnidades: 0, // Reinicia en $0 / unidades en cero
        usados: 0        // Reinicia en cero
      })
    );

    // Los egresos de compras de stock, gastos extras y pago de ayudantes se reinician a $0 en el nuevo mes.
    const nuevosEgresos: Egreso[] = [
      { id: `P-${Date.now()}`, fecha: new Date().toISOString().split('T')[0], descripcion: 'Pagado Ayudante', monto: 125.00, tipo: 'PagoPersonal' }
    ];

    setItems(nuevosItems);
    setEgresos(nuevosEgresos);
    setPeriodoActual(nuevoNombrePeriodo);
  };

  // Restaurar por completo los valores predeterminados de prueba para depuración
  const reiniciarValoresPrueba = () => {
    const itemsCompletos = PRODUCTOS_INICIALES.map(item => calcularCamposItem(item));
    setItems(itemsCompletos);
    setEgresos(EGRESOS_INICIALES);
    setPagoFiscalizacion(25.00);
    setPeriodoActual('Mayo 2026 - Junio 2026');
  };

  return {
    items,
    egresos,
    cierres,
    periodoActual,
    pagoFiscalizacion,
    setPagoFiscalizacion,
    ajustarUsados,
    obtenerBalanceConsolidado,
    ejecutarCierrePeriodo,
    reiniciarValoresPrueba
  };
};
