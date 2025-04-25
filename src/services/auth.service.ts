import { supabase } from '../config/supabaseClient';
import { AppError } from '../utils/appError';
import { 
  LoginCredentials, 
  RegisterCredentials, 
  ResetPasswordCredentials, 
  UpdatePasswordCredentials,
  AuthResponse 
} from '../types/auth';

/**
 * Authentication servis sınıfı.
 * Supabase Auth ile kullanıcı kimlik doğrulama işlemlerini yönetir.
 */
export class AuthService {
  /**
   * Kullanıcı hesabı oluşturur
   * @param credentials Kayıt bilgileri
   * @returns Kullanıcı ve oturum bilgileri
   */
  async register({ email, password, name }: RegisterCredentials): Promise<AuthResponse> {
    const { data: user, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        }
      }
    });

    if (error) {
      throw new AppError('Kayıt işlemi başarısız oldu', 400);
    }

    return { user: user.user, session: user.session };
  }

  /**
   * Kullanıcı girişi yapar
   * @param credentials Giriş bilgileri
   * @returns Kullanıcı ve oturum bilgileri
   */
  async login({ email, password }: LoginCredentials): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw new AppError('Giriş işlemi başarısız oldu', 401);
    }

    return { user: data.user, session: data.session };
  }

  /**
   * Kullanıcı çıkışı yapar
   * @returns Başarı durumu
   */
  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new AppError('Çıkış işlemi başarısız oldu', 500);
    }
  }

  /**
   * Mevcut kullanıcı ve oturum bilgilerini alır
   * @returns Mevcut oturum bilgisi
   */
  async getCurrentSession() {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      return { session: null, error: error.message };
    }

    return { session: data.session };
  }

  /**
   * Mevcut kullanıcı bilgilerini alır
   * @returns Mevcut kullanıcı bilgisi
   */
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  }

  /**
   * Şifre sıfırlama e-postası gönderir
   * @param credentials E-posta bilgisi
   * @returns Başarı durumu
   */
  async resetPassword({ email }: ResetPasswordCredentials): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      throw new AppError('Şifre sıfırlama işlemi başarısız oldu', 400);
    }
  }

  /**
   * Kullanıcı şifresini günceller
   * @param credentials Yeni şifre bilgisi
   * @returns Başarı durumu
   */
  async updatePassword({ password }: UpdatePasswordCredentials): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password
    });

    if (error) {
      throw new AppError('Şifre güncelleme işlemi başarısız oldu', 400);
    }
  }

  /**
   * JWT token'ın geçerliliğini kontrol eder
   * @param token JWT token
   * @returns Token geçerlilik durumu
   */
  async verifyToken(token: string): Promise<{ valid: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.auth.getUser(token);
      
      if (error) {
        return { valid: false, error: error.message };
      }

      return { valid: !!data.user };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu';
      return { valid: false, error: errorMessage };
    }
  }
}

export default new AuthService(); 