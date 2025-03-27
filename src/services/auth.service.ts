import supabase from '../config/supabase';
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
class AuthService {
  /**
   * Kullanıcı hesabı oluşturur
   * @param credentials Kayıt bilgileri
   * @returns Kullanıcı ve oturum bilgileri
   */
  async register({ email, password, name }: RegisterCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });

      if (error) {
        return { user: null, session: null, error: error.message };
      }

      return { user: data.user, session: data.session };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu';
      return { user: null, session: null, error: errorMessage };
    }
  }

  /**
   * Kullanıcı girişi yapar
   * @param credentials Giriş bilgileri
   * @returns Kullanıcı ve oturum bilgileri
   */
  async login({ email, password }: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { user: null, session: null, error: error.message };
      }

      return { user: data.user, session: data.session };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu';
      return { user: null, session: null, error: errorMessage };
    }
  }

  /**
   * Kullanıcı çıkışı yapar
   * @returns Başarı durumu
   */
  async logout(): Promise<{ error?: string }> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu';
      return { error: errorMessage };
    }
  }

  /**
   * Mevcut kullanıcı ve oturum bilgilerini alır
   * @returns Mevcut oturum bilgisi
   */
  async getCurrentSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        return { session: null, error: error.message };
      }

      return { session: data.session };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu';
      return { session: null, error: errorMessage };
    }
  }

  /**
   * Mevcut kullanıcı bilgilerini alır
   * @returns Mevcut kullanıcı bilgisi
   */
  async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        return { user: null, error: error.message };
      }

      return { user: data.user };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu';
      return { user: null, error: errorMessage };
    }
  }

  /**
   * Şifre sıfırlama e-postası gönderir
   * @param credentials E-posta bilgisi
   * @returns Başarı durumu
   */
  async resetPassword({ email }: ResetPasswordCredentials): Promise<{ error?: string }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.APP_URL}/reset-password`
      });
      
      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu';
      return { error: errorMessage };
    }
  }

  /**
   * Kullanıcı şifresini günceller
   * @param credentials Yeni şifre bilgisi
   * @returns Başarı durumu
   */
  async updatePassword({ password }: UpdatePasswordCredentials): Promise<{ error?: string }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password
      });
      
      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu';
      return { error: errorMessage };
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