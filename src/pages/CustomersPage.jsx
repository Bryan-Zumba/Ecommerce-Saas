import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomers } from '../hooks/useCustomers';
import CustomerFilters from '../components/customers/CustomerFilters';
import CustomerTable from '../components/customers/CustomerTable';
import CustomerFormModal from '../components/customers/CustomerForm';

function CustomersPage() {
  const navigate = useNavigate();
  const { customers, loading, addCustomer, updateCustomer, deleteCustomer } = useCustomers();

  const [searchQuery, setSearchQuery] = useState('');

  // Estado del modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Filtrar clientes localmente por búsqueda
  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    const query = searchQuery.toLowerCase();
    return customers.filter(
      (c) =>
        c.nombre.toLowerCase().includes(query) ||
        c.id.toLowerCase().includes(query) ||
        (c.email && c.email.toLowerCase().includes(query))
    );
  }, [customers, searchQuery]);

  const handleAddNew = () => {
    setSelectedCustomer(null); // Null significa crear nuevo
    setIsModalOpen(true);
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleSave = async (formData) => {
    if (selectedCustomer) {
      // Editando
      return await updateCustomer(formData.id, formData);
    } else {
      // Creando
      return await addCustomer(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Navbar simplificado ── */}
      <nav className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-emerald-600 transition-colors font-medium"
          >
            <span className="mr-2">←</span> Ir a la Tienda
          </button>
          <div className="font-bold text-xl text-emerald-600 italic">Ecommerce SaaS</div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 lg:p-12">
        <div className="flex flex-col mb-8">
          <h1 className="text-3xl font-black text-gray-900">Gestión de Clientes</h1>
          <p className="text-gray-500 mt-1">Administra tu cartera de clientes, añade nuevos o edita los existentes.</p>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
          <CustomerFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onAddNew={handleAddNew}
          />

          <CustomerTable
            data={filteredCustomers}
            isLoading={loading}
            onEdit={handleEdit}
            onDelete={deleteCustomer}
          />
        </div>
      </main>

      {/* Modal para Crear/Editar */}
      <CustomerFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedCustomer}
        onSave={handleSave}
      />
    </div>
  );
}

export default CustomersPage;
