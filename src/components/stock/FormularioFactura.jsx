import React, { useState } from 'react';

function FormularioFactura({ datos, setDatos }) {
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDatos(prev => ({ ...prev, imagenAdjunta: file }));
      // Crear URL para previsualizar
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Datos de la Factura</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Código de Factura</label>
          <input
            type="text"
            name="codigo"
            value={datos.codigo}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            placeholder="Ej: F001-000123"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
          <input
            type="date"
            name="fecha"
            value={datos.fecha}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Total de Factura ($)</label>
          <input
            type="number"
            name="total"
            value={datos.total}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Adjuntar Imagen</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
            required={!datos.imagenAdjunta}
          />
        </div>
      </div>

      {preview && (
        <div className="mt-4 border p-2 rounded-xl inline-block">
          <p className="text-xs text-gray-500 mb-2">Vista previa:</p>
          <img src={preview} alt="Vista previa de factura" className="h-32 object-contain rounded-lg" />
        </div>
      )}
    </div>
  );
}

export default FormularioFactura;
