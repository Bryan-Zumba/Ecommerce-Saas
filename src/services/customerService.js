const STORAGE_KEY = "saas_customers";
const STORAGE_VERSION = "v2"; // ← Incrementa esto cada vez que cambies MOCK_CLIENTS
const VERSION_KEY = "saas_customers_version";

// Datos iniciales de prueba (Mock Data)
const MOCK_CLIENTS = [
  { id: "0952939130", nombre: "Bryan Zumba", email: "bryan@ecuador.com", telefono: "0991234567" },
  { id: "0952939163", nombre: "Maria Lopez", email: "maria.l@gmail.com", telefono: "0987654321" },
  { id: "1799999999", nombre: "Empresa ABC", email: "ventas@abc.com", telefono: "02-234567" },
];

/**
 * Inicializa el LocalStorage.
 * Si la versión guardada no coincide, reinicia con los datos frescos.
 */
const initStorage = () => {
  const savedVersion = localStorage.getItem(VERSION_KEY);
  if (savedVersion !== STORAGE_VERSION) {
    // Versión diferente → limpiar y recargar con datos actualizados
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_CLIENTS));
    localStorage.setItem(VERSION_KEY, STORAGE_VERSION);
  }
};

export const customerService = {
  getCustomers: async () => {
    initStorage();
    // Simulamos un retraso de red
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        resolve(data);
      }, 500);
    });
  },

  getCustomerById: async (id) => {
    initStorage();
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        resolve(data.find((c) => c.id === id) || null);
      }, 300);
    });
  },

  createCustomer: async (customerData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

        // Verifica si el ID (cédula/RUC) ya existe
        if (data.some(c => c.id === customerData.id)) {
          return reject(new Error("Ya existe un cliente con esta Cédula / RUC"));
        }

        const newData = [...data, customerData];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
        resolve(customerData);
      }, 500);
    });
  },

  updateCustomer: async (id, updateData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        let updatedItem = null;

        data = data.map((c) => {
          if (c.id === id) {
            updatedItem = { ...c, ...updateData, id }; // Protegemos el ID para que no cambie
            return updatedItem;
          }
          return c;
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        resolve(updatedItem);
      }, 500);
    });
  },

  deleteCustomer: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        data = data.filter((c) => c.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        resolve({ success: true, id });
      }, 500);
    });
  }
};
