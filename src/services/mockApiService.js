// mockApiService.js
// Servicio para simular las llamadas al backend con datos de prueba

const MOCK_USERS = [
  {
    id: 1,
    nombre: "Demo",
    apellido: "Usuario",
    email: "demo@carmeeting.com",
    password: "demo123",
    telefono: "3511234567"
  },
  {
    id: 2,
    nombre: "María",
    apellido: "González",
    email: "maria@demo.com",
    password: "demo123",
    telefono: "3517654321"
  },
  {
    id: 3,
    nombre: "Carlos",
    apellido: "Rodríguez",
    email: "carlos@demo.com",
    password: "demo123",
    telefono: "3519876543"
  }
];

const MOCK_VIAJES = [
  {
    id: 1,
    origen: { 
      id: 1, 
      nombre: "Buenos Aires", 
      provincia: { id: 1, nombre: "Buenos Aires" } 
    },
    destino: { 
      id: 2, 
      nombre: "Córdoba", 
      provincia: { id: 2, nombre: "Córdoba" } 
    },
    fecha_salida: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // +7 días
    precio: 5000,
    asientos_disponibles: 3,
    observaciones: "Viaje directo por autopista. Salida puntual a las 8:00 AM.",
    conductor: {
      id: 2,
      nombre: "María",
      apellido: "González"
    },
    estado: "disponible",
    hora_inicio_real: null,
    hora_finalizacion_real: null
  },
  {
    id: 2,
    origen: { 
      id: 3, 
      nombre: "Rosario", 
      provincia: { id: 3, nombre: "Santa Fe" } 
    },
    destino: { 
      id: 4, 
      nombre: "Mendoza", 
      provincia: { id: 4, nombre: "Mendoza" } 
    },
    fecha_salida: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // +10 días
    precio: 7500,
    asientos_disponibles: 2,
    observaciones: "Incluye paradas para descanso. Vehículo cómodo con aire acondicionado.",
    conductor: {
      id: 3,
      nombre: "Carlos",
      apellido: "Rodríguez"
    },
    estado: "disponible",
    hora_inicio_real: null,
    hora_finalizacion_real: null
  },
  {
    id: 3,
    origen: { 
      id: 2, 
      nombre: "Córdoba", 
      provincia: { id: 2, nombre: "Córdoba" } 
    },
    destino: { 
      id: 1, 
      nombre: "Buenos Aires", 
      provincia: { id: 1, nombre: "Buenos Aires" } 
    },
    fecha_salida: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // +5 días
    precio: 4800,
    asientos_disponibles: 1,
    observaciones: "Regreso desde Córdoba. Acepto equipaje mediano.",
    conductor: {
      id: 2,
      nombre: "María",
      apellido: "González"
    },
    estado: "disponible",
    hora_inicio_real: null,
    hora_finalizacion_real: null
  },
  {
    id: 4,
    origen: { 
      id: 5, 
      nombre: "Mar del Plata", 
      provincia: { id: 1, nombre: "Buenos Aires" } 
    },
    destino: { 
      id: 1, 
      nombre: "Buenos Aires", 
      provincia: { id: 1, nombre: "Buenos Aires" } 
    },
    fecha_salida: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // +15 días
    precio: 3500,
    asientos_disponibles: 4,
    observaciones: "Viaje de vuelta del fin de semana. Salida flexible entre 9-10 AM.",
    conductor: {
      id: 1,
      nombre: "Demo",
      apellido: "Usuario"
    },
    estado: "propuesto",
    hora_inicio_real: null,
    hora_finalizacion_real: null
  },
  {
    id: 5,
    origen: { 
      id: 1, 
      nombre: "Buenos Aires", 
      provincia: { id: 1, nombre: "Buenos Aires" } 
    },
    destino: { 
      id: 6, 
      nombre: "Bahía Blanca", 
      provincia: { id: 1, nombre: "Buenos Aires" } 
    },
    fecha_salida: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(), // +12 días
    precio: 4200,
    asientos_disponibles: 2,
    observaciones: "Sin observaciones",
    conductor: {
      id: 1,
      nombre: "Demo",
      apellido: "Usuario"
    },
    estado: "propuesto",
    hora_inicio_real: null,
    hora_finalizacion_real: null
  }
];

const MOCK_VIAJES_COMPLETADOS = [
  {
    id: 6,
    origen: { 
      id: 1, 
      nombre: "Buenos Aires", 
      provincia: { id: 1, nombre: "Buenos Aires" } 
    },
    destino: { 
      id: 2, 
      nombre: "Córdoba", 
      provincia: { id: 2, nombre: "Córdoba" } 
    },
    fecha_salida: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // -10 días
    precio: 4500,
    asientos_disponibles: 0,
    observaciones: "Viaje completado exitosamente",
    conductor: {
      id: 1,
      nombre: "Demo",
      apellido: "Usuario"
    },
    estado: "completado",
    hora_inicio_real: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    hora_finalizacion_real: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString() // +6 horas
  }
];

// Variable para simular el usuario actual logueado
let currentUser = null;
let currentToken = null;

// Simular delay de red
const simulateNetworkDelay = () => new Promise(resolve => setTimeout(resolve, 300));

// Mock API Service
const mockApiService = {
  // LOGIN
  login: async (email, password) => {
    await simulateNetworkDelay();
    
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (user) {
      currentUser = user;
      currentToken = `mock-token-${user.id}-${Date.now()}`;
      
      return {
        ok: true,
        json: async () => ({
          token: currentToken,
          mensaje: "Inicio de sesión exitoso"
        })
      };
    }
    
    return {
      ok: false,
      json: async () => ({
        mensaje: "Credenciales incorrectas"
      })
    };
  },

  // OBTENER PERFIL
  getPerfil: async (token) => {
    await simulateNetworkDelay();
    
    if (token === currentToken && currentUser) {
      return {
        ok: true,
        json: async () => currentUser
      };
    }
    
    return {
      ok: false,
      json: async () => ({ error: "Token inválido" })
    };
  },

  // OBTENER TODOS LOS VIAJES (Listado)
  getViajes: async (token) => {
    await simulateNetworkDelay();
    
    if (token !== currentToken) {
      return {
        ok: false,
        json: async () => ({ error: "No autorizado" })
      };
    }
    
    // Filtrar viajes que no son del usuario actual
    const viajesDisponibles = MOCK_VIAJES.filter(v => 
      v.conductor.id !== currentUser.id && v.estado === "disponible"
    );
    
    return {
      ok: true,
      json: async () => viajesDisponibles
    };
  },

  // OBTENER VIAJES PROPUESTOS (del conductor)
  getViajesPropuestos: async (token) => {
    await simulateNetworkDelay();
    
    if (token !== currentToken) {
      return {
        ok: false,
        json: async () => ({ error: "No autorizado" })
      };
    }
    
    const misViajes = MOCK_VIAJES.filter(v => 
      v.conductor.id === currentUser.id && v.estado === "propuesto"
    );
    
    return {
      ok: true,
      json: async () => misViajes
    };
  },

  // OBTENER VIAJES EN CURSO
  getViajesEnCurso: async (token) => {
    await simulateNetworkDelay();
    
    if (token !== currentToken) {
      return {
        ok: false,
        json: async () => ({ error: "No autorizado" })
      };
    }
    
    const viajesEnCurso = MOCK_VIAJES.filter(v => 
      v.conductor.id === currentUser.id && v.estado === "en_curso"
    );
    
    return {
      ok: true,
      json: async () => viajesEnCurso
    };
  },

  // OBTENER VIAJES COMPLETADOS
  getViajesCompletados: async (token) => {
    await simulateNetworkDelay();
    
    if (token !== currentToken) {
      return {
        ok: false,
        json: async () => ({ error: "No autorizado" })
      };
    }
    
    const viajesCompletados = MOCK_VIAJES_COMPLETADOS.filter(v => 
      v.conductor.id === currentUser.id
    );
    
    return {
      ok: true,
      json: async () => viajesCompletados
    };
  },

  // OBTENER VIAJES ACEPTADOS COMO PASAJERO
  getViajesPasajeroDisponibles: async (token) => {
    await simulateNetworkDelay();
    
    if (token !== currentToken) {
      return {
        ok: false,
        json: async () => ({ error: "No autorizado" })
      };
    }
    
    // Simular que el usuario se unió a algunos viajes
    const viajesAceptados = MOCK_VIAJES.filter(v => 
      v.id === 1 || v.id === 2 // Simular que se unió a estos viajes
    );
    
    return {
      ok: true,
      json: async () => viajesAceptados
    };
  },

  // UNIRSE A UN VIAJE
  joinViaje: async (viajeId, token, equipajeId) => {
    await simulateNetworkDelay();
    
    if (token !== currentToken) {
      return {
        ok: false,
        json: async () => ({ error: "No autorizado" })
      };
    }
    
    const viaje = MOCK_VIAJES.find(v => v.id === viajeId);
    
    if (!viaje) {
      return {
        ok: false,
        json: async () => ({ error: "Viaje no encontrado" })
      };
    }
    
    if (viaje.asientos_disponibles <= 0) {
      return {
        ok: false,
        json: async () => ({ error: "No hay asientos disponibles" })
      };
    }
    
    // Simular que se unió exitosamente
    viaje.asientos_disponibles -= 1;
    
    return {
      ok: true,
      json: async () => ({ 
        mensaje: "Te has unido al viaje exitosamente",
        viaje: viaje
      })
    };
  },

  // INICIAR VIAJE
  iniciarViaje: async (viajeId, token) => {
    await simulateNetworkDelay();
    
    if (token !== currentToken) {
      return {
        ok: false,
        json: async () => ({ error: "No autorizado" })
      };
    }
    
    const viaje = MOCK_VIAJES.find(v => v.id === viajeId);
    
    if (!viaje) {
      return {
        ok: false,
        json: async () => ({ error: "Viaje no encontrado" })
      };
    }
    
    viaje.estado = "en_curso";
    viaje.hora_inicio_real = new Date().toISOString();
    
    return {
      ok: true,
      json: async () => ({ 
        mensaje: "Viaje iniciado exitosamente"
      })
    };
  },

  // FINALIZAR VIAJE
  finalizarViaje: async (viajeId, token) => {
    await simulateNetworkDelay();
    
    if (token !== currentToken) {
      return {
        ok: false,
        json: async () => ({ error: "No autorizado" })
      };
    }
    
    const viaje = MOCK_VIAJES.find(v => v.id === viajeId);
    
    if (!viaje) {
      return {
        ok: false,
        json: async () => ({ error: "Viaje no encontrado" })
      };
    }
    
    viaje.estado = "completado";
    viaje.hora_finalizacion_real = new Date().toISOString();
    
    return {
      ok: true,
      json: async () => ({ 
        mensaje: "Viaje finalizado exitosamente"
      })
    };
  },

  // ELIMINAR VIAJE
  eliminarViaje: async (viajeId, token) => {
    await simulateNetworkDelay();
    
    if (token !== currentToken) {
      return {
        ok: false,
        json: async () => ({ error: "No autorizado" })
      };
    }
    
    const index = MOCK_VIAJES.findIndex(v => v.id === viajeId);
    
    if (index === -1) {
      return {
        ok: false,
        json: async () => ({ error: "Viaje no encontrado" })
      };
    }
    
    MOCK_VIAJES.splice(index, 1);
    
    return {
      ok: true,
      json: async () => ({ 
        mensaje: "Viaje eliminado exitosamente"
      })
    };
  },

  // VERIFICAR SI PUEDE UNIRSE A UN VIAJE
  puedeUnirse: async (viajeId, token) => {
    await simulateNetworkDelay();
    
    if (token !== currentToken) {
      return {
        ok: false,
        json: async () => ({ error: "No autorizado" })
      };
    }
    
    const viaje = MOCK_VIAJES.find(v => v.id === viajeId);
    
    if (!viaje) {
      return {
        ok: false,
        json: async () => ({ error: "Viaje no encontrado" })
      };
    }
    
    const puedeUnirse = viaje.conductor.id !== currentUser.id && viaje.asientos_disponibles > 0;
    
    return {
      ok: true,
      json: async () => ({ 
        puede_unirse: puedeUnirse,
        mensaje: puedeUnirse ? "Puedes unirte a este viaje" : "No puedes unirte a este viaje"
      })
    };
  },

  // OBTENER CALIFICACIONES DEL USUARIO
  getCalificaciones: async (token) => {
    await simulateNetworkDelay();
    
    if (token !== currentToken) {
      return {
        ok: false,
        json: async () => ({ error: "No autorizado" })
      };
    }
    
    // Simular algunas calificaciones
    return {
      ok: true,
      json: async () => []
    };
  },

  // OBTENER VIAJE COMPARTIDO (público, sin autenticación)
  getViajeCompartido: async (viajeId) => {
    await simulateNetworkDelay();
    
    const viaje = MOCK_VIAJES.find(v => v.id === parseInt(viajeId));
    
    if (!viaje) {
      return {
        ok: false,
        json: async () => ({ error: "Viaje no encontrado" })
      };
    }
    
    return {
      ok: true,
      json: async () => viaje
    };
  }
};

// Función auxiliar para interceptar fetch y usar mock en modo demo
export const useMockApi = () => {
  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';
  
  if (!isDemoMode) return false;
  
  // Interceptar fetch
  const originalFetch = window.fetch;
  
  window.fetch = async (url, options = {}) => {
    const API_URL = import.meta.env.VITE_API_URL;
    
    // Si no es una llamada al API, usar fetch normal
    if (!url.includes(API_URL)) {
      return originalFetch(url, options);
    }
    
    // Extraer el endpoint
    const endpoint = url.replace(API_URL, '');
    const method = options.method || 'GET';
    const token = options.headers?.Authorization?.replace('Bearer ', '');
    
    // Routing de endpoints
    if (endpoint === '/login' && method === 'POST') {
      const body = JSON.parse(options.body);
      return mockApiService.login(body.email, body.password);
    }
    
    if (endpoint === '/perfil' && method === 'GET') {
      return mockApiService.getPerfil(token);
    }
    
    if (endpoint === '/viajes' && method === 'GET') {
      return mockApiService.getViajes(token);
    }
    
    if (endpoint === '/viajes/disponibles' && method === 'GET') {
      return mockApiService.getViajesPropuestos(token);
    }
    
    if (endpoint === '/viajes/en-curso' && method === 'GET') {
      return mockApiService.getViajesEnCurso(token);
    }
    
    if (endpoint === '/viajes/completados' && method === 'GET') {
      return mockApiService.getViajesCompletados(token);
    }
    
    if (endpoint === '/viajes/pasajero/disponibles' && method === 'GET') {
      return mockApiService.getViajesPasajeroDisponibles(token);
    }
    
    if (endpoint === '/viajes/pasajero/completados' && method === 'GET') {
      return mockApiService.getViajesCompletados(token);
    }
    
    if (endpoint.match(/\/viajes\/\d+\/pasajeros/) && method === 'POST') {
      const viajeId = parseInt(endpoint.match(/\/viajes\/(\d+)/)[1]);
      const body = JSON.parse(options.body);
      return mockApiService.joinViaje(viajeId, token, body.equipaje_id);
    }
    
    if (endpoint.match(/\/viajes\/\d+\/iniciar/) && method === 'POST') {
      const viajeId = parseInt(endpoint.match(/\/viajes\/(\d+)/)[1]);
      return mockApiService.iniciarViaje(viajeId, token);
    }
    
    if (endpoint.match(/\/viajes\/\d+\/finalizar\/conductor/) && method === 'POST') {
      const viajeId = parseInt(endpoint.match(/\/viajes\/(\d+)/)[1]);
      return mockApiService.finalizarViaje(viajeId, token);
    }
    
    if (endpoint.match(/\/viajes\/\d+\/eliminar/) && method === 'DELETE') {
      const viajeId = parseInt(endpoint.match(/\/viajes\/(\d+)/)[1]);
      return mockApiService.eliminarViaje(viajeId, token);
    }
    
    if (endpoint.match(/\/viajes\/\d+\/puede-unirse/) && method === 'GET') {
      const viajeId = parseInt(endpoint.match(/\/viajes\/(\d+)/)[1]);
      return mockApiService.puedeUnirse(viajeId, token);
    }
    
    if (endpoint === '/calificaciones/usuario' && method === 'GET') {
      return mockApiService.getCalificaciones(token);
    }
    
    if (endpoint.match(/\/viajes\/compartir\/\d+/)) {
      const viajeId = endpoint.match(/\/viajes\/compartir\/(\d+)/)[1];
      return mockApiService.getViajeCompartido(viajeId);
    }
    
    // Si no hay match, retornar error
    return {
      ok: false,
      json: async () => ({ error: "Endpoint no implementado en modo demo" })
    };
  };
  
  return true;
};

export default mockApiService;