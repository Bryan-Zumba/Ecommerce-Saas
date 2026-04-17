import { useState, useEffect, useCallback } from 'react';
import { customerService } from '../services/customerService';

export const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await customerService.getCustomers();
      setCustomers(data);
    } catch (err) {
      setError(err.message || 'Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const addCustomer = async (customerData) => {
    setLoading(true);
    setError(null);
    try {
      const newCustomer = await customerService.createCustomer(customerData);
      setCustomers((prev) => [...prev, newCustomer]);
      return { success: true, data: newCustomer };
    } catch (err) {
      setError(err.message || 'Error al crear cliente');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateCustomer = async (id, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedItem = await customerService.updateCustomer(id, updateData);
      setCustomers((prev) =>
        prev.map((c) => (c.id === id ? updatedItem : c))
      );
      return { success: true, data: updatedItem };
    } catch (err) {
      setError(err.message || 'Error al actualizar cliente');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomer = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await customerService.deleteCustomer(id);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message || 'Error al eliminar cliente');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  };
};
