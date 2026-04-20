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
const mockUsers: User[] = [
  { id: '1', name: 'Adebayo Okafor', email: 'adebayo@gbajo.com', phone: '08012345678', joinDate: '2024-01-15', status: 'active', role: 'admin' },
  { id: '2', name: 'Chioma Nwankwo', email: 'chioma@gbajo.com', phone: '08087654321', joinDate: '2024-02-20', status: 'active', role: 'member' },
  { id: '3', name: 'Kunle Adeyemi', email: 'kunle@gbajo.com', phone: '08011223344', joinDate: '2024-03-10', status: 'active', role: 'member' },
  { id: '4', name: 'Zainab Mohammed', email: 'zainab@gbajo.com', phone: '08055667788', joinDate: '2024-04-05', status: 'inactive', role: 'member' },
  { id: '5', name: 'Emeka Eze', email: 'emeka@gbajo.com', phone: '08099887766', joinDate: '2024-01-30', status: 'active', role: 'member' },
]

const mockTenants: Tenant[] = [
  { id: '1', name: 'Lagos Cooperative', email: 'admin@lagos.coop', status: 'active', createdDate: '2025-01-01', maxMembers: 10, currentMembers: 5 },
  { id: '2', name: 'Ibadan Cooperative', email: 'admin@ibadan.coop', status: 'active', createdDate: '2025-06-01', maxMembers: 10, currentMembers: 3 },
  { id: '3', name: 'Abuja Cooperative', email: 'admin@abuja.coop', status: 'inactive', createdDate: '2024-12-01', maxMembers: 10, currentMembers: 0 },
]

const mockContributions: Contribution[] = [
  { id: '1', memberId: '1', memberName: 'Adebayo Okafor', amount: 50000, date: '2026-04-18', month: 'April', status: 'completed', reference: 'TXN001' },
  { id: '2', memberId: '2', memberName: 'Chioma Nwankwo', amount: 50000, date: '2026-04-17', month: 'April', status: 'completed', reference: 'TXN002' },
  { id: '3', memberId: '3', memberName: 'Kunle Adeyemi', amount: 50000, date: '2026-04-16', month: 'April', status: 'pending', reference: 'TXN003' },
  { id: '4', memberId: '1', memberName: 'Adebayo Okafor', amount: 50000, date: '2026-03-18', month: 'March', status: 'completed', reference: 'TXN004' },
  { id: '5', memberId: '5', memberName: 'Emeka Eze', amount: 50000, date: '2026-04-15', month: 'April', status: 'completed', reference: 'TXN005' },
]

const mockSubscriptions: Subscription[] = [
  { id: '1', memberId: '1', planName: 'Premium', status: 'active', startDate: '2026-01-01', endDate: '2026-12-31', price: 10000, renewalDate: '2026-12-31' },
  { id: '2', memberId: '2', planName: 'Basic', status: 'active', startDate: '2026-02-01', endDate: '2027-01-31', price: 5000, renewalDate: '2027-01-31' },
  { id: '3', memberId: '3', planName: 'Premium', status: 'paused', startDate: '2026-03-01', endDate: '2027-02-28', price: 10000, renewalDate: '2027-02-28' },
]

const mockWallets: Wallet[] = [
  { id: '1', memberId: '1', balance: 150000, totalEarned: 250000, lastUpdated: '2026-04-19' },
  { id: '2', memberId: '2', balance: 200000, totalEarned: 300000, lastUpdated: '2026-04-19' },
  { id: '3', memberId: '3', balance: 100000, totalEarned: 200000, lastUpdated: '2026-04-19' },
  { id: '4', memberId: '5', balance: 180000, totalEarned: 280000, lastUpdated: '2026-04-19' },
]

const mockPayments: Payment[] = [
  { id: '1', memberId: '1', amount: 50000, type: 'contribution', status: 'completed', date: '2026-04-18', reference: 'PAY001' },
  { id: '2', memberId: '2', amount: 10000, type: 'subscription', status: 'completed', date: '2026-04-17', reference: 'PAY002' },
  { id: '3', memberId: '3', amount: 50000, type: 'contribution', status: 'pending', date: '2026-04-19', reference: 'PAY003' },
  { id: '4', memberId: '5', amount: 5000, type: 'subscription', status: 'completed', date: '2026-04-15', reference: 'PAY004' },
]

const mockWithdrawals: Withdrawal[] = [
  { id: '1', memberId: '1', amount: 50000, status: 'completed', requestDate: '2026-04-10', approvalDate: '2026-04-12', bankAccount: 'XXX1234' },
  { id: '2', memberId: '2', amount: 75000, status: 'pending', requestDate: '2026-04-18', bankAccount: 'XXX5678' },
  { id: '3', memberId: '3', amount: 25000, status: 'approved', requestDate: '2026-04-17', approvalDate: '2026-04-18', bankAccount: 'XXX9012' },
]

const mockElections: Election[] = [
  { id: '1', title: '2026 Board of Directors', description: 'Annual institutional leadership transition', startDate: '2026-04-20', endDate: '2026-04-27', status: 'active', positions: ['President', 'Vice President', 'Treasurer', 'Secretary'], totalVotes: 8, quorumRequired: 12 },
  { id: '2', title: 'Q2 Auditor Selection', description: 'Select quarterly auditor for fund review', startDate: '2026-05-01', endDate: '2026-05-08', status: 'upcoming', positions: ['Primary Auditor', 'Secondary Auditor'], totalVotes: 0, quorumRequired: 12 },
]

const mockVotes: Vote[] = [
  { id: '1', electionId: '1', memberId: '1', position: 'President', candidate: 'Adebayo Okafor', timestamp: '2026-04-18T10:30:00Z' },
  { id: '2', electionId: '1', memberId: '2', position: 'President', candidate: 'Chioma Nwankwo', timestamp: '2026-04-18T11:15:00Z' },
]

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
