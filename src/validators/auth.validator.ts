import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır')
});

export const registerSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır')
});

export const emailSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi giriniz')
});

export const updatePasswordSchema = z.object({
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır')
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi giriniz')
});

export const passwordSchema = z.object({
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır')
}); 