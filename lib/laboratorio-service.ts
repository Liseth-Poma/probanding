import type { Laboratorio, CreateLaboratorioData, UpdateLaboratorioData } from './types';
import { validateLaboratorioData, formatLaboratorioForDisplay } from '@/lib/laboratorio-utils'

// Configuración de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_ENDPOINTS = {
  laboratorios: `${API_BASE_URL}/api/laboratorios`
};

// Función helper para manejar las respuestas de la API
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(error.message || `Error ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

// Función helper para obtener headers con autenticación
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken'); // Ajusta según tu sistema de auth
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export const laboratorioService = {
async getAll(): Promise<Laboratorio[]> {
  try {
    const response = await fetch(API_ENDPOINTS.laboratorios, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    const json = await handleResponse(response);
    return json.data;
  } catch (error) {
    console.error('Error al obtener laboratorios:', error);
    throw error;
  }
},

  async getById(id: string): Promise<Laboratorio | null> {
    try {
      const response = await fetch(`${API_ENDPOINTS.laboratorios}/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (response.status === 404) {
        return null;
      }
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al obtener laboratorio:', error);
      throw error;
    }
  },

  // Método create - no buscar por código si es nuevo
async create(laboratorio: Omit<Laboratorio, 'id'>): Promise<Laboratorio> {
  // No buscar por código para crear nuevo
  // ✅ Correcto
const response = await fetch(API_ENDPOINTS.laboratorios, {

    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(laboratorio),
  });
  
  return handleResponse(response);
},

  async update(data: UpdateLaboratorioData): Promise<Laboratorio> {
    try {
      const { id, ...updateData } = data;
      const response = await fetch(`${API_ENDPOINTS.laboratorios}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData)
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al actualizar laboratorio:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_ENDPOINTS.laboratorios}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      await handleResponse(response);
    } catch (error) {
      console.error('Error al eliminar laboratorio:', error);
      throw error;
    }
  },

  async searchByName(query: string): Promise<Laboratorio[]> {
    try {
      const response = await fetch(`${API_ENDPOINTS.laboratorios}?search=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al buscar laboratorios:', error);
      throw error;
    }
  },

  async getByEstado(estado: 'activo' | 'inactivo' | 'mantenimiento'): Promise<Laboratorio[]> {
    try {
      const response = await fetch(`${API_ENDPOINTS.laboratorios}?estado=${estado}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al filtrar laboratorios por estado:', error);
      throw error;
    }
  }
};