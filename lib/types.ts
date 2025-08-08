export interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: 'estudiante' | 'docente' | 'admin';
  carrera?: string;
  semestre?: number;
  created_at: string;
  updated_at?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

// Nuevo tipo para equipos
export interface Equipo {
  nombre: string;
  cantidad: number;
}

// Tipos actualizados para Laboratorio
export interface Laboratorio {
  id: string;
  nombre: string;
  codigo: string;
  ubicacion: string;
  capacidad_maxima: number;
  tipo_laboratorio: 'quimica' | 'fisica' | 'biologia' | 'computacion' | 'electronica';
  equipos_disponibles: Equipo[]; // Cambio aquí
  horario_disponible: Record<string, any>;
  activo: boolean;
  observaciones?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateLaboratorioData {
  nombre: string;
  codigo: string;
  ubicacion: string;
  capacidad_maxima: number;
  tipo_laboratorio: 'quimica' | 'fisica' | 'biologia' | 'computacion' | 'electronica';
  equipos_disponibles: Equipo[];
  horario_disponible: Record<string, any>;
  activo: boolean;
  observaciones?: string;
}

export interface UpdateLaboratorioData extends Partial<CreateLaboratorioData> {
  id: string;
}