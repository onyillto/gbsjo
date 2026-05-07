import { create } from 'zustand'

// ==================== INTERFACES ====================
export interface User {
  id: string
  name: string
  email: string
  phone: string
  joinDate: string
  status: 'active' | 'inactive'
  role: 'member' | 'admin'
  avatar?: string
}

export interface Tenant {
  id: string
  name: string
  email: string
  status: 'active' | 'inactive'
  createdDate: string
  maxMembers: number
  currentMembers: number
}

export interface Contribution {
  id: string
  memberId: string
  memberName: string
  amount: number
  date: string
  month: string
  status: 'completed' | 'pending'
  reference: string
}

export interface Subscription {
  id: string
  memberId: string
  planName: string
  status: 'active' | 'paused' | 'cancelled'
  startDate: string
  endDate: string
  price: number
  renewalDate: string
}

export interface Wallet {
  id: string
  memberId: string
  balance: number
  totalEarned: number
  lastUpdated: string
}

export interface Payment {
  id: string
  memberId: string
  amount: number
  type: 'contribution' | 'subscription' | 'other'
  status: 'pending' | 'completed' | 'failed'
  date: string
  reference: string
}

export interface Withdrawal {
  id: string
  memberId: string
  amount: number
  status: 'pending' | 'approved' | 'completed' | 'rejected'
  requestDate: string
  approvalDate?: string
  bankAccount?: string
}

export interface Election {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  status: 'upcoming' | 'active' | 'completed'
  positions: string[]
  totalVotes: number
  quorumRequired: number
}

export interface Vote {
  id: string
  electionId: string
  memberId: string
  position: string
  candidate: string
  timestamp: string
}

// ==================== MOCK DATA ====================
const mockUsers: User[] = []
const mockTenants: Tenant[] = []
const mockContributions: Contribution[] = []
const mockSubscriptions: Subscription[] = []
const mockWallets: Wallet[] = []
const mockPayments: Payment[] = []
const mockWithdrawals: Withdrawal[] = []
const mockElections: Election[] = []
const mockVotes: Vote[] = []

// ==================== STORE ====================
interface GbajoStore {
  users: User[]
  addUser: (u: User) => void
  updateUser: (id: string, u: Partial<User>) => void
  deleteUser: (id: string) => void

  tenants: Tenant[]
  addTenant: (t: Tenant) => void
  updateTenant: (id: string, t: Partial<Tenant>) => void
  deleteTenant: (id: string) => void

  contributions: Contribution[]
  addContribution: (c: Contribution) => void
  updateContribution: (id: string, c: Partial<Contribution>) => void
  deleteContribution: (id: string) => void

  subscriptions: Subscription[]
  addSubscription: (s: Subscription) => void
  updateSubscription: (id: string, s: Partial<Subscription>) => void
  deleteSubscription: (id: string) => void

  wallets: Wallet[]
  addWallet: (w: Wallet) => void
  updateWallet: (id: string, w: Partial<Wallet>) => void

  payments: Payment[]
  addPayment: (p: Payment) => void
  updatePayment: (id: string, p: Partial<Payment>) => void
  deletePayment: (id: string) => void

  withdrawals: Withdrawal[]
  addWithdrawal: (w: Withdrawal) => void
  updateWithdrawal: (id: string, w: Partial<Withdrawal>) => void
  deleteWithdrawal: (id: string) => void

  elections: Election[]
  addElection: (e: Election) => void
  updateElection: (id: string, e: Partial<Election>) => void
  deleteElection: (id: string) => void

  votes: Vote[]
  addVote: (v: Vote) => void

  getTotalContributions: () => number
  getTotalMembers: () => number
  getActiveElections: () => Election[]
}

export const useGbajoStore = create<GbajoStore>((set, get) => ({
  users: mockUsers,
  addUser: (u) => set((s) => ({ users: [...s.users, u] })),
  updateUser: (id, u) => set((s) => ({ users: s.users.map(x => x.id === id ? { ...x, ...u } : x) })),
  deleteUser: (id) => set((s) => ({ users: s.users.filter(x => x.id !== id) })),

  tenants: mockTenants,
  addTenant: (t) => set((s) => ({ tenants: [...s.tenants, t] })),
  updateTenant: (id, t) => set((s) => ({ tenants: s.tenants.map(x => x.id === id ? { ...x, ...t } : x) })),
  deleteTenant: (id) => set((s) => ({ tenants: s.tenants.filter(x => x.id !== id) })),

  contributions: mockContributions,
  addContribution: (c) => set((s) => ({ contributions: [...s.contributions, c] })),
  updateContribution: (id, c) => set((s) => ({ contributions: s.contributions.map(x => x.id === id ? { ...x, ...c } : x) })),
  deleteContribution: (id) => set((s) => ({ contributions: s.contributions.filter(x => x.id !== id) })),

  subscriptions: mockSubscriptions,
  addSubscription: (s) => set((st) => ({ subscriptions: [...st.subscriptions, s] })),
  updateSubscription: (id, s) => set((st) => ({ subscriptions: st.subscriptions.map(x => x.id === id ? { ...x, ...s } : x) })),
  deleteSubscription: (id) => set((st) => ({ subscriptions: st.subscriptions.filter(x => x.id !== id) })),

  wallets: mockWallets,
  addWallet: (w) => set((s) => ({ wallets: [...s.wallets, w] })),
  updateWallet: (id, w) => set((s) => ({ wallets: s.wallets.map(x => x.id === id ? { ...x, ...w } : x) })),

  payments: mockPayments,
  addPayment: (p) => set((s) => ({ payments: [...s.payments, p] })),
  updatePayment: (id, p) => set((s) => ({ payments: s.payments.map(x => x.id === id ? { ...x, ...p } : x) })),
  deletePayment: (id) => set((s) => ({ payments: s.payments.filter(x => x.id !== id) })),

  withdrawals: mockWithdrawals,
  addWithdrawal: (w) => set((s) => ({ withdrawals: [...s.withdrawals, w] })),
  updateWithdrawal: (id, w) => set((s) => ({ withdrawals: s.withdrawals.map(x => x.id === id ? { ...x, ...w } : x) })),
  deleteWithdrawal: (id) => set((s) => ({ withdrawals: s.withdrawals.filter(x => x.id !== id) })),

  elections: mockElections,
  addElection: (e) => set((s) => ({ elections: [...s.elections, e] })),
  updateElection: (id, e) => set((s) => ({ elections: s.elections.map(x => x.id === id ? { ...x, ...e } : x) })),
  deleteElection: (id) => set((s) => ({ elections: s.elections.filter(x => x.id !== id) })),

  votes: mockVotes,
  addVote: (v) => set((s) => ({ votes: [...s.votes, v] })),

  getTotalContributions: () => get().contributions.reduce((sum, c) => sum + c.amount, 0),
  getTotalMembers: () => get().users.length,
  getActiveElections: () => get().elections.filter(e => e.status === 'active'),
}))
