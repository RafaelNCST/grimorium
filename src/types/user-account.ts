/**
 * User Account Types
 *
 * Tipos relacionados a conta de usuário, assinaturas e perfil
 */

export type SubscriptionTier = "camponês" | "realeza";

export type PaymentMethod = "credit_card" | "pix" | "paypal";

export interface PaymentInfo {
  method: PaymentMethod;
  lastFourDigits?: string; // últimos 4 dígitos do cartão
  expiryDate?: string; // MM/YY
  email?: string; // para PayPal
}

export interface Subscription {
  tier: SubscriptionTier;
  status: "active" | "cancelled" | "expired";
  startDate: string; // ISO date
  renewalDate?: string; // ISO date
  paymentInfo?: PaymentInfo;
}

export interface UserAccount {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  authProvider: "google" | "email";
  subscription: Subscription;
  createdAt: string; // ISO date
}

// Mock user para desenvolvimento (até implementar auth real)
export const MOCK_USER: UserAccount = {
  id: "mock-user-1",
  email: "usuario@grimorium.com",
  displayName: "Escritor",
  authProvider: "email",
  subscription: {
    tier: "camponês",
    status: "active",
    startDate: new Date().toISOString(),
  },
  createdAt: new Date().toISOString(),
};
