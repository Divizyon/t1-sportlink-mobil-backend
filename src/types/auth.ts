import { Session, User } from '@supabase/supabase-js';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name?: string;
}

export interface ResetPasswordCredentials {
  email: string;
}

export interface UpdatePasswordCredentials {
  password: string;
}

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error?: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

// Supabase Auth tarafından döndürülen JWT token bilgilerini içerir
export interface JwtPayload {
  aud: string;
  exp: number;
  sub: string;
  email: string;
  role: string;
  iat: number;
} 