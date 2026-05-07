import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SubscriptionFeatures {
  status: string
  title: string
  currency: string
  max_users: number
  max_plans: number
  max_contributions: number
  price: number
  billing_cycle: string
  starts_at: string
  ends_at: string
}

export interface AuthUser {
  token: string
  tenant_id: string
  first_name: string
  last_name: string
  email: string
  phone_number: string
  role: string
  status?: string
  company_name?: string
  subscription_features?: SubscriptionFeatures
}

interface AuthStore {
  user: AuthUser | null
  setAuth: (user: AuthUser) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      setAuth: (user) => set({ user }),
      clearAuth: () => set({ user: null }),
    }),
    { name: 'gbajo-auth' }
  )
)
